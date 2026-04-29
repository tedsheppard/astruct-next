import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { chunkText, extractClauseNumbers, detectSectionHeading, generateEmbeddings } from '@/lib/chunking'
import { CATEGORY_VALUES } from '@/lib/document-categories'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function classifyDocument(
  text: string,
  filename: string
): Promise<{ category: string; summary: string }> {
  const truncatedText = (text || '').slice(0, 8000)
  const hasText = truncatedText.trim().length > 50
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: `You are a construction contract document classifier. Classify into exactly ONE category and provide a brief summary.

Categories: 01_contract, 02_tender, 03_drawings, 04_specifications, 05_project_letters, 06_rfi, 07_variations, 08_nod, 09_eot, 10_payment_claims, 11_payment_schedules, 12_third_party_invoices, 13_other

Filename hints (use confidently when text is sparse):
- RFI / RFI-### → 06_rfi
- VAR / VO / Variation → 07_variations
- NOD → 08_nod
- EOT → 09_eot
- LETTER / LTR → 05_project_letters (unless filename strongly implies another category)
- Program / Schedule (alone) → 05_project_letters
- Contract / Agreement / Subcontract → 01_contract

If text is missing or sparse, classify from filename — DO NOT default to 13_other unless no signal is present.

JSON only: {"category": "XX_value", "summary": "max 10 word shorthand with reference numbers / parties / subject"}`,
        },
        {
          role: 'user',
          content: hasText
            ? `Filename: ${filename}\n\nDocument text:\n${truncatedText}`
            : `Filename: ${filename}\n\n(No extractable text — PDF may be image-only/scanned. Classify from filename.)`,
        },
      ],
      response_format: { type: 'json_object' },
    })
    const result = JSON.parse(response.choices[0].message.content || '{}')
    return {
      category: CATEGORY_VALUES.includes(result.category) ? result.category : '13_other',
      summary: result.summary || 'No summary available.',
    }
  } catch (err) {
    console.error('[Reembed] Classification error:', err)
    return { category: '13_other', summary: 'Could not classify document.' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { contract_id } = await request.json()
    if (!contract_id) {
      return Response.json({ error: 'contract_id is required' }, { status: 400 })
    }

    // Verify ownership
    const { data: contract } = await supabase
      .from('contracts')
      .select('id')
      .eq('id', contract_id)
      .single()

    if (!contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    const admin = createAdminClient()

    // Load ALL documents (including ones with no text — they still need reclassification by filename)
    const { data: documents } = await admin
      .from('documents')
      .select('id, filename, extracted_text, category')
      .eq('contract_id', contract_id)

    if (!documents || documents.length === 0) {
      return Response.json({ success: true, documents_processed: 0, total_chunks: 0, reclassified: 0 })
    }

    let totalChunks = 0
    let reclassified = 0

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i]
      console.log(`[Reembed] Processing document ${i + 1}/${documents.length}: ${doc.filename}`)

      // Reclassify every document — filename + text → category & summary.
      try {
        const { category, summary } = await classifyDocument(doc.extracted_text || '', doc.filename)
        if (category !== doc.category) {
          await admin
            .from('documents')
            .update({ category, ai_summary: summary })
            .eq('id', doc.id)
          reclassified++
        } else {
          // Refresh the summary even if category unchanged
          await admin.from('documents').update({ ai_summary: summary }).eq('id', doc.id)
        }
      } catch (err) {
        console.error(`[Reembed] Reclassify failed for ${doc.filename}:`, err)
      }

      // Skip embedding for empty / too-short text
      if (!doc.extracted_text || doc.extracted_text.length < 50) continue

      try {
        // Delete existing chunks for this document
        await admin
          .from('document_chunks')
          .delete()
          .eq('document_id', doc.id)

        // Re-chunk with structure-aware chunker
        const chunks = chunkText(doc.extracted_text)
        if (chunks.length === 0) continue

        // Re-embed with text-embedding-3-large
        const embeddings = await generateEmbeddings(chunks)

        // Build chunk rows with enriched metadata
        const chunkRows = chunks.map((content, index) => ({
          document_id: doc.id,
          contract_id,
          chunk_index: index,
          content,
          embedding: JSON.stringify(embeddings[index]),
          section_heading: detectSectionHeading(content),
          clause_numbers: extractClauseNumbers(content),
          metadata: {
            filename: doc.filename,
            chunk_of: chunks.length,
            clause_numbers: extractClauseNumbers(content),
          },
        }))

        const { error: chunkError } = await admin
          .from('document_chunks')
          .insert(chunkRows)

        if (chunkError) {
          console.error(`[Reembed] Chunk insert error for ${doc.filename}:`, chunkError)
          continue
        }

        totalChunks += chunks.length
        console.log(`[Reembed] ${doc.filename}: ${chunks.length} chunks created`)
      } catch (err) {
        console.error(`[Reembed] Failed for ${doc.filename}:`, err)
        // Continue with next document
      }
    }

    return Response.json({
      success: true,
      documents_processed: documents.length,
      total_chunks: totalChunks,
      reclassified,
    })
  } catch (error) {
    console.error('[Reembed] Error:', error)
    return Response.json({ error: 'Failed to re-embed documents' }, { status: 500 })
  }
}
