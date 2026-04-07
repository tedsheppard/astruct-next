import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Get the session
  const { data: session, error: sessionError } = await supabase
    .from('chat_sessions')
    .select('id, title, contract_id, created_at, updated_at')
    .eq('id', id)
    .single()

  if (sessionError || !session) {
    return Response.json({ error: 'Session not found' }, { status: 404 })
  }

  // Get messages
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('id, role, content, feedback, sources, created_at')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  if (messagesError) {
    console.error('Messages fetch error:', messagesError)
    return Response.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }

  return Response.json({
    session,
    messages: messages || [],
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Session delete error:', error)
    return Response.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }

  return Response.json({ success: true })
}
