#!/usr/bin/env node
/**
 * Verifies A15: pulsing ring + speech bubble on Library nav item shows on
 * first visit and dismisses on click.
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
  await page.screenshot({ path: join(SHOTS, `A15-${label}.png`), fullPage: true })
  console.log(`SHOT A15-${label}`)
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

  // ─── Cue should be visible on Library ──────────────────────────────
  await shoot('01-cue-visible')
  const bubbleCount = await page.locator('text=Upload Project Documents Here').count()
  console.log(`"Upload Project Documents Here" bubble count: ${bubbleCount}`)
  const dismissed1 = await page.evaluate(() => localStorage.getItem('astruct_library_cue_dismissed'))
  console.log(`localStorage dismissed (before click): ${JSON.stringify(dismissed1)}`)

  // ─── Click Library to dismiss ──────────────────────────────────────
  await page.locator('a:has-text("Library")').first().click()
  await page.waitForTimeout(1000)
  await shoot('02-after-click-library')
  const bubbleCountAfter = await page.locator('text=Upload Project Documents Here').count()
  console.log(`bubble count after Library click: ${bubbleCountAfter}`)
  const dismissed2 = await page.evaluate(() => localStorage.getItem('astruct_library_cue_dismissed'))
  console.log(`localStorage dismissed (after click): ${JSON.stringify(dismissed2)}`)

  // ─── Persist after reload ──────────────────────────────────────────
  await page.reload()
  await page.waitForTimeout(2000)
  await shoot('03-after-reload')
  const bubbleCountReload = await page.locator('text=Upload Project Documents Here').count()
  console.log(`bubble count after reload: ${bubbleCountReload}`)
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
