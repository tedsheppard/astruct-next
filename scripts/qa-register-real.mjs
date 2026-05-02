import { chromium } from 'playwright'
const br = await chromium.launch({ headless: true })
const pg = await br.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())
pg.on('response', async r => {
  if (r.url().includes('/auth/') && r.status() >= 400) {
    console.log(`[net ${r.status()}] → ${(await r.text()).slice(0, 200)}`)
  }
})
const stamp = Date.now()
const email = `iship+${stamp}@gmail.com`
await pg.goto('http://localhost:3000/register')
await pg.waitForTimeout(2000)
await pg.locator('input[placeholder="Your name"]').fill('Test User')
await pg.locator('input[placeholder="you@company.com"]').fill(email)
await pg.locator('input[type="password"]').fill('abcdef123')
await pg.locator('button:has-text("Create account")').click()
await pg.waitForTimeout(5000)
await pg.screenshot({ path: 'test-results/screenshots/register-success.png', fullPage: true })
console.log('Final URL:', pg.url())
const errTxt = await pg.locator('div.text-red-600, div.bg-red-50').first().textContent().catch(() => null)
console.log('Visible error:', JSON.stringify(errTxt))
await br.close()
