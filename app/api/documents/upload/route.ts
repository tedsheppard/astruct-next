import { type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { CATEGORY_VALUES } from '@/lib/document-categories'
import { chunkText, extractClauseNumbers, detectSectionHeading, generateEmbeddings } from '@/lib/chunking'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 120


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Ensure the storage bucket exists
async function ensureBucket() {
  const admin = createAdminClient()
  const { data: buckets } = await admin.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === 'documents')
  if (!exists) {
    await admin.storage.createBucket('documents', {
      public: false,
      fileSizeLimit: 52428800, // 50MB
    })
  }
}

// Classify document and generate summary using GPT-4o
async function classifyDocument(
  text: string,
  filename: string
): Promise<{ category: string; summary: string }> {
  const truncatedText = text.slice(0, 8000)

  const response = await openai.chat.completions.create({
    model: 'gpt-5.4-nano',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a construction contract document classifier. Given a document's filename and text content, classify it into exactly ONE of the following categories and provide a brief summary.

Categories (use the exact value):
- 01_contract: Main contract documents, agreements, conditions of contract
- 02_tender: Tender documents, bid proposals, tender submissions
- 03_drawings: Architectural, structural, or engineering drawings
- 04_specifications: Technical specifications, standards
- 05_project_letters: General project correspondence, letters
- 06_rfi: Requests for Information
- 07_variations: Variation orders, change orders, scope changes
- 08_nod: Notices of Delay, delay notifications
- 09_eot: Extension of Time claims
- 10_payment_claims: Payment claims, progress claims, invoices from contractor
- 11_payment_schedules: Payment schedules, payment certificates
- 12_third_party_invoices: Third-party invoices, subcontractor invoices
- 13_other: Anything that doesn't fit the above categories

Respond in JSON format only: {"category": "XX_value", "summary": "short description"}

IMPORTANT: The summary must be a SHORT shorthand description (max 10 words). Do NOT start with "This document is..." or "The document...". Use concise shorthand like:
- "Letter from Pensar to JH re dispute over rock anchors"
- "RFI024 - Steel sinking shoe and rebar detail"
- "Variation VQ-053 - Rock Anchors for Wet Well Caisson"
- "Notice of Delay No.11 - Rock Anchors"
- "Subcontract No. 7216-SUB-090 - Head Contract"
- "Response to JH-SUBCOMM-004499 re rock anchors"
Identify the key parties, subject matter, and reference numbers.`,
      },
      {
        role: 'user',
        content: `Filename: ${filename}\n\nDocument text:\n${truncatedText}`,
      },
    ],
    response_format: { type: 'json_object' },
  })

  try {
    const result = JSON.parse(response.choices[0].message.content || '{}')
    const category = CATEGORY_VALUES.includes(result.category)
      ? result.category
      : '13_other'
    return {
      category,
      summary: result.summary || 'No summary available.',
    }
  } catch {
    return { category: '13_other', summary: 'Could not classify document.' }
  }
}

// chunkText, extractClauseNumbers, detectSectionHeading, generateEmbeddings
// imported from @/lib/chunking

// Extract text from PDF using pdf-parse v2
async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({
    data: new Uint8Array(buffer),
    verbosity: 0,
  })
  try {
    const result = await parser.getText()
    return result.text
  } finally {
    await parser.destroy().catch(() => {})
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureBucket()

    const formData = await request.formData()
    const contractId = formData.get('contract_id') as string

    if (!contractId) {
      return Response.json({ error: 'contract_id is required' }, { status: 400 })
    }

    // Verify the user owns this contract
    const { data: contract } = await supabase
      .from('contracts')
      .select('id')
      .eq('id', contractId)
      .single()

    if (!contract) {
      return Response.json({ error: 'Contract not found' }, { status: 404 })
    }

    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files provided' }, { status: 400 })
    }

    const admin = createAdminClient()
    const uploadedDocuments = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileType = file.type || 'application/octet-stream'
      const filename = file.name
      const fileSize = file.size

      // Upload to Supabase Storage
      const storagePath = `${contractId}/${Date.now()}_${filename}`
      const { error: uploadError } = await admin.storage
        .from('documents')
        .upload(storagePath, buffer, {
          contentType: fileType,
          upsert: false,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        continue
      }

      // Extract text
      let extractedText = ''
      if (fileType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
        try {
          extractedText = await extractPdfText(buffer)
        } catch (err) {
          console.error('PDF extraction error:', err)
          extractedText = ''
        }
      } else if (fileType.startsWith('text/')) {
        extractedText = buffer.toString('utf-8')
      }

      // Classify with AI
      let category = '13_other'
      let summary = 'Document uploaded.'
      if (extractedText.length > 50) {
        try {
          const classification = await classifyDocument(extractedText, filename)
          category = classification.category
          summary = classification.summary
        } catch (err) {
          console.error('Classification error:', err)
        }
      }

      // Insert into documents table
      const { data: doc, error: insertError } = await admin
        .from('documents')
        .insert({
          contract_id: contractId,
          user_id: user.id,
          filename,
          file_path: storagePath,
          file_type: fileType,
          file_size: fileSize,
          category,
          ai_summary: summary,
          extracted_text: extractedText,
          processed: extractedText.length > 0,
        })
        .select('id, filename, file_type, file_size, category, ai_summary, processed, uploaded_at')
        .single()

      if (insertError) {
        console.error('Document insert error:', insertError)
        continue
      }

      // Chunk and embed
      if (extractedText.length > 0 && doc) {
        try {
          const chunks = chunkText(extractedText)
          if (chunks.length > 0) {
            const embeddings = await generateEmbeddings(chunks)

            const chunkRows = chunks.map((content, index) => ({
              document_id: doc.id,
              contract_id: contractId,
              chunk_index: index,
              content,
              embedding: JSON.stringify(embeddings[index]),
              section_heading: detectSectionHeading(content),
              clause_numbers: extractClauseNumbers(content),
              metadata: { filename, chunk_of: chunks.length, clause_numbers: extractClauseNumbers(content) },
            }))

            const { error: chunkError } = await admin
              .from('document_chunks')
              .insert(chunkRows)

            if (chunkError) {
              console.error('Chunk insert error:', chunkError)
            }
          }
        } catch (err) {
          console.error('Chunking/embedding error:', err)
        }
      }

      uploadedDocuments.push(doc)

      // Trigger deadline scan in background (don't await — let it run async)
      if (doc && extractedText.length > 100) {
        fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/deadlines/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || '',
          },
          body: JSON.stringify({ contract_id: contractId, document_id: doc.id, trigger: 'upload' }),
        }).catch(err => console.error('[Upload] Deadline scan trigger failed:', err))
      }
    }

    return Response.json({ documents: uploadedDocuments })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Upload error:', msg, err)
    return Response.json(
      { error: `Upload failed: ${msg}` },
      { status: 500 }
    )
  }
}
