import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

async function main() {
  const out = '/tmp/astruct-screenshots/videos'
  mkdirSync(out, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  // Record video
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } },
  })
  const page = await ctx.newPage()

  console.log('Loading Harvey.ai live...')
  await page.goto('https://www.harvey.ai/', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(3000)

  // Dismiss cookies
  try { await page.click('text=Accept all', { timeout: 3000 }) } catch {}
  await page.waitForTimeout(1000)

  // Slowly scroll the entire page
  const height = await page.evaluate(() => document.body.scrollHeight)
  console.log(`Page height: ${height}px`)

  for (let y = 0; y < height; y += 80) {
    await page.evaluate((s) => window.scrollTo({ top: s, behavior: 'auto' }), y)
    await page.waitForTimeout(60)
  }

  // Pause at bottom
  await page.waitForTimeout(2000)

  // Scroll back up slowly
  for (let y = height; y >= 0; y -= 120) {
    await page.evaluate((s) => window.scrollTo({ top: s, behavior: 'auto' }), y)
    await page.waitForTimeout(40)
  }

  await page.waitForTimeout(2000)
  await ctx.close()
  await browser.close()

  console.log(`Video saved to ${out}/`)
}

main().catch(console.error)
