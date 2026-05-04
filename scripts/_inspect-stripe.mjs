import { chromium } from 'playwright'
import Stripe from 'stripe'
import { readFileSync } from 'fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf-8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)] }))
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })

// Build a quick checkout session directly
const cust = await stripe.customers.create({ email: 'inspect@gmail.com', metadata: { supabase_user_id: 'fake-user-id' } })
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  customer: cust.id,
  line_items: [{ price: env.STRIPE_PRICE_BASE, quantity: 1 }, { price: env.STRIPE_PRICE_OVERAGE }],
  automatic_tax: { enabled: false },
  success_url: 'http://localhost:3000/?ok=1',
  cancel_url: 'http://localhost:3000/?cancel=1',
})
console.log('Checkout URL:', session.url)

const br = await chromium.launch({ headless: true })
const page = await br.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage())
await page.goto(session.url)
await page.waitForTimeout(5000)
// Dump every input + label + button-with-role
const dom = await page.evaluate(() => {
  const out = []
  document.querySelectorAll('input, button, label').forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return
    out.push({ tag: el.tagName, type: el.type || '', id: el.id, name: el.getAttribute('name'), value: (el.tagName === 'INPUT' ? el.value : ''), text: (el.textContent || '').trim().slice(0, 40), placeholder: el.placeholder || '' })
  })
  return out
})
console.log(JSON.stringify(dom, null, 2))
await br.close()
