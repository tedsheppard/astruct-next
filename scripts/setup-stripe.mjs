#!/usr/bin/env node
/**
 * Idempotent Stripe provisioning. Run once per environment.
 *
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe.mjs
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe.mjs
 *
 * Re-runnable: every Stripe object is keyed by `lookup_key` or `metadata.id`,
 * so subsequent runs check-then-create rather than duplicating.
 *
 * Outputs the created/found IDs to /docs/stripe-provisioning-output.json
 * for the founder's reference.
 */

import Stripe from 'stripe'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'

const SECRET = process.env.STRIPE_SECRET_KEY
if (!SECRET) {
  console.error('STRIPE_SECRET_KEY env is required.')
  console.error('  Test mode: get sk_test_... from https://dashboard.stripe.com/test/apikeys')
  console.error('  Live mode: get sk_live_... from https://dashboard.stripe.com/apikeys')
  process.exit(1)
}

const isLive = SECRET.startsWith('sk_live_')
console.log(`\nProvisioning Stripe in ${isLive ? 'LIVE' : 'TEST'} mode...\n`)

const stripe = new Stripe(SECRET, { apiVersion: '2025-09-30.clover' })

// ─── Helpers ─────────────────────────────────────────────────────────────
async function findPriceByLookupKey(lookupKey) {
  const list = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 })
  return list.data[0] || null
}

async function findProductByMetadataId(id) {
  const list = await stripe.products.search({ query: `metadata['astruct_id']:'${id}'` })
  return list.data[0] || null
}

// ─── Step 1+2: Base price + Product ─────────────────────────────────────
// Find the base price first (single source of truth) and use its product.
// This is robust to prior partial runs that may have left an orphan product.
let basePrice = await findPriceByLookupKey('pro_contract_monthly_aud')
let product
if (basePrice) {
  console.log(`✓ Base price exists: ${basePrice.id}`)
  const productId = typeof basePrice.product === 'string' ? basePrice.product : basePrice.product.id
  product = await stripe.products.retrieve(productId)
  console.log(`✓ Using product from base price: ${product.id}`)
} else {
  // No base price yet — find or create the product, then create the price.
  product = await findProductByMetadataId('pro_contract')
  if (product) {
    console.log(`✓ Product exists: ${product.id}`)
  } else {
    product = await stripe.products.create({
      name: 'Astruct Pro Contract',
      description: 'One contract slot with included AI usage. Generous allowance + per-token overage.',
      metadata: { astruct_id: 'pro_contract', tier: 'pro_contract' },
      tax_code: 'txcd_10000000',
    })
    console.log(`+ Created product: ${product.id}`)
  }
  basePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 2995,
    currency: 'aud',
    recurring: { interval: 'month' },
    tax_behavior: 'inclusive',
    lookup_key: 'pro_contract_monthly_aud',
    metadata: { type: 'base' },
  })
  console.log(`+ Created base price: ${basePrice.id}`)
}

// ─── Step 3a: Meter for token overage ─────────────────────────────────
// Stripe billing meters (introduced 2025-03-31) replace the legacy
// "metered" usage_type. Idempotent: look up by event_name first.
const meterEventName = 'astruct_token_units'
let meter = null
try {
  const list = await stripe.billing.meters.list({ status: 'active', limit: 100 })
  meter = list.data.find(m => m.event_name === meterEventName) || null
} catch {/* ignore */}
if (meter) {
  console.log(`✓ Meter exists: ${meter.id} (event: ${meterEventName})`)
} else {
  meter = await stripe.billing.meters.create({
    display_name: 'Astruct token units (10k tokens)',
    event_name: meterEventName,
    default_aggregation: { formula: 'sum' },
    customer_mapping: { type: 'by_id', event_payload_key: 'stripe_customer_id' },
    value_settings: { event_payload_key: 'value' },
  })
  console.log(`+ Created meter: ${meter.id} (event: ${meterEventName})`)
}

