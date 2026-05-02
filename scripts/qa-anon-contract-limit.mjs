#!/usr/bin/env node
/**
 * Verifies A8: anon user with 1 contract cannot create another.
 * - Loads /assistant (auto-creates anon + contract)
 * - Goes through intro modal Continue
 * - Tries to navigate to /contracts/new
 * - Expects either: button hidden in sidebar, OR /contracts/new shows "Sign up to add another"
 * - Direct API hit POST /api/contracts → expect 403 ANON_CONTRACT_LIMIT
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
  await page.screenshot({ path: join(SHOTS, `A8-${label}.png`), fullPage: true })
  console.log(`SHOT A8-${label}`)
}

try {
  // ─── Setup: anon user with 1 uploaded contract ─────────────────────
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  await page.waitForTimeout(2000)
  await shoot('01-after-intro')

  // ─── Sidebar: open contract dropdown, check "+ New Contract" hidden
  await page.locator('button:has(span.truncate)').first().click()
  await page.waitForTimeout(500)
  await shoot('02-sidebar-dropdown')
  const newContractBtn = await page.locator('button:has-text("New Contract")').count()
  const signUpHint = await page.locator('text=Sign up to add another').count()
  console.log('"New Contract" button count:', newContractBtn)
  console.log('"Sign up to add another" hint count:', signUpHint)

  // ─── Navigate directly to /contracts/new ───────────────────────────
  await page.goto('http://localhost:3000/contracts/new')
  await page.waitForTimeout(2000)
  await shoot('03-contracts-new')
  const blockedHeading = await page.locator('text=Sign up to add another project').count()
  console.log('Blocked-page heading count:', blockedHeading)

  // ─── Direct API: POST /api/contracts ───────────────────────────────
  // Use the page's fetch so cookies (anon session) carry.
  const apiResult = await page.evaluate(async () => {
    const r = await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Should be blocked' }),
    })
    const body = await r.json().catch(() => ({}))
    return { status: r.status, body }
  })
  console.log('API POST /api/contracts result:', JSON.stringify(apiResult))

} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
