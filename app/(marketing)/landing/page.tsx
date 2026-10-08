import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroLoop, Walkthrough } from '@/components/mk/media'
import { Clause, IssueWindow } from '@/components/mk/fragments'
import { AskLive, DraftLive, SearchLive, WatchLive } from '@/components/mk/live/fragments'
import { DropInLive } from '@/components/mk/live/dropin'
import { ComputerLive } from '@/components/mk/live/computer'
import { WhoScroll } from '@/components/mk/live/who'
import { Faq, HOME_FAQ, faqJsonLd } from '@/components/mk/faq'
import { GComputer, GDrive, GGmail, GOneDrive, GOutlook, GSharePoint, GUpload, IArrow, ICheck } from '@/components/mk/icons'
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


const ic = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

// The four parts of Project Brain, in this order everywhere on the page.
const BRAIN: { n: string; href: string; c: string; title: string; line: string }[] = [
  { n: '1', href: '#search', c: 'teal', title: 'Search everything', line: 'Documents, Outlook and Gmail, SharePoint, Google Drive, Aconex and Procore.' },
  { n: '2', href: '#draft', c: 'violet', title: 'Draft from everything', line: 'Letters, notices, variations and claims from the whole record.' },
  { n: '3', href: '#safe-ai', c: 'blue', title: 'Safe AI', line: 'Frontier models under API terms. Not used for training.' },
  { n: '4', href: '#company', c: 'amber', title: 'One company account', line: 'Unlimited users, your drafting style, priced per project.' },
]

const SAFE: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: 'Not used for training', body: 'Astruct uses OpenAI’s models through its API. Under the API terms, your documents, mail and drafts are not used to train models, by us or by OpenAI.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" {...ic} /><path d="M6 18 18 6" {...ic} /></svg>,
  },
  {
    title: 'Zero Data Retention', body: 'Our OpenAI account has Zero Data Retention. Requests are processed and answered, then not kept by OpenAI.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z" {...ic} /><path d="M9 12l2 2 4-4" {...ic} /></svg>,
  },
  {
    title: 'Stored in Australia', body: 'Your projects, mail, documents and drafts are stored in Sydney, and the application runs there too.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" {...ic} /><circle cx="12" cy="10" r="2.4" {...ic} /></svg>,
  },
  {
    title: 'Read-only drives', body: 'SharePoint, OneDrive and Google Drive are connected read-only. Astruct only sees the mailboxes and folders you connect.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...ic} /><circle cx="12" cy="12" r="2.8" {...ic} /></svg>,
  },
  {
    title: 'Your admin decides access', body: 'Owners and admins set roles and decide whose mailbox each person may search.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" {...ic} /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" {...ic} /><path d="M12 14.5v2.5" {...ic} /></svg>,
  },
  {
    title: 'Nothing sent automatically', body: 'Astruct drafts for review. A person on your team checks the draft and sends it through your normal process.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14" {...ic} /><path d="M21 3l-7 18-4-7-7-4z" {...ic} /></svg>,
  },
]

