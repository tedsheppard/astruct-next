import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// GET: list review tables for a contract
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const contractId = request.nextUrl.searchParams.get('contract_id')
    if (!contractId) return Response.json({ error: 'contract_id required' }, { status: 400 })

    const { data, error } = await supabase
      .from('review_tables')
      .select('id, name, description, status, document_ids, created_at, updated_at')
      .eq('contract_id', contractId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ tables: data || [] })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST: create a new review table with columns
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { contract_id, name, description, document_ids, columns } = await request.json()
    if (!contract_id || !name) return Response.json({ error: 'contract_id and name required' }, { status: 400 })

    const admin = createAdminClient()

    // Create the table
    const { data: table, error } = await admin
      .from('review_tables')
      .insert({ contract_id, user_id: user.id, name, description, document_ids: document_ids || [], status: 'draft' })
      .select('id')
      .single()

    if (error || !table) throw error

    // Create columns
    if (columns && columns.length > 0) {
      const columnRows = columns.map((col: { name: string; description?: string; data_type?: string }, i: number) => ({
        review_table_id: table.id,
        name: col.name,
        description: col.description || '',
        data_type: col.data_type || 'text',
        column_order: i,
      }))

      await admin.from('review_columns').insert(columnRows)
    }

    return Response.json({ table: { id: table.id, name, description } })
  } catch (error) {
    console.error('Review table create error:', error)
    return Response.json({ error: 'Failed to create' }, { status: 500 })
  }
}
