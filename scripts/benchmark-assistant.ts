/**
 * Astruct Assistant Quality Benchmark
 *
 * Runs 20 AS4000-specific test questions against the assistant and evaluates
 * each response against a rubric:
 * - Cites a clause number: yes/no
 * - Quotes exact text: yes/no
 * - Answer is accurate: manual review required
 * - Proper deflect when out of scope: yes/no
 *
 * Usage:
 *   npx tsx scripts/benchmark-assistant.ts --contract-id <id> --base-url <url>
 *
 * The script outputs a summary table and saves detailed results to benchmark-results.json
 */

interface TestQuestion {
  id: number
  question: string
  type: 'factual' | 'calculation' | 'drafting' | 'deflect' | 'clause_lookup' | 'analysis'
  expectCitation: boolean
  expectDeflect: boolean
  expectedClauseRefs?: string[]
  description: string
}

interface TestResult {
  id: number
  question: string
  type: string
  response: string
  hasCitation: boolean
  hasQuotedText: boolean
  properDeflect: boolean | null
  expectedCitation: boolean
  expectedDeflect: boolean
  pass: boolean
  notes: string
}

const TEST_QUESTIONS: TestQuestion[] = [
  // ─── Factual lookups ───────────────────────────────────────────────────
  {
    id: 1,
    question: 'What is the date for practical completion?',
    type: 'factual',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should cite contract details directly',
  },
  {
    id: 2,
    question: 'What is the defects liability period under this contract?',
    type: 'factual',
    expectCitation: true,
    expectDeflect: false,
    expectedClauseRefs: ['37'],
    description: 'Should cite clause 37 with exact text',
  },
  {
    id: 3,
    question: 'What are the liquidated damages provisions?',
    type: 'factual',
    expectCitation: true,
    expectDeflect: false,
    expectedClauseRefs: ['35'],
    description: 'Should cite clause 35 with rate and conditions',
  },
  {
    id: 4,
    question: 'Who is the Superintendent under this contract?',
    type: 'factual',
    expectCitation: false,
    expectDeflect: false,
    description: 'Should answer from contract details, no clause needed',
  },
  {
    id: 5,
    question: 'What is the process for making a progress payment claim?',
    type: 'factual',
    expectCitation: true,
    expectDeflect: false,
    expectedClauseRefs: ['37', '42'],
    description: 'Should cite payment clause with requirements and deadlines',
  },

  // ─── Clause lookups ────────────────────────────────────────────────────
  {
    id: 6,
    question: 'Show me clause 34',
    type: 'clause_lookup',
    expectCitation: true,
    expectDeflect: false,
    expectedClauseRefs: ['34'],
    description: 'Should quote clause 34 text directly',
  },
  {
    id: 7,
    question: 'What does clause 40 say about variations?',
    type: 'clause_lookup',
    expectCitation: true,
    expectDeflect: false,
    expectedClauseRefs: ['40'],
    description: 'Should quote clause 40 text about variations',
  },
  {
    id: 8,
    question: 'What are the notice requirements under clause 34.2?',
    type: 'clause_lookup',
    expectCitation: true,
    expectDeflect: false,
    expectedClauseRefs: ['34.2'],
    description: 'Should cite specific sub-clause with notice period',
  },

  // ─── Analysis ──────────────────────────────────────────────────────────
  {
    id: 9,
    question: 'What are all the time bars in this contract?',
    type: 'analysis',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should identify multiple time-sensitive clauses with references',
  },
  {
    id: 10,
    question: 'Compare the variation process with the EOT claim process',
    type: 'analysis',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should cite both variation and EOT clauses with differences',
  },
  {
    id: 11,
    question: 'What are our rights if site access is delayed beyond the planned date?',
    type: 'analysis',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should cite delay/EOT provisions with quoted text',
  },
  {
    id: 12,
    question: 'Summarise the dispute resolution process step by step',
    type: 'analysis',
    expectCitation: true,
    expectDeflect: false,
    expectedClauseRefs: ['42'],
    description: 'Should outline each step with clause references',
  },

  // ─── Calculations ──────────────────────────────────────────────────────
  {
    id: 13,
    question: 'If practical completion is delayed by 3 weeks, what are the liquidated damages?',
    type: 'calculation',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should calculate using the LD rate from the contract',
  },
  {
    id: 14,
    question: 'How many days notice do I need to give for a variation claim?',
    type: 'calculation',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should cite the specific notice period from the clause',
  },

  // ─── Drafting ──────────────────────────────────────────────────────────
  {
    id: 15,
    question: 'Draft a notice of delay for unexpected ground conditions',
    type: 'drafting',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should produce a formal notice with clause references',
  },
  {
    id: 16,
    question: 'Draft an extension of time claim for wet weather delays',
    type: 'drafting',
    expectCitation: true,
    expectDeflect: false,
    description: 'Should produce EOT claim citing relevant clauses',
  },

  // ─── Should deflect ───────────────────────────────────────────────────
  {
    id: 17,
    question: 'Can I sue them for breach of contract?',
    type: 'deflect',
    expectCitation: false,
    expectDeflect: true,
    description: 'Should deflect - legal advice question',
  },
  {
    id: 18,
    question: 'Is this clause enforceable in Queensland?',
    type: 'deflect',
    expectCitation: false,
    expectDeflect: true,
    description: 'Should deflect - enforceability is legal advice',
  },
  {
    id: 19,
    question: 'What is the current bank bill swap rate?',
    type: 'deflect',
    expectCitation: false,
    expectDeflect: true,
    description: 'Should deflect - external market information',
  },
  {
    id: 20,
    question: 'Should I accept their variation offer or reject it?',
    type: 'deflect',
    expectCitation: false,
    expectDeflect: true,
    description: 'Should deflect - strategic/commercial advice',
  },
]

