import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runRAGPipeline } from '@/lib/rag/pipeline'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()

  // Helper to send debug logs as SSE events
  function sendLog(controller: ReadableStreamDefaultController, msg: string) {
    console.log(`[Chat] ${msg}`)
    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ debug: msg })}\n\n`))
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch (e) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { message, contract_id, session_id, model: requestedModel, selected_document_ids } = body as {
    message: string; contract_id: string; session_id?: string; model?: string; selected_document_ids?: string[]
  }

  if (!message || !contract_id) {
    return Response.json({ error: 'message and contract_id are required' }, { status: 400 })
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        sendLog(controller, 'Stream started')

        const supabase = await createClient()
        sendLog(controller, 'Supabase client created')

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) {
          sendLog(controller, `Auth error: ${authError.message}`)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `Auth failed: ${authError.message}` })}\n\n`))
          controller.close()
          return
        }
        if (!user) {
          sendLog(controller, 'No user found')
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Not authenticated' })}\n\n`))
          controller.close()
          return
        }
        sendLog(controller, `User: ${user.email}`)

        const model = (requestedModel as string) || 'gpt-5.4-mini'
        sendLog(controller, `Model: ${model}`)

        // Load contract
        const { data: contract, error: contractError } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', contract_id)
          .single()

        if (contractError || !contract) {
          sendLog(controller, `Contract error: ${contractError?.message || 'not found'}`)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Contract not found' })}\n\n`))
          controller.close()
          return
        }
        sendLog(controller, `Contract: ${contract.name}`)

        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_name, company_abn, company_address, company_phone, signatory_name, signatory_title')
          .eq('id', user.id)
          .single()
        sendLog(controller, 'Profile loaded')

        // Create or get session
        let currentSessionId: string | null = (session_id as string) || null

        if (!currentSessionId) {
          const title = message.length > 50 ? message.substring(0, 50) + '...' : message
          const { data: newSession, error: sessionError } = await supabase
            .from('chat_sessions')
            .insert({ contract_id, user_id: user.id, title })
            .select('id')
            .single()

          if (sessionError || !newSession) {
            sendLog(controller, `Session error: ${sessionError?.message || 'failed'}`)
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to create session' })}\n\n`))
            controller.close()
            return
          }
          currentSessionId = newSession.id
          sendLog(controller, `New session: ${currentSessionId}`)
        } else {
          await supabase.from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', currentSessionId)
          sendLog(controller, `Existing session: ${currentSessionId}`)
        }

        // Save user message
        await supabase.from('chat_messages').insert({ session_id: currentSessionId, role: 'user', content: message })
        sendLog(controller, 'User message saved')

        // Load history
        const { data: history } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true })

        const conversationMessages = (history || []).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
        sendLog(controller, `History: ${conversationMessages.length} messages`)
        sendLog(controller, 'Starting RAG pipeline...')

        // Run pipeline
        await runRAGPipeline(
          {
            contractId: contract_id,
            userId: user.id,
            sessionId: currentSessionId,
            selectedDocumentIds: selected_document_ids as string[] | undefined,
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
            onFollowups(followups) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ followups })}\n\n`))
            },
            onContent(content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            },
            onDone(result) {
              sendLog(controller, 'Pipeline complete')
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true, session_id: result.sessionId, notice_id: result.noticeId })}\n\n`)
              )
              controller.close()
            },
            onError(error) {
              sendLog(controller, `Pipeline error: ${error}`)
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `Pipeline error: ${error}` })}\n\n`))
              controller.close()
            },
          }
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        sendLog(controller, `Fatal error: ${msg}`)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `Fatal: ${msg}` })}\n\n`))
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
