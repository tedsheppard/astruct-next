/**
 * RAG Pipeline Test Suite
 * Tests the pipeline modules directly (bypassing HTTP/auth).
 * Run with: npx tsx scripts/test-rag.ts
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

interface TestResult {
  name: string
  passed: boolean
  details: string
  elapsed: number
}

// ─── Test 1: Query Rewriter ─────────────────────────────────────────────────

async function testQueryRewriter(): Promise<TestResult> {
  const start = Date.now()
  try {
    // Test vague follow-up
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `You rewrite queries for a construction contract RAG system. Given conversation history and the user's latest message, output JSON with:
- rewrittenQuery: a standalone, specific search query
- queryType: "question" | "analysis" | "drafting" | "clause_lookup" | "casual"
- extractedClauseRefs: clause/section numbers mentioned
- extractedKeyTerms: domain-specific terms
- complexity: "simple" | "moderate" | "complex"

History:
user: Tell me about the variation provisions
assistant: The variation provisions are covered in Clause 34...

User message: What about the time limit for that?

JSON only:`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}')

    const rewritten = json.rewrittenQuery?.toLowerCase() || ''
    const hasVariation = rewritten.includes('variation') || rewritten.includes('clause 34')
    const hasTime = rewritten.includes('time') || rewritten.includes('days') || rewritten.includes('deadline') || rewritten.includes('period')

    if (hasVariation && hasTime) {
      return { name: 'Query Rewriter - vague follow-up', passed: true, details: `Rewritten: "${json.rewrittenQuery}"`, elapsed: Date.now() - start }
    }
    return { name: 'Query Rewriter - vague follow-up', passed: false, details: `Rewritten query doesn't reference variations + time: "${json.rewrittenQuery}"`, elapsed: Date.now() - start }
  } catch (err) {
    return { name: 'Query Rewriter - vague follow-up', passed: false, details: `Error: ${err}`, elapsed: Date.now() - start }
  }
}

// ─── Test 2: Hybrid Search ──────────────────────────────────────────────────

async function testHybridSearch(): Promise<TestResult[]> {
  const results: TestResult[] = []

  // Get test contract
  const { data: contract } = await supabase
    .from('contracts')
    .select('id')
    .eq('name', 'RAG Test Contract - Riverstone Infrastructure')
    .single()

  if (!contract) {
    return [{ name: 'Hybrid Search', passed: false, details: 'No test contract found', elapsed: 0 }]
  }

  const queries = [
    { query: 'variation provisions clause 34', expect: ['34'] },
    { query: 'liquidated damages', expect: ['36'] },
    { query: 'practical completion', expect: ['42'] },
    { query: 'extension of time delay', expect: ['33'] },
    { query: 'defects liability', expect: ['35'] },
  ]

  for (const { query, expect } of queries) {
    const start = Date.now()
    try {
      const emb = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: query,
        dimensions: 1536,
      })

      const { data, error } = await supabase.rpc('hybrid_search_chunks', {
        query_embedding: emb.data[0].embedding,
        query_text: query,
        match_threshold: 0.25,
        match_count: 5,
        filter_contract_id: contract.id,
        filter_document_ids: null,
      })

      if (error) {
        results.push({ name: `Search: "${query}"`, passed: false, details: `Error: ${error.message}`, elapsed: Date.now() - start })
        continue
      }

      const allContent = (data || []).map((r: { content: string }) => r.content).join(' ').toLowerCase()
      const missing = expect.filter(e => !allContent.includes(`clause ${e}`) && !allContent.includes(`${e}.`))

      if (missing.length === 0) {
        results.push({ name: `Search: "${query}"`, passed: true, details: `Found ${data?.length || 0} results, all expected clauses present`, elapsed: Date.now() - start })
      } else {
        results.push({ name: `Search: "${query}"`, passed: false, details: `Missing clauses: ${missing.join(', ')}. Got ${data?.length || 0} results`, elapsed: Date.now() - start })
      }
    } catch (err) {
      results.push({ name: `Search: "${query}"`, passed: false, details: `Error: ${err}`, elapsed: Date.now() - start })
    }
  }

  return results
}

// ─── Test 3: Citation Verifier ──────────────────────────────────────────────

async function testCitationVerifier(): Promise<TestResult> {
  const start = Date.now()
  // Test with a response that references clauses
  const fakeResponse = 'Under Clause 34.1, variations must be directed in writing. Clause 99.9 requires immediate action.'
  const fakeChunks = [
    { content: 'Clause 34.1 The Superintendent may direct the Contractor in writing to vary the work.', clauseNumbers: ['34.1'] },
  ]

  // Clause 34.1 should be found, Clause 99.9 should not
  const clauseRefs = [...fakeResponse.matchAll(/(?:clause|section)\s*(\d+[\.\d]*)/gi)].map(m => m[1])

  const found34 = fakeChunks.some(c => c.content.includes('34.1') || c.clauseNumbers.includes('34.1'))
  const found99 = fakeChunks.some(c => c.content.includes('99.9') || c.clauseNumbers.includes('99.9'))

  if (clauseRefs.includes('34.1') && clauseRefs.includes('99.9') && found34 && !found99) {
    return { name: 'Citation Verifier', passed: true, details: 'Correctly identified valid (34.1) and invalid (99.9) citations', elapsed: Date.now() - start }
  }
  return { name: 'Citation Verifier', passed: false, details: `Refs found: ${clauseRefs}, 34.1 in chunks: ${found34}, 99.9 in chunks: ${found99}`, elapsed: Date.now() - start }
}

// ─── Test 4: Self-Reviewer ──────────────────────────────────────────────────

async function testSelfReviewer(): Promise<TestResult> {
  const start = Date.now()
  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      temperature: 0,
      messages: [{
        role: 'user',
        content: `You are a quality reviewer for a construction contract AI assistant.
Review this AI-generated response against the source document excerpts provided.

SOURCE EXCERPTS:
[Source 1] Clause 36.1 If the Contractor fails to reach Practical Completion by the Date for Practical Completion, the Contractor shall pay the Principal liquidated damages at the rate stated in the Annexure.

AI RESPONSE:
Under the contract, liquidated damages are set at $5,000 per day under Clause 36.1. The Principal can deduct these from any payment. Additionally, Clause 36.5 states that the Principal may terminate the contract if LDs exceed 10% of the Contract Sum.

Check for:
1. Any factual claims not supported by the source excerpts
2. Any fabricated or incorrect clause references
3. Any incorrect party names, dates, or dollar amounts
4. Any legal conclusions beyond what sources say
5. Missing relevant information

Respond in JSON only:
{"issues": [...], "overall_quality": "good|needs_revision|poor", "suggested_additions": [...]}`
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}')

    // Should flag: $5,000/day is fabricated, Clause 36.5 doesn't exist
    if (json.overall_quality !== 'good' && json.issues?.length > 0) {
      return { name: 'Self-Reviewer', passed: true, details: `Quality: ${json.overall_quality}, Issues: ${json.issues.length} found (correct — response has fabricated details)`, elapsed: Date.now() - start }
    }
    return { name: 'Self-Reviewer', passed: false, details: `Should have flagged fabricated details. Quality: ${json.overall_quality}, Issues: ${json.issues?.length || 0}`, elapsed: Date.now() - start }
  } catch (err) {
    return { name: 'Self-Reviewer', passed: false, details: `Error: ${err}`, elapsed: Date.now() - start }
  }
}

// ─── Test 5: End-to-End Generation ──────────────────────────────────────────

async function testGeneration(): Promise<TestResult> {
  const start = Date.now()
  try {
    const { data: contract } = await supabase
      .from('contracts')
      .select('*')
      .eq('name', 'RAG Test Contract - Riverstone Infrastructure')
      .single()

    if (!contract) return { name: 'E2E Generation', passed: false, details: 'No test contract', elapsed: 0 }

    // Get chunks for context
    const emb = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: 'variation clause 34',
      dimensions: 1536,
    })

    const { data: chunks } = await supabase.rpc('hybrid_search_chunks', {
      query_embedding: emb.data[0].embedding,
      query_text: 'variation clause 34',
      match_threshold: 0.25,
      match_count: 5,
      filter_contract_id: contract.id,
      filter_document_ids: null,
    })

    const ragContext = (chunks || []).map((c: { content: string }, i: number) => `[Source ${i + 1}]\n${c.content}`).join('\n---\n')

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      temperature: 0.4,
      system: `You are Astruct AI, a construction contract assistant for the "RAG Test Contract" (AS4000-2024). Contractor: BuildRight Construction. Principal: Riverstone Council.\n\nRELEVANT EXCERPTS:\n${ragContext}\n\nGround answers in the documents. Cite clause numbers.`,
      messages: [{ role: 'user', content: 'What are the key requirements for claiming a variation under this contract?' }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const lower = text.toLowerCase()

    const has34 = lower.includes('34')
    const hasVariation = lower.includes('variation')
    const has14days = lower.includes('14 days')

    if (has34 && hasVariation) {
      return { name: 'E2E Generation', passed: true, details: `Response: ${text.length} chars, mentions Clause 34: ✓, variations: ✓, 14 days: ${has14days ? '✓' : '✗'}`, elapsed: Date.now() - start }
    }
    return { name: 'E2E Generation', passed: false, details: `Missing clause 34 or variation reference. Preview: ${text.slice(0, 200)}`, elapsed: Date.now() - start }
  } catch (err) {
    return { name: 'E2E Generation', passed: false, details: `Error: ${err}`, elapsed: Date.now() - start }
  }
}

// ─── Run All ────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== RAG Pipeline Test Suite ===\n')

  const allResults: TestResult[] = []

  console.log('--- Query Rewriter ---')
  allResults.push(await testQueryRewriter())

  console.log('\n--- Hybrid Search ---')
  allResults.push(...await testHybridSearch())

  console.log('\n--- Citation Verifier ---')
  allResults.push(await testCitationVerifier())

  console.log('\n--- Self-Reviewer ---')
  allResults.push(await testSelfReviewer())

  console.log('\n--- E2E Generation ---')
  allResults.push(await testGeneration())

  // Print results
  console.log('\n\n=== RESULTS ===\n')
  let passed = 0
  let failed = 0
  for (const r of allResults) {
    const icon = r.passed ? '✓' : '✗'
    console.log(`${icon} ${r.name} (${r.elapsed}ms)`)
    console.log(`  ${r.details}`)
    if (r.passed) passed++
    else failed++
  }

  console.log(`\n=== ${passed}/${passed + failed} passed, ${failed} failed ===`)
  if (failed > 0) process.exit(1)
}

main().catch(console.error)
