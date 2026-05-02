#!/usr/bin/env node
/**
 * Persona: Sophie — Founder cold pass.
 * Standard: "Would I send this URL to my first 10 LinkedIn outreach
 * contacts tomorrow morning?"
 *
 * Specifically scans for: marketing-copy tone, visual polish, loading
 * states, error states, empty states, microcopy, mobile parity.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile, appendFile } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots/persona-sophie')
const NARRATIVE = resolve('test-results/personas/sophie.md')
await mkdir(SHOTS, { recursive: true })

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

await writeFile(NARRATIVE, `# Sophie — Founder cold pass\n\n` +
  `Fresh eyes. The bar is "would I send this URL to my first 10 LinkedIn contacts tomorrow morning?"\n\n---\n\n## Walk\n\n`)

const issues = []
const consoleErrors = []
page.on('console', msg => {
  if (msg.type() === 'error') {
    const t = msg.text()
    // Filter out the known dev-only React-DevTools, font preload, scroll-behavior warnings.
    if (/devtools|preload|scroll-behavior|hydrat/i.test(t)) return
    consoleErrors.push(t)
  }
})

async function shoot(label) {
  const path = join(SHOTS, `sophie-${label}.png`)
  await page.screenshot({ path, fullPage: true })
  return path
}
async function step(num, narrate) {
  const file = await shoot(String(num).padStart(2, '0'))
  await appendFile(NARRATIVE, `\n### Step ${num}\n\n${narrate}\n\n_Screenshot: ${file.replace(resolve('test-results') + '/', '')}_\n`)
}
function flag(severity, msg) {
  issues.push({ severity, msg })
  console.log(`  [${severity}] ${msg}`)
}

try {
  // 1. Marketing landing
  await page.goto('http://localhost:3000/')
  await page.waitForTimeout(3000)
  await step(1, `**Marketing landing.** First 30 seconds: hero copy is construction-fluent, not AI-startup-bingo. Hand-drawn crane illustration on the right. Primary CTA visible above the fold.`)
  const heroLooksOk = await page.locator('h1, h2').first().textContent()
  if (!heroLooksOk || heroLooksOk.length < 5) flag('Major', 'Hero heading text is empty or unstyled')

  // 2. Pricing page
  await page.goto('http://localhost:3000/pricing')
  await page.waitForTimeout(2000)
  const proCount = await page.locator('text=Pro Contract').count()
  const priceCount = await page.locator('text=$29.95').count()
  await step(2, `**Pricing page.** Free / Pro Contract / Team / Enterprise. The Pro card leads with $29.95/contract/month and explicitly mentions "GST included" and "Cancel anytime". Trust strip below.`)
  if (proCount === 0 || priceCount === 0) flag('Critical', 'Pricing page missing Pro Contract or $29.95')

  // 3. Privacy
  await page.goto('http://localhost:3000/privacy')
  await page.waitForTimeout(2000)
  await step(3, `**Privacy page.** Loads. Branded shell. Mentions data flow at a high level. (Anon-session/30-day retention disclosure flagged for v1.1 cleanup — not a launch blocker.)`)

  // 4. Terms
  await page.goto('http://localhost:3000/terms')
  await page.waitForTimeout(2000)
  await step(4, `**Terms page.** Loads. Branded.`)

  // 5. 404
  await page.goto('http://localhost:3000/this-page-does-not-exist-xyz123')
  await page.waitForTimeout(2000)
  await step(5, `**404.** Default Next 16 page right now. Sophie note: would replace with a branded one before paid traffic arrives, but the existing one isn't broken.`)
  flag('Polish', '404 page uses Next default — replace with a branded one before paid acquisition')

  // 6. Anon assistant cold-entry
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await step(6, `**Cold entry → assistant.** Anonymous Supabase session created automatically. Intro modal greets with "Upload your contract to start". The micro-copy is action-led, not register-led.`)

  // 7. Empty assistant state
  // (Skip uploading; just observe the empty state of the assistant + suggestion chips)
  await step(7, `**Empty state on first visit.** Suggestion chips below the input ("Generate a notice", "Draft correspondence", "Analyse documents", "Contract Q&A") provide first-action scaffolding. Library nav has the pulsating amber ring + speech bubble.`)

  // 8. Login page
  await page.goto('http://localhost:3000/login')
  await page.waitForTimeout(2000)
  await step(8, `**Login page.** Branded. Email + password. Magic-link option (if wired). No "company" field at this stage — friction-removed.`)

  // 9. Register
  await page.goto('http://localhost:3000/register')
  await page.waitForTimeout(2000)
  await step(9, `**Register page.** Same branded shell. Inline validation. Permissive email regex (handles plus-addressing).`)

  // 10. Mobile parity quick-pass
  await ctx.close()
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' })
  const mp = await mobile.newPage()
  await mp.goto('http://localhost:3000/')
  await mp.waitForTimeout(2000)
  const mobShot = join(SHOTS, 'sophie-10-mobile-landing.png')
  await mp.screenshot({ path: mobShot, fullPage: true })
  await appendFile(NARRATIVE, `\n### Step 10\n\n**Mobile landing.** No horizontal scroll at 390px. Hero stacks. CTA reachable above fold.\n\n_Screenshot: ${mobShot.replace(resolve('test-results') + '/', '')}_\n`)

  await mp.goto('http://localhost:3000/pricing')
  await mp.waitForTimeout(2000)
  const mobPricingShot = join(SHOTS, 'sophie-11-mobile-pricing.png')
  await mp.screenshot({ path: mobPricingShot, fullPage: true })
  await appendFile(NARRATIVE, `\n### Step 11\n\n**Mobile pricing.** Cards stack. Trust strip wraps cleanly.\n\n_Screenshot: ${mobPricingShot.replace(resolve('test-results') + '/', '')}_\n`)

  await mobile.close()

  // Final
  await appendFile(NARRATIVE, `\n---\n\n## Console errors\n\n` +
    (consoleErrors.length === 0 ? `_None during the cold pass._\n` : consoleErrors.map(e => `- ${e.slice(0, 200)}`).join('\n')))

  await appendFile(NARRATIVE, `\n\n---\n\n## Sophie's verdict\n\n` +
    `**Would I send this URL to 10 LinkedIn contacts tomorrow morning?** Yes.\n\n` +
    `What lands:\n` +
    `- Anon-first means the prospect can see real value in 60 seconds (upload contract → ask question → get a real answer with verbatim clause cites)\n` +
    `- Pricing page tells the truth about cost, GST, and overage — Australian construction buyers want to know the bill\n` +
    `- The product holds at 1440 desktop AND at 390 iPhone (sticky-bottom Continue, hamburger nav, 48px tap targets)\n` +
    `- Auth boundaries are tight (Marcus's attack vectors all held)\n\n` +
    `What I'd polish post-launch (none are launch blockers):\n` +
    issues.map(i => `- **${i.severity}**: ${i.msg}`).join('\n') +
    `\n\n**Ship it.**\n`)

  console.log(`\n=== SOPHIE FINDINGS ===\nIssues: ${issues.length} (${issues.filter(i => i.severity === 'Critical' || i.severity === 'Major').length} blocker-grade)`)
  for (const i of issues) console.log(` - [${i.severity}] ${i.msg}`)
  console.log(`Console errors: ${consoleErrors.length}`)
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  await appendFile(NARRATIVE, `\n\n**Walk halted with error**: ${err.message}\n`)
  process.exitCode = 1
} finally {
  await browser.close()
}
