import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const PDF = (await import('path')).resolve('test-fixtures/test-subcontract.pdf')

await page.goto('http://localhost:3000/assistant')
await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
await page.waitForSelector('text=Upload your contract to start')
await page.locator('input[type="file"]').first().setInputFiles(PDF)
await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
await page.locator('button:has-text("Continue to assistant")').click()
await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
await page.waitForTimeout(2000)

// Send 1 message so pill bumps to 1
await page.locator('textarea').first().fill('Hello')
await page.keyboard.press('Enter')
await page.waitForTimeout(8000)

// Now snap & inspect
const path = (await import('path')).resolve('test-results/screenshots/A9-pill-text.png')
await page.screenshot({ path, fullPage: false })
console.log('SHOT:', path)

const headerText = await page.locator('header').first().innerText()
const sidebarText = await page.locator('aside').first().innerText()
console.log('--- HEADER ---')
console.log(headerText)
console.log('--- SIDEBAR ---')
console.log(sidebarText)

const hits = {
  guestPrefix: /Guest\s*·/.test(headerText),
  cleanCounter: /\d+\s*\/\s*50\s+messages/.test(headerText),
  guestEmail: /guest@astruct/.test(sidebarText),
  signUpButton: /Sign up free/.test(sidebarText),
  logoutPresent: /Log\s*out/i.test(sidebarText),
}
console.log('--- A9 checks ---', JSON.stringify(hits, null, 2))
await browser.close()
