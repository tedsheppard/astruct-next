import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { chunkText, extractClauseNumbers, detectSectionHeading, generateEmbeddings } from '@/lib/chunking'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

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

    // Load all documents with extracted text
    const { data: documents } = await admin
      .from('documents')
      .select('id, filename, extracted_text')
      .eq('contract_id', contract_id)
      .not('extracted_text', 'is', null)

    if (!documents || documents.length === 0) {
      return Response.json({ success: true, documents_processed: 0, total_chunks: 0 })
    }

    let totalChunks = 0

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i]
      if (!doc.extracted_text || doc.extracted_text.length < 50) continue

      console.log(`[Reembed] Processing document ${i + 1}/${documents.length}: ${doc.filename}`)

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
    })
  } catch (error) {
    console.error('[Reembed] Error:', error)
    return Response.json({ error: 'Failed to re-embed documents' }, { status: 500 })
  }
}
