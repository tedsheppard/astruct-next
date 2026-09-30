import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroLoop, Walkthrough } from '@/components/mk/media'
import { Clause, IssueWindow } from '@/components/mk/fragments'
import { AskFragment, DraftFragment, SearchFragment, WatchFragment } from '@/components/mk/capabilities'
import { Faq, HOME_FAQ, faqJsonLd } from '@/components/mk/faq'
import { GGmail, GOneDrive, GOutlook, GSharePoint, GUpload, IArrow, ICheck } from '@/components/mk/icons'
import { PricingCards, TRIAL_LINE } from '@/components/mk/pricing'
import { SIGNUP_URL } from '@/components/mk/links'

// The root path is rewritten here by proxy.ts, so this page is served at "/".
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const CAPS = [
  { id: 'ask', c: 'teal', label: 'Ask', line: 'Answers from your contract, with the page.' },
  { id: 'search', c: 'blue', label: 'Search', line: 'Boolean or plain English, across 5,000 documents.' },
  { id: 'draft', c: 'violet', label: 'Draft', line: 'Letters, notices and EOT claims, as Word files.' },
  { id: 'watch', c: 'amber', label: 'Watch', line: 'Directions and delays, flagged as mail arrives.' },
]

const SECURITY: { title: string; body: string }[] = [
  { title: 'Stored in Australia', body: 'Your projects, mail and documents are stored in Australia, in Sydney.' },
  { title: 'Zero Data Retention', body: 'Astruct uses OpenAI’s API under Zero Data Retention, so your content is not kept by OpenAI once a request is answered.' },
  { title: 'No training on your data', body: 'Your mail, documents and drafts are never used to train models, by us or by OpenAI.' },
  { title: 'Mailbox access set by your admin', body: 'Your administrator decides whose mailbox each person can search and use with Astruct, one person at a time.' },
  { title: 'Drafts are never sent automatically', body: 'Astruct prepares letters, notices and claims. A person on your team reviews them and sends them.' },
  { title: 'Microsoft 365 on your terms', body: 'Organisation-wide connections run on your tenant’s admin consent, and your admin can revoke them at any time.' },
]

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mk-ticks">
      {items.map((t) => <li key={t}><ICheck />{t}</li>)}
    </ul>
  )
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQ)) }} />

      {/* Hero */}
      <section className="mk-hero">
        <div className="mk-field mk-field-hero" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="mk-wrap">
          <span className="mk-pill mk-glass-pill">Built in Australia for Australian contracts</span>
          <h1 className="mk-h1 mk-hero-h1">Frontier AI for <span className="mk-grad">Australian construction contracts.</span></h1>
          <p className="mk-lede">
            Ask a question and get an answer that’s actually about construction, with the page it came from. Search
            thousands of project documents, draft notices and EOT claims, and let Astruct’s agent watch your project mail
            for variation directions and delays.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
            <Link className="mk-link" href="#ask">See what it does<IArrow /></Link>
          </div>
          <p className="mk-fine mk-hero-fine">{TRIAL_LINE}</p>
          <nav className="mk-caps" aria-label="What Astruct does">
            {CAPS.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="mk-cap">
                <span className="mk-chip" data-c={c.c}>{c.label}</span>
                <span className="mk-cap-line">{c.line}</span>
              </a>
            ))}
          </nav>
          <div className="mk-hero-stage">
            <div className="mk-bezel">
              <HeroLoop label="A 15-second explainer: site instruction SI-014 arrives from Harrow &amp; Vale, Astruct links the evidence, finds Special Condition SC 8.1 and a notice due Fri 2 Oct at 5:00 pm, and prepares the Variation Notice for review." />
            </div>
          </div>
        </div>
      </section>

      {/* Ask */}
      <section className="mk-sec mk-feature-sec" id="ask">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy mk-reveal">
            <span className="mk-chip mk-chip-lg" data-c="teal">Ask</span>
            <h2 className="mk-h2">Ask a question. Get an answer that’s actually for construction.</h2>
            <p className="mk-body mk-feature-body">
              Astruct answers from your contract, your correspondence and your project documents, and shows the page
              each point came from. It reads special conditions and amendments with the rest, so the answer follows the
              clause that actually applies.
            </p>
            <Bullets items={[
              'Knows how Australian contracts work: AS 2124, AS 4000, AS 4300, AS 4902 and AS 4903 style contracts, their subcontracts, and bespoke or heavily amended forms',
              'Security of payment law, such as SOPA and Queensland’s BIF Act, with its payment and adjudication time limits',
              'Every answer cites the document and page, one click from the source',
            ]} />
          </div>
          <div className="mk-panel mk-reveal"><AskFragment /></div>
        </div>
      </section>

      {/* Search */}
      <section className="mk-sec mk-feature-sec mk-alt" id="search">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy mk-reveal">
            <span className="mk-chip mk-chip-lg" data-c="blue">Search</span>
            <h2 className="mk-h2">Search every document. Boolean or plain English.</h2>
            <p className="mk-body mk-feature-body">
              Up to 5,000 documents per project: the contract, drawings, programmes, RFIs, site diaries, minutes and every
              email. Write a Boolean query the way a litigation team would, or just ask in plain English. Every result
              lands on the page.
            </p>
            <Bullets items={[
              'AND, OR, NOT, “exact phrases”, brackets and wildcards',
              'Proximity: w/5, NEAR/10 and pre/3 for words close together or in order',
              'Results across documents and mail, each with its page reference',
            ]} />
            <p className="mk-fine mk-feature-note"><Link className="mk-link" href="/support/boolean-search">Boolean search reference<IArrow /></Link></p>
          </div>
          <div className="mk-stage mk-reveal" data-tone="cool">
            <div className="mk-field" aria-hidden="true"><i /><i /><i /></div>
            <div className="mk-lg"><SearchFragment /></div>
          </div>
        </div>
      </section>

      {/* Draft */}
      <section className="mk-sec mk-feature-sec" id="draft">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy mk-reveal">
            <span className="mk-chip mk-chip-lg" data-c="violet">Draft</span>
            <h2 className="mk-h2">Draft the letter. Keep your house style.</h2>
            <p className="mk-body mk-feature-body">
              Project letters, emails, variation notices, notices of delay and EOT claims, drafted from the facts of the
              project and the clause that governs them. They come out in your house style as Word files, ready for you to
              check, edit and send.
            </p>
            <Bullets items={[
              'Particulars filled in from the project: references, dates, parties and the clause',
              'Your letterhead and house style, downloaded as .docx',
              'Nothing is sent automatically. A person on your team reviews and sends',
            ]} />
          </div>
          <div className="mk-panel mk-reveal"><DraftFragment /></div>
        </div>
      </section>

      {/* Watch */}
      <section className="mk-sec mk-feature-sec mk-alt" id="watch">
        <div className="mk-wrap">
          <div className="mk-feature mk-feature-flip">
            <div className="mk-feature-copy mk-reveal">
              <span className="mk-chip mk-chip-lg" data-c="amber">Watch</span>
              <h2 className="mk-h2">Don’t get time-barred.</h2>
              <p className="mk-body mk-feature-body">
                Astruct’s agent reads project mail as it arrives. Without being asked, it compares each direction against
                your scope of work and flags the ones that look like variations. It spots potential delays too, then finds
                the notice clause and works out the deadline, so you can give notice on time.
              </p>
              <Bullets items={[
                'Directions compared against the scope of work automatically',
                'Potential delays flagged from mail, minutes and programme updates',
                'Every deadline shows the clause it came from, and stays marked “check the clause” until you confirm the rule',
              ]} />
              <p className="mk-fine mk-feature-note">New mail is picked up within about five minutes. Astruct only sees the mailboxes and folders you connect.</p>
            </div>
            <div className="mk-stage mk-reveal" data-tone="warm">
              <div className="mk-field" aria-hidden="true"><i /><i /><i /></div>
              <div className="mk-lg"><WatchFragment /></div>
            </div>
          </div>
          <div className="mk-updown mk-reveal">
            <div className="mk-updown-card">
              <span className="mk-updown-k">Upstream</span>
              <h3>To the principal or head contractor</h3>
              <p>The notices and claims you must give: variations, delays, EOTs and payment claims, each with its time bar.</p>
            </div>
            <div className="mk-updown-card">
              <span className="mk-updown-k">Downstream</span>
              <h3>From your subcontractors</h3>
              <p>The notices and claims you receive, and the responses and payment schedules you owe, each with its deadline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* See it work */}
      <section className="mk-sec" id="see-it-work">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
            <span className="mk-kicker">See it work</span>
            <h2 className="mk-h2">From one email to a notice, ready for review.</h2>
            <p className="mk-lede">A walkthrough on the demo project: a fictional façade subcontract in Fortitude Valley, Brisbane, and the site instruction that changed its brackets.</p>
          </div>
          <div className="mk-walk mk-reveal">
            <Walkthrough label="Astruct walkthrough on the demo project" phone={<div className="ui mk-still-phone-pad"><Clause /></div>}>
              <IssueWindow />
            </Walkthrough>
            <div className="mk-walk-steps" aria-label="What the walkthrough shows">
              <span>Mail arrives</span><span>Direction flagged</span><span>Evidence linked</span><span>Clause and deadline</span><span>Notice drafted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mk-sec mk-alt" id="integrations">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-chip mk-chip-lg" data-c="rose">Integrations</span>
            <h2 className="mk-h2">Works where your project already lives.</h2>
            <p className="mk-lede">Connect your sources once. Astruct keeps reading them and files what arrives to the right project.</p>
          </div>
          <div className="mk-int mk-reveal">
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GOutlook /></span></div>
              <h3>Outlook</h3>
              <p>Personal and shared Microsoft 365 mailboxes. Shared mailboxes need your admin’s consent, given once with one link.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GSharePoint /></span><span className="mk-int-logo"><GOneDrive /></span></div>
              <h3>SharePoint and OneDrive</h3>
              <p>Project folders and document libraries, kept in sync. SharePoint needs your Microsoft 365 admin’s consent.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GGmail /></span></div>
              <h3>Gmail</h3>
              <p>Project mailboxes on Gmail or Google Workspace. Open to pilot customers while Google completes its review.</p>
              <span className="mk-int-status is-pilot"><i className="ui-dot" />Pilot</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo" style={{ color: 'var(--ink)' }}><GUpload /></span></div>
              <h3>Uploads, folders and zips</h3>
              <p>Drop in the contract, drawings, programme and past correspondence. Zips are unpacked and emails keep their attachments.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card mk-int-others">
              <div>
                <h3 style={{ marginTop: 0 }}>Procore, Aconex and other platforms</h3>
                <p style={{ marginTop: 6 }}>Connections to project platforms such as Procore, Aconex, HammerTech and Payapps are built on request.</p>
              </div>
              <span className="mk-int-status is-request"><i className="ui-dot" />On request</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mk-sec" id="security">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">Security</span>
            <h2 className="mk-h2">Your project data stays yours.</h2>
            <p className="mk-lede">Commercial correspondence is sensitive. Astruct is built so it stays where it should, and only the right people see it.</p>
          </div>
          <div className="mk-sec-grid mk-reveal">
            {SECURITY.map((s) => (
              <div className="mk-sec-item" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 36 }}><Link className="mk-link" href="/security">How Astruct handles your data<IArrow /></Link></p>
        </div>
      </section>

      {/* Pricing */}
      <section className="mk-sec mk-alt" id="pricing">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">Pricing</span>
            <h2 className="mk-h2">One plan. Try it free for 30 days.</h2>
            <p className="mk-lede">Use Astruct on a live project for 30 days with 100 credits. Your card is not charged during the trial, and we’ll email you 5 days before it ends.</p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-sec" id="faq">
        <div className="mk-wrap mk-narrow">
          <div className="mk-head mk-reveal">
            <h2 className="mk-h2">Questions</h2>
          </div>
          <Faq items={HOME_FAQ} />
          <p style={{ marginTop: 32 }}><Link className="mk-link" href="/support">More answers in the help centre<IArrow /></Link></p>
        </div>
      </section>

      {/* Close */}
      <section className="mk-sec mk-close">
        <div className="mk-field mk-field-close" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="mk-wrap mk-reveal">
          <h2 className="mk-h2">Start with one project.</h2>
          <p className="mk-lede" style={{ marginTop: 22, marginLeft: 'auto', marginRight: 'auto', maxWidth: 620 }}>
            Add the contract, connect a mailbox and ask your first question.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
            <Link className="mk-link" href="/support">Visit the help centre<IArrow /></Link>
          </div>
          <p className="mk-fine" style={{ marginTop: 18 }}>{TRIAL_LINE}</p>
        </div>
      </section>
    </>
  )
}
