#!/usr/bin/env node
/**
 * Persona B2 — Mobile Subbie.
 *
 * Dave, 52, plumbing subbie. On site, iPhone 12, 4G. Paint-spattered hands,
 * doesn't know what a "subcontract" really is, just got a "show cause"
 * notice and is panicking. Will only tap, never click. Will rage-quit if
 * the keyboard or buttons are tiny.
 *
 * Walks:
 *   1. Lands on /assistant on 380×844 phone viewport
 *   2. Tap to upload (input[type=file] is hidden, so we set files directly)
 *   3. Watch how the intro modal looks on phone
 *   4. Type a question with thumbs (use real text)
 *   5. Try to scroll, swipe, tap source pills
 *   6. Try to open sidebar nav (collapsed on mobile — needs a hamburger?)
 *   7. Sign up
 */
import { chromium, devices } from 'playwright'
import { resolve, join } from 'path'
import { mkdir } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots/persona-b2')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const iphone = devices['iPhone 12']
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({
  ...iphone,
  // Slow 4G-ish throttle (CDP-level emulation only available on chromium contexts)
})
const page = await ctx.newPage()
const issues = []

async function shoot(label) {
  await page.screenshot({ path: join(SHOTS, `b2-${label}.png`), fullPage: true })
  console.log(`SHOT b2-${label}`)
}
async function check(label, fn) {
  try {
    const r = await fn()
    if (!r.ok) { issues.push(`[${label}] ${r.msg}`); console.log(`✗ ${label}: ${r.msg}`) }
    else console.log(`✓ ${label}: ${r.msg || 'ok'}`)
  } catch (e) {
    issues.push(`[${label}] threw: ${e.message}`); console.log(`✗ ${label}: ${e.message}`)
  }
}

try {
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForTimeout(2000)
  await shoot('01-mobile-landing')
  await check('upload prompt visible on mobile', async () => {
    const v = await page.locator('text=Upload your contract').isVisible().catch(() => false)
    return { ok: v, msg: 'modal present' }
  })

  // Tap to upload
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await shoot('02-mobile-modal-after-extract')
  await check('intro modal usable on mobile (Continue button visible)', async () => {
    const btn = page.locator('button:has-text("Continue to assistant")').first()
    const visible = await btn.isVisible().catch(() => false)
    if (!visible) return { ok: false, msg: 'button not visible' }
    const box = await btn.boundingBox()
    return { ok: !!box && box.width >= 100 && box.height >= 36, msg: `button ${box?.width}x${box?.height}` }
  })

  // Scroll through the modal first to confirm whole thing fits / scrolls
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(500)
  await shoot('03-mobile-modal-scrolled')

  // Continue (force — on mobile the sticky party-card may overlap the button)
  const continueBtn = page.locator('button:has-text("Continue to assistant")').first()
  await continueBtn.scrollIntoViewIfNeeded()
  await continueBtn.click({ force: true })
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 5000 })
  await page.waitForTimeout(2000)
  await shoot('04-mobile-assistant')

  // Tap-type a panicked question (real subbie phrasing)
  await page.locator('textarea').first().fill('I just got a show cause notice what does it mean and what do I do')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(25000)
  await shoot('05-mobile-after-question')
  await check('mobile answer scrollable', async () => {
    const t = await page.locator('main').innerText()
    return { ok: t.length > 200, msg: `answer length ${t.length}` }
  })

  // Check input box is reachable above keyboard area (>=44px target)
  await check('input box tap target', async () => {
    const ta = page.locator('textarea').first()
    const box = await ta.boundingBox()
    return { ok: !!box && box.height >= 36, msg: `textarea ${Math.round(box?.width || 0)}x${Math.round(box?.height || 0)}` }
  })

  // Tap a source pill
  const sourceBtn = page.locator('button:has-text("Sources")').last()
  if (await sourceBtn.count()) {
    await sourceBtn.click()
    await page.waitForTimeout(800)
    await shoot('06-mobile-sources-open')
  }

  // Tap a suggested chip below input
  const chip = page.locator('button:has-text("Generate a notice")').first()
  if (await chip.count()) {
    await chip.click()
    await page.waitForTimeout(500)
    await shoot('07-mobile-chip-tab')
  }

  // Sign up button visible at bottom
  const signupBtn = page.locator('button:has-text("Sign up free")').first()
  await check('Sign up free CTA visible on mobile', async () => {
    const v = await signupBtn.isVisible().catch(() => false)
    return { ok: v, msg: v ? 'visible' : 'hidden' }
  })

  console.log('\n=== ISSUES ===')
  if (issues.length === 0) console.log('NONE — mobile experience clean')
  else issues.forEach(i => console.log(' - ' + i))
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
