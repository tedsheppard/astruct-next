/**
 * Pricing: one plan. AU$89.95 a month for the account after the free trial,
 * and the model work on top of it paid either with the reader's own ChatGPT
 * or API key at no extra cost, or with Astruct credits by the token; the fee
 * is the same either way. The numbers are the app's own (lib/site/plans.ts
 * copies them from astruct-app/lib/models/billing.ts and lib/pricing.ts).
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
  description: 'AU$89.95 a month for your account after the free trial. Model work is then paid either with your own ChatGPT or API key at no extra cost, or with Astruct credits by the token.',
}

const FAQ = [
  { q: 'What do I get for AU$89.95 a month?', a: 'Your account, and everything in it: the projects, the contract reading, the claims, the notices, the letters, the vault and the registers, your connected mail and calendar, the work queue that reads them, and your own persistent computer with a real terminal in it. The fee is for the account itself: it is the same price whether the model work runs on your own ChatGPT, on your own API key, or on Astruct credits.' },
  { q: 'Is there really a free trial?', a: 'Yes. Your first project and AU$5 of Astruct credits, with no card. It is the whole product, not a cut-down one: bring a contract in, ask for the claim or the notice, and see what comes back.' },
  { q: 'What does "your own ChatGPT or API key at no extra cost" mean?', a: 'Connect your ChatGPT, or your own OpenAI or Anthropic key, in Settings. The model work then runs on your account: your ChatGPT plan’s own limits apply, or your provider bills you for the API, and Astruct charges nothing by the token on top of the subscription. You can do it on any plan, the free trial included, and it does not change what you pay Astruct.' },
  { q: 'And if I would rather not connect anything?', a: 'Then Astruct runs the models and you pay by the token as Astruct credits, at the rates on this page. Most people end up using both in a month: their ChatGPT for the conversation, and credits for a job it cannot run.' },
  { q: 'What happens when my own ChatGPT allowance runs out?', a: 'Astruct stops and says so, keeping what it had written. You can wait for the allowance to reset, buy more from OpenAI, or finish that task on Astruct credits, which are then charged by the token. You choose in advance which of those it should do.' },
  { q: 'Can I cancel?', a: 'Any time. The subscription runs to the end of the period you have paid for and does not renew, and nothing is deleted: your projects, documents and keys stay where they are.' },
  { q: 'I am already on a Plus, Pro or Max plan.', a: 'Nothing changes for you. Those plans keep working exactly as they are, with the same limits, until you cancel them; Settings marks yours as a legacy plan so you can see which one you are on.' },
]

export default function PricingPage() {
  return (
    <AxRoot>
      <AxHeader />

      <section className="ax-sec ax-sec-first is-in">
        <div className="ax-page-head ax-page-head-mid">
          <span className="ax-pill"><i />Pricing</span>
          <h1>One plan. Your own ChatGPT, or ours.</h1>
          <p className="ax-lede">AU$89.95 a month for your account after the free trial. Model work is then paid either with your own ChatGPT or API key at no extra cost, or with Astruct credits by the token. Free to start, with no card.</p>
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
