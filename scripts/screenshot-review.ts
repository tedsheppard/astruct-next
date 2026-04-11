/**
 * Visual review script — screenshots marketing pages and saves them for review.
 * Run with: npx tsx scripts/screenshot-review.ts
 */

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE_URL = 'http://localhost:3000'
const OUTPUT_DIR = '/tmp/astruct-screenshots'
const PAGES = [
  { path: '/landing', name: 'homepage' },
  { path: '/platform', name: 'platform' },
  { path: '/pricing', name: 'pricing' },
]

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  for (const page of PAGES) {
    console.log(`\n=== Screenshotting: ${page.name} ===`)

    // Desktop (1440px)
    const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const desktopPage = await desktopCtx.newPage()
    await desktopPage.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle', timeout: 30000 })
    await desktopPage.waitForTimeout(1500) // Wait for animations

    // Full page screenshot
    await desktopPage.screenshot({
      path: `${OUTPUT_DIR}/${page.name}-desktop-full.png`,
      fullPage: true,
    })
    console.log(`  Desktop full: ${OUTPUT_DIR}/${page.name}-desktop-full.png`)

    // Above the fold
    await desktopPage.screenshot({
      path: `${OUTPUT_DIR}/${page.name}-desktop-fold.png`,
    })
    console.log(`  Desktop fold: ${OUTPUT_DIR}/${page.name}-desktop-fold.png`)

    await desktopCtx.close()

    // Mobile (375px)
    const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } })
    const mobilePage = await mobileCtx.newPage()
    await mobilePage.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle', timeout: 30000 })
    await mobilePage.waitForTimeout(1500)

    await mobilePage.screenshot({
      path: `${OUTPUT_DIR}/${page.name}-mobile-full.png`,
      fullPage: true,
    })
    console.log(`  Mobile full: ${OUTPUT_DIR}/${page.name}-mobile-full.png`)

    await mobilePage.screenshot({
      path: `${OUTPUT_DIR}/${page.name}-mobile-fold.png`,
    })
    console.log(`  Mobile fold: ${OUTPUT_DIR}/${page.name}-mobile-fold.png`)

    await mobileCtx.close()
  }

  await browser.close()
  console.log(`\n=== All screenshots saved to ${OUTPUT_DIR} ===`)
}

main().catch(console.error)
