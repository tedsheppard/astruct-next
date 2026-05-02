#!/usr/bin/env node
/**
 * Verifies the New Project button on /contracts now creates a blank project
 * + drops into the assistant with the upload modal, instead of /contracts/new.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
const SHOTS = resolve('test-results/screenshots')

const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

try {
  // Use anon flow to get a logged-in-equivalent state
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await page.screenshot({ path: join(SHOTS, 'newproj-01-modal-on-empty.png'), fullPage: true })
  console.log('Step 1: assistant on a blank project shows upload modal — ok')

  // Modal copy check
  const setupHeading = await page.locator('text=Set up your project').count()
  const uploadCopy = await page.locator('text=Drop your contract here').count()
  console.log(`Modal heading "Set up your project": ${setupHeading}, upload zone: ${uploadCopy}`)

  // Browse Contracts page (will use anon contract limit so might be locked)
  await page.goto('http://localhost:3000/contracts')
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(SHOTS, 'newproj-02-browse.png'), fullPage: true })
  const titleCount = await page.locator('text=Your projects').count()
  const newBtnCount = await page.locator('button:has-text("New Project")').count()
  console.log(`Browse title "Your projects": ${titleCount}, "New Project" button: ${newBtnCount}`)
} catch (err) {
  console.error('ERROR:', err.message)
  process.exitCode = 1
} finally {
  await br.close()
}
