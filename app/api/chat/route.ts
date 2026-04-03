import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

function isClaudeModel(model: string): boolean {
  return model.startsWith('claude-')
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, contract_id, session_id, model: requestedModel } = await request.json()
    const model = requestedModel || 'claude-sonnet-4-6'

    if (!message || !contract_id) {
      return Response.json(
        { error: 'message and contract_id are required' },
        { status: 400 }
      )
    }

    // Load contract metadata
    const { data: contract } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contract_id)
      .single()

    if (!contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Perform RAG: embed the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    })
    const queryEmbedding = embeddingResponse.data[0].embedding

    // Use admin client to call the match function (avoids RLS issues with rpc)
    const admin = createAdminClient()

    // Vector similarity search
    const { data: vectorChunks, error: chunksError } = await admin.rpc(
      'match_document_chunks',
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.25,
        match_count: 15,
        filter_contract_id: contract_id,
      }
    )

    if (chunksError) {
      console.error('RAG retrieval error:', chunksError)
    }

    // Also do keyword search for clause references and specific terms
    // Extract potential clause numbers and key terms from the message
    const clauseMatch = message.match(/(?:clause|cl|section|s)\s*(\d+[\.\d]*)/i)
    let keywordChunks: typeof vectorChunks = []
    if (clauseMatch) {
      const clauseNum = clauseMatch[1]
      const { data: kwChunks } = await admin
        .from('document_chunks')
        .select('id, document_id, chunk_index, content, metadata')
        .eq('contract_id', contract_id)
        .or(`content.ilike.%clause ${clauseNum}%,content.ilike.%${clauseNum} %`)
        .limit(10)
      keywordChunks = (kwChunks || []).map((c: Record<string, unknown>) => ({ ...c, similarity: 0.5 }))
    }

    // Merge and deduplicate chunks, prioritizing keyword matches
    const seenIds = new Set<string>()
    const allChunks: { id: string; document_id: string; content: string; similarity: number }[] = []

    // Keyword matches first (more likely to be what user wants)
    for (const chunk of keywordChunks || []) {
      if (!seenIds.has(chunk.id)) {
        seenIds.add(chunk.id)
        allChunks.push(chunk)
      }
    }
    // Then vector matches
    for (const chunk of vectorChunks || []) {
      if (!seenIds.has(chunk.id)) {
        seenIds.add(chunk.id)
        allChunks.push(chunk)
      }
    }

    // Take top 15 chunks
    const chunks = allChunks.slice(0, 15)

    // Load document filenames for context
    const { data: documents } = await supabase
      .from('documents')
      .select('id, filename, category')
      .eq('contract_id', contract_id)

    // Build document name lookup
    const docNameMap: Record<string, string> = {}
    for (const doc of documents || []) {
      docNameMap[doc.id] = doc.filename
    }

    // Build RAG context
    let ragContext = ''
    if (chunks && chunks.length > 0) {
      ragContext = chunks
        .map((chunk: { document_id: string; content: string; similarity: number }, i: number) => {
          const docName = docNameMap[chunk.document_id] || 'Unknown document'
          return `[Source ${i + 1}: ${docName}]\n${chunk.content}`
        })
        .join('\n\n---\n\n')
    }

    // Build document list
    const docList = (documents || []).map((d) => `- ${d.filename}`).join('\n')

    // Format contract details
    const formatDate = (d: string | null) => {
      if (!d) return 'Not specified'
      return new Date(d).toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }
    const formatCurrency = (n: number | null) => {
      if (!n) return 'Not specified'
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
      }).format(n)
    }

    // Build party details using new flexible fields, falling back to legacy
    const party1Role = contract.party1_role || 'Principal'
    const party1Name = contract.party1_name || contract.principal_name || 'Not specified'
    const party2Role = contract.party2_role || 'Contractor'
    const party2Name = contract.party2_name || contract.contractor_name || 'Not specified'
    const adminRole = contract.administrator_role || 'Superintendent'
    const adminName = contract.administrator_name || contract.superintendent_name || 'Not specified'

    // Load user profile for letterhead
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_name, company_abn, company_address, company_phone, signatory_name, signatory_title')
      .eq('id', user.id)
      .single()

    // Load current obligations for context
    const { data: obligations } = await supabase
      .from('obligations')
      .select('description, clause_reference, due_date, status, completed')
      .eq('contract_id', contract_id)
      .eq('completed', false)
      .order('due_date', { ascending: true })
      .limit(20)

    const obligationsContext = (obligations || []).map(o =>
      `- ${o.description} (${o.clause_reference || 'no clause'}) — due ${formatDate(o.due_date)} [${o.status}]`
    ).join('\n')

    // Build system prompt
    const systemPrompt = `You are Astruct AI, an expert construction contract intelligence assistant for the "${contract.name}" contract.

CONTRACT DETAILS:
- Form: ${contract.contract_form || 'Not specified'}
- ${party1Role}: ${party1Name}${contract.party1_address ? ' — ' + contract.party1_address : ''}
- ${party2Role}: ${party2Name}${contract.party2_address ? ' — ' + contract.party2_address : ''}
- ${adminRole}: ${adminName}${contract.administrator_address ? ' — ' + contract.administrator_address : ''}
- Date of Contract: ${formatDate(contract.date_of_contract)}
- Date for Practical Completion: ${formatDate(contract.date_practical_completion)}
- Contract Sum: ${formatCurrency(contract.contract_sum)}
- User is: ${contract.user_is_party === 'party1' ? party1Role : party2Role}

USER'S LETTERHEAD:
- Company: ${profile?.company_name || 'Not configured'}
- ABN: ${profile?.company_abn || 'Not configured'}
- Address: ${profile?.company_address || 'Not configured'}
- Phone: ${profile?.company_phone || 'Not configured'}
- Signatory: ${profile?.signatory_name || 'Not configured'}, ${profile?.signatory_title || ''}

PROJECT DOCUMENTS:
${docList || 'No documents uploaded yet.'}

${obligationsContext ? `CURRENT OBLIGATIONS:\n${obligationsContext}` : ''}

${ragContext ? `RELEVANT DOCUMENT EXCERPTS:\n\n${ragContext}` : 'No document excerpts matched this query.'}

INSTRUCTIONS:
1. Ground all answers in the uploaded documents. Cite specific clause numbers.
2. When the user asks about a specific clause, quote the relevant text directly.
3. Be natural and conversational for casual messages.
4. Never fabricate clause text — only quote what appears in the excerpts.
5. Use REAL party names and details from CONTRACT DETAILS — never generic placeholders.

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

    // Create or get session
    let currentSessionId = session_id

    if (!currentSessionId) {
      const title = message.length > 50 ? message.substring(0, 50) + '...' : message
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          contract_id,
          user_id: user.id,
          title,
        })
        .select('id')
        .single()

      if (sessionError || !newSession) {
        console.error('Session creation error:', sessionError)
        return Response.json(
          { error: 'Failed to create chat session' },
          { status: 500 }
        )
      }
      currentSessionId = newSession.id
    } else {
      // Update session updated_at
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSessionId)
    }

    // Save user message
    const { error: msgError } = await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      role: 'user',
      content: message,
    })

    if (msgError) {
      console.error('Message save error:', msgError)
    }

    // Load conversation history for context
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: true })

    const conversationMessages = (history || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Call AI with streaming — supports OpenAI and Anthropic
    const encoder = new TextEncoder()
    let fullResponse = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (isClaudeModel(model)) {
            // ─── Anthropic Claude ───
            const stream = await anthropic.messages.create({
              model,
              max_tokens: 30000,
              system: systemPrompt,
              stream: true,
              messages: conversationMessages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
              })),
            })
            for await (const event of stream) {
              if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                const content = event.delta.text
                fullResponse += content
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
              }
            }
          } else {
            // ─── OpenAI ───
            const openaiStream = await openai.chat.completions.create({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                ...conversationMessages,
              ],
              stream: true,
              max_completion_tokens: 16384,
            })
            for await (const chunk of openaiStream) {
              const content = chunk.choices[0]?.delta?.content
              if (content) {
                fullResponse += content
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
              }
            }
          }

          // Save the complete assistant message
          const adminForSave = createAdminClient()
          await adminForSave.from('chat_messages').insert({
            session_id: currentSessionId,
            role: 'assistant',
            content: fullResponse,
          })

          // Auto-save generated document as a notice
          const docMatch = fullResponse.match(/---DOCUMENT_START---([\s\S]*?)---DOCUMENT_END---/)
          let savedNoticeId: string | null = null
          if (docMatch) {
            try {
              const docData = JSON.parse(docMatch[1].trim())
              const { data: notice } = await adminForSave.from('notices').insert({
                contract_id,
                user_id: user.id,
                notice_type: docData.noticeType || 'Other',
                title: docData.title || 'Untitled Notice',
                content: docData.content || '',
                clause_references: docData.clauseReference ? [docData.clauseReference] : [],
              }).select('id').single()
              savedNoticeId = notice?.id || null
            } catch (e) {
              console.error('Failed to auto-save notice:', e)
            }
          }

          // Send done event with session_id
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, session_id: currentSessionId, notice_id: savedNoticeId })}\n\n`
            )
          )
          controller.close()
        } catch (err) {
          console.error('Stream error:', err)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
