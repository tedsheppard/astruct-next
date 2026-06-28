import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const suiteDir = path.join(rootDir, 'seeds', 'riverside-towers-suite')
const biblePath = path.join(suiteDir, 'project-bible.json')
const manifestPath = path.join(suiteDir, 'documents-manifest.json')
const envPath = path.join(rootDir, '.env.local')

function loadEnv(text) {
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

function chunkText(text, maxTokens = 1200, overlapTokens = 200) {
  const charsPerToken = 4
  const maxChars = maxTokens * charsPerToken
  const overlapChars = overlapTokens * charsPerToken
  if (!text || text.length === 0) return []
  if (text.length <= maxChars) return [text]
  const chunks = []
  let start = 0
  while (start < text.length) {
    let end = start + maxChars
    if (end < text.length) {
      const slice = text.slice(start, end)
      const clauseBreak = slice.search(/\n\d+\.\s+[A-Z]/)
      const lastParagraph = slice.lastIndexOf('\n\n')
      const lastSentence = slice.lastIndexOf('. ')
      const lastNewline = slice.lastIndexOf('\n')
      if (clauseBreak > maxChars * 0.4) {
        end = start + clauseBreak
      } else if (lastParagraph > maxChars * 0.5) {
        end = start + lastParagraph + 2
      } else if (lastSentence > maxChars * 0.5) {
        end = start + lastSentence + 2
      } else if (lastNewline > maxChars * 0.5) {
        end = start + lastNewline + 1
      }
    }
    chunks.push(text.slice(start, end).trim())
    start = end - overlapChars
    if (start < 0) start = 0
    if (end >= text.length) break
  }
  return chunks.filter(Boolean)
}

function extractClauseNumbers(text) {
  const matches = [...text.matchAll(/(?:clause|section)\s+(\d+[\.\d]*)/gi)]
  return [...new Set(matches.map((m) => m[1]))]
}

function detectSectionHeading(text) {
  const headingMatch = text.match(/^(?:\d+[\.\d]*\.?\s+[A-Z][A-Z\s&]+|(?:Clause|Section)\s+\d+[\.\d]*\s*[-–—]\s*.+|# .+)/m)
  return headingMatch ? headingMatch[0].trim().slice(0, 100) : null
}

async function generateEmbeddings(openai, chunks) {
  if (chunks.length === 0) return []
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: chunks,
    dimensions: 1536,
  })
  return response.data.map((d) => d.embedding)
}

async function main() {
  loadEnv(await fs.readFile(envPath, 'utf8'))
  const project = JSON.parse(await fs.readFile(biblePath, 'utf8'))
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  if (!supabaseUrl || !serviceRoleKey || !openaiKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or OPENAI_API_KEY')
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const openai = new OpenAI({ apiKey: openaiKey })

  let { data: profile } = await supabase.from('profiles').select('id, email').limit(1).maybeSingle()
  if (!profile) {
    const { data: userList, error: userListError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 })
    if (userListError) throw new Error(`Failed to inspect auth users: ${userListError.message}`)

    let targetUser = userList?.users?.[0] || null
    if (!targetUser) {
      const demoEmail = 'demo+astruct-riverside@example.com'
      const demoPassword = `Astruct-${Date.now()}-Seed!`
      const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        email_confirm: true,
        user_metadata: { name: 'Astruct Demo User' },
      })
      if (createUserError || !createdUser.user) {
        throw new Error(`Failed to create bootstrap auth user: ${createUserError?.message}`)
      }
      targetUser = createdUser.user
    }

    const targetUserId = targetUser.id
    const targetEmail = targetUser.email || 'demo+astruct-riverside@example.com'
    const { data: createdProfile } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', targetUserId)
      .maybeSingle()

    if (!createdProfile) {
      const { error: insertProfileError } = await supabase.from('profiles').insert({
        id: targetUserId,
        name: 'Astruct Demo User',
        email: targetEmail,
      })
      if (insertProfileError) {
        throw new Error(`Failed to bootstrap profile: ${insertProfileError.message}`)
      }
    }

    const { data: refreshed } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', targetUserId)
      .single()
    profile = refreshed
  }
  if (!profile) throw new Error('No profile found in database after bootstrap')
  const userId = profile.id

  const { data: existing } = await supabase
    .from('contracts')
    .select('id')
    .eq('user_id', userId)
    .eq('reference_number', project.project_reference)
    .limit(1)

  if (existing && existing.length > 0) {
    for (const contract of existing) {
      await supabase.from('document_chunks').delete().eq('contract_id', contract.id)
      await supabase.from('obligations').delete().eq('contract_id', contract.id)
      const { data: sessions } = await supabase.from('chat_sessions').select('id').eq('contract_id', contract.id)
      if (sessions) {
        for (const session of sessions) {
          await supabase.from('chat_messages').delete().eq('session_id', session.id)
        }
      }
      await supabase.from('chat_sessions').delete().eq('contract_id', contract.id)
      await supabase.from('documents').delete().eq('contract_id', contract.id)
      await supabase.from('contracts').delete().eq('id', contract.id)
    }
  }

  await supabase
    .from('profiles')
    .update({
      name: 'Ted Sheppard',
      company_name: project.contract.contractor,
      company_abn: '98 765 432 100',
      company_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
    })
    .eq('id', userId)

  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      user_id: userId,
      name: project.project_name,
      reference_number: project.project_reference,
      contract_form: project.contract.contract_form,
      party1_role: 'Principal',
      party1_name: project.contract.principal,
      party1_address: 'Level 12, 100 Eagle Street, Brisbane QLD 4000',
      party2_role: 'Contractor',
      party2_name: project.contract.contractor,
      party2_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
      administrator_role: 'Superintendent',
      administrator_name: project.contract.superintendent,
      administrator_address: 'Suite 8, 55 Elizabeth Street, Brisbane QLD 4000',
      user_is_party: 'party2',
      date_of_contract: project.contract.date_of_contract,
      date_practical_completion: project.contract.date_for_practical_completion,
      defects_liability_period: project.contract.defects_liability_period,
      contract_sum: project.contract.contract_sum_aud,
      status: 'active',
    })
    .select('id')
    .single()
  if (contractError || !contract) throw new Error(`Failed to create contract: ${contractError?.message}`)

  const contractId = contract.id
  let insertedDocs = 0
  let insertedChunks = 0

  for (const [index, doc] of manifest.entries()) {
    if (index % 10 === 0) {
      console.log(`Processing ${index + 1}/${manifest.length}: ${doc.filename}`)
    }
    const extractedText = await fs.readFile(doc.source_abs_path, 'utf8')
    const uploadedAt = new Date(`${doc.date}T09:00:00+10:00`).toISOString()
    const { data: dbDoc, error: docError } = await supabase
      .from('documents')
      .insert({
        contract_id: contractId,
        user_id: userId,
        filename: doc.filename,
        file_path: `seeds/riverside-towers-suite/${doc.source_file}`,
        file_type: doc.file_type || 'application/pdf',
        file_size: Buffer.byteLength(extractedText, 'utf8'),
        category: doc.category,
        ai_summary: doc.summary,
        extracted_text: extractedText,
        processed: true,
        uploaded_at: uploadedAt,
      })
      .select('id')
      .single()
    if (docError || !dbDoc) {
      const { data: liveContract } = await supabase.from('contracts').select('id').eq('id', contractId).maybeSingle()
      const { data: liveProfile } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle()
      throw new Error(
        `Failed to create document ${doc.filename}: ${docError?.message}; contract_exists=${Boolean(liveContract)}; profile_exists=${Boolean(liveProfile)}`
      )
    }
    insertedDocs += 1

    const chunks = chunkText(extractedText)
    const embeddings = await generateEmbeddings(openai, chunks)
    const rows = chunks.map((content, index) => ({
      document_id: dbDoc.id,
      contract_id: contract.id,
      chunk_index: index,
      content,
      embedding: JSON.stringify(embeddings[index]),
      section_heading: detectSectionHeading(content),
      clause_numbers: extractClauseNumbers(content),
      metadata: {
        filename: doc.filename,
        category: doc.category,
        chunk_of: chunks.length,
        event_code: doc.event_code,
      },
    }))
    if (rows.length > 0) {
      const { error: chunkError } = await supabase.from('document_chunks').insert(rows)
      if (chunkError) throw new Error(`Failed to insert chunks for ${doc.filename}: ${chunkError.message}`)
      insertedChunks += rows.length
    }
  }

  console.log(`Seeded contract ${contractId}`)
  console.log(`Inserted documents: ${insertedDocs}`)
  console.log(`Inserted chunks: ${insertedChunks}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
