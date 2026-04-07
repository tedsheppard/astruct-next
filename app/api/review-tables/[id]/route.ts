import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET: full review table with columns and cells
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const { data: table } = await supabase
      .from('review_tables')
      .select('*')
      .eq('id', id)
      .single()

    if (!table) return Response.json({ error: 'Not found' }, { status: 404 })

    const { data: columns } = await supabase
      .from('review_columns')
      .select('*')
      .eq('review_table_id', id)
      .order('column_order')

    const { data: cells } = await supabase
      .from('review_cells')
      .select('*')
      .eq('review_table_id', id)

    // Get document names
    const docIds = table.document_ids || []
    const { data: docs } = await supabase
      .from('documents')
      .select('id, filename')
      .in('id', docIds.length > 0 ? docIds : ['00000000-0000-0000-0000-000000000000'])

    return Response.json({ table, columns: columns || [], cells: cells || [], documents: docs || [] })
  } catch (error) {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { error } = await supabase.from('review_tables').delete().eq('id', id)
    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
