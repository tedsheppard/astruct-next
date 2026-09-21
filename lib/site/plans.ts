/**
 * What Astruct costs, for the pricing page. One subscription for the account
 * itself, and then the model work paid either with the reader's own ChatGPT
 * or API key, at no extra cost, or with Astruct credits by the token. The fee
 * has no nexus to which of those they choose.
 *
 * Every number here is the app's own and must not be changed here alone:
 *
 *   astruct-app/lib/models/billing.ts  PLATFORM_AUD (89.95) and PLATFORM_COPY
 *   astruct-app/lib/usage.ts           FREE_TRIAL_CAP_MICROS (AU$5 of credits)
 *   astruct-app/lib/pricing.ts         MODEL_RATES, AUD_PER_USD (1.55) and
 *                                      MARGIN (3.5), which give the credit
 *                                      rates below: USD rate x 1.55 x 3.5
 *   astruct-app/lib/agent/model-mix.ts which model each intelligence level
 *                                      uses (Efficient: Luna; Advanced:
 *                                      Terra; Expert: Sol; Maximum: Astra,
 *                                      with Fable writing)
 */

/** The one subscription. */
export const PLATFORM_AUD = 89.95
export const PLATFORM_PRICE = `AU$${PLATFORM_AUD.toFixed(2)} a month`
/** The sentence, as the app says it (PLATFORM_COPY). */
export const PLATFORM_COPY =
  'AU$89.95 a month for your account after the free trial. Model work is then paid either with your own ChatGPT or API key at no extra cost, or with Astruct credits by the token.'
/** The free trial, as the gate actually applies it. */
export const TRIAL_LINE = 'Free to start: your first project and AU$5 of Astruct credits, with no card.'

export const PLATFORM_INCLUDES = [
  'Everything in the product: claims, notices, letters, the vault, the registers',
  'Your own persistent computer, always there, with a real terminal',
  'Connected mail, calendar and drive, and the work queue that reads them',
  'Model work on your own ChatGPT or API key at no extra cost, on any plan',
  'Or Astruct credits by the token, at the rates below',
  'Cancel any time',
]

export const OWN_ACCOUNT_NOTE =
  'The subscription pays for the account. The model work on top of it is paid either way, and the choice costs nothing: connect your own ChatGPT or API key on any plan, including the free trial, and there are no token charges at all; or let Astruct run the models and pay by the token. If your own allowance runs out part way through a task, Astruct stops and asks: wait, buy more from the provider, or finish that task on Astruct credits.'

/** Astruct credits, per million tokens in Australian dollars, by the
 *  intelligence level the desk shows. Provider rate x 1.55 x 3.5. */
export type CreditRate = { level: string; model: string; input: string; output: string }
export const CREDIT_RATES: CreditRate[] = [
  { level: 'Efficient', model: 'for everyday work', input: '$6.78', output: '$54.25' },
  { level: 'Advanced', model: 'for detailed project work', input: '$13.56', output: '$108.50' },
  { level: 'Expert', model: 'for drafting and analysis', input: '$27.13', output: '$217.00' },
  { level: 'Maximum', model: 'the strongest available', input: '$54.25', output: '$271.25' },
]
export const CREDIT_NOTE =
  'Per million tokens, in Australian dollars. Reading a document Astruct has already read is charged at a tenth of the input rate, so a long contract is paid for once. A task pauses and asks before it runs up a bill.'
