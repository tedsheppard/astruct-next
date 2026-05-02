#!/usr/bin/env node
/**
 * Reproduces the user's screenshot: /register with test@test.com.
 * Verifies the new error message includes the actual email (not "").
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots')
await mkdir(SHOTS, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())

page.on('response', async r => {
  if (r.url().includes('/auth/') && r.status() >= 400) {
    const body = await r.text().catch(() => '')
    console.log(`[net ${r.status()}] ${r.url()} → ${body.slice(0, 200)}`)
  }
})

try {
  await page.goto('http://localhost:3000/register')
  await page.waitForTimeout(2000)
  await page.locator('input[placeholder="Your name"]').fill('Test User')
  await page.locator('input[placeholder="you@company.com"]').fill('test@test.com')
  await page.locator('input[type="password"]').fill('abcdef123')
  await page.locator('button:has-text("Create account")').click()
  await page.waitForTimeout(4000)
  await page.screenshot({ path: join(SHOTS, 'register-after-submit.png'), fullPage: true })
  const errTxt = await page.locator('div.text-red-600, div.bg-red-50').first().textContent().catch(() => null)
  console.log('Visible error:', JSON.stringify(errTxt))
  if (errTxt && errTxt.includes('""')) {
    console.log('✗ STILL SHOWING EMPTY-QUOTES ERROR')
    process.exitCode = 1
  } else if (errTxt && errTxt.includes('test@test.com')) {
    console.log('✓ Error now references the actual email value')
  } else {
    console.log('· Error format:', errTxt?.slice(0, 100))
  }
} catch (err) {
  console.error('ERROR:', err.message)
  process.exitCode = 1
} finally {
  await browser.close()
}
