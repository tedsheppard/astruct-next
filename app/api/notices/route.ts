import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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

    const { data: notices, error } = await supabase
      .from('notices')
      .select('*')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ notices })
  } catch (err) {
    console.error('GET /api/notices error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
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

    const body = await request.json()
    const { contract_id, notice_type, title, content, clause_references } = body

    if (!contract_id || !notice_type || !title || !content) {
      return Response.json(
        { error: 'contract_id, notice_type, title, and content are required' },
        { status: 400 }
      )
    }

    const { data: notice, error } = await supabase
      .from('notices')
      .insert({
        contract_id,
        user_id: user.id,
        notice_type,
        title,
        content,
        clause_references: clause_references || [],
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ notice }, { status: 201 })
  } catch (err) {
    console.error('POST /api/notices error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
