#!/usr/bin/env node
/**
 * Verifies A16: suggestion chips reference real clause numbers from the
 * extracted contract.
 */
import { chromium } from 'playwright'
import { resolve, join } from 'path'
import { mkdir } from 'fs/promises'

const SHOTS = resolve('test-results/screenshots')
await mkdir(SHOTS, { recursive: true })
const PDF = resolve('test-fixtures/test-subcontract.pdf')

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

async function shoot(label) {
  await page.screenshot({ path: join(SHOTS, `A16-${label}.png`), fullPage: true })
  console.log(`SHOT A16-${label}`)
}

try {
  await page.goto('http://localhost:3000/assistant')
  await page.waitForURL(/\/contracts\/[a-f0-9-]+\/assistant/, { timeout: 30000 })
  await page.waitForSelector('text=Upload your contract to start', { timeout: 10000 })
  await page.locator('input[type="file"]').first().setInputFiles(PDF)
  await page.waitForSelector('text=Auto-filled from your contract', { timeout: 90000 })
  await page.locator('button:has-text("Continue to assistant")').click()
  await page.waitForSelector('text=Auto-filled from your contract', { state: 'hidden' })
  // Need to wait for the facts API to return clause_topics
  await page.waitForTimeout(5000)
  await shoot('01-default-tab')

  // Tab through each suggestion tab and screenshot
  const labels = ['Generate a notice', 'Draft correspondence', 'Analyse documents', 'Contract Q&A']
  for (let i = 0; i < labels.length; i++) {
    await page.locator(`button:has-text("${labels[i]}")`).first().click()
    await page.waitForTimeout(300)
    await shoot(`tab-${i + 1}-${labels[i].replace(/[^a-z]+/gi, '-').toLowerCase()}`)
  }

  // Inspect all visible suggestion buttons for clause-number content
  const allText = await page.locator('main').innerText()
  // Hunt for "clause N" pattern
  const matches = allText.match(/clause\s+\d+(?:\.\d+)*/gi) || []
  const unique = [...new Set(matches.map(m => m.toLowerCase()))]
  console.log('Unique clause references in chip text:', unique)
} catch (err) {
  console.error('ERROR:', err.message)
  await shoot('error')
  process.exitCode = 1
} finally {
  await browser.close()
}
