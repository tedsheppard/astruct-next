/**
 * Captures Harvey.ai for design reference + Astruct app pages for product screenshots
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const HARVEY_PAGES = [
  { url: 'https://www.harvey.ai/', name: 'harvey-home' },
  { url: 'https://www.harvey.ai/platform', name: 'harvey-platform' },
  { url: 'https://www.harvey.ai/platform/assistant', name: 'harvey-assistant' },
]

const ASTRUCT_PAGES = [
  { url: 'http://localhost:3000/contracts/2700b025-555e-4ca6-b04e-cd6542cf3e74/assistant', name: 'app-assistant' },
  { url: 'http://localhost:3000/contracts/2700b025-555e-4ca6-b04e-cd6542cf3e74/library', name: 'app-library' },
  { url: 'http://localhost:3000/contracts/2700b025-555e-4ca6-b04e-cd6542cf3e74/calendar', name: 'app-calendar' },
  { url: 'http://localhost:3000/contracts/2700b025-555e-4ca6-b04e-cd6542cf3e74/correspondence', name: 'app-correspondence' },
]

async function main() {
  const outDir = '/tmp/astruct-screenshots'
  mkdirSync(outDir, { recursive: true })
  mkdirSync(`${outDir}/harvey`, { recursive: true })
  mkdirSync(`${outDir}/app`, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  // Capture Harvey pages
  console.log('=== Capturing Harvey.ai ===')
  for (const p of HARVEY_PAGES) {
    try {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await ctx.newPage()
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForTimeout(2000)

      // Above the fold
      await page.screenshot({ path: `${outDir}/harvey/${p.name}-fold.png` })

      // Full page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1500)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(500)
      await page.screenshot({ path: `${outDir}/harvey/${p.name}-full.png`, fullPage: true })

      console.log(`  ${p.name}: done`)
      await ctx.close()
    } catch (e) {
      console.log(`  ${p.name}: FAILED - ${e}`)
    }
  }

  // Capture Astruct app pages (need to login first)
  console.log('\n=== Capturing Astruct app ===')
  const appCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const loginPage = await appCtx.newPage()

  // Login
  try {
    await loginPage.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 15000 })
    await loginPage.waitForTimeout(1000)
    await loginPage.fill('input[type="email"]', 'demo@astruct.io')
    await loginPage.fill('input[type="password"]', 'demo1234')
    await loginPage.click('button[type="submit"]')
    await loginPage.waitForTimeout(3000)
    console.log('  Logged in')
  } catch (e) {
    console.log(`  Login failed: ${e}`)
  }

  for (const p of ASTRUCT_PAGES) {
    try {
      const page = await appCtx.newPage()
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForTimeout(2000)
      await page.screenshot({ path: `${outDir}/app/${p.name}.png` })
      console.log(`  ${p.name}: done`)
      await page.close()
    } catch (e) {
      console.log(`  ${p.name}: FAILED - ${e}`)
    }
  }

  await appCtx.close()
  await browser.close()
  console.log('\n=== All done ===')
}

main().catch(console.error)
