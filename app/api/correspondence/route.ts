import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const contractId = request.nextUrl.searchParams.get('contract_id')
    if (!contractId) return Response.json({ error: 'contract_id required' }, { status: 400 })

    const { data, error } = await supabase
      .from('correspondence')
      .select('id, subject, from_party, to_party, content, category, correspondence_type, clause_tags, date_received, ai_summary, file_path, file_type, processed, platform')
      .eq('contract_id', contractId)
      .order('date_received', { ascending: false })

    if (error) throw error
    return Response.json({ correspondence: data || [] })
  } catch (error) {
    console.error('Correspondence fetch error:', error)
    return Response.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await request.json()
    const { error } = await supabase.from('correspondence').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
