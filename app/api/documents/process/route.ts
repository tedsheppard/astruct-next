import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CATEGORY_VALUES } from '@/lib/document-categories'
import { chunkText, extractClauseNumbers, detectSectionHeading, generateEmbeddings } from '@/lib/chunking'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Try unpdf first (works on serverless/Vercel)
    const { extractText } = await import('unpdf')
    const result = await extractText(new Uint8Array(buffer))
    const text = Array.isArray(result.text) ? result.text.join('\n') : result.text
    if (text && text.length > 10) return text
  } catch (e) {
    console.log('[Process] unpdf failed, trying pdf-parse:', e instanceof Error ? e.message : e)
  }

  try {
    // Fallback to pdf-parse v2
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 })
    try {
      const result = await parser.getText()
      return result.text
    } finally {
      await parser.destroy().catch(() => {})
    }
  } catch (e) {
    console.error('[Process] pdf-parse also failed:', e instanceof Error ? e.message : e)
    return ''
  }
}

async function classifyDocument(text: string, filename: string): Promise<{ category: string; summary: string }> {
  const truncatedText = text.slice(0, 8000)
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
Respond JSON only: {"category": "XX_value", "summary": "max 10 word shorthand"}`,
        },
        { role: 'user', content: `Filename: ${filename}\n\nDocument text:\n${truncatedText}` },
      ],
      response_format: { type: 'json_object' },
    })
    const result = JSON.parse(response.choices[0].message.content || '{}')
    return {
      category: CATEGORY_VALUES.includes(result.category) ? result.category : '13_other',
      summary: result.summary || 'No summary available.',
    }
  } catch (err) {
    console.error('Classification error:', err)
    return { category: '13_other', summary: 'Could not classify document.' }
  }
}

/**
 * POST /api/documents/process
 * Body: { contract_id, file_path, filename, file_type, file_size }
 *
 * The file is already uploaded to Supabase Storage by the client.
 * This route downloads it, extracts text, classifies, chunks, and embeds.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { contract_id, file_path, filename, file_type, file_size } = await request.json()

    if (!contract_id || !file_path || !filename) {
      return Response.json({ error: 'contract_id, file_path, and filename are required' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await admin.storage
      .from('documents')
      .download(file_path)

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      return Response.json({ error: 'Failed to download file from storage' }, { status: 500 })
    }

    const buffer = Buffer.from(await fileData.arrayBuffer())

    // Extract text
    let extractedText = ''
    if (file_type === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
      try { extractedText = await extractPdfText(buffer) } catch (err) {
        console.error('PDF extraction error:', err)
      }
    } else if (file_type?.startsWith('text/')) {
      extractedText = buffer.toString('utf-8')
    }

    // Classify
    let category = '13_other'
    let summary = 'Document uploaded.'
    if (extractedText.length > 50) {
      const classification = await classifyDocument(extractedText, filename)
      category = classification.category
      summary = classification.summary
    }

    // Insert document record
    const { data: doc, error: insertError } = await admin
      .from('documents')
      .insert({
        contract_id,
        user_id: user.id,
        filename,
        file_path,
        file_type: file_type || 'application/octet-stream',
        file_size: file_size || buffer.length,
        category,
        ai_summary: summary,
        extracted_text: extractedText,
        processed: extractedText.length > 0,
      })
      .select('id, filename, file_type, file_size, category, ai_summary, processed, uploaded_at')
      .single()

    if (insertError) {
      console.error('Document insert error:', insertError)
      return Response.json({ error: 'Failed to save document' }, { status: 500 })
    }

    // Chunk and embed
    if (extractedText.length > 0 && doc) {
      try {
        const chunks = chunkText(extractedText)
        if (chunks.length > 0) {
          const embeddings = await generateEmbeddings(chunks)
          const chunkRows = chunks.map((content, index) => ({
            document_id: doc.id,
            contract_id,
            chunk_index: index,
            content,
            embedding: JSON.stringify(embeddings[index]),
            section_heading: detectSectionHeading(content),
            clause_numbers: extractClauseNumbers(content),
            metadata: { filename, chunk_of: chunks.length },
          }))
          await admin.from('document_chunks').insert(chunkRows)
        }
      } catch (err) {
        console.error('Chunking/embedding error:', err)
      }
    }

    return Response.json({ document: doc })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Process error:', msg)
    return Response.json({ error: `Processing failed: ${msg}` }, { status: 500 })
  }
}
