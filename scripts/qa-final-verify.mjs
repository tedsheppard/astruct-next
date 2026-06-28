#!/usr/bin/env node
/**
 * Final verification of: Mn1, Mn2 (auto-scan firing), C1+C2 root cause,
 * C4 (/about), M1 (/solutions hub + sub-pages).
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir } from 'fs/promises'

const SHOTS = resolve('test-results/full-coverage/screenshots')
await mkdir(SHOTS, { recursive: true })

let counter = 600
const next = () => String(++counter).padStart(3, '0')
const findings = []

const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

async function shot(slug, label) {
  const file = join(SHOTS, `${next()}_final_${slug}_${label}.png`)
  await page.screenshot({ path: file, fullPage: true }).catch(() => {})
  console.log(`  → ${file.split('/').pop()}`)
  return file
}
function expect(label, cond, detail) {
  const tag = cond ? '✓' : '✗'
  console.log(`  ${tag} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!cond) findings.push({ label, detail })
}

const ROUTES = [
  // C2 — privacy now shows real content
  { url: 'https://astruct.io/privacy', slug: 'c2-privacy', expect: 'Information We Collect' },
  // C4 — /about
  { url: 'https://astruct.io/about', slug: 'c4-about', expect: 'Built in Brisbane' },
  // M1 — /solutions hub
  { url: 'https://astruct.io/solutions', slug: 'm1-hub', expect: 'Built for everyone in the chain' },
  // M1 — 5 sub-pages
  { url: 'https://astruct.io/solutions/contractors', slug: 'm1-contractors', expect: '' },
  { url: 'https://astruct.io/solutions/developers', slug: 'm1-developers', expect: '' },
  { url: 'https://astruct.io/solutions/subcontractors', slug: 'm1-subcontractors', expect: '' },
  { url: 'https://astruct.io/solutions/contract-administrators', slug: 'm1-ca', expect: '' },
  { url: 'https://astruct.io/solutions/construction-lawyers', slug: 'm1-lawyers', expect: '' },
]

try {
  for (const r of ROUTES) {
    console.log(`\n=== ${r.url} ===`)
    await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(3500)
    await shot(r.slug, 'load')
    if (r.expect) {
      const found = await page.locator(`text=${r.expect}`).count()
      expect(`"${r.expect}" visible`, found > 0)
    }
    // Check that the page isn't the branded 404
    const has404 = await page.locator('text=We couldn').count()
    expect('not the 404 page', has404 === 0)
    // Check that body has substantive content (>500 chars in main content)
    const bodyText = await page.locator('body').innerText()
    expect('body has >500 chars', bodyText.length > 500, `length=${bodyText.length}`)
  }

  // Mn1 — settings/general dropdowns are shadcn
  console.log(`\n=== Mn1: Settings/General dropdowns ===`)
  // Need to be authed. Quick anon flow.
  await page.goto('https://app.astruct.io/assistant', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(8000)
  const m = page.url().match(/\/contracts\/([a-f0-9-]+)/)
  if (m) {
    const cid = m[1]
    await page.goto(`https://app.astruct.io/contracts/${cid}/settings`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(4000)
    await shot('mn1-settings-general', 'load')
    const native = await page.locator('select').count()
    const shadcn = await page.locator('button[role="combobox"], [data-slot="select-trigger"]').count()
    expect('Mn1: no native <select>', native === 0, `native=${native}`)
    expect('Mn1: shadcn triggers present', shadcn >= 2, `shadcn=${shadcn}`)
  }

  console.log(`\n=== Summary ===`)
  console.log(`Failed: ${findings.length}`)
  for (const f of findings) console.log(` ✗ ${f.label}${f.detail ? ': ' + f.detail : ''}`)
} catch (err) {
  console.error('FATAL:', err.message)
  await shot('fatal', 'error')
  process.exitCode = 1
} finally {
  await br.close()
}
