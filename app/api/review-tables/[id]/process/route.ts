import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST: process a review table — extract all cells using gpt-5-nano (cheapest)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: tableId } = await params
    const admin = createAdminClient()

    // Load table
    const { data: table } = await admin
      .from('review_tables')
      .select('*')
      .eq('id', tableId)
      .single()

    if (!table) return Response.json({ error: 'Not found' }, { status: 404 })

    // Load columns
    const { data: columns } = await admin
      .from('review_columns')
      .select('*')
      .eq('review_table_id', tableId)
      .order('column_order')

    if (!columns || columns.length === 0) {
      return Response.json({ error: 'No columns defined' }, { status: 400 })
    }

    // Load documents
    const docIds = table.document_ids || []
    if (docIds.length === 0) {
      return Response.json({ error: 'No documents selected' }, { status: 400 })
    }

    const { data: docs } = await admin
      .from('documents')
      .select('id, filename, extracted_text')
      .in('id', docIds)

    if (!docs || docs.length === 0) {
      return Response.json({ error: 'No documents found' }, { status: 404 })
    }

    // Set table status to processing
    await admin.from('review_tables').update({ status: 'processing' }).eq('id', tableId)

    let totalCells = 0
    let completedCells = 0

    // Process each document — extract all columns at once per document (batch prompt)
    for (const doc of docs) {
      if (!doc.extracted_text || doc.extracted_text.length < 20) continue

      const docText = doc.extracted_text.slice(0, 8000) // Cap for cheap model

      // Build a single batch prompt for all columns
      const columnDefs = columns.map((col, i) =>
        `${i + 1}. "${col.name}" (${col.data_type}): ${col.description || col.name}`
      ).join('\n')

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-5-nano', // Cheapest model
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: `Extract data points from a construction document. For each field, provide the value and a brief source quote. Respond in JSON array format matching the field numbers. Use "N/A" if not found.`
            },
            {
              role: 'user',
              content: `Document: ${doc.filename}\n\nContent:\n${docText}\n\nExtract these fields:\n${columnDefs}\n\nRespond as JSON array:\n[{"value": "...", "excerpt": "brief source quote"}, ...]`
            }
          ],
          response_format: { type: 'json_object' },
        })

        const text = response.choices[0]?.message?.content || '{}'
        let extracted: Array<{ value: string; excerpt?: string }> = []

        try {
          const parsed = JSON.parse(text)
          // Handle both array and object with array property
          if (Array.isArray(parsed)) {
            extracted = parsed
          } else if (parsed.results) {
            extracted = parsed.results
          } else if (parsed.fields) {
            extracted = parsed.fields
          } else {
            // Try to extract values from numbered keys
            extracted = columns.map((_, i) => parsed[i] || parsed[`${i + 1}`] || parsed[columns[i].name] || { value: 'N/A' })
          }
        } catch {
          console.error(`[ReviewTable] JSON parse error for ${doc.filename}`)
          continue
        }

        // Save cells
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i]
          const cell = extracted[i] || { value: 'N/A' }
          const value = typeof cell === 'string' ? cell : cell.value || 'N/A'
          const excerpt = typeof cell === 'string' ? '' : cell.excerpt || ''
          const isNA = value === 'N/A' || value === 'n/a' || value === ''

          await admin.from('review_cells').upsert({
            review_table_id: tableId,
            review_column_id: col.id,
            document_id: doc.id,
            value: value,
            raw_excerpt: excerpt,
            confidence: isNA ? 0 : 0.8,
            status: isNA ? 'not_found' : 'complete',
          }, { onConflict: 'review_table_id,review_column_id,document_id' })

          completedCells++
        }
        totalCells += columns.length
      } catch (err) {
        console.error(`[ReviewTable] Processing error for ${doc.filename}:`, err)
        // Mark cells as error for this doc
        for (const col of columns) {
          await admin.from('review_cells').upsert({
            review_table_id: tableId,
            review_column_id: col.id,
            document_id: doc.id,
            value: null,
            status: 'error',
            confidence: 0,
          }, { onConflict: 'review_table_id,review_column_id,document_id' })
        }
      }
    }

    // Set table status to complete
    await admin.from('review_tables').update({ status: 'complete', updated_at: new Date().toISOString() }).eq('id', tableId)

    console.log(`[ReviewTable] Processed ${docs.length} docs, ${completedCells}/${totalCells} cells`)

    return Response.json({ success: true, documents_processed: docs.length, cells_completed: completedCells })
  } catch (error) {
    console.error('[ReviewTable] Process error:', error)
    return Response.json({ error: 'Processing failed' }, { status: 500 })
  }
}
