import type { Metadata } from 'next'
import { PricingCards } from '@/components/mk/pricing'
import { Faq, faqJsonLd, type QA } from '@/components/mk/faq'
import Link from 'next/link'
import { TRIAL_LINE } from '@/components/mk/links'
import { IArrow } from '@/components/mk/icons'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    `AU$199 per project, per month, ex GST, with unlimited users. Projects 2–5 AU$179 each, 6–15 AU$159, 16–30 AU$139, 31 and over AU$119. ${TRIAL_LINE}`,
  alternates: { canonical: '/pricing' },
}

function item(q: string, text: string): QA {
  return { q, text, a: <p>{text}</p> }
}

const ITEMS: QA[] = [
  item('How does per-project pricing work?', 'Each project you run in Astruct, with its contract, documents and mail, is billed monthly. The first project is AU$199, projects 2–5 are AU$179 each, 6–15 are AU$159 each, 16–30 are AU$139 each, and every project from the 31st is AU$119.'),
  item('Does every project drop to the lower price?', 'No. Each project is charged at the rate for its band. With 8 projects you pay AU$199 for the first, AU$179 for each of the next four and AU$159 for each of the last three: AU$199 + AU$716 + AU$477 = AU$1,392 a month, an average of AU$174 per project.'),
  item('How many users can we add?', 'As many as you like. Every user in your company account is included at no extra cost, on every project.'),
  item('What is included with each project?', 'Everything in Astruct: the contract read with every notice period and its clause, Ask, Search and Draft across thousands of documents, Outlook mail read for variations, delays and claims, and your letterhead on every draft. Procore, Gmail and SharePoint are available on request.'),
  item('How does the free trial work?', 'Request a trial and we email you an invite link. The trial is free for 30 days, with two projects and 100 credits, and no card. Credits cover the work Astruct does for you: reading documents, answering questions and drafting. To keep going after 30 days, subscribe at the prices above. Nothing is charged unless you do.'),
  item('How do I cancel?', 'Cancel any time. If you let the trial end without subscribing, nothing is charged.'),
  item('Are prices in Australian dollars?', 'Yes. All prices are in Australian dollars and exclude GST.'),
]

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ITEMS)) }} />
      <section className="mk-page-head">
        <div className="mk-wrap mk-ph-grid">
          <div>
            <h1 className="mk-h1" style={{ fontSize: 'clamp(40px, 5.4vw, 72px)' }}>Per project.<br />Every user included.</h1>
            <p className="mk-lede">AU$199 a month for your first project, and less for each one after. Add as many people as you like. {TRIAL_LINE}</p>
          </div>
          <dl className="mk-ph-facts">
            <div><dt>Users</dt><dd>Unlimited, on every project</dd></div>
            <div><dt>Eight projects</dt><dd>AU$1,392 a month, AU$174 each on average</dd></div>
            <div><dt>Trial</dt><dd>30 days, two projects, 100 credits</dd></div>
            <div><dt>Prices</dt><dd>Australian dollars, excluding GST</dd></div>
          </dl>
        </div>
      </section>
      <section className="mk-pp-cards">
        <div className="mk-wrap" style={{ marginTop: -48 }}>
          <PricingCards onPricingPage />
        </div>
      </section>
      <section className="mk-sec mk-alt">
        <div className="mk-wrap mk-faq-grid">
          <div className="mk-faq-side">
            <h2 className="mk-h2">Pricing questions</h2>
            <p className="mk-body">How the per-project price, the trial and billing work.</p>
            <p><Link className="mk-link" href="/support">More answers in the help centre<IArrow /></Link></p>
          </div>
          <Faq items={ITEMS} />
        </div>
      </section>
    </>
  )
}
