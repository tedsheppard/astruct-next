import { chromium } from 'playwright'
import { resolve } from 'path'
const br = await chromium.launch({ headless: true })
const page = await br.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())
await page.goto('https://astruct.io/solutions/construction-lawyers', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.waitForTimeout(4000)
await page.screenshot({ path: resolve('test-results/full-coverage/screenshots/610_final_lawyers_load.png'), fullPage: true })
const has = await page.locator('text=Cut the contract').count()
const len = (await page.locator('body').innerText()).length
console.log(`construction-lawyers: heading=${has}, body=${len} chars`)
await br.close()
