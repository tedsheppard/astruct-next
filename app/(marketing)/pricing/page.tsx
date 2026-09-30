import type { Metadata } from 'next'
import { PricingCards } from '@/components/mk/pricing'
import { Faq, faqJsonLd, type QA } from '@/components/mk/faq'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'AU$89.95 per user per month, ex GST, with 100 credits per user per month included. Start with a 30-day free trial and 100 credits. Card required, not charged during the trial, and we email you 5 days before it ends.',
  alternates: { canonical: '/pricing' },
}

function item(q: string, text: string): QA {
  return { q, text, a: <p>{text}</p> }
}

const ITEMS: QA[] = [
  item('How does the free trial work?', 'The trial runs for 30 days and includes 100 credits. You add a card when you sign up so there is no gap if you keep going, and it is not charged during the trial. We’ll email you 5 days before your trial ends. If you do nothing, the subscription starts at AU$89.95 per user per month, ex GST.'),
  item('How do I cancel?', 'Cancel any time in Settings > Billing. Cancel before your trial ends and you are not charged at all.'),
  item('What is included in the subscription?', 'Everything in Astruct: Ask, Search, Draft and the agent that watches your mail, up to 5,000 documents per project, and your Outlook, SharePoint and OneDrive connections. Each user’s subscription includes 100 credits a month.'),
  item('What uses credits?', 'Credits measure the AI work Astruct does for you: answering questions, reading new mail and documents as they arrive, checking them for directions and delays, and drafting. Settings > Billing shows what used them.'),
  item('How does pooling work?', 'Included credits are pooled across your organisation. A team of five has 500 credits a month to share, however the work falls between them.'),
  item('What if we use more than our included credits?', 'Astruct keeps working, and extra credits are charged at AU$1.00 each, billed monthly. You can see usage at any time in Settings > Billing.'),
  item('How do seats work?', 'Each person in your organisation who uses Astruct is a seat, at AU$89.95 per month, ex GST, with 100 credits added to the shared pool. Owners and admins add and remove people in Team.'),
  item('Are prices in Australian dollars?', 'Yes. All prices are in Australian dollars and exclude GST.'),
]

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ITEMS)) }} />
      <section className="mk-page-head">
        <div className="mk-wrap">
          <h1 className="mk-h1" style={{ fontSize: 'clamp(48px, 7.4vw, 96px)' }}>One plan.<br />Start free.</h1>
          <p className="mk-lede">Try Astruct on a live project for 30 days with 100 credits. Your card is not charged during the trial, and we’ll email you 5 days before it ends. Then one price per user, with credits included.</p>
        </div>
      </section>
      <section style={{ paddingBottom: 'clamp(96px, 12vw, 160px)' }}>
        <div className="mk-wrap" style={{ marginTop: -48 }}>
          <PricingCards onPricingPage />
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