function checkHasCitation(response: string): boolean {
  return /(?:clause|section|cl\.?|s\.?)\s*\d+[\.\d]*/i.test(response)
}

function checkHasQuotedText(response: string): boolean {
  // Check for blockquote format: > "text" or > 'text' or > text
  return /^>\s*.{15,}/m.test(response)
}

function checkDeflection(response: string): boolean {
  const deflectPhrases = [
    'legal advisor',
    'legal advice',
    'not a legal advice tool',
    'question for your',
    'outside my scope',
    'outside the scope',
    'cannot provide legal',
    'legal interpretation',
    'legal question',
  ]
  const lower = response.toLowerCase()
  return deflectPhrases.some(phrase => lower.includes(phrase))
}

async function runQuestion(
  question: TestQuestion,
  contractId: string,
  baseUrl: string,
  sessionId?: string
): Promise<{ response: string; newSessionId?: string }> {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: question.question,
      contract_id: contractId,
      session_id: sessionId,
      model: 'claude-sonnet-4-6',
    }),
  })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new Error('No response stream')

  const decoder = new TextDecoder()
  let buffer = ''
  let fullContent = ''
  let newSessionId: string | undefined

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        const data = JSON.parse(line.slice(6))
        if (data.content) fullContent += data.content
        if (data.done && data.session_id) newSessionId = data.session_id
      } catch { /* skip */ }
    }
  }

  return { response: fullContent, newSessionId }
}

function evaluate(question: TestQuestion, response: string): TestResult {
  const hasCitation = checkHasCitation(response)
  const hasQuotedText = checkHasQuotedText(response)
  const isDeflect = checkDeflection(response)

  let pass = true
  const notes: string[] = []

  // Check citation
  if (question.expectCitation && !hasCitation) {
    pass = false
    notes.push('MISSING: Expected clause citation')
  }

  // Check quote (only if citation expected and found)
  if (question.expectCitation && hasCitation && !hasQuotedText) {
    notes.push('WARN: Has citation but no verbatim quote')
  }

  // Check deflection
  if (question.expectDeflect && !isDeflect) {
    pass = false
    notes.push('MISSING: Should have deflected but did not')
  }
  if (!question.expectDeflect && isDeflect) {
    pass = false
    notes.push('BAD: Deflected when should have answered')
  }

  return {
    id: question.id,
    question: question.question,
    type: question.type,
    response,
    hasCitation,
    hasQuotedText,
    properDeflect: question.expectDeflect ? isDeflect : null,
    expectedCitation: question.expectCitation,
    expectedDeflect: question.expectDeflect,
    pass,
    notes: notes.length > 0 ? notes.join('; ') : 'OK',
  }
}

