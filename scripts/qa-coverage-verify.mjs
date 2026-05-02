#!/usr/bin/env node
/**
 * Verify the four app-side QA fixes on LIVE.
 *   C3: app.astruct.io/{unknown} → branded 404 (not bootstrap loader)
 *   C5: register → /settings/billing reachable; /setup has shadcn dropdowns
 *   C6: /forgot-password page renders + login has the link
 *   M2: /contracts/new no longer shows manual form
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile } from 'fs/promises'

const SHOTS = resolve('test-results/full-coverage/screenshots')
await mkdir(SHOTS, { recursive: true })

let counter = 400
const next = () => String(++counter).padStart(3, '0')
const findings = []

const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

async function shot(slug, label) {
  const file = join(SHOTS, `${next()}_verify_${slug}_${label}.png`)
  await page.screenshot({ path: file, fullPage: true }).catch(() => {})
  console.log(`  → ${file.split('/').pop()}`)
  return file
}
function expect(label, cond, detail) {
  const tag = cond ? '✓' : '✗'
  console.log(`  ${tag} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!cond) findings.push({ severity: 'Critical', label, detail })
}

try {
  // ─── C3: 404 fix ────────────────────────────────────────────────────
  console.log('\n=== C3: app.astruct.io/{bad-route} → branded 404 ===')
  await page.goto('https://app.astruct.io/this-route-does-not-exist-xyz', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(4000)
  await shot('c3', '404-render')
  const has404 = await page.locator('text=404').count()
  const hasMessage = await page.locator('text=We couldn').count()
  const hasGuestLoader = await page.locator('text=Starting your guest session').count()
  expect('Branded 404 visible', has404 > 0 && hasMessage > 0)
  expect('No guest-session bootstrap', hasGuestLoader === 0)

  console.log('\n=== C3 also: /forgot-password no longer falls through ===')
  await page.goto('https://app.astruct.io/forgot-password', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)
  await shot('c3-c6', 'forgot-pw-page')
  const fpHeading = await page.locator('text=Forgot your password').count()
  const fpInput = await page.locator('input[inputMode="email"]').count()
  expect('/forgot-password renders the page', fpHeading > 0)
  expect('email input present', fpInput > 0)

  // ─── M4: forgot link on /login ──────────────────────────────────────
  console.log('\n=== M4: "Forgot password?" link on /login ===')
  await page.goto('https://app.astruct.io/login', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await shot('m4', 'login-with-fp-link')
  const fpLink = await page.locator('a[href="/forgot-password"]:has-text("Forgot password")').count()
  expect('Forgot password? link visible on /login', fpLink > 0)

  // ─── C5: /setup uses shadcn dropdowns + billing reachable ──────────
  console.log('\n=== C5: register fresh user → /settings/billing reachable ===')
  const stamp = Date.now()
  const email = `qa+verify-${stamp}@gmail.com`
  await page.goto('https://app.astruct.io/register', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await page.locator('input[placeholder="Your name"]').fill('QA Verify')
  await page.locator('input[placeholder="you@company.com"]').fill(email)
  await page.locator('input[type="password"]').fill('AbcDef123!')
  await page.locator('button:has-text("Create account")').click()
  await page.waitForTimeout(8000)
  await shot('c5', 'after-register')
  console.log(`  Final URL after register: ${page.url()}`)
  const stuckOnSetup = page.url().includes('/setup')
  expect('Register did NOT force /setup redirect', !stuckOnSetup)

  console.log('\n=== C5: navigate directly to /settings/billing ===')
  await page.goto('https://app.astruct.io/settings/billing', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  await shot('c5', 'billing-page-reachable')
  console.log(`  Final URL: ${page.url()}`)
  const onBilling = page.url().endsWith('/settings/billing')
  expect('/settings/billing reachable for new authed user', onBilling)
  if (onBilling) {
    const planCard = await page.locator('text=Plan').count()
    const stepperPlus = await page.locator('button[aria-label="Increase quantity"]').count()
    expect('Billing page Plan card present', planCard > 0)
    expect('Contract slot stepper present', stepperPlus > 0)
  }

  console.log('\n=== C5: /setup dropdowns are shadcn (not native) ===')
  await page.goto('https://app.astruct.io/setup', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)
  await shot('c5', 'setup-dropdowns')
  // Native select element vs shadcn button-trigger
  const nativeSelectCount = await page.locator('select').count()
  const shadcnTrigger = await page.locator('[data-slot="select-trigger"], button[role="combobox"]').count()
  expect('No native <select> on /setup', nativeSelectCount === 0, `nativeCount=${nativeSelectCount}`)
  expect('shadcn Select triggers present', shadcnTrigger > 0, `triggers=${shadcnTrigger}`)

  // ─── M2: /contracts/new no longer shows the legacy form ──────────
  console.log('\n=== M2: /contracts/new auto-redirects, no legacy form ===')
  await page.goto('https://app.astruct.io/contracts/new', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(7000)
  await shot('m2', 'contracts-new-result')
  console.log(`  Final URL: ${page.url()}`)
  const inAssistant = /\/contracts\/[a-f0-9-]+\/assistant/.test(page.url())
  const introModal = await page.locator('text=Drop your contract here').count()
  const settingUp = await page.locator('text=Setting up your project').count()
  const oldFormHeading = await page.locator('text=Create Contract').count()
  expect('/contracts/new lands in assistant or shows setting-up', inAssistant || settingUp > 0 || introModal > 0)
  expect('Legacy "Create Contract" heading no longer renders', oldFormHeading === 0)

  console.log(`\n=== Summary ===`)
  console.log(`Total checks: ${counter - 400}`)
  console.log(`Failed: ${findings.length}`)
  for (const f of findings) console.log(` ✗ ${f.label}${f.detail ? ': ' + f.detail : ''}`)

  await writeFile(
    resolve('test-results/full-coverage/_verify.json'),
    JSON.stringify({ findings }, null, 2),
  )
} catch (err) {
  console.error('FATAL:', err.message)
  await shot('verify-error', 'fatal')
  process.exitCode = 1
} finally {
  await br.close()
}