// ─── Step 3b: Metered overage price backed by the meter ──────────────
let overagePrice = await findPriceByLookupKey('pro_contract_overage_aud')
if (overagePrice) {
  const ovProductId = typeof overagePrice.product === 'string' ? overagePrice.product : overagePrice.product.id
  if (ovProductId !== product.id) {
    // Orphan — deactivate, drop the lookup_key, recreate under canonical product
    console.log(`! Overage price ${overagePrice.id} is on the wrong product — archiving and recreating`)
    await stripe.prices.update(overagePrice.id, { active: false, lookup_key: null })
    overagePrice = null
  } else {
    console.log(`✓ Overage price exists: ${overagePrice.id}`)
  }
}
if (!overagePrice) {
  overagePrice = await stripe.prices.create({
    product: product.id,
    currency: 'aud',
    recurring: {
      interval: 'month',
      usage_type: 'metered',
      meter: meter.id,
    },
    billing_scheme: 'per_unit',
    unit_amount: 10, // $0.10 per 10k-token unit
    tax_behavior: 'inclusive',
    lookup_key: 'pro_contract_overage_aud',
    transfer_lookup_key: true,
    metadata: { type: 'overage', tokens_per_unit: '10000', meter_event_name: meterEventName },
  })
  console.log(`+ Created overage price: ${overagePrice.id}`)
}

// ─── Step 4: Customer Portal config ────────────────────────────────────
const baseUrl = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.astruct.io'
const marketingUrl = baseUrl.replace('app.', '')
const portalConfigList = await stripe.billingPortal.configurations.list({ is_default: true, limit: 1 })
let portalConfig = portalConfigList.data[0]
const portalParams = {
  business_profile: {
    privacy_policy_url: `${marketingUrl}/privacy`,
    terms_of_service_url: `${marketingUrl}/terms`,
    headline: 'Astruct billing',
  },
  features: {
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    customer_update: { enabled: true, allowed_updates: ['email', 'name', 'address'] },
    subscription_cancel: {
      enabled: true,
      mode: 'at_period_end',
      cancellation_reason: {
        enabled: true,
        options: ['too_expensive', 'missing_features', 'switched_service', 'unused', 'other'],
      },
    },
    subscription_update: {
      enabled: true,
      default_allowed_updates: ['quantity'],
      products: [{ product: product.id, prices: [basePrice.id] }],
      proration_behavior: 'create_prorations',
    },
  },
  default_return_url: `${baseUrl}/settings/billing`,
}
if (portalConfig) {
  portalConfig = await stripe.billingPortal.configurations.update(portalConfig.id, portalParams)
  console.log(`✓ Updated portal config: ${portalConfig.id}`)
} else {
  // Stripe API: `default: true` is not a valid create-time parameter (only set
  // via update). Fresh accounts get the first config as default automatically.
  portalConfig = await stripe.billingPortal.configurations.create(portalParams)
  console.log(`+ Created portal config: ${portalConfig.id}`)
}

// ─── Step 5: Tax registration check ────────────────────────────────────
try {
  const regs = await stripe.tax.registrations.list({ status: 'active', limit: 100 })
  const auReg = regs.data.find(r => r.country === 'AU')
  if (auReg) {
    console.log(`✓ AU GST registration active (${auReg.id})`)
  } else {
    console.log('! AU GST registration NOT found.')
    console.log('  Stripe Tax must be enabled and AU registered for $29.95-inclusive pricing to charge correctly.')
    console.log('  https://dashboard.stripe.com/tax/registrations')
  }
} catch (e) {
  console.log(`! Could not check Stripe Tax registrations: ${e.message}`)
}

// ─── Output ─────────────────────────────────────────────────────────────
const output = {
  mode: isLive ? 'live' : 'test',
  generated_at: new Date().toISOString(),
  product_id: product.id,
  base_price_id: basePrice.id,
  base_price_lookup_key: basePrice.lookup_key,
  overage_price_id: overagePrice.id,
  overage_price_lookup_key: overagePrice.lookup_key,
  meter_id: meter.id,
  meter_event_name: meterEventName,
  portal_config_id: portalConfig.id,
}
const outFile = resolve(`docs/stripe-provisioning-output.${isLive ? 'live' : 'test'}.json`)
await writeFile(outFile, JSON.stringify(output, null, 2))
console.log(`\nWrote ${outFile}\n`)

console.log('Add the following to your environment:')
console.log(`  STRIPE_SECRET_KEY=${SECRET.slice(0, 12)}...`)
console.log(`  STRIPE_PRICE_BASE=${basePrice.id}`)
console.log(`  STRIPE_PRICE_OVERAGE=${overagePrice.id}`)
console.log(`  STRIPE_PRODUCT_PRO=${product.id}`)
console.log(`  # webhook secret comes from \`stripe listen\` (test) or your dashboard webhook (live):`)
console.log(`  STRIPE_WEBHOOK_SECRET=whsec_...\n`)
