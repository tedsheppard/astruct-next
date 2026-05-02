#!/usr/bin/env node
/**
 * Real-user walkthrough. Lands on /assistant cold, walks through:
 *   01: bootstrap
 *   02: intro modal opens
 *   03: upload PDF
 *   04: review step
 *   05: click Continue → assistant page (empty chat)
 *   06: SHOOT thinking display while sending "Hello" (trivial)
 *   07: SHOOT response to Hello
 *   08: SHOOT thinking display while sending real contract question
 *   09: SHOOT response with Like/Dislike/Refresh buttons visible
 *   10: SHOOT after clicking Like
 *   11: SHOOT after clicking Like a second time (toggle off)
 *   12: SHOOT after clicking Dislike (mutually exclusive)
 *   13: SHOOT after clicking Refresh
 *   14: SHOOT clicking locked Calendar
 *   15: SHOOT clicking +New Contract / Browse Contracts as anon
 *
 * Output: 15+ screenshots + DOM-snapshot dumps.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile } from 'fs/promises'

const PREFIX = process.argv.find(a => a.startsWith('--prefix='))?.split('=')[1] || 'walk'
const SHOTS = resolve('test-results/screenshots')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const consoleLines = []
page.on('console', m => consoleLines.push(`[${m.type()}] ${m.text()}`))

async function shoot(label) {
  await page.screenshot({ path: join(SHOTS, `${PREFIX}-${label}.png`), fullPage: true })
  console.log(`SHOT ${PREFIX}-${label}`)
}

async function dump(label, selector = 'body') {
  const text = await page.locator(selector).first().innerText().catch(() => '')
  await writeFile(join(SHOTS, `${PREFIX}-${label}.txt`), text)
}

async function shootThinking(label) {
  // Capture the live thinking area for ~3 seconds at 500ms intervals
  for (let i = 0; i < 6; i++) {
    await page.screenshot({ path: join(SHOTS, `${PREFIX}-${label}-${i}.png`), fullPage: false })
    await page.waitForTimeout(500)
  }
}

try {
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await shoot('01-modal-open')

  // Upload
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await shoot('02-review')

  // Continue
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  await page.waitForTimeout(2000)
  await shoot('03-assistant-empty')
  await dump('03-assistant-empty')

  // ─── Send "Hello" — trivial message ────────────────────────────────
  await page.locator('textarea').first().fill('Hello')
  await page.keyboard.press('Enter')
  // Try to capture the thinking display in the first 1.5s
  await page.waitForTimeout(400)
  await shoot('04-hello-thinking-early')
  await page.waitForTimeout(800)
  await shoot('05-hello-thinking-mid')
  await page.waitForTimeout(2000)
  await shoot('06-hello-thinking-late')
  // Wait for response to settle
  await page.waitForTimeout(8000)
  await shoot('07-hello-response')
  await dump('07-hello-response')

  // ─── Send real contract question ──────────────────────────────────
  await page.locator('textarea').first().fill('What does clause 34 say about extension of time?')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(500)
  await shoot('08-real-thinking-early')
  await page.waitForTimeout(2000)
  await shoot('09-real-thinking-mid')
  await page.waitForTimeout(4000)
  await shoot('10-real-thinking-late')
  await page.waitForTimeout(10000)
  await shoot('11-real-response')
  await dump('11-real-response')

  // ─── Like / Dislike / Refresh inspection ──────────────────────────
  // Find feedback buttons on the last assistant message
  const likeButtons = await page.locator('button[aria-label*="like" i], button[title*="like" i], button:has(svg.lucide-thumbs-up)').all()
  const dislikeButtons = await page.locator('button[aria-label*="dislike" i], button[title*="dislike" i], button:has(svg.lucide-thumbs-down)').all()
  console.log('like buttons found:', likeButtons.length, 'dislike:', dislikeButtons.length)
  if (likeButtons.length > 0) {
    await likeButtons[likeButtons.length - 1].click()
    await page.waitForTimeout(500)
    await shoot('12-after-like')
    await likeButtons[likeButtons.length - 1].click()
    await page.waitForTimeout(500)
    await shoot('13-after-like-toggle-off')
  }
  if (dislikeButtons.length > 0 && likeButtons.length > 0) {
    await likeButtons[likeButtons.length - 1].click()
    await page.waitForTimeout(300)
    await dislikeButtons[dislikeButtons.length - 1].click()
    await page.waitForTimeout(500)
    await shoot('14-after-dislike-mutually-exclusive')
  }

  // Find refresh button
  const refreshButtons = await page.locator('button:has(svg.lucide-rotate-cw), button:has(svg.lucide-refresh-cw), button[title*="refresh" i], button[title*="regenerat" i]').all()
  console.log('refresh buttons found:', refreshButtons.length)
  if (refreshButtons.length > 0) {
    await refreshButtons[refreshButtons.length - 1].click()
    await page.waitForTimeout(500)
    await shoot('15-after-refresh-click')
    // Capture the input box state after — current bug puts the prompt back in
    const inputVal = await page.locator('textarea').first().inputValue()
    console.log('Input value after refresh click:', JSON.stringify(inputVal))
    await page.waitForTimeout(8000)
    await shoot('16-after-refresh-result')
  }

  // ─── Click locked Calendar nav ────────────────────────────────────
  await page.locator('aside').locator('a:has-text("Calendar"), button:has-text("Calendar")').first().click().catch(() => {})
  await page.waitForTimeout(1500)
  await shoot('17-calendar-locked-click')

  // ─── Try to create a 2nd contract ─────────────────────────────────
  await page.goto('http://localhost:3000/contracts/new')
  await page.waitForLoadState('networkidle')
  await shoot('18-new-contract-as-anon')
  await dump('18-new-contract-as-anon', 'main')
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  if (consoleLines.length) {
    const errs = consoleLines.filter(l => l.startsWith('[error]') || l.startsWith('[pageerror]'))
    if (errs.length) {
      console.log('--- console errors ---')
      console.log(errs.slice(0, 40).join('\n'))
    }
    await writeFile(join(SHOTS, `${PREFIX}-console.log`), consoleLines.join('\n'))
  }
  await browser.close()
}
