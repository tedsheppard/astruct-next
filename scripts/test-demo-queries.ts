/**
 * Test demo queries by calling the RAG pipeline directly (bypasses auth).
 * Run with: npx tsx scripts/test-demo-queries.ts
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CONTRACT_ID = 'e63848d3-9030-4516-92e6-b98b118d610b'

const QUERIES = [
  // Q&A — scenario-based
  'The Superintendent directed us to change the facade panels to Alucobond A2 on 3 February. We gave notice of variation on 10 February. The new panels have a 14-week lead time that will delay the programme. What are our rights and what notices do we need to issue to protect our position?',
  'We found basalt rock at B3 on 18 February and notified a latent condition. The Superintendent asked for a geotech report within 14 days. We submitted our EOT claim for 18 days but the Principal rejected it on 12 March saying we should have done better site investigations. Is their rejection valid and what should we do next?',
  'Marshall & Associates issued a direction on 2 April to upgrade the basement waterproofing from Type B to Type A membrane. Is this a variation? What\'s the time bar for notifying it and what do we need to include in the notice?',
  // Drafting — scenario-based
  'Draft a formal notice of delay to the Superintendent for the facade panel specification change. The direction was issued on 3 February 2026 under reference 260203. The new Alucobond A2 panels have a 14-week lead time compared to 6 weeks for the original Vitrabond panels, causing an 8-week critical path delay to the facade works.',
  'Draft a notice of dispute to Riverside Development Group regarding their rejection of our EOT Claim 002 for the latent conditions at B3. Their rejection letter was dated 12 March 2026. We believe the rejection is invalid because the basalt rock formation could not have been reasonably anticipated from the geotechnical information available at tender.',
]

interface TestResult {
  query: string
  responseLength: number
  responsePreview: string
  fullResponse: string
  timeMs: number
  clauseRefs: string[]
  partyNames: string[]
  projectDetails: string[]
  isDrafting: boolean
  quality: number
  notes: string
  chunksFound: number
}

// Cache contract/profile/docs across calls
let _contract: any = null
let _profile: any = null
let _docNameMap: Record<string, string> = {}

async function loadContractData() {
  if (_contract) return
  const { data: contract } = await supabase.from('contracts').select('*').eq('id', CONTRACT_ID).single()
  _contract = contract
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', contract!.user_id).single()
  _profile = profile
  const { data: documents } = await supabase.from('documents').select('id, filename').eq('contract_id', CONTRACT_ID)
  for (const doc of documents || []) _docNameMap[doc.id] = doc.filename
}

async function testQuery(query: string): Promise<TestResult> {
  const start = Date.now()
  const isDrafting = query.toLowerCase().startsWith('draft')

  const { rewriteQuery } = await import('../lib/rag/query-rewriter')
  const { hybridRetrieve } = await import('../lib/rag/retriever')
  const { buildContext } = await import('../lib/rag/context-builder')
  const { generate } = await import('../lib/rag/generator')

  await loadContractData()

  const classifiedQuery = await rewriteQuery(query, [])
  const chunks = await hybridRetrieve(classifiedQuery, CONTRACT_ID, undefined, _docNameMap)

  const config = {
    contractId: CONTRACT_ID,
    userId: _contract.user_id,
    sessionId: null,
    model: 'claude-sonnet-4-6',
    conversationHistory: [] as any[],
    contract: _contract,
    profile: _profile,
  }

  const systemPrompt = await buildContext(chunks, config, classifiedQuery)

  let fullContent = ''
  const history = [{ role: 'user' as const, content: query }]
  await generate(systemPrompt, history, classifiedQuery, 'claude-sonnet-4-6', {
    onContent: (chunk: string) => { fullContent += chunk },
    onDone: () => {},
    onThinkingState: () => {},
    onThinkingSources: () => {},
    onSources: () => {},
    onError: () => {},
  } as any)

  const timeMs = Date.now() - start

  // Analyse
  const clauseRefs = [...new Set([...fullContent.matchAll(/[Cc]lause\s+(\d+[\.\d]*)/g)].map(m => m[1]))]
  const partyNames: string[] = []
  if (fullContent.includes('Apex')) partyNames.push('Apex')
  if (fullContent.includes('Riverside Development') || fullContent.includes('Riverside')) partyNames.push('Riverside')
  if (fullContent.includes('Marshall')) partyNames.push('Marshall')

  const projectDetails: string[] = []
  if (fullContent.includes('24,500,000') || fullContent.includes('24.5')) projectDetails.push('$24.5M')
  if (fullContent.includes('12,500')) projectDetails.push('$12,500/day')
  if (fullContent.includes('15 December 2027') || fullContent.includes('Dec 2027')) projectDetails.push('PC date')
  if (fullContent.includes('21 day') || fullContent.includes('21-day')) projectDetails.push('21-day bar')
  if (fullContent.includes('RDG-2026-001')) projectDetails.push('ref')
  if (fullContent.includes('3 February') || fullContent.includes('3 Feb')) projectDetails.push('3-Feb date')
  if (fullContent.includes('12 March') || fullContent.includes('12 Mar')) projectDetails.push('12-Mar date')
  if (fullContent.includes('18 February') || fullContent.includes('18 Feb')) projectDetails.push('18-Feb date')
  if (fullContent.includes('2 April') || fullContent.includes('2 Apr')) projectDetails.push('2-Apr date')
  if (fullContent.includes('VD-007') || fullContent.includes('VD-003')) projectDetails.push('VD ref')
  if (fullContent.includes('260203')) projectDetails.push('260203 ref')
  if (fullContent.includes('Alucobond') || fullContent.includes('Vitrabond')) projectDetails.push('panel names')
  if (fullContent.includes('basalt')) projectDetails.push('basalt')

  return {
    query,
    responseLength: fullContent.length,
    responsePreview: fullContent.slice(0, 300).replace(/\n/g, ' '),
    fullResponse: fullContent,
    timeMs,
    clauseRefs,
    partyNames,
    projectDetails,
    isDrafting,
    quality: 0,
    notes: '',
    chunksFound: chunks.length,
  }
}

function scoreResult(r: TestResult): TestResult {
  let score = 3 // baseline
  const notes: string[] = []

  if (r.responseLength > 2500) { score += 2; notes.push('very substantive') }
  else if (r.responseLength > 1200) { score += 1; notes.push('good length') }
  else if (r.responseLength < 400) { score -= 1; notes.push('too short') }

  if (r.clauseRefs.length >= 4) { score += 2; notes.push(`${r.clauseRefs.length} clauses`) }
  else if (r.clauseRefs.length >= 2) { score += 1; notes.push(`${r.clauseRefs.length} clauses`) }
  else { notes.push('few clauses') }

  if (r.partyNames.length >= 2) { score += 2; notes.push('party names') }
  else if (r.partyNames.length >= 1) { score += 1 }

  if (r.projectDetails.length >= 2) { score += 2; notes.push(r.projectDetails.join(', ')) }
  else if (r.projectDetails.length >= 1) { score += 1; notes.push(r.projectDetails[0]) }

  if (r.timeMs < 15000) { score += 1; notes.push(`${(r.timeMs/1000).toFixed(0)}s`) }

  if (r.chunksFound >= 3) { notes.push(`${r.chunksFound} chunks`) }

  r.quality = Math.min(10, Math.max(1, score))
  r.notes = notes.join(' | ')
  return r
}

async function main() {
  console.log('=== Testing Demo Queries Against RAG Pipeline ===\n')

  const results: TestResult[] = []

  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i]
    const icon = q.startsWith('Draft') ? '📝' : '❓'
    process.stdout.write(`[${i + 1}/${QUERIES.length}] ${icon} ${q.slice(0, 65)}...`)

    try {
      const result = scoreResult(await testQuery(q))
      results.push(result)
      console.log(` ✓ ${result.responseLength}ch | ${(result.timeMs/1000).toFixed(1)}s | ${result.quality}/10`)
    } catch (err: any) {
      console.log(` ✗ ERROR: ${err.message?.slice(0, 80)}`)
      results.push({
        query: q, responseLength: 0, responsePreview: 'ERROR', fullResponse: '', timeMs: 0,
        clauseRefs: [], partyNames: [], projectDetails: [], isDrafting: q.startsWith('Draft'),
        quality: 0, notes: err.message, chunksFound: 0,
      })
    }
  }

  // Rank
  const qaResults = results.filter(r => !r.isDrafting).sort((a, b) => b.quality - a.quality)
  const draftResults = results.filter(r => r.isDrafting).sort((a, b) => b.quality - a.quality)

  console.log('\n\n══════════════════════════════════════════════════')
  console.log('  RANKED Q&A RESULTS')
  console.log('══════════════════════════════════════════════════')
  for (const r of qaResults) {
    console.log(`\n  [${r.quality}/10] "${r.query}"`)
    console.log(`  ${r.responseLength} chars | ${(r.timeMs/1000).toFixed(1)}s | ${r.chunksFound} chunks | ${r.notes}`)
    console.log(`  Clauses: [${r.clauseRefs.join(', ')}]`)
    console.log(`  Preview: ${r.responsePreview.slice(0, 200)}...`)
  }

  console.log('\n\n══════════════════════════════════════════════════')
  console.log('  RANKED DRAFTING RESULTS')
  console.log('══════════════════════════════════════════════════')
  for (const r of draftResults) {
    console.log(`\n  [${r.quality}/10] "${r.query}"`)
    console.log(`  ${r.responseLength} chars | ${(r.timeMs/1000).toFixed(1)}s | ${r.chunksFound} chunks | ${r.notes}`)
    console.log(`  Clauses: [${r.clauseRefs.join(', ')}]`)
    console.log(`  Preview: ${r.responsePreview.slice(0, 200)}...`)
  }

  // Final recommendations
  const bestQA = qaResults[0]
  const bestDraft = draftResults[0]

  console.log('\n\n══════════════════════════════════════════════════')
  console.log('  🎬 FINAL RECOMMENDATIONS FOR RECORDING')
  console.log('══════════════════════════════════════════════════')
  console.log(`\n  Scene 2 (Q&A):`)
  console.log(`    Query: "${bestQA?.query}"`)
  console.log(`    Quality: ${bestQA?.quality}/10 | ${(bestQA?.timeMs || 0) / 1000}s`)
  console.log(`    Clauses cited: [${bestQA?.clauseRefs.join(', ')}]`)
  console.log(`    Details: ${bestQA?.notes}`)

  console.log(`\n  Scene 3 (Draft):`)
  console.log(`    Query: "${bestDraft?.query}"`)
  console.log(`    Quality: ${bestDraft?.quality}/10 | ${(bestDraft?.timeMs || 0) / 1000}s`)
  console.log(`    Clauses cited: [${bestDraft?.clauseRefs.join(', ')}]`)
  console.log(`    Details: ${bestDraft?.notes}`)

  // Print full best responses
  console.log('\n\n══════════════════════════════════════════════════')
  console.log('  FULL BEST Q&A RESPONSE')
  console.log('══════════════════════════════════════════════════')
  console.log(bestQA?.fullResponse)

  console.log('\n\n══════════════════════════════════════════════════')
  console.log('  FULL BEST DRAFT RESPONSE')
  console.log('══════════════════════════════════════════════════')
  console.log(bestDraft?.fullResponse)

  // Print ALL full responses
  console.log('\n\n══════════════════════════════════════════════════')
  console.log('  ALL RESPONSES')
  console.log('══════════════════════════════════════════════════')
  for (const r of results) {
    console.log(`\n--- [${r.quality}/10] ${r.query.slice(0, 80)}... ---`)
    console.log(r.fullResponse)
    console.log('---END---')
  }
}

main().catch(console.error)
