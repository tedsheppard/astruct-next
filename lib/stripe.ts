import Stripe from 'stripe'

let cached: Stripe | null = null

export function getStripe(): Stripe {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY missing. Run scripts/setup-stripe.mjs and add the key to .env.local.',
    )
  }
  cached = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })
  return cached
}

export const STRIPE_PRICE_BASE = process.env.STRIPE_PRICE_BASE || ''
export const STRIPE_PRICE_OVERAGE = process.env.STRIPE_PRICE_OVERAGE || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && !!STRIPE_PRICE_BASE && !!STRIPE_PRICE_OVERAGE
}

/** One billing unit = 10,000 tokens. Round up partial units. */
export function tokensToOverageUnits(tokens: number): number {
  if (tokens <= 0) return 0
  return Math.ceil(tokens / 10000)
}

/** Per-contract included token allowance (input + output combined). */
export const INCLUDED_TOKENS_PER_CONTRACT = 2_500_000

/** Default overage cap in cents ($200 AUD). */
export const DEFAULT_OVERAGE_CAP_CENTS = 20_000
