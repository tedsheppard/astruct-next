/**
 * Pricing. The same plans and the same prices as before, on the site's own
 * chrome: the switch between the two sides of the chain, the three plans,
 * then the questions people ask about them.
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
  description: 'Free to start. Plans for subcontractors making claims and for head contractors assessing them.',
}

const FAQ = [
  { q: 'Is there really a free plan?', a: 'Yes. Subcontractors can start free on their first project, with no credit card. It includes compliant claims, the statutory endorsement and deadline tracking.' },
  { q: 'How is pricing structured for head contractors?', a: 'Head-contractor plans scale with the number of contracts and assessors you run, with custom enterprise pricing for larger builders. Book a demo and we will size it to your projects.' },
  { q: 'Can I change plans later?', a: 'Yes. You can upgrade or change plans as your needs change.' },
  { q: 'Do both parties pay?', a: 'Each organisation has its own plan. A subcontractor on the free plan can still work in a shared workspace created by a head contractor.' },
]

export default function PricingPage() {
  return (
    <AxRoot>
      <AxHeader />

      <section className="ax-sec ax-sec-first is-in">
        <div className="ax-page-head ax-page-head-mid">
          <span className="ax-pill"><i />Pricing</span>
          <h1>Simple pricing for both sides of the chain.</h1>
          <p className="ax-lede">Free to start. Plans scale with the work you do, whether you make claims or assess them.</p>
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
        <h2>Start on your first project.</h2>
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
