#!/usr/bin/env node
/**
 * Combined #1 (regression sweep) + #2 (inner-app coverage).
 *
 * Steps:
 *   - Register fresh real account
 *   - Walk every protected route, screenshot each
 *   - Upload the real 14MB Pensar subcontract via the canonical flow
 *   - Visit every contract sub-page (library/calendar/correspondence/templates/history/settings/general/parties/administrator/dates)
 *   - Visit account-level routes (letterheads, knowledge-base, settings, settings/billing)
 *   - Try every interactive element on each, screenshot before/after
 *   - Capture console errors per route
 *   - Save observations to _sweep.json for the report
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile } from 'fs/promises'

const SHOTS = resolve('test-results/full-coverage/screenshots')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-results/full-coverage/uploads/sample-contract.pdf')

let counter = 500
const next = () => String(++counter).padStart(3, '0')
const observations = []
const findings = []
const consoleErrorsByRoute = {}

const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

let currentRoute = 'pre-login'
page.on('console', m => {
  if (m.type() === 'error') {
    const t = m.text()
    if (/devtools|preload|hydrat|scroll-behavior|net::ERR_FAILED/i.test(t)) return
    if (!consoleErrorsByRoute[currentRoute]) consoleErrorsByRoute[currentRoute] = []
    consoleErrorsByRoute[currentRoute].push(t.slice(0, 200))
  }
})

async function shot(slug, label) {
  const file = join(SHOTS, `${next()}_sw_${slug}_${label}.png`)
  await page.screenshot({ path: file, fullPage: true }).catch(() => {})
  return file
}
function note(severity, route, msg) {
  if (severity !== 'Info') findings.push({ severity, route, msg })
  console.log(`  [${severity}] ${route}: ${msg}`)
}
function obs(route, finalUrl, screenshot, elements, didLoad) {
  observations.push({ route, finalUrl, screenshot, elements, didLoad, consoleErrors: consoleErrorsByRoute[route]?.length || 0 })
}

async function visit(route, slug) {
  currentRoute = route
  const url = `https://app.astruct.io${route}`
  console.log(`\n=== ${route} ===`)
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(4500)
  } catch (e) {
    note('Major', route, `goto failed: ${e.message.slice(0, 80)}`)
    return null
  }
  const finalUrl = page.url()
  const elements = await page.evaluate(() => {
    const list = []
    document.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [role="button"], [role="tab"]').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      list.push({ tag: el.tagName.toLowerCase(), text: (el.textContent || '').trim().slice(0, 50), href: el.getAttribute('href') })
    })
    return list.length
  }).catch(() => 0)
  const file = await shot(slug, 'load')
  console.log(`  → ${file.split('/').pop()} (${elements} elements, ${consoleErrorsByRoute[route]?.length || 0} console errors)`)
  obs(route, finalUrl, file, elements, true)
  return file
}

const stamp = Date.now()
const email = `qa+sweep-${stamp}@gmail.com`

try {
  // ─── Register fresh authed user ────────────────────────────────────
  console.log(`\n=== Register fresh: ${email} ===`)
  await page.goto('https://app.astruct.io/register', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await page.locator('input[placeholder="Your name"]').fill('Sweep Tester')
  await page.locator('input[placeholder="you@company.com"]').fill(email)
  await page.locator('input[type="password"]').fill('AbcDef123!')
  await page.locator('button:has-text("Create account")').click()
  await page.waitForTimeout(8000)
  await shot('register', 'after')
  console.log(`  Final URL: ${page.url()}`)

  // ─── Upload the real PDF first so contract sub-pages have content ──
  console.log(`\n=== Upload Pensar subcontract ===`)
  if (page.url().includes('/contracts/') && page.url().includes('?intro=1')) {
    try {
      await page.waitForSelector('text=Drop your contract here', { timeout: 8000 })
      await page.locator('input[type="file"]').first().setInputFiles(PDF)
      await page.waitForSelector('text=Auto-filled from your contract', { timeout: 180000 })
      const cont = page.locator('button:has-text("Continue to assistant")').first()
      await cont.scrollIntoViewIfNeeded()
      await cont.click({ force: true })
      await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(3000)
      await shot('upload', 'done')
    } catch (e) {
      note('Major', 'upload-flow', `upload failed: ${e.message.slice(0, 100)}`)
    }
  }
  // Find the contract id we're on
  const m = page.url().match(/\/contracts\/([a-f0-9-]+)/)
  const cid = m?.[1]
  if (!cid) {
    note('Critical', 'contract-id', 'no contract id captured; sub-page sweep aborted')
    throw new Error('no contract id')
  }
  console.log(`Working contract: ${cid}`)

  // ─── #1: Regression sweep — known protected routes ─────────────────
  await visit(`/contracts/${cid}/assistant`, 'assistant')
  await visit(`/contracts/${cid}/library`, 'library')
  await visit(`/contracts/${cid}/calendar`, 'calendar') // free user, not anon — should NOT be locked
  await visit(`/contracts/${cid}/correspondence`, 'correspondence')
  await visit(`/contracts/${cid}/templates`, 'templates')
  await visit(`/contracts/${cid}/history`, 'history')
  await visit(`/contracts/${cid}/settings`, 'settings-general')
  await visit(`/contracts/${cid}/settings/parties`, 'settings-parties')
  await visit(`/contracts/${cid}/settings/administrator`, 'settings-administrator')
  await visit(`/contracts/${cid}/settings/dates`, 'settings-dates')
  await visit(`/letterheads`, 'letterheads')
  await visit(`/knowledge-base`, 'knowledge-base')
  await visit(`/settings`, 'settings')
  await visit(`/settings/billing`, 'settings-billing')
  await visit(`/contracts`, 'browse-contracts')

  // ─── #2: deeper interactions on a few pages ────────────────────────

  // Library — try uploading a doc via its UI (use the same PDF)
  console.log(`\n=== Library: try multi-doc upload ===`)
  currentRoute = `/contracts/${cid}/library`
  await page.goto(`https://app.astruct.io/contracts/${cid}/library`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  await shot('library', 'before-upload')
  try {
    const fileInput = await page.locator('input[type="file"]').first()
    if (await fileInput.count()) {
      await fileInput.setInputFiles(PDF)
      await page.waitForTimeout(15000)
      await shot('library', 'after-upload')
      const docCards = await page.locator('text=/.*\\.pdf/i').count()
      console.log(`  After upload: ${docCards} pdf references in DOM`)
    } else {
      note('Major', '/library', 'no file input found; cannot test multi-doc upload')
    }
  } catch (e) {
    note('Major', '/library', `upload threw: ${e.message.slice(0, 100)}`)
  }

  // Calendar — does it show extracted deadlines for the uploaded contract?
  console.log(`\n=== Calendar: deadlines surfacing? ===`)
  currentRoute = `/contracts/${cid}/calendar`
  await page.goto(`https://app.astruct.io/contracts/${cid}/calendar`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(6000)
  await shot('calendar', 'load')
  const deadlineRows = await page.locator('text=/clause|notice|claim|days/i').count()
  console.log(`  Calendar deadline-related text count: ${deadlineRows}`)

  // Project Settings → Parties — confirm RoleSelect dropdowns hold
  console.log(`\n=== Settings/Parties: RoleSelect dropdowns? ===`)
  currentRoute = `/contracts/${cid}/settings/parties`
  await page.goto(`https://app.astruct.io/contracts/${cid}/settings/parties`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  await shot('parties', 'load')
  const partiesNativeSelects = await page.locator('select').count()
  const partiesShadcnTriggers = await page.locator('button[role="combobox"], [data-slot="select-trigger"]').count()
  console.log(`  Native <select>: ${partiesNativeSelects}, shadcn triggers: ${partiesShadcnTriggers}`)
  if (partiesNativeSelects > 0) {
    note('Major', '/settings/parties', `${partiesNativeSelects} native <select> elements still present`)
  }

  // Settings/Administrator — confirm RoleSelect
  console.log(`\n=== Settings/Administrator: RoleSelect? ===`)
  currentRoute = `/contracts/${cid}/settings/administrator`
  await page.goto(`https://app.astruct.io/contracts/${cid}/settings/administrator`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  await shot('administrator', 'load')
  const adminNativeSelects = await page.locator('select').count()
  const adminShadcnTriggers = await page.locator('button[role="combobox"], [data-slot="select-trigger"]').count()
  console.log(`  Native <select>: ${adminNativeSelects}, shadcn triggers: ${adminShadcnTriggers}`)
  if (adminNativeSelects > 0) {
    note('Major', '/settings/administrator', `${adminNativeSelects} native <select> elements still present`)
  }

  // ─── Account-level Settings UI ─────────────────────────────────────
  console.log(`\n=== /settings: Profile/Billing subnav present? ===`)
  currentRoute = '/settings'
  await page.goto('https://app.astruct.io/settings', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  await shot('settings-account', 'load')
  const profTab = await page.locator('a:has-text("Profile")').count()
  const billTab = await page.locator('a:has-text("Billing")').count()
  console.log(`  Profile subnav: ${profTab}, Billing subnav: ${billTab}`)
  if (profTab === 0 || billTab === 0) {
    note('Polish', '/settings', `subnav missing (profile=${profTab}, billing=${billTab})`)
  }

  // ─── Done ──────────────────────────────────────────────────────────
  console.log('\n=== Findings ===')
  for (const f of findings) console.log(` [${f.severity}] ${f.route}: ${f.msg}`)
  console.log(`\n=== Console errors per route ===`)
  for (const [r, errs] of Object.entries(consoleErrorsByRoute)) {
    if (errs.length) console.log(` ${r}: ${errs.length}`)
  }

  await writeFile(
    resolve('test-results/full-coverage/_sweep.json'),
    JSON.stringify({ email, cid, observations, findings, consoleErrorsByRoute }, null, 2),
  )
} catch (err) {
  console.error('FATAL:', err.message)
  await shot('fatal', 'error')
  process.exitCode = 1
} finally {
  await br.close()
}
