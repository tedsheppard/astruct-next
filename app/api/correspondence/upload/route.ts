import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { chunkText, extractClauseNumbers, detectSectionHeading, generateEmbeddings } from '@/lib/chunking'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: new Uint8Array(buffer), verbosity: 0 })
  try {
    const result = await parser.getText()
    return result.text
  } finally {
    await parser.destroy().catch(() => {})
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const contractId = formData.get('contract_id') as string
    if (!contractId) return Response.json({ error: 'contract_id required' }, { status: 400 })

    const admin = createAdminClient()

    // Ensure storage bucket
    const { data: buckets } = await admin.storage.listBuckets()
    if (!buckets?.some(b => b.name === 'correspondence')) {
      await admin.storage.createBucket('correspondence', { public: false, fileSizeLimit: 52428800 })
    }

    // Load contract for context
    const { data: contract } = await admin
      .from('contracts')
      .select('party1_name, party2_name, principal_name, contractor_name, party1_role, party2_role')
      .eq('id', contractId)
      .single()

    const party1 = contract?.party1_name || contract?.principal_name || 'Principal'
    const party2 = contract?.party2_name || contract?.contractor_name || 'Contractor'

    const files = formData.getAll('files') as File[]
    if (!files || files.length === 0) return Response.json({ error: 'No files' }, { status: 400 })

    const uploaded = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileType = file.type || 'application/octet-stream'
      const filename = file.name

      // Upload to storage
      const storagePath = `${contractId}/${Date.now()}_${filename}`
      await admin.storage.from('correspondence').upload(storagePath, buffer, { contentType: fileType, upsert: false })

      // Extract text
      let extractedText = ''
      if (fileType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf')) {
        try { extractedText = await extractPdfText(buffer) } catch { extractedText = '' }
      } else if (fileType.startsWith('text/') || filename.endsWith('.txt') || filename.endsWith('.eml')) {
        extractedText = buffer.toString('utf-8')
      }

      // AI classification + extraction
      let classification = {
        date: new Date().toISOString().split('T')[0],
        from: '',
        to: '',
        subject: filename.replace(/\.[^.]+$/, ''),
        type: 'letter',
        clause_references: [] as string[],
        summary: '',
      }

      if (extractedText.length > 30) {
        try {
          const res = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 600,
            temperature: 0,
            messages: [{
              role: 'user',
              content: `Analyse this construction project correspondence. The parties are ${party1} and ${party2}.

Extract:
- date: the date of the correspondence (YYYY-MM-DD)
- from: who sent it
- to: who received it
- subject: brief subject line (max 10 words)
- type: one of [letter, email, notice, direction, rfi, payment_claim, variation, eot_claim, show_cause, other]
- clause_references: contract clause numbers mentioned (array of strings)
- summary: 1 sentence summary

JSON only, no markdown:
{"date":"","from":"","to":"","subject":"","type":"","clause_references":[],"summary":""}

Document (${filename}):
${extractedText.slice(0, 6000)}`
            }],
          })

          const text = res.content[0].type === 'text' ? res.content[0].text : ''
          const match = text.match(/\{[\s\S]*\}/)
          if (match) classification = { ...classification, ...JSON.parse(match[0]) }
        } catch (e) {
          console.error('[Correspondence Upload] AI classification failed:', e)
        }
      }

      // Insert into correspondence table
      const { data: corr, error } = await admin
        .from('correspondence')
        .insert({
          contract_id: contractId,
          user_id: user.id,
          subject: classification.subject || filename,
          content: extractedText.slice(0, 50000),
          from_party: classification.from || '',
          to_party: classification.to || '',
          category: classification.type === 'letter' ? 'Incoming' : 'Incoming',
          correspondence_type: classification.type,
          clause_tags: classification.clause_references || [],
          date_received: classification.date,
          file_path: storagePath,
          file_type: fileType,
          file_size: file.size,
          extracted_text: extractedText,
          ai_summary: classification.summary,
          processed: true,
        })
        .select('id, subject, from_party, to_party, correspondence_type, date_received, clause_tags, ai_summary')
        .single()

      if (error) { console.error('[Correspondence Upload] Insert error:', error); continue }

      uploaded.push(corr)

      // Chunk and embed for RAG searchability
      if (extractedText.length > 100 && corr) {
        try {
          const chunks = chunkText(extractedText)
          if (chunks.length > 0) {
            const embeddings = await generateEmbeddings(chunks)

            // Create a shadow document entry for RAG
            const { data: shadowDoc } = await admin
              .from('documents')
              .insert({
                contract_id: contractId,
                user_id: user.id,
                filename: `[Correspondence] ${classification.subject}`,
                file_path: storagePath,
                file_type: fileType,
                file_size: file.size,
                category: '05_project_letters',
                ai_summary: classification.summary,
                extracted_text: extractedText,
                processed: true,
              })
              .select('id')
              .single()

            if (shadowDoc) {
              const chunkRows = chunks.map((content, index) => ({
                document_id: shadowDoc.id,
                contract_id: contractId,
                chunk_index: index,
                content,
                embedding: JSON.stringify(embeddings[index]),
                section_heading: detectSectionHeading(content),
                clause_numbers: extractClauseNumbers(content),
                metadata: { filename: `[Correspondence] ${classification.subject}`, chunk_of: chunks.length },
              }))

              await admin.from('document_chunks').insert(chunkRows)
            }
          }
        } catch (e) {
          console.error('[Correspondence Upload] Chunking error:', e)
        }
      }

      // Trigger deadline scan in background
      if (corr && extractedText.length > 50) {
        fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : 'http://localhost:3000'}/api/deadlines/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Cookie': request.headers.get('cookie') || '' },
          body: JSON.stringify({ contract_id: contractId, correspondence_id: corr.id, trigger: 'correspondence' }),
        }).catch(() => {})
      }
    }

    return Response.json({ correspondence: uploaded })
  } catch (err) {
    console.error('[Correspondence Upload] Error:', err)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
