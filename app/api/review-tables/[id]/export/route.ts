import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET: export review table as CSV
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const { data: table } = await supabase.from('review_tables').select('name, document_ids').eq('id', id).single()
    if (!table) return Response.json({ error: 'Not found' }, { status: 404 })

    const { data: columns } = await supabase.from('review_columns').select('id, name').eq('review_table_id', id).order('column_order')
    const { data: cells } = await supabase.from('review_cells').select('review_column_id, document_id, value').eq('review_table_id', id)
    const { data: docs } = await supabase.from('documents').select('id, filename').in('id', table.document_ids || [])

    if (!columns || !docs) return Response.json({ error: 'No data' }, { status: 404 })

    const docMap = Object.fromEntries((docs || []).map(d => [d.id, d.filename]))
    const cellMap = new Map<string, string>()
    for (const cell of cells || []) {
      cellMap.set(`${cell.document_id}:${cell.review_column_id}`, cell.value || '')
    }

    // Build CSV
    const headers = ['Document', ...columns.map(c => c.name)]
    const rows = (table.document_ids || []).map((docId: string) => {
      const filename = docMap[docId] || 'Unknown'
      const values = columns.map(col => {
        const val = cellMap.get(`${docId}:${col.id}`) || ''
        // Escape CSV
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val
      })
      return [filename, ...values].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')
    const filename = table.name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    })
  } catch (error) {
    return Response.json({ error: 'Export failed' }, { status: 500 })
  }
}
