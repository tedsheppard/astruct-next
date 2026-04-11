import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runRAGPipeline } from '@/lib/rag/pipeline'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  // Parse the request body BEFORE creating the stream
  // This is the only sync work we do before returning the Response
  const body = await request.json()
  const { message, contract_id, session_id, model: requestedModel, selected_document_ids } = body

  if (!message || !contract_id) {
    return Response.json({ error: 'message and contract_id are required' }, { status: 400 })
  }

  const encoder = new TextEncoder()

  // Return the streaming response IMMEDIATELY
  // All heavy work (auth, DB, AI calls) happens inside the stream
  const readable = new ReadableStream({
    async start(controller) {
      try {
        // Heartbeat — first byte goes out instantly
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking: 'Starting...' })}\n\n`))

        // Now do auth + DB work inside the stream (connection is already alive)
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Unauthorized' })}\n\n`))
          controller.close()
          return
        }

        const model = requestedModel || 'claude-sonnet-4-6'

        // Load contract
        const { data: contract } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', contract_id)
          .single()

        if (!contract) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Contract not found' })}\n\n`))
          controller.close()
          return
        }

        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_name, company_abn, company_address, company_phone, signatory_name, signatory_title')
          .eq('id', user.id)
          .single()

        // Create or get session
        let currentSessionId = session_id

        if (!currentSessionId) {
          const title = message.length > 50 ? message.substring(0, 50) + '...' : message
          const { data: newSession, error: sessionError } = await supabase
            .from('chat_sessions')
            .insert({ contract_id, user_id: user.id, title })
            .select('id')
            .single()

          if (sessionError || !newSession) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to create session' })}\n\n`))
            controller.close()
            return
          }
          currentSessionId = newSession.id
        } else {
          await supabase
            .from('chat_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', currentSessionId)
        }

        // Save user message
        await supabase.from('chat_messages').insert({
          session_id: currentSessionId,
          role: 'user',
          content: message,
        })

        // Load conversation history
        const { data: history } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true })

        const conversationMessages = (history || []).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

        // Run RAG pipeline
        await runRAGPipeline(
          {
            contractId: contract_id,
            userId: user.id,
            sessionId: currentSessionId,
            selectedDocumentIds: selected_document_ids,
            model,
            conversationHistory: conversationMessages,
            contract,
            profile,
          },
          message,
          {
            onThinkingState(state) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking: state })}\n\n`))
            },
            onThinkingSources(data) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking_sources: data })}\n\n`))
            },
            onSources(sources) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources })}\n\n`))
            },
            onContent(content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            },
            onDone(result) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true, session_id: result.sessionId, notice_id: result.noticeId })}\n\n`)
              )
              controller.close()
            },
            onError(error) {
              console.error('[Chat] Pipeline error:', error)
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`))
              controller.close()
            },
          }
        )
      } catch (err) {
        console.error('[Chat] Fatal error:', err)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Internal error' })}\n\n`))
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
}
