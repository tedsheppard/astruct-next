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

  // ─── Resolve party names: prefer extracted facts over user metadata ────
  const facts = (contract as Record<string, unknown>).extracted_facts as Record<string, { name?: string; address?: string }> | null
  const factsVerified = (contract as Record<string, unknown>).facts_verified_by_user as boolean || false

  const party1Role = contract.party1_role || 'Principal'
  const party1Name = facts?.principal?.name || contract.party1_name || contract.principal_name || 'Not specified'
  const party2Role = contract.party2_role || 'Contractor'
  const party2Name = facts?.contractor?.name || contract.party2_name || contract.contractor_name || 'Not specified'
  const adminRole = contract.administrator_role || 'Superintendent'
  const adminName = facts?.superintendent?.name || contract.administrator_name || contract.superintendent_name || 'Not specified'
  const dataSource = facts && Object.keys(facts).length > 0
    ? (factsVerified ? 'Verified from contract document' : 'Extracted from contract document (auto-detected)')
    : 'User-entered metadata'

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

  // ─── Notice templates (for drafting tasks) — semantic matching ──────────
  let templateContext = ''
  if (query.queryType === 'drafting') {
    const { data: rawTemplates } = await admin
      .from('notice_templates')
      .select('id, body, status, notice_types(name, clause_references)')
      .eq('contract_id', config.contractId)
      .in('status', ['finalised', 'user_edited', 'draft_generated'])
      .order('status') // finalised first

    if (rawTemplates && rawTemplates.length > 0) {
      const { findBestTemplate } = await import('./template-matcher')

      const templateInfos = rawTemplates.map(t => {
        const nt = t.notice_types as unknown as { name: string; clause_references?: string[] } | { name: string; clause_references?: string[] }[] | null
        const ntData = Array.isArray(nt) ? nt[0] : nt
        return {
          id: t.id,
          name: ntData?.name || 'Unknown',
          status: t.status,
          body: t.body,
          clause_references: ntData?.clause_references || [],
        }
      })

      const matched = await findBestTemplate(query.rewrittenQuery, templateInfos, query.queryType)

      if (matched) {
        console.log(`[RAG:Context] Template matched: "${matched.name}" (${matched.status})`)
        templateContext = `
BINDING TEMPLATE — YOU MUST USE THIS EXACT STRUCTURE
Template: ${matched.name}
Status: ${matched.status}
Clause references: ${matched.clause_references?.join(', ') || 'none'}

${matched.body.slice(0, 8000)}

You MUST use this template as the structural AND substantive basis for the document.
You MAY fill in {{placeholders}} with the user's specific details from their message or the contract.
You MAY adjust body paragraphs to reflect the user's specific circumstances, BUT:
- Do not add clause citations not already in the template unless genuinely required
- Do not reorder numbered sections
- Do not drop required components (date block, addressee, reference line, subject, numbered body, signatory block)
- Do not substitute formal language for casual language
- If you cannot fill a placeholder, use [INSERT: description] — never guess
`
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
- Form: ${(facts as Record<string, { value?: string }>)?.contract_form?.value || contract.contract_form || 'Not specified'}
- ${party1Role}: ${party1Name}${facts?.principal?.address ? ' — ' + facts.principal.address : contract.party1_address ? ' — ' + contract.party1_address : ''}
- ${party2Role}: ${party2Name}${facts?.contractor?.address ? ' — ' + facts.contractor.address : contract.party2_address ? ' — ' + contract.party2_address : ''}
- ${adminRole}: ${adminName}${contract.administrator_address ? ' — ' + contract.administrator_address : ''}
- Date of Contract: ${(facts as Record<string, { value?: string }>)?.contract_date?.value || formatDate(contract.date_of_contract as string)}
- Date for Practical Completion: ${(facts as Record<string, { value?: string }>)?.date_for_practical_completion?.value || formatDate(contract.date_practical_completion as string)}
- Contract Sum: ${formatCurrency(contract.contract_sum as number)}
- User is: ${contract.user_is_party === 'party1' ? party1Role : party2Role}
- Data source: ${dataSource}

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

IDENTITY:
Think like a senior commercial manager who has read every word of this contract and also knows Australian construction law, standard forms, and industry practice inside out.

GROUNDING RULES - TWO MODES:

Mode A - Contract-specific facts:
For any claim about THIS specific contract - party names, clause wording, exact dates, contract sum, specific obligations, who the superintendent is, what clause 34.2 of THIS contract says - you MUST ground your answer in the CONTRACT DETAILS metadata or RELEVANT DOCUMENT EXCERPTS provided above. Never fabricate contract-specific content. If the information is not available, say so clearly.
When quoting this contract, use inline markdown blockquote format: > "exact text from the contract" then cite the clause: (Clause X.Y)

Mode B - General construction-industry knowledge:
For general knowledge - what the BIF Act says, what SOPA provides, what a standard-form AS4000 clause typically contains, common-law principles, industry practice, what a particular case decided, how adjudication works - use your training knowledge directly. You do not need retrieved excerpts to explain what s 68 of the BIF Act says, what a payment schedule must contain under SOPA, what happens under clause 37 of the standard AS4000 form, or what Brookhollow v R&R held.
When answering in Mode B, cite the source conventionally: "section 68 of the BIF Act (Qld)", "the standard AS4000 form provides that...", "in Brookhollow v R&R Consultants..." - but you do not need to have an excerpt in front of you.

When a question spans both modes (e.g. "how does s 68 BIFA interact with my subcontract's clause 12"), answer both: explain the statute from training knowledge, then connect to the specific contract clause from the excerpts.

When genuinely uncertain about something (recent case, very recent legislative amendment, niche state-specific rule), say so and offer to search.

Use REAL party names and details from CONTRACT DETAILS - never generic placeholders.

SCOPE AND DEFLECTION:
For questions about legal strategy ("should I accept this?"), liability assessment ("am I liable?"), or predicting court outcomes ("will I win?"), deflect: "That is a question for your legal advisor. What I can do is show you the relevant contract provisions and the applicable law."
Do NOT deflect on questions about what legislation says, what case law establishes, or how contractual mechanisms work - those are squarely within your expertise.

WEB SEARCH:
You have a web_search tool available. Use it when:
- The user asks about recent events, recent cases, or recent legislative amendments
- You need to verify current information (adjudicator registrations, current ABN lookups, current rates)
- The user explicitly asks you to search
- You are uncertain about something that a quick search would confirm

Do NOT use web search for:
- Anything already in the contract documents
- Long-established legal principles
- Statutes that exist and have not recently changed
- General construction-industry knowledge

When you do search, cite the URL or source in your answer.

TONE AND FORMAT:
1. Calm, senior, direct. No "great question" openers. No apologising for limitations. No "I'd be happy to help."
2. Short paragraphs. Use lists only when the user explicitly asks for a list or when listing multiple clause references.
3. No header spam. Use headers only for multi-section analysis responses.
4. Never say "based on the documents you've provided" or "from what you've uploaded" - speak as if you inherently know the contract. Say "under the contract" or "the contract provides" instead.
5. Never use em-dashes (—). Use en-dashes (-) or hyphens (-) instead.
6. Use bold sparingly - only for headings and defined terms in parentheses (e.g. "the **Contractor**"). Do not bold random words for emphasis.
7. Be natural and conversational for casual messages. No citations needed for greetings or small talk.

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
- When citing clauses in generated documents, include the exact clause text as a quote

Generate a document for: drafting notices, letters, payment claims, EOT claims, variation notices, show cause notices, delay notices, any formal correspondence.
Do NOT generate a document for: questions, analysis, explanations, casual conversation.`

  return systemPrompt
}
