/**
 * The two ways Astruct is sold, for the pricing page. Every number here is
 * copied from the app's own definitions and must not be changed here alone:
 *
 *   astruct-app/lib/pricing.ts     PLANS (priceAud 59 / 199 / 399, the Pro and
 *                                  Max multipliers 5 and 20) and
 *                                  FREE_TRIAL_CAP_MICROS (AU$5, once)
 *   astruct-app/lib/models/billing.ts  OWN_ACCOUNT_AUD (149.95)
 *
 * Track A is metered by tokens on the tiers; track B is a flat platform fee
 * with no token charges at all (astruct-app/docs/BILLING.md).
 */

export type CreditTier = {
  id: 'free' | 'plus' | 'pro' | 'max'
  name: string
  price: string
  cadence?: string
  blurb: string
  featured?: boolean
  features: string[]
}

/** Track A: Astruct pays the model bills and charges by tokens on the tiers. */
export const CREDIT_TIERS: CreditTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    blurb: 'Bring a contract in and see the work come back.',
    features: [
      'AU$5 of included usage, once',
      'The whole product: claims, notices, letters, the vault',
      'Your own persistent computer',
      'No credit card to start',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$59',
    cadence: '/month',
    blurb: 'For one contract administrator running live jobs.',
    features: [
      'A rolling 5-hour limit and a weekly limit',
      'Pay as you go beyond the week',
      'Connected mail, calendar and drive',
      'Everything in Free',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$199',
    cadence: '/month',
    featured: true,
    blurb: 'For a busy desk across several projects.',
    features: [
      'Five times the usage of Plus',
      'The same rolling 5-hour and weekly limits, five times larger',
      'Pay as you go beyond the week',
      'Everything in Plus',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    price: '$399',
    cadence: '/month',
    blurb: 'For a contracts team, or the heaviest single desk.',
    features: [
      'Twenty times the usage of Plus',
      'The strongest intelligence on the longest documents',
      'Pay as you go beyond the week',
      'Everything in Pro',
    ],
  },
]

/** Track B: the customer's own model account, and a flat fee for Astruct. */
export const OWN_ACCOUNT_AUD = 149.95
export const OWN_ACCOUNT_PRICE = `AU$${OWN_ACCOUNT_AUD.toFixed(2)} a month`
export const OWN_ACCOUNT_FEATURES = [
  'Everything in the product, on every project',
  'Your own persistent computer, always there',
  'Your own ChatGPT, or your own OpenAI or Anthropic key',
  'No token charges at all',
  'Cancel any time',
]
export const OWN_ACCOUNT_NOTE =
  'Your ChatGPT runs on your ChatGPT plan’s own limits, and an API key is billed to you by the provider. Astruct charges the platform fee and nothing else.'

/** The lowest paid price, for the home page’s fine print. */
export const LOWEST_PAID_AUD = 59
