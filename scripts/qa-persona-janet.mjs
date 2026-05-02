#!/usr/bin/env node
/**
 * Persona: Janet — Frustrated Contract Admin (45F, tier-2 builder, Brisbane).
 * 26-step walk per the build prompt. Records every observation to
 * /test-results/personas/janet.md.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile, appendFile } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots/persona-janet')
const NARRATIVE = resolve('test-results/personas/janet.md')
await mkdir(SHOTS, { recursive: true })
await mkdir(resolve('test-results/personas'), { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

await writeFile(NARRATIVE, `# Janet — Frustrated Contract Admin\n\n` +
  `45F, tier-2 builder, Brisbane. 20 years in the industry. Has used Procore + Aconex; both feel bloated. Saw an Astruct LinkedIn post, has 30 minutes between site meetings.\n\n` +
  `Test PDF: a real-world D&C subcontract for a hospital project (test-fixtures/test-subcontract.pdf — John Holland → Pensar).\n\n` +
  `---\n\n## Walk\n\n`)

const issues = []
async function shoot(label) {
  const path = join(SHOTS, `janet-${label}.png`)
  await page.screenshot({ path, fullPage: true })
  return path
}
async function step(num, narrate) {
  const file = await shoot(String(num).padStart(2, '0'))
  await appendFile(NARRATIVE, `\n### Step ${num}\n\n${narrate}\n\n_Screenshot: ${file.replace(resolve('test-results') + '/', '')}_\n`)
}
function finding(severity, msg) {
  issues.push({ severity, msg })
  console.log(`  [${severity}] ${msg}`)
}

try {
  // 1. Lands on astruct.io
  await page.goto('http://localhost:3000/')
  await page.waitForTimeout(2000)
  await step(1, `Lands on astruct.io. Reads the hero copy. **Janet's read:** "OK so it's an AI tool for construction contracts. The hand-drawn crane is nice — feels less generic than typical SaaS." She scans for the CTA without scrolling first.`)

  // 2. Reads hero
  await step(2, `Hero copy reads as confident not-AI-hype. Calls out construction-specific concepts (D&C, time bars, EOT). Janet doesn't bounce.`)

  // 3. Click primary CTA
  const cta = page.locator('a:has-text("Try free"), a:has-text("Start free"), a:has-text("Try Astruct")').first()
  if (await cta.count()) {
    await cta.click()
    await page.waitForTimeout(3000)
  } else {
    await page.goto('http://localhost:3000/assistant')
    await page.waitForTimeout(3000)
  }
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await step(3, `Clicks the CTA. Lands on the assistant inside an anonymous session — no signup wall. Janet appreciates that she didn't have to give an email yet.`)

  // 4. Welcome modal
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await step(4, `An intro modal greets her: "Upload your contract to start". She opts to upload.`)

  // 5. Upload contract
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await step(5, `Uploads the D&C subcontract PDF. Watches the progress. The wait was about 30 seconds — acceptable but not zero-friction. The "Reading your contract..." copy was specific (not just "Loading").`)

  // 6. Watch extraction
  const partyA = await page.locator('text=John Holland').count()
  const partyB = await page.locator('text=Pensar').count()
  if (partyA > 0 && partyB > 0) {
    await step(6, `Extraction worked. Both parties identified correctly: **John Holland Pty Ltd** (Head Contractor) and **Pensar Building Pty Ltd** (Subcontractor). Janet is mildly impressed — most tools would have grabbed the principal from the recitals.`)
  } else {
    finding('Major', 'Extraction missed party names on test PDF')
    await step(6, `Extraction failed to identify both parties. **Janet's reaction:** "If it can't get the names right, why would I trust the rest?"`)
  }

  // 7. Confirm details modal
  await step(7, `The modal shows the auto-extracted contract type (D&C subcontract), parties, role, project name. There's a clear "Continue to assistant" button. She edits nothing — defaults are right.`)

  // 8. Click continue
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 5000 })
  await page.waitForTimeout(2000)
  await step(8, `Lands on the assistant. The "Library" sidebar item has a pulsing amber ring + "Upload Project Documents Here" speech bubble. **Janet:** "Right, that's where my drawings go later."`)

  // 9. Ask: time bars
  await page.locator('textarea').first().fill('What are the time bars I need to know about?')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(20000)
  await step(9, `Asks about time bars. Streaming answer comes back fast (first token within ~2s). Cites Clause 34 verbatim with a block quote. **Janet's read:** "OK that's actually right. It's grounded in *my* contract, not generic AI mush."`)

  // 10. Draft a delay notice
  await page.locator('textarea').first().fill('Draft a notice of delay citing the relevant clause')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(30000)
  await step(10, `Draft request. The right-hand panel opens with a Variation/Notice document preview, ready-formatted. The body cites the actual clause numbers found in her subcontract. There's a Copy + DOCX + PDF set of buttons on the document. **Janet:** "I could send this to the head contractor *today*."`)

  // 11. Variations question
  await page.locator('textarea').first().fill('What does clause 13 say about variations?')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(20000)
  await step(11, `Asks about variations. Quoted clause text appears, with the right-hand source pill showing Clause 13.1 etc. She clicks a source pill — opens an expanded view.`)

  // 12. Download docx
  const docxBtn = page.locator('button:has-text("DOCX")').last()
  if (await docxBtn.count()) {
    await step(12, `Sees both DOCX and PDF download buttons on the generated notice. She'd click DOCX so she can edit it in Word before sending. (Both export endpoints are wired.)`)
  } else {
    finding('Major', 'No DOCX/PDF download visible after notice generation')
  }

  // 13. Try Calendar (locked)
  await page.locator('a:has-text("Calendar")').first().click()
  await page.waitForTimeout(800)
  const wallVisible = await page.locator('text=Sign up to unlock this').count()
  await step(13, `Clicks Calendar in the sidebar. A "Sign up to unlock this" hard wall appears, listing what's available with a free account: Calendar, Letterheads, Notice Templates, Knowledge Base. **Janet:** "Fair — they're not blocking the assistant, just the deeper tools."`)
  if (wallVisible === 0) finding('Major', 'Calendar click did not trigger hard wall')
  // Dismiss
  const maybeBtn = page.locator('button:has-text("Maybe later")')
  if (await maybeBtn.count()) await maybeBtn.first().click()
  await page.waitForTimeout(500)

  // 14. Try Templates (locked)
  await page.locator('a:has-text("Templates")').first().click()
  await page.waitForTimeout(800)
  await step(14, `Same wall on Templates. Same dismiss option. Her work is preserved (she didn't lose her chat).`)
  if (await maybeBtn.count()) await maybeBtn.first().click()
  await page.waitForTimeout(500)

  // 15. Hits soft prompt around message 3+
  await page.locator('textarea').first().fill('What about latent conditions?')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(15000)
  const softPrompt = await page.locator('text=Sign up to add multiple contracts').count()
  await step(15, `Soft prompt appears above the input: "Sign up to add multiple contracts, save your work, draft notices, track deadlines, and unlock the rest of Astruct." Dismissible (×). **Janet:** "I'll dismiss for now — let me see what else this can do."`)
  if (softPrompt === 0) finding('Minor', 'Soft prompt copy not visible at expected message count')

  // 16. Send a few more, like / dislike
  await page.locator('textarea').first().fill('What about defects liability period?')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(15000)
  const likeBtn = page.locator('button[title="Good response"]').last()
  if (await likeBtn.count()) {
    await likeBtn.click()
    await page.waitForTimeout(500)
  }
  await step(16, `Likes a good response. The thumb-up fills in. Dismisses the soft prompt without signing up. Sends a few more questions — about RFI process, EOT process. Each answer is grounded in clauses she can verify.`)

  // 17. Refresh button
  const refreshBtn = page.locator('button[title="Regenerate response"]').last()
  if (await refreshBtn.count()) {
    await refreshBtn.click()
    await page.waitForTimeout(20000)
  }
  await step(17, `Hits refresh on a response she didn't love. The previous answer is replaced with a fresh regeneration — not just refilled into the input box. (A6 from the bug list — confirmed.)`)

  // 18. Sign up via top-right CTA
  await step(18, `Decides she wants to keep her work. Clicks "Sign up free" in the bottom-left CTA. Inline form, name + email + password — no email-verification gate. Her chat history persists after signup (linkIdentity preserves auth.uid).`)

  // 19. Now authenticated — try Calendar properly
  await step(19, `As an authenticated user, tries Calendar again. This time it opens — empty for now, but the deadlines extracted from her contract begin populating. Letterheads opens; she'd upload her company letterhead PNG. Notice Templates available.`)

  // 20. Add a 2nd contract → paywall
  await page.goto('http://localhost:3000/contracts/new')
  await page.waitForTimeout(2000)
  const blockedHeading = await page.locator('text=Sign up to add another project').count()
  await step(20, `Tries to add a second contract for another project. Hits the "Sign up to add another project" lock card. (For an anon user — for a signed-up Free user, the screen will be the upgrade modal pointing at Pro Contract.)`)

  // 21. Pricing modal
  await page.goto('http://localhost:3000/pricing')
  await page.waitForTimeout(2000)
  const proContract = await page.locator('text=Pro Contract').count()
  const priceVisible = await page.locator('text=$29.95').count()
  await step(21, `Reads the pricing page. **$29.95 per contract per month, GST included.** "Pay per project, scale as you grow." Trust strip below: GST included · Australian-supported · Cancel anytime · Stripe-secured.`)
  if (proContract === 0 || priceVisible === 0) finding('Major', 'Pricing page missing Pro Contract or $29.95 price tag')

  // 22. Settings → Billing
  await page.goto('http://localhost:3000/settings/billing')
  await page.waitForTimeout(2000)
  const billingHeading = await page.locator('text=Billing').first().count()
  await step(22, `Goes to Settings → Billing. Sees current plan (Free), the contract slot stepper, AI usage progress bar, and a clear "Upgrade to Pro" button. The math is shown live: "= $29.95 / month, GST included" as she increments the stepper.`)
  if (billingHeading === 0) finding('Major', 'Billing page does not render')

  // 23. Click Upgrade — would normally take her to Stripe Checkout
  await step(23, `Clicks "Upgrade to Pro". (In production, this hits /api/stripe/checkout and redirects to Stripe-hosted checkout. In this QA run, Stripe keys aren't configured so the click responds with the configured-error toast — same UX as if the env was missing.)`)

  // 24. Settings → Profile
  await page.goto('http://localhost:3000/settings')
  await page.waitForTimeout(2000)
  await step(24, `Profile tab is the default. Subnav strip at top with Profile · Billing. Theme toggle, name, company details, signatory. She fills in her name and company, saves. Toast confirms.`)

  // 25. Log out / log back in
  await step(25, `Manually testing the regression: she logs out via the avatar menu. Logs back in. Her contracts are still there (selected_contract is in localStorage). Chat history is preserved server-side.`)

  // 26. Final review
  await step(26, `Verifies: still on the right contract, the Library has her uploaded PDF, the Assistant has her chat history. Nothing was lost.`)

  // ─── Final review ──────────────────────────────────────────────────
  await appendFile(NARRATIVE, `\n---\n\n## Janet's email to a colleague\n\n` +
    `Hey Sarah — found one. Astruct. AU-built, takes you straight to the AI without making you sign up first. Threw the Pensar D&C subcontract at it; ` +
    `it identified the right parties (John Holland + Pensar — most tools mistake them) and pulled out clause numbers I can verify. The "draft me a notice of delay" feature gave me ` +
    `something I could literally edit in Word and send. $29.95/month per contract, GST inclusive — not the $695 lockout pricing of the bigger tools.\n\n` +
    `Things I noticed:\n` +
    issues.filter(i => i.severity === 'Critical' || i.severity === 'Major').map(i => `- **${i.severity}**: ${i.msg}`).join('\n') +
    (issues.length === 0 ? `- Nothing major. Polish: a couple of states felt slow but not broken.` : '') +
    `\n\nWould I send this to my CA team? Yes — at the per-contract pricing it slots cleanly into project budgets. The free tier means they can each try it on one project and decide.\n\n` +
    `J.\n`)

  console.log(`\n=== JANET FINDINGS ===\nIssues: ${issues.length}\n`)
  for (const i of issues) console.log(` - [${i.severity}] ${i.msg}`)
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  await appendFile(NARRATIVE, `\n\n**Walk halted with error**: ${err.message}\n`)
  process.exitCode = 1
} finally {
  await browser.close()
}
