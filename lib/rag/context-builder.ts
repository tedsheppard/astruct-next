import type { RAGConfig, RetrievedChunk, ClassifiedQuery } from './types'
import { createAdminClient } from '@/lib/supabase/admin'

export async function buildContext(
  chunks: RetrievedChunk[],
  config: RAGConfig,
  query: ClassifiedQuery
): Promise<string> {
  const contract = config.contract as Record<string, string | number | null>
  const profile = config.profile as Record<string, string | null> | null
  const admin = createAdminClient()

  // ─── Contract metadata ────────────────────────────────────────────────
  const formatDate = (d: string | null) => {
    if (!d) return 'Not specified'
    return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  const formatCurrency = (n: number | null) => {
    if (!n) return 'Not specified'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(n)
  }

  const party1Role = contract.party1_role || 'Principal'
  const party1Name = contract.party1_name || contract.principal_name || 'Not specified'
  const party2Role = contract.party2_role || 'Contractor'
  const party2Name = contract.party2_name || contract.contractor_name || 'Not specified'
  const adminRole = contract.administrator_role || 'Superintendent'
  const adminName = contract.administrator_name || contract.superintendent_name || 'Not specified'

  // ─── Document map with summaries ──────────────────────────────────────
  const { data: documents } = await admin
    .from('documents')
    .select('id, filename, category, ai_summary, extracted_text')
    .eq('contract_id', config.contractId)

  const docMap = (documents || []).map(d =>
    `- ${d.filename} [${d.category}]: ${d.ai_summary || 'No summary'}`
  ).join('\n')

  // ─── Full contract in context (if small enough) ──────────────────────
  let fullContractText = ''
  if (query.complexity === 'complex' || query.queryType === 'analysis' || query.queryType === 'drafting') {
    const contractDocs = (documents || []).filter(d =>
      d.category === '01_contract' && d.extracted_text
    )
    const totalChars = contractDocs.reduce((sum, d) => sum + (d.extracted_text?.length || 0), 0)
    // If under ~80K tokens (~320K chars), include full contract
    if (totalChars > 0 && totalChars < 320000) {
      fullContractText = contractDocs.map(d => d.extracted_text).join('\n\n---\n\n')
    }
  }

  // ─── Obligations ──────────────────────────────────────────────────────
  const { data: obligations } = await admin
    .from('obligations')
    .select('description, clause_reference, due_date, status')
    .eq('contract_id', config.contractId)
    .eq('completed', false)
    .order('due_date', { ascending: true })
    .limit(20)

  const obligationsContext = (obligations || []).map(o =>
    `- ${o.description} (${o.clause_reference || 'no clause'}) — due ${formatDate(o.due_date)} [${o.status}]`
  ).join('\n')

  // ─── Notice templates (for drafting tasks) ─────────────────────────────
  let templateContext = ''
  if (query.queryType === 'drafting') {
    const { data: templates } = await admin
      .from('notice_templates')
      .select('body, status, notice_types(name)')
      .eq('contract_id', config.contractId)
      .in('status', ['finalised', 'user_edited', 'draft_generated'])
      .order('status') // finalised first

    if (templates && templates.length > 0) {
      // Find the most relevant template by matching query terms to template names
      const queryLower = query.rewrittenQuery.toLowerCase()
      const matched = templates.find(t => {
        const nt = t.notice_types as unknown as { name: string } | { name: string }[] | null
        const name = (Array.isArray(nt) ? nt[0]?.name : nt?.name || '').toLowerCase()
        return queryLower.includes(name) || name.split(' ').some(word => word.length > 3 && queryLower.includes(word))
      })

      if (matched) {
        const mnt = matched.notice_types as unknown as { name: string } | { name: string }[] | null
        const name = (Array.isArray(mnt) ? mnt[0]?.name : mnt?.name) || 'Notice'
        templateContext = `\nEXISTING TEMPLATE FOR "${name.toUpperCase()}" (status: ${matched.status}):\n\n${matched.body.slice(0, 8000)}\n\nWhen drafting this type of notice, use the above template as the structural and substantive basis. Deviate only if the user's specific circumstances require additional content not covered by the template, and flag any deviation.\n`
      }
    }
  }

  // ─── RAG context ──────────────────────────────────────────────────────
  let ragContext = ''
  if (chunks.length > 0) {
    // Sort by document then chunk index for coherent reading
    const sorted = [...chunks].sort((a, b) => {
      if (a.documentId !== b.documentId) return a.documentName.localeCompare(b.documentName)
      return a.chunkIndex - b.chunkIndex
    })

    ragContext = sorted.map((chunk, i) => {
      const heading = chunk.sectionHeading ? ` | Section: ${chunk.sectionHeading}` : ''
      const clauses = chunk.clauseNumbers.length ? ` | Clauses: ${chunk.clauseNumbers.join(', ')}` : ''
      const content = chunk.expandedContent || chunk.content
      return `[Source ${i + 1}: ${chunk.documentName}${heading}${clauses}]\n${content}`
    }).join('\n\n---\n\n')
  }

  // ─── Build system prompt ──────────────────────────────────────────────
  const systemPrompt = `You are Astruct AI, an expert construction contract intelligence assistant for the "${contract.name}" contract.

CONTRACT DETAILS:
- Form: ${contract.contract_form || 'Not specified'}
- ${party1Role}: ${party1Name}${contract.party1_address ? ' — ' + contract.party1_address : ''}
- ${party2Role}: ${party2Name}${contract.party2_address ? ' — ' + contract.party2_address : ''}
- ${adminRole}: ${adminName}${contract.administrator_address ? ' — ' + contract.administrator_address : ''}
- Date of Contract: ${formatDate(contract.date_of_contract as string)}
- Date for Practical Completion: ${formatDate(contract.date_practical_completion as string)}
- Contract Sum: ${formatCurrency(contract.contract_sum as number)}
- User is: ${contract.user_is_party === 'party1' ? party1Role : party2Role}

USER'S LETTERHEAD:
- Company: ${profile?.company_name || 'Not configured'}
- ABN: ${profile?.company_abn || 'Not configured'}
- Address: ${profile?.company_address || 'Not configured'}
- Phone: ${profile?.company_phone || 'Not configured'}
- Signatory: ${profile?.signatory_name || 'Not configured'}, ${profile?.signatory_title || ''}

DOCUMENT MAP:
${docMap || 'No documents uploaded yet.'}

${obligationsContext ? `CURRENT OBLIGATIONS:\n${obligationsContext}` : ''}

${fullContractText ? `FULL CONTRACT TEXT:\n\n${fullContractText}\n\n` : ''}${ragContext ? `RELEVANT DOCUMENT EXCERPTS:\n\n${ragContext}` : 'No document excerpts matched this query.'}
${templateContext}

INSTRUCTIONS:
1. You have access to the contract documents in the project library. Ground all answers in these documents. Cite specific clause numbers.
2. When the user asks about a specific clause, quote the relevant text directly.
3. Be natural and conversational for casual messages.
4. Never fabricate clause text — only quote what appears in the excerpts or full contract text.
5. Use REAL party names and details from CONTRACT DETAILS — never generic placeholders.
6. If the document excerpts don't contain enough information to answer confidently, say so explicitly rather than guessing.
7. Never say "based on the documents you've provided" or "from what you've uploaded" — speak as if you inherently know the contract. Say "under the contract" or "the contract provides" instead.
8. Never use em-dashes (—). Use en-dashes (–) or hyphens (-) instead.
9. Use bold sparingly — only for headings and defined terms in parentheses (e.g. "the **Contractor**"). Do not bold random words for emphasis.

DOCUMENT GENERATION:
When asked to draft, create, or write a notice, letter, claim, or formal correspondence, you MUST:
1. First write a brief conversational summary of what you drafted
2. Then output the document in this exact format:

---DOCUMENT_START---
{
  "type": "notice",
  "title": "Document Title",
  "noticeType": "Payment Claim|Variation|Delay|EOT Claim|Dispute|Show Cause|Other",
  "clauseReference": "Clause XX.X",
  "content": "Full document content in markdown...",
  "metadata": {
    "addressee": "Full name and address of recipient",
    "from": "Full name and address of sender",
    "date": "${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}",
    "reference": "${contract.reference_number || contract.name}",
    "subject": "Document subject line"
  }
}
---DOCUMENT_END---

Document content rules:
- Include proper structure: date, addressee block, reference, salutation, heading, numbered body paragraphs with clause citations, signatory block
- Use REAL party names, addresses, dates from CONTRACT DETAILS
- Only use [INSERT: description] for genuinely unknown facts (specific event dates, amounts not in contract)
- The content should be the complete document in markdown
- Reference specific contract clauses from the document excerpts
- Use formal construction industry language

Generate a document for: drafting notices, letters, payment claims, EOT claims, variation notices, show cause notices, delay notices, any formal correspondence.
Do NOT generate a document for: questions, analysis, explanations, casual conversation.`

  return systemPrompt
}
