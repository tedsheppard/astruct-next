#!/usr/bin/env node
/**
 * Idempotently create / update the Stripe webhook endpoint that points to
 * the production app. Returns the signing secret so it can be added to
 * environment variables.
 *
 *   STRIPE_SECRET_KEY=sk_live_… node scripts/setup-webhook.mjs
 */
import Stripe from 'stripe'

const SECRET = process.env.STRIPE_SECRET_KEY
if (!SECRET) { console.error('STRIPE_SECRET_KEY required'); process.exit(1) }

const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.astruct.io'
const URL = `${APP_ORIGIN}/api/stripe/webhook`

const EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.updated',
  'payment_method.attached',
]

const stripe = new Stripe(SECRET, { apiVersion: '2026-04-22.dahlia' })

const list = await stripe.webhookEndpoints.list({ limit: 100 })
let endpoint = list.data.find(e => e.url === URL)

if (endpoint) {
  console.log(`✓ Webhook exists: ${endpoint.id}`)
  // Update the events list to make sure we're subscribed to everything we need
  endpoint = await stripe.webhookEndpoints.update(endpoint.id, {
    enabled_events: EVENTS,
    description: 'Astruct production webhook',
  })
  console.log(`  Updated events: ${endpoint.enabled_events.length}`)
  console.log(`! Existing webhooks do not return their signing secret. If you need a new one, delete it in Dashboard and re-run, or copy whsec_… from Dashboard.`)
} else {
  endpoint = await stripe.webhookEndpoints.create({
    url: URL,
    enabled_events: EVENTS,
    api_version: '2026-04-22.dahlia',
    description: 'Astruct production webhook',
    metadata: { astruct_id: 'prod_webhook' },
  })
  console.log(`+ Created webhook: ${endpoint.id}`)
  console.log(`+ URL: ${endpoint.url}`)
  console.log(`+ Signing secret: ${endpoint.secret}`)
  console.log(`\nAdd to env:\n  STRIPE_WEBHOOK_SECRET=${endpoint.secret}\n`)
}
