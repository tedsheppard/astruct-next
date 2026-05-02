import { chromium } from 'playwright'
import { resolve } from 'path'
const browser = await chromium.launch({ headless: true })
const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())
await page.goto('https://astruct.io/pricing')
await page.waitForTimeout(4000)
await page.screenshot({ path: resolve('test-results/screenshots/prod-pricing.png'), fullPage: true })
const proCount = await page.locator('text=Pro Contract').count()
const priceCount = await page.locator('text=$29.95').count()
const trustGst = await page.locator('text=GST included').count()
console.log(`Pro Contract card: ${proCount}, $29.95 visible: ${priceCount}, GST trust strip: ${trustGst}`)
await browser.close()
