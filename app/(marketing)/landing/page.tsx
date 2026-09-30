import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroLoop, Walkthrough } from '@/components/mk/media'
import { Clause, IssueWindow } from '@/components/mk/fragments'
import { AskLive, DraftLive, SearchLive, WatchLive } from '@/components/mk/live/fragments'
import { DropInLive } from '@/components/mk/live/dropin'
import { ComputerLive } from '@/components/mk/live/computer'
import { Faq, HOME_FAQ, faqJsonLd } from '@/components/mk/faq'
import { GGmail, GOneDrive, GOutlook, GSharePoint, GUpload, IArrow, ICheck } from '@/components/mk/icons'
import { PricingCards, TRIAL_LINE } from '@/components/mk/pricing'
import { SIGNUP_URL } from '@/components/mk/links'

// The root path is rewritten here by proxy.ts, so this page is served at "/".
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}


// Every form and Act here is one Astruct reads when you give it the contract;
// it works from the document itself, so amended and bespoke forms read the same way.
const CONTRACTS: [string, string][] = [
  ['AS 2124-1992', 'General conditions'],
  ['AS 2545-1993', 'Subcontract'],
  ['AS 4000-1997', 'General conditions'],
  ['AS 4901-1998', 'Subcontract'],
  ['AS 4300-1995', 'Design and construct'],
  ['AS 4902-2000', 'Design and construct'],
  ['AS 4903-2000', 'D&C subcontract'],
  ['AS 4905-2002', 'Minor works'],
  ['AS 4906-2002', 'Minor works'],
  ['AS 4917-2003', 'Construction management'],
  ['AS 11000-2015', 'General conditions'],
  ['ABIC MW-2018', 'Major works'],
  ['ABIC SW-2018', 'Simple works'],
  ['GC21', 'NSW Government'],
  ['NEC4', 'ECC'],
  ['FIDIC', 'Red, Yellow and Silver Books'],
  ['HIA', 'Residential contracts'],
  ['MBA', 'Residential contracts'],
  ['Bespoke', 'and amended contracts'],
]


const SECURITY: { title: string; body: string }[] = [
  { title: 'Stored in Australia', body: 'Your projects, mail and documents are stored in Australia, in Sydney, and never used to train models.' },
  { title: 'Zero Data Retention', body: 'Astruct uses OpenAI’s API under Zero Data Retention, so your content is not kept by OpenAI once a request is answered.' },
  { title: 'You stay in control', body: 'Your admin decides who can search which mailbox, and drafts are never sent automatically.' },
]

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mk-ticks">
      {items.map((t) => <li key={t}><ICheck />{t}</li>)}
    </ul>
  )
}

