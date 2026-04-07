import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: messageId } = await params
    const { feedback } = await request.json()

    if (feedback !== 'positive' && feedback !== 'negative' && feedback !== null) {
      return Response.json({ error: 'Invalid feedback value' }, { status: 400 })
    }

    // Verify user owns this message's session
    const admin = createAdminClient()
    const { data: message } = await admin
      .from('chat_messages')
      .select('id, session_id')
      .eq('id', messageId)
      .single()

    if (!message) {
      return Response.json({ error: 'Message not found' }, { status: 404 })
    }

    const { data: session } = await admin
      .from('chat_sessions')
      .select('user_id')
      .eq('id', message.session_id)
      .single()

    if (!session || session.user_id !== user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await admin
      .from('chat_messages')
      .update({
        feedback,
        feedback_at: feedback ? new Date().toISOString() : null,
      })
      .eq('id', messageId)

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return Response.json({ error: 'Failed to save feedback' }, { status: 500 })
  }
}
