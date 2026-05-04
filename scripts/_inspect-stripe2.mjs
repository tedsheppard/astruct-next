import { chromium } from 'playwright'
import Stripe from 'stripe'
import { readFileSync } from 'fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf-8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)] }))
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
const cust = await stripe.customers.create({ email: 'inspect2@gmail.com' })
const session = await stripe.checkout.sessions.create({
  mode: 'subscription', customer: cust.id,
  line_items: [{ price: env.STRIPE_PRICE_BASE, quantity: 1 }, { price: env.STRIPE_PRICE_OVERAGE }],
  automatic_tax: { enabled: false },
  success_url: 'http://localhost:3000/?ok=1',
  cancel_url: 'http://localhost:3000/?cancel=1',
})
const br = await chromium.launch({ headless: true })
const page = await br.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())
await page.goto(session.url)
await page.waitForTimeout(5000)
await page.locator('#payment-method-accordion-item-title-card').click()
await page.waitForTimeout(2500)
const dom = await page.evaluate(() => {
  const out = []
  document.querySelectorAll('input').forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return
    out.push({ id: el.id, name: el.getAttribute('name'), type: el.type || '', placeholder: el.placeholder || '', autoc: el.autocomplete || '' })
  })
  return out
})
console.log(JSON.stringify(dom, null, 2))
await page.screenshot({ path: 'test-results/stripe-e2e/_inspect-card-expanded.png', fullPage: true })
await br.close()
