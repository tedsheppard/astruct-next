#!/usr/bin/env node
/**
 * Verify A2/A18: send 2 messages, confirm header pill increments, sidebar
 * UsageMeter is hidden, and no "0 days left" text appears anywhere.
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
const consoleLines = []
page.on('console', (m) => consoleLines.push(`[${m.type()}] ${m.text()}`))

async function shoot(label) {
  await page.screenshot({ path: join(SHOTS, `A2-${label}.png`), fullPage: true })
  console.log(`SHOT: A2-${label}`)
}

try {
  // Land on /assistant → bootstrap → contract assistant with intro modal
  await page.goto('http://localhost:3000/assistant', { waitUntil: 'domcontentloaded' })
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })

  // Upload + extract
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })

  // Click Continue to dismiss intro modal — find by visible text
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 10000 })
  await page.waitForTimeout(1500)
  await shoot('01-after-intro')

  // Inspect sidebar BEFORE sending messages — capture what UsageMeter shows for guest
  const sidebarText = await page.locator('aside').first().innerText()
  console.log('--- sidebar text BEFORE messages ---')
  console.log(sidebarText)
  const headerText = await page.locator('header').first().innerText()
  console.log('--- header text BEFORE messages ---')
  console.log(headerText)

  // Find the chat input — it's a textarea
  const input = page.locator('textarea').first()
  await input.fill('Hello')
  // Hit Cmd+Enter / Enter to send (look for the send button or use keyboard)
  await page.keyboard.press('Enter')
  // Wait for assistant to start streaming or finish — give it a beat
  await page.waitForTimeout(8000)
  await shoot('02-after-msg-1')

  // Refresh AnonContext faster — wait the polling interval
  await page.waitForTimeout(5000)
  await shoot('03-after-msg-1-poll')

  await input.fill('What does clause 34 say?')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(15000)
  await shoot('04-after-msg-2')

  await page.waitForTimeout(5000)
  await shoot('05-after-msg-2-poll')

  const sidebarText2 = await page.locator('aside').first().innerText()
  const headerText2 = await page.locator('header').first().innerText()
  console.log('--- sidebar text AFTER 2 messages ---')
  console.log(sidebarText2)
  console.log('--- header text AFTER 2 messages ---')
  console.log(headerText2)

  // Bug-spotting checks
  const bodyText = await page.locator('body').innerText()
  const hits = {
    daysLeft: /days left/i.test(bodyText),
    queries050: /Queries\s+0\s*\/\s*50/i.test(bodyText),
    upgradeBadge: /\bUpgrade\b/.test(bodyText),
  }
  console.log('--- bug checks ---')
  console.log(JSON.stringify(hits, null, 2))
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  if (consoleLines.length) {
    const errs = consoleLines.filter((l) => l.startsWith('[error]') || l.startsWith('[pageerror]'))
    if (errs.length) {
      console.log('--- console errors ---')
      console.log(errs.join('\n'))
    }
  }
  await browser.close()
}
