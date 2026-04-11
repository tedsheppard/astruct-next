/**
 * Generate marketing screenshots by interacting with the app.
 * Sends a real query to the assistant, waits for response, then screenshots.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3000'
const OUT = 'public/marketing'

async function main() {
  mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  // Login
  const loginPage = await ctx.newPage()
  await loginPage.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 15000 })
  await loginPage.waitForTimeout(1000)
  await loginPage.fill('input[type="email"]', 'demo@astruct.io')
  await loginPage.fill('input[type="password"]', 'demo1234')
  await loginPage.click('button[type="submit"]')
  await loginPage.waitForTimeout(3000)
  console.log('Logged in')

  const contractId = '2700b025-555e-4ca6-b04e-cd6542cf3e74'

  // 1. Library (already has documents - good shot)
  console.log('Capturing library...')
  const libPage = await ctx.newPage()
  await libPage.goto(`${BASE}/contracts/${contractId}/library`, { waitUntil: 'networkidle', timeout: 20000 })
  await libPage.waitForTimeout(2000)
  // Crop to just the main content area (exclude sidebar for cleaner marketing shot)
  const libContent = await libPage.$('main') || libPage
  await libPage.screenshot({ path: `${OUT}/app-library.webp`, type: 'png' })
  console.log('  Library done')

  // 2. Assistant - send a real question and wait for response
  console.log('Capturing assistant with response...')
  const assistPage = await ctx.newPage()
  await assistPage.goto(`${BASE}/contracts/${contractId}/assistant`, { waitUntil: 'networkidle', timeout: 20000 })
  await assistPage.waitForTimeout(2000)

  // Type and send a question
  const textarea = await assistPage.$('textarea')
  if (textarea) {
    await textarea.fill("What's the time bar for notifying a variation under this contract?")
    await assistPage.waitForTimeout(500)

    // Click "Ask Astruct" button
    const askBtn = await assistPage.$('button:has-text("Ask Astruct")')
    if (askBtn) {
      await askBtn.click()
      console.log('  Question sent, waiting for response...')

      // Wait for streaming to complete (check for the send button to reappear)
      await assistPage.waitForTimeout(20000) // Give it time to respond
    }
  }
  await assistPage.screenshot({ path: `${OUT}/app-assistant.webp`, type: 'png' })
  console.log('  Assistant done')

  // 3. Calendar
  console.log('Capturing calendar...')
  const calPage = await ctx.newPage()
  await calPage.goto(`${BASE}/contracts/${contractId}/calendar`, { waitUntil: 'networkidle', timeout: 20000 })
  await calPage.waitForTimeout(2000)
  await calPage.screenshot({ path: `${OUT}/app-calendar.webp`, type: 'png' })
  console.log('  Calendar done')

  // 4. Correspondence
  console.log('Capturing correspondence...')
  const corrPage = await ctx.newPage()
  await corrPage.goto(`${BASE}/contracts/${contractId}/correspondence`, { waitUntil: 'networkidle', timeout: 20000 })
  await corrPage.waitForTimeout(2000)
  await corrPage.screenshot({ path: `${OUT}/app-correspondence.webp`, type: 'png' })
  console.log('  Correspondence done')

  await browser.close()
  console.log(`\nAll screenshots saved to ${OUT}/`)
}

main().catch(console.error)
