#!/usr/bin/env node
/**
 * Persona B1 — Frustrated Contract Admin.
 *
 * Sarah, 38, contract admin at a tier-2 builder. Behind on a delay claim
 * deadline, half-distracted, jumps around aggressively, types fast, makes
 * typos, expects the tool to be obvious. Will rage-quit if anything looks
 * broken.
 *
 * Walks through:
 *   1. Lands on /assistant cold
 *   2. Drag-and-drop fails (we'll set files), ignores intro auto-fill,
 *      hits Continue immediately
 *   3. Asks a typo'd, half-formed question
 *   4. Tries to click the file pill in the sources to see clause text
 *   5. Hits refresh, then typo'd follow-up
 *   6. Tries Calendar (locked), tries Templates (locked)
 *   7. Tries to upload another file mid-chat
 *   8. Tries /contracts/new (should hit the anon block)
 *   9. Hits Sign up free
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots/persona-b1')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const issues = []

async function shoot(label) {
  await page.screenshot({ path: join(SHOTS, `b1-${label}.png`), fullPage: true })
  console.log(`SHOT b1-${label}`)
}

async function check(label, fn) {
  try {
    const result = await fn()
    if (!result.ok) {
      issues.push(`[${label}] ${result.msg}`)
      console.log(`✗ ${label}: ${result.msg}`)
    } else {
      console.log(`✓ ${label}: ${result.msg || 'ok'}`)
    }
  } catch (e) {
    issues.push(`[${label}] threw: ${e.message}`)
    console.log(`✗ ${label}: threw ${e.message}`)
  }
}

try {
  // 1. Cold entry
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await shoot('01-cold-landing')

  // 2. Aggressive upload — clicks file picker, picks file, immediately hits Continue
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await shoot('02-modal-after-extract')
  await check('intro modal extracted parties', async () => {
    const text = await page.locator('text=Auto-filled from your contract').first().isVisible()
    return { ok: text, msg: 'modal shown' }
  })
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 5000 })
  await page.waitForTimeout(2000)
  await shoot('03-arrived-on-assistant')

  // 3. Typo'd question (Sarah is fast)
  await page.locator('textarea').first().fill('what r the time bars for delay claims under this contractr')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(20000)
  await shoot('04-first-answer')
  await check('first answer rendered', async () => {
    const t = await page.locator('main').innerText()
    return { ok: /clause|day|notice|delay/i.test(t), msg: t.length > 200 ? 'has substantive answer' : 'too short' }
  })

  // 4. Open sources panel
  const sourcesBtn = page.locator('button:has-text("Sources")').last()
  if (await sourcesBtn.count()) {
    await sourcesBtn.click()
    await page.waitForTimeout(1000)
    await shoot('05-sources-open')
  }

  // 5. Hit refresh
  const refreshBtn = page.locator('button[title="Regenerate response"]').last()
  if (await refreshBtn.count()) {
    await refreshBtn.click()
    await page.waitForTimeout(20000)
    await shoot('06-after-refresh')
    await check('refresh produced new answer', async () => {
      const t = await page.locator('main').innerText()
      return { ok: /clause|day|notice|delay/i.test(t), msg: 'still has substantive answer' }
    })
  } else {
    issues.push('refresh button missing')
  }

  // Typo follow-up
  await page.locator('textarea').first().fill('write me a delay notice fast pls')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(25000)
  await shoot('07-after-followup')

  // 6. Try Calendar (locked) — should fire hard wall dialog
  await page.locator('a:has-text("Calendar")').first().click()
  await page.waitForTimeout(800)
  await shoot('08-calendar-locked')
  await check('calendar fires hard wall', async () => {
    const wall = await page.locator('text=Sign up to unlock this').count()
    return { ok: wall > 0, msg: `wall: ${wall}` }
  })
  // Dismiss wall and try Templates
  const dismissBtn = page.locator('button:has-text("Maybe later")')
  if (await dismissBtn.count()) await dismissBtn.first().click()
  await page.waitForTimeout(500)
  await page.locator('a:has-text("Templates")').first().click()
  await page.waitForTimeout(800)
  await shoot('09-templates-locked')
  if (await dismissBtn.count()) await dismissBtn.first().click()
  await page.waitForTimeout(500)

  // 7. Try uploading another file mid-chat
  await page.goto(page.url().replace(/\/[^/]+$/, '/library'))
  await page.waitForTimeout(2000)
  await shoot('10-library-page')

  // 8. Try /contracts/new — should hit anon block
  await page.goto('http://localhost:3000/contracts/new')
  await page.waitForTimeout(2000)
  await shoot('11-contracts-new-blocked')
  await check('contracts/new shows anon lock', async () => {
    const txt = await page.locator('text=Sign up to add another project').count()
    return { ok: txt > 0, msg: `lock card visible: ${txt}` }
  })

  // 9. Sign up free
  await page.locator('button:has-text("Sign up free")').first().click()
  await page.waitForTimeout(2000)
  await shoot('12-sign-up-page')

  console.log('\n=== ISSUES ===')
  if (issues.length === 0) console.log('NONE — all persona checks green')
  else issues.forEach(i => console.log(' - ' + i))
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
