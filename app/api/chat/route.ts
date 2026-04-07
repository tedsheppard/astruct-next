import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runRAGPipeline } from '@/lib/rag/pipeline'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      message,
      contract_id,
      session_id,
      model: requestedModel,
      selected_document_ids,
    } = await request.json()

    const model = requestedModel || 'claude-sonnet-4-6'

    if (!message || !contract_id) {
      return Response.json({ error: 'message and contract_id are required' }, { status: 400 })
    }

    // Load contract
    const { data: contract } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contract_id)
      .single()

    if (!contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Load user profile
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
        console.error('Session creation error:', sessionError)
        return Response.json({ error: 'Failed to create chat session' }, { status: 500 })
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

    // Stream response via RAG pipeline
    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
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
