import { chromium } from 'playwright'
import Stripe from 'stripe'
import { readFileSync } from 'fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf-8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)] }))
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
const cust = await stripe.customers.create({ email: 'inspect5@gmail.com' })
const session = await stripe.checkout.sessions.create({
  mode: 'subscription', customer: cust.id,
  line_items: [{ price: env.STRIPE_PRICE_BASE, quantity: 1 }, { price: env.STRIPE_PRICE_OVERAGE }],
  automatic_tax: { enabled: false },
  success_url: 'http://localhost:3000/?ok=1', cancel_url: 'http://localhost:3000/?cancel=1',
})
const br = await chromium.launch({ headless: true })
const page = await br.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())
await page.goto(session.url)
await page.waitForTimeout(7000)
// Force click the card radio
await page.locator('#payment-method-accordion-item-title-card').click({ force: true })
await page.waitForTimeout(3000)
await page.screenshot({ path: 'test-results/stripe-e2e/_inspect5-after-card.png', fullPage: true })
const dom = await page.evaluate(() => Array.from(document.querySelectorAll('input')).map(el => ({ id: el.id, name: el.getAttribute('name'), type: el.type, placeholder: el.placeholder, visible: el.offsetParent !== null })).filter(i => i.visible))
console.log('VISIBLE INPUTS AFTER FORCE CLICK:', JSON.stringify(dom, null, 2))
await br.close()
