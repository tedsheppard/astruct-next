import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { CATEGORY_VALUES } from '@/lib/document-categories'
import {
  chunkText,
  extractClauseNumbers,
  detectSectionHeading,
  generateEmbeddings,
} from '@/lib/chunking'
import { extractFacts } from '@/lib/contract-facts/extractor'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import('unpdf')
    const result = await extractText(new Uint8Array(buffer))
    const text = Array.isArray(result.text) ? result.text.join('\n') : result.text
    if (text && text.length > 10) return text
  } catch (e) {
    console.log('[quick-init] unpdf failed, trying pdf-parse:', e instanceof Error ? e.message : e)
  }
  try {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 })
    try {
      const result = await parser.getText()
      return result.text
    } finally {
      await parser.destroy().catch(() => {})
    }
  } catch (e) {
    console.error('[quick-init] pdf-parse also failed:', e instanceof Error ? e.message : e)
    return ''
  }
}

async function classifyDocument(
  text: string,
  filename: string,
): Promise<{ category: string; summary: string }> {
  const truncated = text.slice(0, 8000)
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content:
            'Classify the document into ONE of: 01_contract, 02_tender, 03_drawings, 04_specifications, 05_project_letters, 06_rfi, 07_variations, 08_nod, 09_eot, 10_payment_claims, 11_payment_schedules, 12_third_party_invoices, 13_other. Respond JSON: {"category":"XX_value","summary":"max 10 word shorthand"}',
        },
        {
          role: 'user',
          content: `Filename: ${filename}\n\nDocument text:\n${truncated || '(no text — classify by filename)'}`,
        },
      ],
      response_format: { type: 'json_object' },
    })
    const r = JSON.parse(response.choices[0].message.content || '{}')
    return {
      category: CATEGORY_VALUES.includes(r.category) ? r.category : '01_contract',
      summary: r.summary || 'Contract uploaded.',
    }
  } catch {
    return { category: '01_contract', summary: 'Contract uploaded.' }
  }
}

/**
 * POST /api/contracts/quick-init
 *
 * The "intro modal" pipeline. The client has already uploaded the PDF to
 * Supabase Storage (bypassing Vercel's 4.5MB function payload limit).
 * This endpoint:
 *  1. Downloads from storage
 *  2. Extracts text (unpdf → pdf-parse fallback)
 *  3. Inserts a documents row
 *  4. Chunks + embeds (so RAG works immediately)
 *  5. Calls extractFacts() to populate contracts.extracted_facts
 *
 * Body: { contract_id, file_path, filename, file_type, file_size }
 * Returns: { ok, document_id, facts }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { contract_id, file_path, filename, file_type, file_size } = await request.json()

    if (!contract_id || !file_path || !filename) {
      return Response.json(
        { error: 'contract_id, file_path and filename are required' },
        { status: 400 },
      )
    }

    const admin = createAdminClient()

    // Verify ownership
    const { data: contract } = await admin
      .from('contracts')
      .select('id, user_id')
      .eq('id', contract_id)
      .single()
    if (!contract || contract.user_id !== user.id) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Anon 50MB cap (server-side enforcement; client also enforces)
    if (user.is_anonymous) {
      const ANON_TOTAL_BYTES = 50 * 1024 * 1024
      const { data: profile } = await admin
        .from('profiles')
        .select('bytes_uploaded')
        .eq('id', user.id)
        .maybeSingle()
      const already = profile?.bytes_uploaded || 0
      if (already + (file_size || 0) > ANON_TOTAL_BYTES) {
        return Response.json(
          {
            error:
              'Guest accounts can upload up to 50MB total. Sign up free to remove the limit.',
            code: 'ANON_UPLOAD_LIMIT',
          },
          { status: 413 },
        )
      }
    }

    // Download the file from storage (uploaded client-side)
    const { data: fileData, error: downloadErr } = await admin.storage
      .from('documents')
      .download(file_path)
    if (downloadErr || !fileData) {
      console.error('[quick-init] download failed', downloadErr)
      return Response.json({ error: 'Could not read uploaded file' }, { status: 500 })
    }
    const buffer = Buffer.from(await fileData.arrayBuffer())

    let extractedText = ''
    if (file_type === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
      extractedText = await extractPdfText(buffer)
    } else if (file_type?.startsWith('text/')) {
      extractedText = buffer.toString('utf-8')
    }

    const { category, summary } = await classifyDocument(extractedText, filename)

    const { data: doc, error: docErr } = await admin
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
      .select('id')
      .single()
    if (docErr || !doc) {
      console.error('[quick-init] document insert failed', docErr)
      return Response.json({ error: 'Could not save document' }, { status: 500 })
    }

    if (extractedText.length > 0) {
      try {
        const chunks = chunkText(extractedText)
        if (chunks.length > 0) {
          const embeddings = await generateEmbeddings(chunks)
          const rows = chunks.map((content, i) => ({
            document_id: doc.id,
            contract_id,
            chunk_index: i,
            content,
            embedding: JSON.stringify(embeddings[i]),
            section_heading: detectSectionHeading(content),
            clause_numbers: extractClauseNumbers(content),
            metadata: {
              filename,
              chunk_of: chunks.length,
              clause_numbers: extractClauseNumbers(content),
            },
          }))
          await admin.from('document_chunks').insert(rows)
        }
      } catch (e) {
        console.error('[quick-init] chunk/embed failed', e)
      }
    }

    // Track upload bytes for anon hard-wall.
    if (file_size) {
      const { data: profile } = await admin
        .from('profiles')
        .select('bytes_uploaded')
        .eq('id', user.id)
        .maybeSingle()
      await admin
        .from('profiles')
        .update({
          bytes_uploaded: (profile?.bytes_uploaded || 0) + file_size,
          last_active_at: new Date().toISOString(),
        })
        .eq('id', user.id)
    }

    // Run the existing fact-extractor against the new chunks.
    const facts = await extractFacts(contract_id)

    return Response.json({ ok: true, document_id: doc.id, facts })
  } catch (err) {
    console.error('[quick-init] error', err)
    return Response.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
  }
}
