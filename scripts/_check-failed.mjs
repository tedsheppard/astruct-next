import Stripe from 'stripe'
import { readFileSync } from 'fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf-8').split('\n').filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)] }))
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
const subs = await stripe.subscriptions.list({ limit: 20 })
console.log('Subscriptions in test mode:')
for (const s of subs.data) {
  console.log(`  ${s.id} status=${s.status} customer=${s.customer} email=${s.metadata?.supabase_user_id || ''} created=${new Date(s.created * 1000).toISOString()}`)
}
console.log('\nRecent customers:')
const cs = await stripe.customers.list({ limit: 10 })
for (const c of cs.data) console.log(`  ${c.id} ${c.email}`)
console.log('\nRecent invoices:')
const inv = await stripe.invoices.list({ limit: 5 })
for (const i of inv.data) {
  console.log(`  ${i.id} status=${i.status} amount_paid=${i.amount_paid} customer=${i.customer}`)
  console.log(`    has charge field: ${!!i.charge} (deprecated)`)
  console.log(`    payments.data: ${(i.payments?.data || []).length}`)
  if (i.payments?.data?.length) {
    for (const p of i.payments.data) console.log(`      payment: ${p.payment?.payment_intent} charge=${p.payment?.charge}`)
  }
}
