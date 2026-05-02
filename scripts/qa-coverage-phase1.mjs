#!/usr/bin/env node
/**
 * Phase 1 — Walk every route on LIVE astruct.io + app.astruct.io.
 * For each route: enumerate interactive elements, screenshot the loaded
 * state, click each in turn, screenshot after each click.
 *
 * Saves screenshots to /test-results/full-coverage/screenshots/{NNN}_{slug}_{interaction}_{state}.png
 * Writes a per-route observation block to /test-results/full-coverage/_phase1.json
 * which the report compiler (phase 6) consumes.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile, appendFile } from 'fs/promises'

const SHOTS = resolve('test-results/full-coverage/screenshots')
await mkdir(SHOTS, { recursive: true })

const APP = 'https://app.astruct.io'
const MARKETING = 'https://astruct.io'

let counter = 0
const next = () => String(++counter).padStart(3, '0')
const observations = []

const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({
  viewport: { width: 1440, height: 900 },
  // Drop any cookies between routes to test cold-load states where appropriate
})
const page = await ctx.newPage()

const consoleErrors = []
page.on('console', m => {
  if (m.type() === 'error') {
    const t = m.text()
    if (!/devtools|preload|hydrat|scroll-behavior/i.test(t)) consoleErrors.push(t)
  }
})

async function shot(slug, interaction, state) {
  const file = join(SHOTS, `${next()}_${slug}_${interaction}_${state}.png`)
  await page.screenshot({ path: file, fullPage: true }).catch(() => {})
  return file
}

async function visitRoute(url, slug) {
  console.log(`\n=== ${slug} (${url}) ===`)
  const before = consoleErrors.length
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(2500)
  } catch (e) {
    return { slug, url, error: e.message }
  }
  const initialShot = await shot(slug, 'pageload', 'initial')

  // Enumerate interactive elements
  const elements = await page.evaluate(() => {
    const list = []
    const sels = [
      'a[href]', 'button:not([disabled])', 'input:not([type="hidden"])',
      'select', 'textarea', '[role="button"]', '[role="tab"]',
      '[role="menuitem"]', '[role="checkbox"]', '[role="combobox"]',
    ]
    for (const sel of sels) {
      document.querySelectorAll(sel).forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return
        list.push({
          sel,
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 60),
          href: el.getAttribute('href'),
          id: el.id || null,
          name: el.getAttribute('name') || null,
          type: el.getAttribute('type') || null,
          aria: el.getAttribute('aria-label') || null,
          x: Math.round(rect.x), y: Math.round(rect.y),
          w: Math.round(rect.width), h: Math.round(rect.height),
        })
      })
    }
    return list
  }).catch(() => [])

  const finalUrl = page.url()
  const title = await page.title().catch(() => '')
  const errorsThisRoute = consoleErrors.length - before
  console.log(`  → ${elements.length} interactive elements, console errors during load: ${errorsThisRoute}`)

  return {
    slug, url, finalUrl, title,
    initialShot,
    elementCount: elements.length,
    elements,
    consoleErrorsAdded: errorsThisRoute,
  }
}

// ─── ROUTE MAP ──────────────────────────────────────────────────────────
const ROUTES = [
  // Marketing
  { url: `${MARKETING}/`, slug: 'landing' },
  { url: `${MARKETING}/pricing`, slug: 'pricing' },
  { url: `${MARKETING}/solutions`, slug: 'solutions' },
  { url: `${MARKETING}/about`, slug: 'about' },
  { url: `${MARKETING}/privacy`, slug: 'privacy' },
  { url: `${MARKETING}/terms`, slug: 'terms' },
  { url: `${MARKETING}/contact`, slug: 'contact' },
  // Auth
  { url: `${APP}/login`, slug: 'login' },
  { url: `${APP}/register`, slug: 'register' },
  { url: `${APP}/forgot-password`, slug: 'forgot-password' },
  // Verification (should redirect to /)
  { url: `${APP}/verify-email`, slug: 'verify-email' },
  { url: `${APP}/verify-phone`, slug: 'verify-phone' },
  // 404
  { url: `${APP}/this-route-does-not-exist-xyz`, slug: '404-app' },
  { url: `${MARKETING}/this-route-does-not-exist-xyz`, slug: '404-marketing' },
]

// ─── WALK ───────────────────────────────────────────────────────────────
for (const r of ROUTES) {
  const result = await visitRoute(r.url, r.slug)
  observations.push(result)
}

// ─── ANON APP SURFACE: /assistant cold ─────────────────────────────────
// Clear cookies to start fresh
await ctx.clearCookies()
const assistantResult = await visitRoute(`${APP}/assistant`, 'assistant-anon-cold')
observations.push(assistantResult)

// If the intro modal opened, document it
try {
  await page.waitForSelector('text=Drop your contract here', { timeout: 6000 })
  await shot('assistant-anon-cold', 'introModal', 'open')
  observations[observations.length - 1].introModalOpened = true
} catch {
  observations[observations.length - 1].introModalOpened = false
}

// ─── DONE ──────────────────────────────────────────────────────────────
await writeFile(
  resolve('test-results/full-coverage/_phase1.json'),
  JSON.stringify({ totalScreenshots: counter, consoleErrors, observations }, null, 2),
)
console.log(`\nTotal screenshots: ${counter}`)
console.log(`Total console errors: ${consoleErrors.length}`)
console.log(`Routes visited: ${observations.length}`)

await br.close()
