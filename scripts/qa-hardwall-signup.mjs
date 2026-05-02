#!/usr/bin/env node
/**
 * Reproduces the hard-wall signup "Email address \"\" is invalid" error.
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

// Capture console + network errors
page.on('console', msg => console.log('[browser]', msg.type(), msg.text()))
page.on('response', async r => {
  if (r.url().includes('/auth/') && r.status() >= 400) {
    const body = await r.text().catch(() => '')
    console.log('[network]', r.status(), r.url(), body.slice(0, 300))
  }
})

try {
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  await page.waitForTimeout(2000)

  // Trigger the hard wall by clicking Calendar (locked)
  await page.locator('a:has-text("Calendar")').first().click()
  await page.waitForSelector('text=Sign up to unlock this', { timeout: 5000 })
  await page.screenshot({ path: join(SHOTS, 'hardwall-1-opened.png'), fullPage: true })

  // Try submitting with i@gmail.com (the user's example)
  await page.locator('#hw-name').fill('test')
  await page.locator('#hw-email').fill('i@gmail.com')
  await page.locator('#hw-password').fill('abcdef123')

  // Verify React state actually has the email
  const inputValue = await page.locator('#hw-email').inputValue()
  console.log('Input value before submit:', JSON.stringify(inputValue))

  await page.locator('button:has-text("Sign up free")').last().click()
  await page.waitForTimeout(3000)
  await page.screenshot({ path: join(SHOTS, 'hardwall-2-after-submit.png'), fullPage: true })

  const errorTxt = await page.locator('div.text-red-600').textContent().catch(() => null)
  console.log('Visible error:', JSON.stringify(errorTxt))

  // Try with a longer email
  await page.locator('#hw-email').fill('')
  await page.locator('#hw-email').fill('testuser123@gmail.com')
  await page.waitForTimeout(300)
  await page.locator('button:has-text("Sign up free")').last().click()
  await page.waitForTimeout(3000)
  await page.screenshot({ path: join(SHOTS, 'hardwall-3-longer-email.png'), fullPage: true })
  const errorTxt2 = await page.locator('div.text-red-600').textContent().catch(() => null)
  console.log('Visible error (longer email):', JSON.stringify(errorTxt2))
} catch (err) {
  console.error('ERROR:', err.message)
} finally {
  await browser.close()
}