async function main() {
  const args = process.argv.slice(2)
  const contractIdIdx = args.indexOf('--contract-id')
  const baseUrlIdx = args.indexOf('--base-url')

  if (contractIdIdx === -1 || !args[contractIdIdx + 1]) {
    console.error('Usage: npx tsx scripts/benchmark-assistant.ts --contract-id <id> [--base-url <url>]')
    process.exit(1)
  }

  const contractId = args[contractIdIdx + 1]
  const baseUrl = baseUrlIdx !== -1 && args[baseUrlIdx + 1] ? args[baseUrlIdx + 1] : 'http://localhost:3000'

  console.log(`\n  Astruct Assistant Benchmark`)
  console.log(`  Contract: ${contractId}`)
  console.log(`  Base URL: ${baseUrl}`)
  console.log(`  Questions: ${TEST_QUESTIONS.length}`)
  console.log(`  ${'─'.repeat(50)}\n`)

  const results: TestResult[] = []
  let passed = 0
  let failed = 0
  let citationsPresent = 0
  let quotesPresent = 0
  let properDeflections = 0
  let deflectionQuestions = 0

  for (const question of TEST_QUESTIONS) {
    process.stdout.write(`  [${question.id.toString().padStart(2)}/${TEST_QUESTIONS.length}] ${question.question.slice(0, 55).padEnd(58)}`)

    try {
      const { response } = await runQuestion(question, contractId, baseUrl)
      const result = evaluate(question, response)
      results.push(result)

      if (result.pass) {
        passed++
        process.stdout.write(' PASS')
      } else {
        failed++
        process.stdout.write(' FAIL')
      }

      if (result.hasCitation) citationsPresent++
      if (result.hasQuotedText) quotesPresent++
      if (question.expectDeflect) {
        deflectionQuestions++
        if (result.properDeflect) properDeflections++
      }

      if (result.notes !== 'OK') {
        process.stdout.write(` (${result.notes})`)
      }

      process.stdout.write('\n')

      // Brief pause between requests
      await new Promise(r => setTimeout(r, 1000))
    } catch (err) {
      process.stdout.write(` ERROR: ${err instanceof Error ? err.message : String(err)}\n`)
      results.push({
        id: question.id,
        question: question.question,
        type: question.type,
        response: '',
        hasCitation: false,
        hasQuotedText: false,
        properDeflect: null,
        expectedCitation: question.expectCitation,
        expectedDeflect: question.expectDeflect,
        pass: false,
        notes: `ERROR: ${err instanceof Error ? err.message : String(err)}`,
      })
      failed++
    }
  }

  // Summary
  const citationExpected = TEST_QUESTIONS.filter(q => q.expectCitation).length
  console.log(`\n  ${'─'.repeat(50)}`)
  console.log(`  RESULTS SUMMARY`)
  console.log(`  ${'─'.repeat(50)}`)
  console.log(`  Pass/Fail:         ${passed}/${failed} (${Math.round(passed / TEST_QUESTIONS.length * 100)}% pass rate)`)
  console.log(`  Citations:         ${citationsPresent}/${citationExpected} expected have citations`)
  console.log(`  Verbatim quotes:   ${quotesPresent}/${citationExpected} have blockquote text`)
  console.log(`  Proper deflection: ${properDeflections}/${deflectionQuestions} deflect questions handled`)
  console.log(`  Accuracy:          Manual review required - see benchmark-results.json`)
  console.log(`  ${'─'.repeat(50)}\n`)

  // Save results
  const fs = await import('fs')
  const outputPath = 'benchmark-results.json'
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        contractId,
        summary: {
          total: TEST_QUESTIONS.length,
          passed,
          failed,
          passRate: `${Math.round(passed / TEST_QUESTIONS.length * 100)}%`,
          citationRate: `${citationsPresent}/${citationExpected}`,
          quoteRate: `${quotesPresent}/${citationExpected}`,
          deflectionRate: `${properDeflections}/${deflectionQuestions}`,
        },
        results,
      },
      null,
      2
    )
  )
  console.log(`  Results saved to ${outputPath}\n`)
}

main().catch(err => {
  console.error('Benchmark failed:', err)
  process.exit(1)
})
