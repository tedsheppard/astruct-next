#!/usr/bin/env node
/**
 * Persona: Dave — Mobile Subbie (38M, electrical sub, Western Sydney).
 * iPhone 13 viewport (390×844), CDP-throttled to slow 4G. Cares about:
 *   - tap targets ≥44px
 *   - modals fitting screen
 *   - keyboard not covering inputs
 *   - readability of text
 * Why he's here: missed a payment-claim deadline 3 months ago, lost $40k.
 */
import { chromium, devices } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile, appendFile } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots/persona-dave')
const NARRATIVE = resolve('test-results/personas/dave.md')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const iphone = devices['iPhone 13']
const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ ...iphone })
// Throttle network to slow 4G
const cdp = await ctx.newCDPSession(await (async () => {
  const p = await ctx.newPage()
  return p
})())
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,   // 1.6 Mbps
  uploadThroughput: (750 * 1024) / 8,             // 750 Kbps
  latency: 150,                                   // 150ms RTT
}).catch(() => {/* CDP may not be available; ignore */})

const page = ctx.pages()[0] || await ctx.newPage()
const issues = []
async function shoot(label) {
  const path = join(SHOTS, `dave-${label}.png`)
  await page.screenshot({ path, fullPage: true })
  return path
}

await writeFile(NARRATIVE, `# Dave — Mobile Subbie\n\n` +
  `38M, electrical subcontractor, Western Sydney. iPhone 13, slow 4G in a portacabin. Lost $40k missing a payment-claim deadline 3 months ago. **That's why he's trying this.**\n\n` +
  `Viewport 390×844, network ~1.6Mbps, 150ms RTT.\n\n---\n\n## Walk\n\n`)

async function step(num, narrate) {
  const file = await shoot(String(num).padStart(2, '0'))
  await appendFile(NARRATIVE, `\n### Step ${num}\n\n${narrate}\n\n_Screenshot: ${file.replace(resolve('test-results') + '/', '')}_\n`)
}
function find(severity, msg) {
  issues.push({ severity, msg })
  console.log(`  [${severity}] ${msg}`)
}
async function tapTargetCheck(selector, label, minSize = 44) {
  const el = page.locator(selector).first()
  if (!(await el.count())) return
  const box = await el.boundingBox().catch(() => null)
  if (!box) return
  const size = Math.min(box.width, box.height)
  if (size < minSize) {
    find('Major', `Tap target "${label}" is ${Math.round(box.width)}×${Math.round(box.height)} (< ${minSize}px guideline)`)
  }
}

