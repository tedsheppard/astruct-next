/**
 * Sample contract clone helper.
 *
 * Anon users can opt to seed their account with a fictional AS4000-style head
 * contract via /api/auth/anon-start { seed_sample: true }. Source text lives
 * in seeds/sample-contract.md; we chunk + embed on demand and insert into the
 * user's account. Embedding cost on clone is ~$0.0002 — negligible.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import path from 'path'
import {
  chunkText,
  extractClauseNumbers,
  detectSectionHeading,
  generateEmbeddings,
} from '@/lib/chunking'

const SAMPLE_NAME = 'Sample Contract — Riverside Industrial Estate'
const SAMPLE_FORM = 'AS4000-1997'

interface ParsedSample {
  source: string
  contractName: string
  filename: string
  party1Name: string
  party1Role: string
  party2Name: string
  party2Role: string
  administratorName: string
  administratorRole: string
}

let cachedParsed: ParsedSample | null = null

async function loadSample(): Promise<ParsedSample | null> {
  if (cachedParsed) return cachedParsed
  try {
    const seedPath = path.join(process.cwd(), 'seeds', 'sample-contract.md')
    const source = await fs.readFile(seedPath, 'utf-8')
    cachedParsed = {
      source,
      contractName: SAMPLE_NAME,
      filename: 'Sample Contract — Riverside Industrial Estate.md',
      party1Name: 'Riverside Industrial Pty Ltd',
      party1Role: 'Principal',
      party2Name: 'Murchison Construction Pty Ltd',
      party2Role: 'Contractor',
      administratorName: 'Caelen Ross & Partners',
      administratorRole: 'Superintendent',
    }
    return cachedParsed
  } catch (e) {
    console.warn('[sample-contract] seed not available:', e instanceof Error ? e.message : e)
    return null
  }
}

/**
 * Clones the sample contract into a fresh contract row for the given user.
 * Returns the new contract_id, or null if the seed is unavailable.
 */
export async function cloneSampleForUser(
  admin: SupabaseClient,
  userId: string
): Promise<string | null> {
  const seed = await loadSample()
  if (!seed) return null

  const { data: contract, error: contractErr } = await admin
    .from('contracts')
    .insert({
      user_id: userId,
      name: seed.contractName,
      contract_form: SAMPLE_FORM,
      party1_name: seed.party1Name,
      party1_role: seed.party1Role,
      party2_name: seed.party2Name,
      party2_role: seed.party2Role,
      administrator_name: seed.administratorName,
      administrator_role: seed.administratorRole,
      status: 'active',
      is_sample_clone: true,
    })
    .select('id')
    .single()

  if (contractErr || !contract) {
    console.error('[sample-contract] contract insert failed', contractErr)
    return null
  }

  const { data: doc, error: docErr } = await admin
    .from('documents')
    .insert({
      contract_id: contract.id,
      user_id: userId,
      filename: seed.filename,
      file_path: `sample/${userId}/${seed.filename}`,
      file_type: 'text/markdown',
      file_size: Buffer.byteLength(seed.source, 'utf-8'),
      category: '01_contract',
      ai_summary: 'Sample AS4000 head contract — Riverside Industrial Warehouse',
      extracted_text: seed.source,
      processed: true,
    })
    .select('id')
    .single()

  if (docErr || !doc) {
    console.error('[sample-contract] document insert failed', docErr)
    return contract.id
  }

  // Chunk + embed at clone time so the assistant can retrieve immediately.
  try {
    const chunks = chunkText(seed.source)
    if (chunks.length > 0) {
      const embeddings = await generateEmbeddings(chunks)
      const rows = chunks.map((content, i) => ({
        document_id: doc.id,
        contract_id: contract.id,
        chunk_index: i,
        content,
        embedding: JSON.stringify(embeddings[i]),
        section_heading: detectSectionHeading(content),
        clause_numbers: extractClauseNumbers(content),
        metadata: {
          filename: seed.filename,
          chunk_of: chunks.length,
          clause_numbers: extractClauseNumbers(content),
          is_sample: true,
        },
      }))
      await admin.from('document_chunks').insert(rows)
    }
  } catch (e) {
    console.error('[sample-contract] chunk/embed failed', e)
    // Non-fatal — contract row exists, retrieval will fall back to keyword
    // search or no-context answers.
  }

  return contract.id
}
