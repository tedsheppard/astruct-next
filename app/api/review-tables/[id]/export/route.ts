import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

// GET ?format=csv|xlsx — defaults to CSV for back-compat.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const format = request.nextUrl.searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv'

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

    const headers = ['Document', ...columns.map(c => c.name)]
    const dataRows = (table.document_ids || []).map((docId: string) => {
      const filename = docMap[docId] || 'Unknown'
      const values = columns.map(col => cellMap.get(`${docId}:${col.id}`) || '')
      return [filename, ...values]
    })

    const filename = table.name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_')

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows])
      XLSX.utils.book_append_sheet(wb, ws, 'Review')
      const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
      return new Response(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        },
      })
    }

    // CSV fallback
    const csv = [headers, ...dataRows]
      .map((row: unknown[]) => row.map((val: unknown) => {
        const s = String(val ?? '')
        return s.includes(',') || s.includes('"') || s.includes('\n')
          ? `"${s.replace(/"/g, '""')}"`
          : s
      }).join(','))
      .join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}.csv"`,
      },
    })
  } catch (error) {
    console.error('[review-tables/export]', error)
    return Response.json({ error: 'Export failed' }, { status: 500 })
  }
}
