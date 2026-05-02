#!/usr/bin/env node
/**
 * Single-purpose Playwright runner for QA screenshots.
 *
 * Usage:
 *   node scripts/qa-shoot.mjs --url=http://localhost:3000/assistant --label=A1-before --wait=ready
 *   node scripts/qa-shoot.mjs --url=http://localhost:3000/contracts/<id>/assistant?intro=1 --label=A1-modal-open --wait=2000
 *
 * Flags:
 *   --url       URL to load
 *   --label     Filename label (no extension). Output goes to test-results/screenshots/{label}.png
 *   --wait      "ready" (default — networkidle) | "Nms" | a CSS selector to wait for
 *   --viewport  "desktop" (1440x900 default) | "mobile" (iPhone 13)
 *   --click     CSS selector to click after load (optional)
 *   --type      "selector|text" — type text into selector (optional)
 *   --headed    show the browser window (default false)
 *   --reuse     reuse storage state from .auth-state.json (preserves anon session)
 *   --save-state save storage state after run for reuse
 *   --full      full-page screenshot (default true)
 *   --console   write console output to {label}.console.txt
 */

import { chromium, devices } from 'playwright'
import { mkdir, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, join } from 'path'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, '').split('=')
    return [k, rest.join('=') || true]
  }),
)

if (!args.url || !args.label) {
  console.error('Required: --url, --label')
  process.exit(1)
}

const SCREENSHOT_DIR = resolve('test-results/screenshots')
await mkdir(SCREENSHOT_DIR, { recursive: true })
const STATE_FILE = resolve('.qa-auth-state.json')

const browser = await chromium.launch({ headless: !args.headed })
const contextOpts = args.viewport === 'mobile' ? devices['iPhone 13'] : { viewport: { width: 1440, height: 900 } }
if (args.reuse && existsSync(STATE_FILE)) contextOpts.storageState = STATE_FILE
const context = await browser.newContext(contextOpts)
const page = await context.newPage()

const consoleLines = []
page.on('console', (msg) => consoleLines.push(`[${msg.type()}] ${msg.text()}`))
page.on('pageerror', (err) => consoleLines.push(`[pageerror] ${err.message}`))

try {
  await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 30000 })

  if (args.wait === 'ready' || !args.wait) {
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {})
  } else if (/^\d+$/.test(args.wait)) {
    await page.waitForTimeout(parseInt(args.wait, 10))
  } else {
    await page.waitForSelector(args.wait, { timeout: 15000 })
  }

  if (args.click) {
    await page.click(args.click, { timeout: 10000 })
    await page.waitForTimeout(800)
  }

  if (args.type) {
    const [sel, ...rest] = args.type.split('|')
    await page.fill(sel, rest.join('|'))
  }

  const screenshotPath = join(SCREENSHOT_DIR, `${args.label}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: args.full !== 'false' })
  console.log(`SHOT: ${screenshotPath}`)

  if (args.console) {
    await writeFile(join(SCREENSHOT_DIR, `${args.label}.console.txt`), consoleLines.join('\n'))
  }

  if (args['save-state']) {
    await context.storageState({ path: STATE_FILE })
    console.log(`STATE: ${STATE_FILE}`)
  }
} catch (err) {
  console.error('ERROR:', err.message)
  // Save what we got even on partial failure
  try {
    await page.screenshot({ path: join(SCREENSHOT_DIR, `${args.label}-error.png`), fullPage: true })
  } catch {}
  process.exitCode = 1
} finally {
  if (args.console) {
    console.log('--- console ---')
    console.log(consoleLines.join('\n').slice(0, 4000))
  }
  await browser.close()
}
