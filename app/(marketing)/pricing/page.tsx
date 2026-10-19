import type { Metadata } from 'next'
import { PricingCards } from '@/components/mk/pricing'
import { Faq, faqJsonLd, type QA } from '@/components/mk/faq'
import Link from 'next/link'
import { TRIAL_LINE } from '@/components/mk/links'
import { IArrow } from '@/components/mk/icons'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    `AU$199 per project, per month, ex GST, with unlimited users, plus credits for AI use. Projects 2 to 5 are AU$179 each, 6 to 15 AU$159, 16 to 30 AU$139, and 31 and over AU$119. AI use can run on your own OpenAI or Anthropic API key instead. ${TRIAL_LINE}`,
  alternates: { canonical: '/pricing' },
}

function item(q: string, text: string): QA {
  return { q, text, a: <p>{text}</p> }
}

const ITEMS: QA[] = [
  item('How does per-project pricing work?', 'Each project you run in Astruct, with its contract, documents and mail, is billed monthly. The first project is AU$199, projects 2 to 5 are AU$179 each, 6 to 15 are AU$159 each, 16 to 30 are AU$139 each, and from the 31st project on it’s AU$119 each.'),
  item('Do all our projects drop to the lower price?', 'No. Each project is charged at the rate for its band. With 8 projects you pay AU$199 for the first, AU$179 for each of the next four and AU$159 for each of the last three. That’s AU$199 + AU$716 + AU$477 = AU$1,392 a month, or AU$174 a project on average.'),
  item('How many users can we add?', 'As many as you need. Users in your company account cost nothing extra, on any project.'),
  item('What is included with each project?', 'All of Astruct. The contract is read with its notice periods, clauses and pages. Documents and mail are filed to the project and a chronology is kept. You can search the project, ask questions about it and draft from it, with drafts on your letterhead as .docx or PDF. Each user gets a cloud computer, and the project can connect Outlook, OneDrive, SharePoint, Gmail, Google Drive, Dropbox and Procore.'),
  item('How is AI use paid for?', 'You choose in Settings > Model account. By default Astruct uses its own models and charges credits as they’re used, at AU$1.00 a credit, billed monthly. If you add your own OpenAI or Anthropic API key, Astruct’s chat runs on your key and that provider bills you. If your key fails or runs out, Astruct credits take over.'),
  item('How does the free trial work?', 'Request a trial and we email you an invite link. The trial runs for 30 days with two projects and 100 credits, and we don’t ask for a card. Credits are used when Astruct reads documents, answers questions and drafts. To keep going after 30 days, subscribe at the prices above. Nothing is charged unless you do.'),
  item('How do I cancel?', 'Cancel any time. If you let the trial end without subscribing, nothing is charged.'),
  item('Are prices in Australian dollars?', 'Yes. All prices are in Australian dollars and exclude GST.'),
]

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ITEMS)) }} />
      <section className="mk-page-head">
        <div className="mk-wrap mk-page-top">
          <div>
            <h1 className="mk-h1">Pricing</h1>
            <p className="mk-lede">
              You pay per project, per month. The first project is AU$199 ex GST and each one after that costs less.
              Add as many people as you need. AI use is billed in credits. {TRIAL_LINE}
            </p>
          </div>
          <dl className="mk-facts">
            <div><dt>Users</dt><dd>Unlimited, on any project</dd></div>
            <div><dt>Eight projects</dt><dd>AU$1,392 a month, AU$174 each on average</dd></div>
            <div><dt>AI use</dt><dd>Astruct credits, or your own OpenAI or Anthropic API key</dd></div>
            <div><dt>Trial</dt><dd>30 days, two projects, 100 credits</dd></div>
            <div><dt>Prices</dt><dd>Australian dollars, excluding GST</dd></div>
          </dl>
        </div>
      </section>
      <section className="mk-pp-cards">
        <div className="mk-wrap">
          <PricingCards onPricingPage />
        </div>
      </section>
      <section className="mk-sec">
        <div className="mk-wrap mk-faq-grid">
          <div className="mk-faq-side">
            <h2 className="mk-h2">Pricing questions</h2>
            <p className="mk-body">Per-project prices, credits, the trial and billing.</p>
            <p><Link className="mk-link" href="/support">Help centre<IArrow /></Link></p>
          </div>
          <Faq items={ITEMS} />
        </div>
      </section>
    </>
  )
}
