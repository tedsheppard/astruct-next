import type { Metadata } from 'next'
import { PricingCards } from '@/components/mk/pricing'
import { Faq, faqJsonLd, type QA } from '@/components/mk/faq'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'AU$89.95 per user per month, ex GST, with 100 credits per user per month included. Start with a 30-day free trial and 100 credits. No card needed.',
  alternates: { canonical: '/pricing' },
}

const ITEMS: QA[] = [
  {
    q: 'What is included in the subscription?',
    text: 'Everything in Astruct: live mailbox and SharePoint connections, the issue register, deadlines from your contract, evidence and prepared notices. Each user’s subscription includes 100 credits a month.',
    a: <p>Everything in Astruct: live mailbox and SharePoint connections, the issue register, deadlines from your contract, evidence and prepared notices. Each user’s subscription includes 100 credits a month.</p>,
  },
  {
    q: 'What uses credits?',
    text: 'Credits measure the model work Astruct does for you: reading new mail and documents as they arrive, checking them for issues, answering questions and preparing notices. Billing and credits shows what used them.',
    a: <p>Credits measure the model work Astruct does for you: reading new mail and documents as they arrive, checking them for issues, answering questions and preparing notices. Billing and credits shows what used them.</p>,
  },
  {
    q: 'How does pooling work?',
    text: 'Included credits are pooled across your organisation. A team of five has 500 credits a month to share, however the work falls between them.',
    a: <p>Included credits are pooled across your organisation. A team of five has 500 credits a month to share, however the work falls between them.</p>,
  },
  {
    q: 'What if we use more than our included credits?',
    text: 'Astruct keeps working, and extra credits are charged at AU$1.00 each, billed monthly. You can see usage at any time in Billing and credits.',
    a: <p>Astruct keeps working, and extra credits are charged at AU$1.00 each, billed monthly. You can see usage at any time in Billing and credits.</p>,
  },
  {
    q: 'Do we need a card for the trial?',
    text: 'No. The trial runs for 30 days with 100 credits. At the end you choose whether to subscribe. Nothing is charged unless you do.',
    a: <p>No. The trial runs for 30 days with 100 credits. At the end you choose whether to subscribe. Nothing is charged unless you do.</p>,
  },
  {
    q: 'Are prices in Australian dollars?',
    text: 'Yes. All prices are in Australian dollars and exclude GST.',
    a: <p>Yes. All prices are in Australian dollars and exclude GST.</p>,
  },
]

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ITEMS)) }} />
      <section className="mk-page-head">
        <div className="mk-wrap">
          <span className="mk-kicker">Pricing</span>
          <h1 className="mk-h1" style={{ fontSize: 'clamp(48px, 7.4vw, 96px)' }}>One plan.<br />Start free.</h1>
          <p className="mk-lede">Try Astruct on a live project for 30 days with 100 credits. No card needed. Then one price per user, with credits included.</p>
        </div>
      </section>
      <section style={{ paddingBottom: 'clamp(96px, 12vw, 160px)' }}>
        <div className="mk-wrap" style={{ marginTop: -48 }}>
          <PricingCards />
        </div>
      </section>
      <section className="mk-sec mk-alt">
        <div className="mk-wrap mk-narrow">
          <h2 className="mk-h2">Pricing questions</h2>
          <Faq items={ITEMS} />
        </div>
      </section>
    </>
  )
}
