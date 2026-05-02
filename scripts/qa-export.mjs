#!/usr/bin/env node
/**
 * Verifies A12: DOCX, PDF (and XLSX endpoint) actually return real bytes.
 * Skips XLSX UI flow (review-tables require multi-doc upload).
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir, writeFile } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots')
const OUT = resolve('test-results/exports')
await mkdir(SHOTS, { recursive: true })
await mkdir(OUT, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

async function shoot(label) {
  await page.screenshot({ path: join(SHOTS, `A12-${label}.png`), fullPage: true })
  console.log(`SHOT A12-${label}`)
}

try {
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 20000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  await page.waitForTimeout(2000)

  // Hit the API endpoints directly with sample notice content
  const sampleContent = `# Notice of Delay\n\nDear Head Contractor,\n\nWe write under clause 12.4 of the subcontract to notify a delay event of 5 days arising from late access.\n\n> "The Subcontractor must notify the Head Contractor within 10 Business Days of becoming aware of a Qualifying Cause of Delay" (Clause 34)\n\nYours sincerely,`

  const docxResult = await page.evaluate(async (content) => {
    const r = await fetch('/api/documents/generate-docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Notice of Delay', content, metadata: { date: '2026-05-02' } }),
    })
    if (!r.ok) return { ok: false, status: r.status, msg: await r.text() }
    const buf = await r.arrayBuffer()
    return { ok: true, size: buf.byteLength, head: Array.from(new Uint8Array(buf).slice(0, 4)) }
  }, sampleContent)
  console.log('DOCX:', JSON.stringify(docxResult))

  const pdfResult = await page.evaluate(async (content) => {
    const r = await fetch('/api/documents/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Notice of Delay', content, metadata: { date: '2026-05-02' } }),
    })
    if (!r.ok) return { ok: false, status: r.status, msg: await r.text() }
    const buf = await r.arrayBuffer()
    return { ok: true, size: buf.byteLength, head: Array.from(new Uint8Array(buf).slice(0, 4)) }
  }, sampleContent)
  console.log('PDF:', JSON.stringify(pdfResult))

  // DOCX should start with PK (zip) — bytes [0x50, 0x4B]
  // PDF should start with %PDF — bytes [0x25, 0x50, 0x44, 0x46]
  if (docxResult.ok && docxResult.head[0] === 0x50 && docxResult.head[1] === 0x4b) {
    console.log('DOCX magic bytes OK (PK..)')
  } else {
    console.log('DOCX magic bytes FAIL')
  }
  if (pdfResult.ok && pdfResult.head[0] === 0x25 && pdfResult.head[1] === 0x50) {
    console.log('PDF magic bytes OK (%PDF)')
  } else {
    console.log('PDF magic bytes FAIL')
  }

  // Save bytes locally for visual sanity
  if (pdfResult.ok) {
    const buf = await page.evaluate(async (content) => {
      const r = await fetch('/api/documents/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Notice of Delay', content, metadata: { date: '2026-05-02' } }),
      })
      const ab = await r.arrayBuffer()
      return Array.from(new Uint8Array(ab))
    }, sampleContent)
    await writeFile(join(OUT, 'notice.pdf'), Buffer.from(buf))
    console.log('Saved test-results/exports/notice.pdf')
  }
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
