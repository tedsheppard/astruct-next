/**
 * Pricing: the two ways Astruct is sold. Pay as you go on Astruct credits
 * (the tiers, metered by tokens), or bring your own ChatGPT or API key and
 * pay a flat AU$149.95 a month for the platform with no token charges at all.
 * The numbers are the app's own (lib/site/plans.ts copies them from
 * astruct-app/lib/pricing.ts and astruct-app/lib/models/billing.ts).
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { AxRoot, AxHeader, AxFooter } from '@/components/site/ax-chrome'
import { startFreeHref, DEMO_HREF } from '@/lib/site/brand'
import Plans from './plans'
import '../landing/landing.css'
import '../ax-pages.css'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Free to start. Pay as you go on Astruct credits from AU$59 a month, or bring your own ChatGPT or API key for a flat AU$149.95 a month with no token charges.',
}

const FAQ = [
  { q: 'Is there really a free plan?', a: 'Yes. You start with AU$5 of included usage, once, and no credit card. It is the whole product, not a cut-down one: bring a contract in, ask for the claim or the notice, and see what comes back.' },
  { q: 'What is the difference between the two ways of paying?', a: 'On Astruct credits, Astruct pays the model bills and meters your work by tokens against your plan, the way ChatGPT and Claude do. On your own account, you connect your own ChatGPT or your own OpenAI or Anthropic key, the provider bills you for the model work, and you pay Astruct a flat AU$149.95 a month with no token charges at all.' },
  { q: 'Which one is cheaper for me?', a: 'If you already pay for ChatGPT or run an API account, your own account usually is: you are not paying twice for the same tokens. If you would rather one bill and no second account to think about, Astruct credits are simpler. You can move between the two whenever you like.' },
  { q: 'What happens when my own ChatGPT allowance runs out?', a: 'Astruct stops and says so, keeping what it had written. You can wait for the allowance to reset, buy more from OpenAI, or finish that task on Astruct credits, which are then metered by tokens as usual. You choose in advance which of those it should do.' },
  { q: 'Can I change plans later?', a: 'Yes. Move up or down a tier at any time, or switch between Astruct credits and your own account. Leaving the own-account plan takes effect at the end of the period you have paid for.' },
  { q: 'What happens if I go over my limits?', a: 'On a paid tier the work carries on as pay as you go beyond the weekly allowance, at the rate shown in Settings. On the free allowance it stops and asks you to choose a plan, so nothing is ever charged without you deciding to.' },
]

export default function PricingPage() {
  return (
    <AxRoot>
      <AxHeader />

      <section className="ax-sec ax-sec-first is-in">
        <div className="ax-page-head ax-page-head-mid">
          <span className="ax-pill"><i />Pricing</span>
          <h1>Two ways to pay. Same Astruct.</h1>
          <p className="ax-lede">Free to start, with no card. Then either pay as you go on Astruct credits, or bring your own ChatGPT or API key and pay a flat fee for the platform with no token charges at all.</p>
        </div>
        <Plans />
      </section>

      <section className="ax-sec is-in" style={{ paddingTop: 0 }}>
        <div className="ax-two">
          <div className="ax-sub-head">
            <span className="ax-pill"><i />Questions</span>
            <h2>Pricing questions</h2>
            <p>If yours is not here, ask us and we will answer it properly.</p>
          </div>
          <div className="ax-faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ax-sec ax-close is-in" style={{ paddingTop: 0 }}>
        <h2>Start on your first contract.</h2>
        <p className="ax-lede" style={{ maxWidth: 560, margin: '16px auto 0' }}>Bring one contract in and see the claim, the notice and the letter come back finished.</p>
        <div className="ax-cta">
          <a className="ax-btn ax-btn-primary" href={startFreeHref()}>Start your free trial</a>
          <Link className="ax-btn ax-btn-ghost" href={DEMO_HREF}>Book a demo</Link>
        </div>
        <p className="ax-fine">No credit card to start. Australian data, held in Sydney.</p>
      </section>

      <AxFooter />
    </AxRoot>
  )
}
