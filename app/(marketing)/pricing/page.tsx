import type { Metadata } from 'next'
import { PricingCards } from '@/components/mk/pricing'
import { Faq, faqJsonLd, type QA } from '@/components/mk/faq'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'AU$199 per project, per month, ex GST, with unlimited users. Projects 2–5 AU$179 each, 6–15 AU$159, 16–30 AU$139, 31 and over AU$119. 30-day free trial; card required, not charged during the trial.',
  alternates: { canonical: '/pricing' },
}

function item(q: string, text: string): QA {
  return { q, text, a: <p>{text}</p> }
}

const ITEMS: QA[] = [
  item('How does per-project pricing work?', 'Each project you run in Astruct, with its contract, documents and mail, is billed monthly. The first project is AU$199, projects 2–5 are AU$179 each, 6–15 are AU$159 each, 16–30 are AU$139 each, and every project from the 31st is AU$119.'),
  item('Does every project drop to the lower price?', 'No. Each project is charged at the rate for its band. With 8 projects you pay AU$199 for the first, AU$179 for each of the next four and AU$159 for each of the last three: AU$199 + AU$716 + AU$477 = AU$1,392 a month, an average of AU$174 per project.'),
  item('How many users can we add?', 'As many as you like. Every user in your company account is included at no extra cost, on every project.'),
  item('What is included with each project?', 'Everything in Astruct: Search, Ask, Draft and the agent that watches project mail, up to 10,000 documents, your Outlook, SharePoint and OneDrive connections (Gmail and Google Drive for pilot customers), the Astruct Computer for platforms such as Aconex and Procore, and your company drafting styles.'),
  item('How does the free trial work?', 'The trial runs for 30 days. You add a card when you sign up so there is no gap if you keep going, and it is not charged during the trial. We’ll email you 5 days before your trial ends. If you do nothing, your projects are billed at the prices above.'),
  item('How do I cancel?', 'Cancel any time in Settings > Billing. Cancel before your trial ends and you are not charged at all.'),
  item('Are prices in Australian dollars?', 'Yes. All prices are in Australian dollars and exclude GST.'),
]

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ITEMS)) }} />
      <section className="mk-page-head">
        <div className="mk-wrap">
          <h1 className="mk-h1" style={{ fontSize: 'clamp(48px, 7.4vw, 96px)' }}>Per project.<br />Every user included.</h1>
          <p className="mk-lede">AU$199 a month for your first project, and less for each one after. Add as many people as you like. Try it free for 30 days; your card is not charged during the trial, and we’ll email you 5 days before it ends.</p>
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
