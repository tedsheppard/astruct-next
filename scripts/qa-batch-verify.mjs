#!/usr/bin/env node
/**
 * Batch verification of A10 (settings lock), A14 (AI title), A14b (sidebar
 * refresh), A17 (no time-bars copy), A11 (signup validation).
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
  await page.screenshot({ path: join(SHOTS, `batch-${label}.png`), fullPage: true })
  console.log(`SHOT batch-${label}`)
}

try {
  // ─── Anon path ─────────────────────────────────────────────────────────
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await shoot('01-modal-open')

  // A17 — capture the upload progress copy
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  // give it a moment to show first tick
  await page.waitForTimeout(2200)
  await shoot('02-progress-tick1')
  await page.waitForTimeout(5000)
  await shoot('03-progress-tick2')
  // Wait for review
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await shoot('04-review')

  // Capture project name BEFORE Continue (modal)
  const projectNameValueBefore = await page
    .locator('label:has-text("Project name") + input, label:has-text("Project name") ~ input')
    .first()
    .inputValue()
    .catch(() => 'NOT_FOUND')
  console.log('Project name (modal):', projectNameValueBefore)

  // Click Continue
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  await page.waitForTimeout(2500)
  await shoot('05-after-continue')

  // A14b — sidebar should now show the real project name, not "Untitled project"
  const sidebarText = await page.locator('aside').first().innerText()
  console.log('--- sidebar after continue ---')
  console.log(sidebarText)
  const sidebarHasUntitled = /Untitled\s+project/i.test(sidebarText)

  // A10 — click Settings (locked) → hard-wall modal opens
  // Settings now uses AnonLockedNavItem so click should trigger the hard wall.
  const settingsClicked = await page.locator('aside').locator('text=Settings').first().click({ trial: false }).then(() => true).catch(() => false)
  await page.waitForTimeout(1200)
  await shoot('06-settings-locked')

  // Now also navigate by URL to /settings to verify the page-level lock
  await page.goto('http://localhost:3000/settings')
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(1500)
  await shoot('07-settings-direct')
  const settingsPageText = await page.locator('main').first().innerText().catch(() => '')
  console.log('--- /settings page text ---')
  console.log(settingsPageText.slice(0, 400))

  // ─── Signup validation ──────────────────────────────────────────────
  await page.goto('http://localhost:3000/register')
  await page.waitForLoadState('networkidle')
  await shoot('08-register')

  // Fill name empty + try to submit → expect "Please enter your name"
  // Fill an unusual but valid email like "first.last+tag@company.com.au"
  await page.locator('input[placeholder="Your name"]').fill('Edward Sheppard')
  await page.locator('input[placeholder="you@company.com"]').fill('first.last+tag@company.com.au')
  await page.locator('input[placeholder="Min 6 characters"]').fill('correcthorse')
  await shoot('09-register-filled')
  // Don't actually submit — this would create a real Supabase user. We just
  // check that no validation error is showing for a valid email.
  const emailValue = await page.locator('input[placeholder="you@company.com"]').inputValue()
  console.log('Email field value:', emailValue)

  console.log('--- A14b sidebar still has Untitled project? ---', sidebarHasUntitled)
  console.log('--- settings click trigged ---', settingsClicked)
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
