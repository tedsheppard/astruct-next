import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contractId = request.nextUrl.searchParams.get('contract_id')

  if (!contractId) {
    return Response.json(
      { error: 'contract_id is required' },
      { status: 400 }
    )
  }

  const { data: sessions, error } = await supabase
    .from('chat_sessions')
    .select('id, title, created_at, updated_at')
    .eq('contract_id', contractId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Sessions fetch error:', error)
    return Response.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }

  return Response.json({ sessions: sessions || [] })
}
