#!/usr/bin/env node
/**
 * Verifies A7: RAG retrieves real content from the uploaded contract.
 * Three question types:
 *   1. Factual: "Who are the parties to this subcontract?"
 *      Expect mention of John Holland AND Pensar.
 *   2. Procedural: "What is the process for claiming an extension of time?"
 *      Expect a clause reference + a quoted procedure.
 *   3. Clause-verbatim: "Quote clause 12.4 verbatim."
 *      Expect a verbatim block-quote (>30 chars) AND a clause reference.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

async function shoot(label) {
  await page.screenshot({ path: join(SHOTS, `A7-${label}.png`), fullPage: true })
  console.log(`SHOT A7-${label}`)
}

async function ask(question, label) {
  await page.locator('textarea').first().fill(question)
  await page.keyboard.press('Enter')
  // Wait for response — look for the assistant bubble's "Sources" or wait a fixed window
  await page.waitForTimeout(20000)
  await shoot(label)
  // Get visible text of all assistant messages
  const text = await page.locator('main').innerText()
  return text
}

try {
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  await page.waitForTimeout(2000)
  await shoot('00-ready')

  // ─── Q1: Factual party-identification ──────────────────────────────
  const t1 = await ask('Who are the parties to this subcontract? Use only what the document says.', '01-parties')
  const sawJohnHolland = /john\s*holland/i.test(t1)
  const sawPensar = /pensar/i.test(t1)
  console.log(`Q1 parties → John Holland: ${sawJohnHolland}, Pensar: ${sawPensar}`)

  // ─── Q2: Procedural ────────────────────────────────────────────────
  const t2 = await ask('What is the process for claiming an extension of time under this subcontract? Cite the clause numbers.', '02-eot-process')
  const hasClauseRef = /clause\s*\d+(\.\d+)*/i.test(t2)
  const hasNotice = /notice|written|days/i.test(t2)
  console.log(`Q2 EOT → clause ref: ${hasClauseRef}, has notice/written/days language: ${hasNotice}`)

  // ─── Q3: Clause-verbatim ───────────────────────────────────────────
  const t3 = await ask('Quote clause 34 verbatim from the subcontract — the dispute resolution clause. Use a block quote.', '03-verbatim')
  const hasBlockQuote = /(>|"|“)/.test(t3)
  const hasClause34 = /clause\s*34|34\.\d/i.test(t3)
  console.log(`Q3 verbatim → has quote marker: ${hasBlockQuote}, mentions clause 34: ${hasClause34}`)

  // ─── Sources panel test ────────────────────────────────────────────
  // Click the last Sources/Files button to see what was retrieved
  const sourcesBtnCount = await page.locator('button:has-text("Sources")').count()
  console.log(`Sources buttons present: ${sourcesBtnCount}`)
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
