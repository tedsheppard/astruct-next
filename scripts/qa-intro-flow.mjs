#!/usr/bin/env node
/**
 * Walks the full anon intro flow and screenshots each phase:
 *   01: landing → bootstrap spinner
 *   02: intro modal — upload step
 *   03: processing
 *   04: review step (POST-EXTRACT) ← critical: shows the dropdowns we care about
 *   05: dashboard after Continue
 *
 * Args: --label-prefix=A1 --headed --slow
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir } from 'fs/promises'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, '').split('=')
    return [k, rest.join('=') || true]
  }),
)
const PREFIX = args['label-prefix'] || 'intro'
const SHOTS = resolve('test-results/screenshots')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const browser = await chromium.launch({
  headless: !args.headed,
  slowMo: args.slow ? 250 : 0,
})
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const consoleLines = []
page.on('console', (m) => consoleLines.push(`[${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => consoleLines.push(`[pageerror] ${e.message}`))

async function shoot(label, opts = {}) {
  const path = join(SHOTS, `${PREFIX}-${label}.png`)
  await page.screenshot({ path, fullPage: opts.fullPage !== false })
  console.log(`SHOT: ${label}`)
}

try {
  console.log('→ /assistant')
  await page.goto('http://localhost:3000/assistant', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  await shoot('01-bootstrap')

  // Wait for redirect to /contracts/[id]/assistant?intro=1
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
  console.log('→', page.url())
  await page.waitForTimeout(1500)
  await shoot('02-intro-upload')

  // Trigger file input (the click target is the dropzone div)
  const fileInput = page.locator('input[type="file"]').first()
  await fileInput.setInputFiles(PDF)
  console.log('→ uploaded', PDF)

  // Show processing state briefly
  await page.waitForTimeout(1500)
  await shoot('03-processing')

  // Wait for the review step (an "Auto-filled from your contract" header appears)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await page.waitForTimeout(800)
  await shoot('04-review')

  // Now click the Contract type dropdown to verify it's a custom one (no native chrome)
  const contractTypeTrigger = page
    .locator('label:has-text("Contract type") + div [data-slot="select-trigger"], label:has-text("Contract type") ~ * [data-slot="select-trigger"]')
    .first()

  // Fall back: just find the first SelectTrigger inside the modal review area
  const triggers = await page.locator('[data-slot="select-trigger"]').all()
  console.log('→ Found', triggers.length, 'shadcn SelectTriggers in DOM')
  if (triggers.length > 0) {
    await triggers[0].click()
    await page.waitForTimeout(500)
    await shoot('05-dropdown-open')
    await page.keyboard.press('Escape')
  } else {
    console.warn('NO shadcn SelectTriggers found — dropdowns may still be native!')
  }

  await page.waitForTimeout(500)
  await shoot('06-review-final')
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error', { fullPage: true })
  process.exitCode = 1
} finally {
  if (consoleLines.length) {
    const consoleText = consoleLines.join('\n')
    const errors = consoleLines.filter((l) => l.startsWith('[error]') || l.startsWith('[pageerror]'))
    if (errors.length) {
      console.log('--- console errors ---')
      console.log(errors.join('\n'))
    }
    await (await import('fs/promises')).writeFile(
      join(SHOTS, `${PREFIX}-console.txt`),
      consoleText,
    )
  }
  await browser.close()
}
