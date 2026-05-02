#!/usr/bin/env node
/**
 * Phase 5 — Mobile pass at 390x844 (iPhone 13). LIVE.
 * Visit: landing, pricing, login, register, /assistant flow, settings/billing.
 * Audit tap targets, modal fits, hamburger, keyboard.
 */
import { chromium, devices } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile } from 'fs/promises'

const SHOTS = resolve('test-results/full-coverage/screenshots')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-results/full-coverage/uploads/sample-contract.pdf')

let counter = 300
const next = () => String(++counter).padStart(3, '0')
const findings = []

const iphone = devices['iPhone 13']
const br = await chromium.launch({ headless: true })
const ctx = await br.newContext({ ...iphone })
const page = await ctx.newPage()

async function shot(slug, interaction, state) {
  const file = join(SHOTS, `${next()}_${slug}_${interaction}_${state}_mobile.png`)
  await page.screenshot({ path: file, fullPage: true }).catch(() => {})
  console.log(`  → ${file.split('/').pop()}`)
  return file
}

async function tapTarget(sel, label) {
  const el = page.locator(sel).first()
  if (!(await el.count())) return
  const box = await el.boundingBox().catch(() => null)
  if (!box) return
  if (Math.min(box.width, box.height) < 44) {
    findings.push({ severity: 'Major', msg: `Mobile tap target "${label}" is ${Math.round(box.width)}×${Math.round(box.height)} (< 44px)` })
  }
}

try {
  // Marketing — landing, pricing
  console.log('=== Marketing landing + pricing ===')
  await page.goto('https://astruct.io/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await shot('m-01', 'landing', 'top')
  await tapTarget('a:has-text("Start free")', 'Start free CTA')

  await page.goto('https://astruct.io/pricing', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await shot('m-02', 'pricing', 'top')

  // Auth
  await page.goto('https://app.astruct.io/login', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await shot('m-03', 'login', 'initial')
  await tapTarget('button:has-text("Sign in")', 'Sign in button')

  await page.goto('https://app.astruct.io/register', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2500)
  await shot('m-04', 'register', 'initial')
  await tapTarget('button:has-text("Create account")', 'Create account')

  // Anon assistant flow on mobile
  console.log('=== Anon assistant ===')
  await page.goto('https://app.astruct.io/assistant', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(8000)
  await shot('m-05', 'assistant', 'beforeModal')

  try {
    await page.waitForSelector('text=Drop your contract here', { timeout: 30000 })
    await shot('m-06', 'introModal', 'open')
  } catch {
    findings.push({ severity: 'Major', msg: 'Intro modal did not appear on mobile within 30s (possible IP throttle)' })
  }

  // Tap targets in the modal
  await tapTarget('button:has-text("Continue to assistant")', 'Continue to assistant')

  // Upload + go through to assistant
  if (await page.locator('text=Drop your contract here').count()) {
    await page.locator('input[type="file"]').first().setInputFiles(PDF)
    try {
      await page.waitForSelector('text=Auto-filled from your contract', { timeout: 180000 })
      await shot('m-07', 'extracted', 'modal')
      const btn = page.locator('button:has-text("Continue to assistant")').first()
      await btn.scrollIntoViewIfNeeded()
      await btn.click({ force: true })
      await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden', timeout: 8000 }).catch(() => {})
      await page.waitForTimeout(3000)
      await shot('m-08', 'assistant', 'fresh')

      // Hamburger nav
      const ham = page.locator('button[aria-label="Open menu"]')
      if (await ham.count()) {
        const box = await ham.boundingBox()
        if (box && Math.min(box.width, box.height) < 44) {
          findings.push({ severity: 'Major', msg: `Hamburger ${Math.round(box.width)}×${Math.round(box.height)} (< 44px)` })
        }
        await ham.click()
        await page.waitForTimeout(800)
        await shot('m-09', 'hamburger', 'open')
      } else {
        findings.push({ severity: 'Critical', msg: 'No hamburger nav button on mobile assistant page' })
      }

      // Close drawer (tap backdrop or outside)
      await page.locator('div.fixed.inset-0').first().click({ force: true }).catch(() => {})
      await page.waitForTimeout(500)

      // Try sending a message — keyboard appearance test
      const textarea = page.locator('textarea').first()
      const taBox = await textarea.boundingBox().catch(() => null)
      if (taBox && taBox.height < 36) {
        findings.push({ severity: 'Major', msg: `Mobile textarea height ${Math.round(taBox.height)}px — too small for thumb` })
      }
      await textarea.fill('Test from mobile')
      await shot('m-10', 'textarea', 'filledOnMobile')
    } catch (e) {
      findings.push({ severity: 'Major', msg: `Mobile upload extraction failed: ${e.message.slice(0, 100)}` })
    }
  }

  console.log(`\n=== Findings ===`)
  for (const f of findings) console.log(` [${f.severity}] ${f.msg}`)

  await writeFile(
    resolve('test-results/full-coverage/_phase5.json'),
    JSON.stringify({ findings }, null, 2),
  )
} catch (err) {
  console.error('FATAL:', err.message)
  await shot('m-error', 'fatal', 'error')
  process.exitCode = 1
} finally {
  await br.close()
}
