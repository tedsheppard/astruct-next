#!/usr/bin/env node
/**
 * Phase 2 — Use Case A. Real user, anon flow, end-to-end on LIVE app.astruct.io.
 * Uploads the 14MB Pensar subcontract, runs 5 real questions, tests like/dislike/refresh,
 * tests locked features, hits message wall.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, appendFile } from 'fs/promises'

const SHOTS = resolve('test-results/full-coverage/screenshots')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-results/full-coverage/uploads/sample-contract.pdf')

let counter = 100
const next = () => String(++counter).padStart(3, '0')
const findings = []

const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } })
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
  console.log(`  → ${file.split('/').pop()}`)
  return file
}

try {
  console.log('=== Step 1: Land on app/assistant cold ===')
  await page.goto('https://app.astruct.io/assistant', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(4000)
  await shot('uca-01', 'land', 'initial')

  console.log('=== Step 2: Wait for intro modal ===')
  try {
    await page.waitForSelector('text=Drop your contract here', { timeout: 30000 })
    await shot('uca-02', 'introModal', 'visible')
  } catch (e) {
    findings.push({ severity: 'Critical', msg: `Intro modal did not appear after anon-start: ${e.message}` })
    await shot('uca-02', 'introModal', 'failed')
    throw e
  }

  console.log('=== Step 3: Upload real 14MB Pensar subcontract ===')
  await shot('uca-03', 'beforeUpload', 'before')
  const t0 = Date.now()
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  // Wait for the auto-fill modal
  try {
    await page.waitForSelector('text=Auto-filled from your contract', { timeout: 180000 })
    const elapsed = Math.round((Date.now() - t0) / 1000)
    console.log(`  Extraction took ${elapsed}s`)
    findings.push({ severity: 'Info', msg: `Pensar 14MB extraction took ${elapsed}s` })
  } catch (e) {
    findings.push({ severity: 'Critical', msg: `Extraction did not finish within 3min: ${e.message}` })
    await shot('uca-03', 'upload', 'extraction-failed')
    throw e
  }
  await shot('uca-04', 'extractionDone', 'review')

  console.log('=== Step 4: Continue to assistant ===')
  await page.locator('button:has-text("Continue to assistant")').first().scrollIntoViewIfNeeded()
  await page.locator('button:has-text("Continue to assistant")').first().click({ force: true })
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(3000)
  await shot('uca-05', 'assistantOpen', 'fresh')

  console.log('=== Step 5: Library spatial cue check ===')
  const cueVisible = await page.locator('text=Upload Project Documents Here').count()
  console.log(`  Library cue: ${cueVisible}`)
  if (cueVisible === 0) {
    findings.push({ severity: 'Minor', msg: 'Library spatial cue not visible after intro completion' })
  }

  console.log('=== Step 6: Ask 5 questions, test feedback + refresh ===')
  const questions = [
    'What are the time bars for variation claims?',
    'Draft a notice of delay under the relevant clause.',
    'What does clause 34 say verbatim?',
    'Who is the principal in this contract?',
    'Is this a D&C subcontract or head contract?',
  ]
  for (let i = 0; i < questions.length; i++) {
    console.log(`  Q${i + 1}: ${questions[i]}`)
    await page.locator('textarea').first().fill(questions[i])
    await shot(`uca-06-q${i + 1}`, 'beforeSend', 'typed')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(20000)
    await shot(`uca-06-q${i + 1}`, 'afterSend', 'response')
  }

  console.log('=== Step 7: Like the last response, then click Like again to toggle ===')
  const likeBtn = page.locator('button[title="Good response"]').last()
  if (await likeBtn.count()) {
    await likeBtn.click()
    await page.waitForTimeout(500)
    await shot('uca-07', 'likeClicked', 'after')
    await likeBtn.click()
    await page.waitForTimeout(500)
    await shot('uca-07', 'likeToggleOff', 'after')
  } else {
    findings.push({ severity: 'Major', msg: 'Like button missing after assistant response' })
  }

  console.log('=== Step 8: Click refresh — should regenerate ===')
  const refreshBtn = page.locator('button[title="Regenerate response"]').last()
  if (await refreshBtn.count()) {
    await shot('uca-08', 'beforeRefresh', 'before')
    await refreshBtn.click()
    await page.waitForTimeout(15000)
    await shot('uca-08', 'afterRefresh', 'regenerated')
    const inputAfter = await page.locator('textarea').first().inputValue()
    if (inputAfter && inputAfter.length > 0) {
      findings.push({ severity: 'Major', msg: `Refresh button refilled the input ("${inputAfter.slice(0, 40)}") instead of regenerating` })
    }
  }

  console.log('=== Step 9: Try locked features ===')
  const lockedFeatures = ['Calendar', 'Templates']
  for (const feat of lockedFeatures) {
    const link = page.locator(`a:has-text("${feat}")`).first()
    if (await link.count()) {
      await link.click()
      await page.waitForTimeout(800)
      await shot(`uca-09-${feat.toLowerCase()}`, 'lockedClick', 'wallShown')
      const wall = await page.locator('text=Sign up to unlock this').count()
      if (wall === 0) {
        findings.push({ severity: 'Major', msg: `${feat} click did not show hard wall` })
      }
      const dismiss = page.locator('button:has-text("Maybe later")')
      if (await dismiss.count()) await dismiss.first().click()
      await page.waitForTimeout(500)
    } else {
      findings.push({ severity: 'Minor', msg: `Sidebar nav item "${feat}" missing` })
    }
  }

  console.log('=== Step 10: Try to add a 2nd project ===')
  await page.goto('https://app.astruct.io/contracts/new', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)
  await shot('uca-10', 'addSecondProject', 'attempt')

  console.log(`\n=== Findings ===`)
  for (const f of findings) console.log(` [${f.severity}] ${f.msg}`)
  console.log(`Console errors: ${consoleErrors.length}`)
  for (const e of consoleErrors.slice(0, 10)) console.log(`  · ${e.slice(0, 200)}`)

  await appendFile(
    resolve('test-results/full-coverage/_phase2.json'),
    JSON.stringify({ findings, consoleErrors }, null, 2),
  )
} catch (err) {
  console.error('FATAL:', err.message)
  await shot('uca-error', 'fatal', 'error')
  process.exitCode = 1
} finally {
  await br.close()
}
