#!/usr/bin/env node
/**
 * Verifies A4 (like/dislike), A5 (refresh regenerates), A6 (lists render).
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
  await page.screenshot({ path: join(SHOTS, `A4-${label}.png`), fullPage: true })
  console.log(`SHOT A4-${label}`)
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

  // Send a question that should produce a list
  await page.locator('textarea').first().fill('List the time bars in this subcontract as bullet points.')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(15000)
  await shoot('01-list-response')

  // Look for ul / ol elements inside the assistant message
  const ulCount = await page.locator('main ul').count()
  const olCount = await page.locator('main ol').count()
  const liCount = await page.locator('main li').count()
  console.log(`UL: ${ulCount}, OL: ${olCount}, LI: ${liCount}`)

  // ─── A4 like / dislike ─────────────────────────────────────────────
  // Always get fresh button references between clicks to avoid stale handles
  const likeSel = 'button[title="Good response"]'
  const dislikeSel = 'button[title="Bad response"]'
  await page.locator(likeSel).last().click()
  await page.waitForTimeout(400)
  await shoot('02-after-like')
  const likePressed1 = await page.locator(likeSel).last().getAttribute('aria-pressed')
  console.log('After 1st like click, aria-pressed:', likePressed1)

  await page.locator(likeSel).last().click()
  await page.waitForTimeout(400)
  await shoot('03-after-like-toggle-off')
  const likePressed2 = await page.locator(likeSel).last().getAttribute('aria-pressed')
  console.log('After 2nd like click (toggle off), aria-pressed:', likePressed2)

  await page.locator(likeSel).last().click()
  await page.waitForTimeout(300)
  await page.locator(dislikeSel).last().click()
  await page.waitForTimeout(400)
  await shoot('04-mutually-exclusive')
  const finalLike = await page.locator(likeSel).last().getAttribute('aria-pressed')
  const finalDislike = await page.locator(dislikeSel).last().getAttribute('aria-pressed')
  console.log('After like→dislike: like aria-pressed:', finalLike, ' dislike aria-pressed:', finalDislike)

  // ─── A5 refresh regenerates ────────────────────────────────────────
  const messageCountBefore = await page.locator('main').locator('text=Time bar').count()
  console.log('messages before refresh:', await page.locator('button[title="Regenerate response"]').count())
  await page.locator('button[title="Regenerate response"]').last().click()
  await page.waitForTimeout(1500)
  await shoot('05-refresh-clicked')
  const inputAfter = await page.locator('textarea').first().inputValue()
  console.log('Input after refresh click:', JSON.stringify(inputAfter))
  // Wait for streaming to complete
  await page.waitForTimeout(15000)
  await shoot('06-refresh-result')
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