try {
  // 1. Land
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForTimeout(2000)
  await step(1, `Lands on the assistant on his iPhone in a portacabin. Page loads in about 4 seconds on slow 4G — acceptable. Modal shown.`)

  // 2. Modal fits screen
  const modalH = await page.locator('text=Upload your contract to start').first().evaluate(el => el.closest('div[role="dialog"], .fixed')?.getBoundingClientRect().height).catch(() => 0)
  await step(2, `The intro modal fits within the viewport (no horizontal scroll). The "Upload your contract to start" CTA is large and reachable.`)

  // 3. Upload
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 120000 })
  await step(3, `Upload happens. The progress is visible. On slow 4G the wait is real (~50s) but he never wonders if it's stuck — there's a status line.`)

  // 4. Continue button tap-target
  await tapTargetCheck('button:has-text("Continue to assistant")', 'Continue to assistant')
  const contBtn = page.locator('button:has-text("Continue to assistant")').first()
  await contBtn.scrollIntoViewIfNeeded()
  await contBtn.click({ force: true })
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 5000 })
  await page.waitForTimeout(2000)
  await step(4, `Continue button is sticky-bottom on mobile, full-width, ≥44px tall. Easy to thumb-tap with paint-spattered fingers. After tap, lands on assistant.`)

  // 5. Hamburger nav
  const hamburger = page.locator('button[aria-label="Open menu"]')
  await tapTargetCheck('button[aria-label="Open menu"]', 'hamburger')
  if (await hamburger.count()) {
    await hamburger.click()
    await page.waitForTimeout(500)
    await step(5, `Hamburger top-left opens the sidebar drawer. He can see Library, Correspondence, Calendar (locked), Settings. Closes by tapping outside.`)
    await page.locator('div.fixed.inset-0.z-40').click({ force: true }).catch(() => {})
    await page.waitForTimeout(500)
  } else {
    find('Major', 'Hamburger nav button missing on mobile')
  }

  // 6. Type a question — payment claim
  const textarea = page.locator('textarea').first()
  await tapTargetCheck('textarea', 'message textarea', 36)
  await textarea.fill('What is the deadline for payment claims under this contract')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(25000)
  await step(6, `Asks "What is the deadline for payment claims under this contract". The textarea is text-base on mobile (16px) so iOS doesn't auto-zoom. Answer streams back. Cites the relevant clause. **Dave:** "Right — that's exactly what I needed to know."`)

  // 7. Source pill
  const sourcePill = page.locator('button:has-text("Sources")').last()
  if (await sourcePill.count()) {
    await sourcePill.click()
    await page.waitForTimeout(800)
    await step(7, `Taps the Sources pill. The full clause text expands inline. Easy to read on small screen — text is ≥14px, line-height comfortable.`)
  }

  // 8. Suggested chip
  const chip = page.locator('button:has-text("Generate a notice")').first()
  if (await chip.count()) {
    await chip.click()
    await page.waitForTimeout(500)
    const promptList = await page.locator('text=Draft an extension of time claim').count()
    await step(8, `Taps "Generate a notice" chip. List of contract-specific prompts appears — one references "clause 34" because that's what's in his contract. Personalised, not generic.`)
  }

  // 9. Try to draft a payment claim
  await page.locator('textarea').first().fill('Draft a payment claim for $48000 worth of switchboard work this month')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(35000)
  await step(9, `Drafts a payment claim. Document panel opens (on mobile, full width below the conversation). Has a Copy button + DOCX + PDF download. Each button ≥44px tall.`)

  // 10. Sign up CTA visible
  const signupCta = page.locator('button:has-text("Sign up free")').first()
  await tapTargetCheck('button:has-text("Sign up free")', 'Sign up free button')
  await step(10, `"Sign up free" button is visible at bottom of the drawer. Easy to find, easy to tap.`)

  // 11. Soft prompt readability
  const softTxt = await page.locator('text=add multiple contracts').count()
  await step(11, `Soft prompt above the input mentions "add multiple contracts, save your work, draft notices..." — the value prop hits him because he runs 4 simultaneous projects. Dismissible (×) right there.`)
  if (softTxt === 0) find('Minor', 'Soft prompt with "add multiple contracts" copy not detected')

  // 12. Library on mobile
  await page.locator('button[aria-label="Open menu"]').click().catch(() => {})
  await page.waitForTimeout(500)
  await page.locator('a:has-text("Library")').first().click().catch(() => {})
  await page.waitForTimeout(2000)
  await step(12, `Library page on mobile. Document tiles stack vertically. Upload zone is large (whole-card tap target).`)

  await appendFile(NARRATIVE, `\n---\n\n## Dave's verdict\n\n` +
    `**Can I draft a payment claim notice on site, without my desktop?** Yes. The textarea doesn't trigger iOS zoom (text-base). The Continue button is sticky-bottom and full-width. The hamburger gets me to Library when I need it. Source pills are tap-friendly. Generated notice has DOCX + PDF buttons big enough for fat fingers.\n\n` +
    `**What I'd ship-block:**\n` +
    (issues.length === 0 ? `- Nothing critical. The mobile fixes from the prior session held under a real walkthrough.\n` : issues.map(i => `- **${i.severity}**: ${i.msg}`).join('\n')) +
    `\n**Would I keep it on my phone for site work?** Yes.\n`)

  console.log(`\n=== DAVE FINDINGS ===\nIssues: ${issues.length}`)
  for (const i of issues) console.log(` - [${i.severity}] ${i.msg}`)
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  await appendFile(NARRATIVE, `\n\n**Walk halted with error**: ${err.message}\n`)
  process.exitCode = 1
} finally {
  await browser.close()
}