function Marquee({ items, rev, law, dur }: { items: [string, string][]; rev?: boolean; law?: boolean; dur: number }) {
  const set = (hidden?: boolean) => (
    <div className="mk-pillset" aria-hidden={hidden || undefined}>
      {items.map(([a, b], i) => <span className="mk-tpill" key={i}>{a}<small>{b}</small></span>)}
    </div>
  )
  return (
    <div className={`mk-marquee${rev ? ' is-rev' : ''}${law ? ' is-law' : ''}`} style={{ ['--dur' as string]: `${dur}s` }}>
      <div className="mk-marquee-track">{set()}{set(true)}</div>
    </div>
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
          <h1 className="mk-h1 mk-hero-h1">Frontier AI for <span className="mk-grad">Australian construction contracts.</span></h1>
          <p className="mk-lede">
            End to end, built for Australian construction. Answers with the page they came from, search across thousands
            of project documents, notices and EOT claims on your letterhead, and an agent that watches project mail.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
            <Link className="mk-link" href="#ask">See what it does<IArrow /></Link>
          </div>
          <p className="mk-fine mk-hero-fine">{TRIAL_LINE}</p>
          <div className="mk-hero-stage">
            <div className="mk-bezel">
              <HeroLoop label="A 15-second explainer on the demo project. Ask: a question about SI-014, answered with the Variation Notice due Fri 2 Oct at 5:00 pm, citing SC 8.1 on p 21 and SC 9(b) on p 22. Search: (bracket* OR fixing) w/5 &quot;L4&quot; across 4,812 documents. Draft: Variation Notice V-06 as a Word file. Watch: SI-014 flagged as a variation direction outside the Scope of Works in Annexure C, notice due Fri 2 Oct at 5:00 pm." />
            </div>
          </div>
        </div>
      </section>

      {/* The contracts and laws it reads */}
      <section className="mk-marquee-sec" aria-labelledby="reads">
        <div className="mk-wrap">
          <div className="mk-marquee-head mk-reveal">
            <h2 id="reads">Reads the contracts you actually sign.</h2>
            <p>Standard forms, their subcontracts and the amendments that change them.</p>
          </div>
        </div>
        <Marquee items={CONTRACTS} dur={70} />
      </section>

      {/* Ask */}
      <section className="mk-sec mk-feature-sec" id="ask">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy mk-reveal">
            <h2 className="mk-h2">Ask a question. Get an answer that’s actually for construction.</h2>
            <p className="mk-body mk-feature-body">
              Answers come from your contract, correspondence and project documents, with the page for each point.
              Special conditions and amendments are read with the rest.
            </p>
            <Bullets items={[
              'Knows how Australian contracts work: AS 2124, AS 4000, AS 4300, AS 4902 and AS 4903 style contracts, their subcontracts, and bespoke or heavily amended forms',
              'Security of payment law, such as SOPA and Queensland’s BIF Act, with its payment and adjudication time limits',
              'Every answer cites the document and page, one click from the source',
            ]} />
          </div>
          <div className="mk-panel mk-reveal"><AskLive /></div>
        </div>
      </section>

      {/* Search */}
      <section className="mk-sec mk-feature-sec mk-alt" id="search">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy mk-reveal">
            <h2 className="mk-h2">Search every document. Boolean or plain English.</h2>
            <p className="mk-body mk-feature-body">
              Up to 5,000 documents per project, and every email. Use Boolean operators or plain English. Every result
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
            <div className="mk-lg"><SearchLive /></div>
          </div>
        </div>
      </section>

      {/* Draft */}
      <section className="mk-sec mk-feature-sec" id="draft">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy mk-reveal">
            <h2 className="mk-h2">Draft the letter. On your letterhead.</h2>
            <p className="mk-body mk-feature-body">
              Letters, emails, variation notices, notices of delay and EOT claims, drafted from the project’s facts and
              the governing clause. On your letterhead, in your format, as Word files.
            </p>
            <Bullets items={[
              'Particulars filled in from the project: references, dates, parties and the clause',
              'Your letterhead and templates, downloaded as .docx',
              'Nothing is sent automatically. A person on your team reviews and sends',
            ]} />
          </div>
          <div className="mk-panel mk-reveal"><DraftLive /></div>
        </div>
      </section>

      {/* Watch */}
      <section className="mk-sec mk-feature-sec mk-alt" id="watch">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy mk-reveal">
            <h2 className="mk-h2">Don’t get time-barred.</h2>
            <p className="mk-body mk-feature-body">
              The agent reads project mail as it arrives. It compares each direction with your scope of work, flags likely
              variations and potential delays, and works out the notice deadline from the clause. Upstream and downstream.
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
            <div className="mk-lg"><WatchLive /></div>
          </div>
        </div>
      </section>

      {/* Drop in the whole project */}
      <section className="mk-sec" id="drop-in">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
            <h2 className="mk-h2">Drop in the whole project.</h2>
            <p className="mk-lede">Up to 5,000 documents per project. Ask for a notice and Astruct drafts it from the record, on your letterhead.</p>
          </div>
          <DropInLive />
          <p className="mk-fine dp-note">Demo project, fictional parties. Every fact in the notice comes from its documents.</p>
        </div>
      </section>

      {/* Astruct's computer */}
      <section className="mk-sec mk-alt" id="computer">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
            <h2 className="mk-h2">Astruct works on its own computer.</h2>
            <p className="mk-lede">It opens your documents, searches them and drafts in Word, so every answer and notice rests on the project record.</p>
          </div>
          <ComputerLive />
        </div>
      </section>

      {/* See it work */}
      <section className="mk-sec" id="see-it-work">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
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
      <section className="mk-sec mk-sec-tight" id="security">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <h2 className="mk-h2">Your project data stays yours.</h2>
          </div>
          <div className="mk-sec-grid mk-reveal">
            {SECURITY.map((s) => (
              <div className="mk-sec-item" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 32 }}><Link className="mk-link" href="/security">How Astruct handles your data<IArrow /></Link></p>
        </div>
      </section>

      {/* Pricing */}
      <section className="mk-sec mk-alt" id="pricing">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
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
