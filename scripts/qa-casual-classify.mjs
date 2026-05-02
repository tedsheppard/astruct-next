#!/usr/bin/env node
/**
 * Verifies "kk", "what model are you", etc. don't trigger document retrieval.
 * Watches for "Searching across N documents..." text appearing.
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
  await page.screenshot({ path: join(SHOTS, `casual-${label}.png`), fullPage: true })
  console.log(`SHOT casual-${label}`)
}

async function ask(question, label) {
  await page.locator('textarea').first().fill(question)
  await page.keyboard.press('Enter')
  // Snapshot fast to catch the thinking-state UI mid-stream
  await page.waitForTimeout(1500)
  const sawSearch = (await page.locator('text=/Searching across/').count()) > 0
  const sawReading = (await page.locator('text=/Reading relevant/').count()) > 0
  await page.waitForTimeout(8000)
  await shoot(label)
  return { sawSearch, sawReading }
}

try {
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  await page.waitForTimeout(2000)

  const cases = [
    { q: 'hello', label: '01-hello' },
    { q: 'kk', label: '02-kk' },
    { q: 'what model r u really', label: '03-what-model' },
    { q: 'r u chat gpt or claude', label: '04-which-llm' },
    { q: 'thanks', label: '05-thanks' },
    { q: 'cool', label: '06-cool' },
    // Non-casual control — should still trigger retrieval
    { q: 'What does clause 34 say about extension of time?', label: '07-real-question' },
  ]

  console.log('\n=== RESULTS ===')
  for (const c of cases) {
    const r = await ask(c.q, c.label)
    const wantsRetrieval = c.label.startsWith('07')
    const ok = wantsRetrieval ? r.sawSearch : !r.sawSearch
    const tag = ok ? '✓' : '✗'
    console.log(`${tag} ${c.q.padEnd(40)} search=${r.sawSearch} reading=${r.sawReading}`)
  }
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
