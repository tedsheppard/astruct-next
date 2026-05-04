import { chromium } from 'playwright'
import Stripe from 'stripe'
import { readFileSync } from 'fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf-8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)] }))
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
const cust = await stripe.customers.create({ email: 'inspect3@gmail.com' })
const session = await stripe.checkout.sessions.create({
  mode: 'subscription', customer: cust.id,
  line_items: [{ price: env.STRIPE_PRICE_BASE, quantity: 1 }, { price: env.STRIPE_PRICE_OVERAGE }],
  automatic_tax: { enabled: false },
  success_url: 'http://localhost:3000/?ok=1', cancel_url: 'http://localhost:3000/?cancel=1',
})
const br = await chromium.launch({ headless: true })
const page = await br.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())
await page.goto(session.url)
await page.waitForTimeout(5000)
await page.locator('button[data-testid="card-accordion-item-button"]').click()
await page.waitForTimeout(2500)
const dom = await page.evaluate(() => Array.from(document.querySelectorAll('input')).map(el => ({ id: el.id, name: el.getAttribute('name'), type: el.type || '', placeholder: el.placeholder || '' })).filter(x => x.id || x.name))
console.log(JSON.stringify(dom, null, 2))
await br.close()