const COMPANY: { title: string; body: string }[] = [
  { title: 'Unlimited users', body: 'Astruct is priced per project, not per person. Add every contract administrator, project manager, estimator and executive who works on the job, at no extra cost.' },
  { title: 'Spend follows your projects', body: 'You choose which projects are on Astruct, and the bill is the number of projects. Hiring or adding a consultant to a project doesn’t change it.' },
  { title: 'Company drafting styles', body: 'Upload a letter you have sent. Astruct takes its letterhead, page size, margins, fonts, spacing, header and footer, and every draft from then on uses them.' },
  { title: 'Roles and access', body: 'Owners and admins invite people, set their roles and remove them. A person who is removed loses access to the company’s projects straight away.' },
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

      {/* Hero: Project Brain */}
      <section className="mk-hero">
        <div className="mk-field mk-field-hero" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="mk-wrap">
          <h1 className="mk-h1 mk-hero-h1"><span className="mk-grad">Project Brain</span> for Australian construction contracts.</h1>
          <p className="mk-lede">
            Astruct reads the whole project: up to 10,000 documents, Outlook and Gmail, SharePoint and Google Drive, and
            platforms like Aconex and Procore. Then it answers, searches and drafts from all of it.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn" href={SIGNUP_URL}>Get early access</a>
            <Link className="mk-link" href="#search">See how it works<IArrow /></Link>
          </div>
          <p className="mk-fine mk-hero-fine">{TRIAL_LINE}</p>
          <div className="mk-hero-stage">
            <div className="mk-bezel">
              <HeroLoop label="A 15-second film on the demo project. It opens on Frontier AI for construction, then the camera moves through the project documents. Ask: a question about SI-014, answered with the Variation Notice due Fri 2 Oct at 5:00 pm and the subcontract page it relies on, SC 8.1 on p 21. Search: (bracket* OR fixing) w/5 &quot;L4&quot; across 4,812 documents. Draft: Variation Notice V-06 on Arcline letterhead, as a Word file. Watch: SI-014 arrives and is flagged as a variation direction outside the Scope of Works in Annexure C, notice due Fri 2 Oct at 5:00 pm. It ends on Frontier AI for Australian construction contracts." />
            </div>
          </div>
          <nav className="mk-caps mk-brain-caps" aria-label="Project Brain">
            {BRAIN.map((b) => (
              <a className="mk-cap" href={b.href} key={b.n}>
                <span className="mk-chip" data-c={b.c}>{b.n}. {b.title}</span>
                <span className="mk-cap-line">{b.line}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* 1. Search everything */}
      <section className="mk-sec mk-alt" id="search">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">1. Search everything</span>
            <h2 className="mk-h2">Search across the whole project.</h2>
            <p className="mk-lede">
              Uploaded documents, project mail, shared drives and the web platforms the job runs on, searched together.
              Every result lands on the page it came from.
            </p>
          </div>
          <div className="mk-int mk-reveal">
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo" style={{ color: 'var(--ink)' }}><GUpload /></span></div>
              <h3>Uploaded documents</h3>
              <p>Up to 10,000 per project: the contract, drawings, programme and past correspondence. Zips are unpacked and emails keep their attachments.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GOutlook /></span></div>
              <h3>Outlook</h3>
              <p>Personal and shared Microsoft 365 mailboxes. Shared mailboxes need your admin’s consent, given once with one link.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GSharePoint /></span><span className="mk-int-logo"><GOneDrive /></span></div>
              <h3>SharePoint and OneDrive</h3>
              <p>Project folders and document libraries, read-only and kept in sync. SharePoint needs your Microsoft 365 admin’s consent.</p>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-int-card">
              <div className="mk-int-logos"><span className="mk-int-logo"><GGmail /></span><span className="mk-int-logo"><GDrive /></span></div>
              <h3>Gmail and Google Drive</h3>
              <p>Google Workspace mailboxes and Drive folders, read-only. Open to pilot customers while Google completes its review.</p>
              <span className="mk-int-status is-pilot"><i className="ui-dot" />Pilot</span>
            </div>
            <div className="mk-int-card mk-int-others">
              <span className="mk-int-logo" style={{ color: 'var(--ink)' }}><GComputer /></span>
              <div className="mk-int-others-copy">
                <h3 style={{ marginTop: 0 }}>Aconex, Procore and other web software</h3>
                <p style={{ marginTop: 6 }}>Driven by the Astruct Computer. You sign in to the platform in its browser, and Astruct works through what your account can see and brings it back to the project.</p>
              </div>
              <span className="mk-int-status"><i className="ui-dot" />Astruct Computer</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mk-sec mk-feature-sec" id="search-syntax">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy mk-reveal">
            <h3 className="mk-h2">Boolean or plain English.</h3>
            <p className="mk-body mk-feature-body">
              One search runs across every document and email in the project that you are allowed to see.
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

      <section className="mk-sec mk-feature-sec mk-alt" id="ask">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy mk-reveal">
            <h3 className="mk-h2">Ask, and get the page.</h3>
            <p className="mk-body mk-feature-body">
              Ask a question in your own words. Astruct answers from the contract, its amendments and the correspondence,
              and cites the document and page for each point.
            </p>
            <Bullets items={[
              'Reads AS 2124, AS 4000, AS 4300, AS 4902 and AS 4903 style contracts, their subcontracts and amendments',
              'Knows the security of payment time limits, such as under SOPA and Queensland’s BIF Act',
              'Every answer cites the document and page',
            ]} />
          </div>
          <div className="mk-panel mk-reveal"><AskLive /></div>
        </div>
      </section>

      <section className="mk-sec" id="computer">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
            <h3 className="mk-h2">The Astruct Computer.</h3>
            <p className="mk-lede">
              A cloud computer with a browser, files and Word. Astruct uses it to open Aconex, Procore and your documents,
              search them and draft. You sign in to each platform yourself.
            </p>
          </div>
          <ComputerLive />
        </div>
      </section>

      {/* 2. Draft from everything */}
      <section className="mk-sec mk-alt" id="draft">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
            <span className="mk-kicker">2. Draft from everything</span>
            <h2 className="mk-h2">Drafts that come from the record.</h2>
            <p className="mk-lede">
              Letters, notices, variations, EOT claims and other contract documents, drafted from everything Astruct has
              read. References, dates, parties and clauses are taken from the project’s own documents.
            </p>
          </div>
          <DropInLive />
          <p className="mk-fine dp-note">Demo project, fictional parties. Every fact in the notice comes from its documents.</p>
        </div>
      </section>

      <section className="mk-sec mk-feature-sec" id="letterhead">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy mk-reveal">
            <h3 className="mk-h2">On your letterhead, <span className="mk-grad-word">in your style.</span></h3>
            <p className="mk-body mk-feature-body">
              Astruct draws on your past project correspondence to match how your company writes, and lays the draft out
              in your company’s style.
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

      <section className="mk-marquee-sec" aria-labelledby="reads">
        <div className="mk-wrap">
          <div className="mk-marquee-head mk-reveal">
            <h3 id="reads">Reads the contracts you actually sign.</h3>
            <p>Standard forms, their subcontracts and the amendments that change them.</p>
          </div>
        </div>
        <Marquee items={CONTRACTS} dur={70} />
      </section>

      <section className="mk-sec mk-feature-sec mk-alt" id="watch">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy mk-reveal">
            <h3 className="mk-h2">Notices before the time bar.</h3>
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

      <section className="mk-sec" id="see-it-work">
        <div className="mk-wrap">
          <div className="mk-head mk-center mk-reveal">
            <h3 className="mk-h2">From one email to a notice, ready for review.</h3>
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

      {/* 3. Safe AI */}
      <section className="mk-sec mk-alt" id="safe-ai">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">3. Safe AI</span>
            <h2 className="mk-h2">Frontier models, on terms that protect your data.</h2>
            <p className="mk-lede">
              Astruct runs on OpenAI’s frontier models through the API, under an agreement that keeps your content out of
              training and out of storage once a request is answered.
            </p>
          </div>
          <div className="mk-sec-grid mk-reveal">
            {SAFE.map((s) => (
              <div className="mk-sec-item" key={s.title}>
                <span className="mk-sec-ic">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 32 }}><Link className="mk-link" href="/security">How Astruct handles your data<IArrow /></Link></p>
        </div>
      </section>

      {/* 4. One company account */}
      <section className="mk-sec" id="company">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <span className="mk-kicker">4. One company account</span>
            <h2 className="mk-h2">Everyone in the company, on one account.</h2>
            <p className="mk-lede">
              Unlimited users under one company account. Admins control who sees what, how documents look and which
              projects you pay for.
            </p>
          </div>
          <div className="mk-rows mk-brain-rows mk-reveal">
            {COMPANY.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-sec mk-alt" id="who">
        <div className="mk-wrap">
          <WhoScroll />
        </div>
      </section>

      {/* Pricing */}
      <section className="mk-sec" id="pricing">
        <div className="mk-wrap">
          <div className="mk-head mk-reveal">
            <h2 className="mk-h2">Priced per project. Every user included.</h2>
            <p className="mk-lede">AU$199 a month for your first project, and less for each one after. Try it free for 30 days.</p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-sec mk-alt" id="faq">
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
            <a className="mk-btn" href={SIGNUP_URL}>Get early access</a>
            <Link className="mk-link" href="/support">Visit the help centre<IArrow /></Link>
          </div>
          <p className="mk-fine" style={{ marginTop: 18 }}>{TRIAL_LINE}</p>
        </div>
      </section>
    </>
  )
}
