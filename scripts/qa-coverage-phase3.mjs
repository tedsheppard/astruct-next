#!/usr/bin/env node
/**
 * Phase 3 — Use Case B (paid conversion). LIMITED on live mode:
 * - Sign up a real account (not anon)
 * - Visit /settings/billing
 * - Click "Upgrade to Pro" → click through to Stripe-hosted checkout
 * - Screenshot the Stripe page (DO NOT enter card)
 * - Click "Manage in Stripe" portal link if available
 * - Verify the contract stepper, usage bar, cap setter all render
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile } from 'fs/promises'

const SHOTS = resolve('test-results/full-coverage/screenshots')
await mkdir(SHOTS, { recursive: true })

let counter = 200
const next = () => String(++counter).padStart(3, '0')
const findings = []

const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const consoleErrors = []
page.on('console', m => {
  if (m.type() === 'error') {
    const t = m.text()
    if (!/devtools|preload|hydrat|scroll-behavior/i.test(t)) consoleErrors.push(t)
  }
})

async function shot(slug, interaction, state) {
  const file = join(SHOTS, `${next()}_${slug}_${interaction}_${state}.png`)
  await page.screenshot({ path: file, fullPage: true }).catch(() => {})
  console.log(`  → ${file.split('/').pop()}`)
  return file
}

const stamp = Date.now()
const email = `qa+coverage-${stamp}@gmail.com`
const password = 'AbcDef123!'

try {
  // 1. Register a real account
  console.log('=== Step 1: Register real account ===')
  await page.goto('https://app.astruct.io/register', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  await shot('ucb-01', 'register', 'initial')
  await page.locator('input[placeholder="Your name"]').fill('QA Coverage')
  await page.locator('input[placeholder="you@company.com"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await shot('ucb-02', 'register', 'filled')
  await page.locator('button:has-text("Create account")').click()
  await page.waitForTimeout(8000)
  await shot('ucb-03', 'register', 'afterSubmit')
  console.log(`  Final URL: ${page.url()}`)

  // 2. Navigate to settings/billing
  console.log('=== Step 2: Settings → Billing ===')
  await page.goto('https://app.astruct.io/settings/billing', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  await shot('ucb-04', 'billing', 'initial')

  // 3. Try the contract stepper
  console.log('=== Step 3: Stepper interactions ===')
  const plusBtn = page.locator('button[aria-label="Increase quantity"]')
  if (await plusBtn.count()) {
    await plusBtn.click()
    await page.waitForTimeout(500)
    await shot('ucb-05', 'stepper', 'plus1')
    await plusBtn.click()
    await page.waitForTimeout(500)
    await shot('ucb-06', 'stepper', 'plus2')
    const minusBtn = page.locator('button[aria-label="Decrease quantity"]')
    await minusBtn.click()
    await page.waitForTimeout(500)
    await shot('ucb-07', 'stepper', 'minus1')
  } else {
    findings.push({ severity: 'Major', msg: 'Contract stepper buttons missing on Billing page' })
  }

  // 4. Click "Upgrade to Pro" — should navigate to Stripe checkout
  console.log('=== Step 4: Click Upgrade to Pro ===')
  const upgradeBtn = page.locator('button:has-text("Upgrade to Pro")').first()
  if (await upgradeBtn.count()) {
    await shot('ucb-08', 'beforeUpgrade', 'before')
    // Capture the navigation
    const navPromise = page.waitForNavigation({ timeout: 30000 }).catch(() => null)
    await upgradeBtn.click()
    await navPromise
    await page.waitForTimeout(5000)
    await shot('ucb-09', 'afterUpgrade', 'stripeOrApp')
    console.log(`  Final URL: ${page.url()}`)
    if (page.url().includes('checkout.stripe.com') || page.url().includes('billing.stripe.com')) {
      findings.push({ severity: 'Info', msg: 'Stripe-hosted checkout reached successfully' })
    } else {
      findings.push({ severity: 'Major', msg: `Upgrade did not redirect to Stripe — landed on ${page.url()}` })
    }
  } else {
    findings.push({ severity: 'Critical', msg: 'Upgrade to Pro button missing on billing page for new account' })
  }

  // ─── Done ────────────────────────────────────────────────────────────
  console.log(`\n=== Findings ===`)
  for (const f of findings) console.log(` [${f.severity}] ${f.msg}`)
  console.log(`Console errors: ${consoleErrors.length}`)

  await writeFile(
    resolve('test-results/full-coverage/_phase3.json'),
    JSON.stringify({ findings, consoleErrors, email }, null, 2),
  )
} catch (err) {
  console.error('FATAL:', err.message)
  await shot('ucb-error', 'fatal', 'error')
  process.exitCode = 1
} finally {
  await br.close()
}
