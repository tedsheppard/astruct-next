import type { Metadata } from 'next'
import Link from 'next/link'
import { Walkthrough } from '@/components/mk/media'
import { ProjectBrain } from '@/components/mk/brain/project-brain'
import { Clause, IssueWindow } from '@/components/mk/fragments'
import { AskLive, DraftLive, SearchLive, WatchLive } from '@/components/mk/live/fragments'
import { ReadLive } from '@/components/mk/live/read'
import { NoticeRegister } from '@/components/mk/register'
import { Faq, HOME_FAQ, faqJsonLd } from '@/components/mk/faq'
import { GGmail, GOutlook, GSharePoint, GUpload, IArrow, ICheck } from '@/components/mk/icons'
import { PricingCards } from '@/components/mk/pricing'
import { CTA_LABEL, TRIAL_LINE, TRIAL_URL } from '@/components/mk/links'

// The root path is rewritten here by proxy.ts, so this page is served at "/".
export const metadata: Metadata = {
  alternates: { canonical: '/' },
}


// Forms Astruct reads when you give it the contract. It works from the
// document itself, so amended and bespoke forms read the same way.
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

// The four things the project brain does, in this order everywhere on the page.
const BRAIN: { n: string; href: string; c: string; title: string; line: string }[] = [
  { n: '1', href: '#read', c: 'teal', title: 'Reads the contract', line: 'Contract sum, practical completion, LDs, payment dates and every notice period.' },
  { n: '2', href: '#ask', c: 'blue', title: 'Answers with the clause', line: 'Ask anything. Every answer cites the clause and the page.' },
  { n: '3', href: '#draft', c: 'violet', title: 'Drafts the notice', line: 'On your letterhead, in one click, before the time bar.' },
  { n: '4', href: '#watch', c: 'amber', title: 'Reads the project mail', line: 'Outlook, read for variations, delays and claims.' },
]

const SAFE: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: 'Stored in Sydney', body: 'Your projects, mail, documents and drafts are stored in Australia, in Sydney.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" {...ic} /><circle cx="12" cy="10" r="2.4" {...ic} /></svg>,
  },
  {
    title: 'Models run by OpenAI', body: 'Model requests are processed by OpenAI in the United States, under its business API terms.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z" {...ic} /><path d="M9 12l2 2 4-4" {...ic} /></svg>,
  },
  {
    title: 'Not used for training', body: 'Under those terms, your documents, mail and drafts are not used to train models, by us or by OpenAI.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" {...ic} /><path d="M6 18 18 6" {...ic} /></svg>,
  },
  {
    title: 'Nothing leaves without a person', body: 'Astruct drafts. No letter or email leaves until a person on your team presses Send.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14" {...ic} /><path d="M21 3l-7 18-4-7-7-4z" {...ic} /></svg>,
  },
  {
    title: 'Only what you connect', body: 'Astruct reads only the mailboxes you connect. Disconnect one from Settings at any time.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...ic} /><circle cx="12" cy="12" r="2.8" {...ic} /></svg>,
  },
  {
    title: 'Your admin decides access', body: 'Owners and admins set roles and decide whose mailbox each person may search.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" {...ic} /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" {...ic} /><path d="M12 14.5v2.5" {...ic} /></svg>,
  },
]

const COMPANY: { title: string; body: string }[] = [
  { title: 'Unlimited users', body: 'Astruct is priced per project, not per person. Add every contract administrator, project manager, estimator and executive on the job at no extra cost.' },
  { title: 'Spend follows your projects', body: 'You choose which projects are on Astruct, and the bill is the number of projects. Hiring or adding a consultant to a project doesn’t change it.' },
  { title: 'Your letterhead', body: 'Upload a letter you have sent. Astruct takes its letterhead, page size, margins, fonts, header and footer, and every draft from then on uses them.' },
  { title: 'Roles and access', body: 'Owners and admins invite people, set their roles and remove them. A person who is removed loses access to the company’s projects straight away.' },
]

type WhoItem = { kind: string; title: string; meta: string; c: 'rose' | 'amber' | 'blue' | 'teal' | 'violet' }
const WHO: { title: string; body: string; points: string[]; item: WhoItem }[] = [
  {
    title: 'Head contractors',
    body: 'Give notices to the principal on time, check subcontractor claims against their subcontracts, and give payment schedules inside the security of payment deadlines.',
    points: ['Delay notices and EOT claims under the head contract', 'Subcontractor claims checked against each subcontract', 'Payment schedules inside the statutory time'],
    item: { kind: 'Payment schedule', title: 'Arcline PC-09, due today', meta: 'Item 27 · 10 Business Days from Fri 25 Sep', c: 'blue' },
  },
  {
    title: 'Subcontractors',
    body: 'Catch directions that change your scope, even when they say “no change”, and draft variation notices, delay notices and EOT claims from the evidence.',
    points: ['Directions compared against your scope of work', 'Variation notices before the time bar', 'Payment claims on the reference date'],
    item: { kind: 'Variation notice', title: 'SI-014 given Tue 29 Sep, on time', meta: 'SC 8.1 · due Fri 2 Oct, 5:00 pm', c: 'teal' },
  },
  {
    title: 'Developers',
    body: 'Check each variation and EOT claim against the contract, the programme and the correspondence, and respond within the time the contract allows.',
    points: ['Claims checked against the contract and programme', 'The clause and page behind every answer', 'Responses inside the time the contract allows'],
    item: { kind: 'EOT claim received', title: '14 days claimed, crane outage', meta: 'AS 4000 cl 34.5 · decision due within 28 days', c: 'amber' },
  },
]

// The request and the steps beside the drafted letter (demo pack, fictional).
const DRAFT_PROMPT = 'Draft me a notice of delay for the crane outage and late Level 6 access, on our letterhead'
const DRAFT_STEPS = [
  'Read Subcontract HV2291-SC-014: SC 7.1, p 20',
  'Found the crane emails of 23 September',
  'Checked Programme Rev 8 for the critical path',
  'Drafted on the Arcline letterhead',
]

/** Where the data goes: stored in Sydney, models in the US, nothing sent without a person. */
function DataFlow() {
  return (
    <div className="df" role="img" aria-label="Your documents, mail and drafts are stored in Sydney. Model requests go to OpenAI in the United States and are not used for training. A letter or email leaves only when a person on your team presses Send.">
      <div className="df-node">
        <span className="df-k">Your team</span>
        <b>Documents, mail and drafts</b>
      </div>
      <span className="df-arrow" aria-hidden="true" />
      <div className="df-node is-main">
        <span className="df-k"><i className="df-flag" aria-hidden="true" />Stored</span>
        <b>Sydney, Australia</b>
        <small>Projects, mail, documents, drafts</small>
      </div>
      <span className="df-arrow is-both" aria-hidden="true" />
      <div className="df-node">
        <span className="df-k">Model requests</span>
        <b>OpenAI, United States</b>
        <small>Business API terms · not used for training</small>
      </div>
      <span className="df-down" aria-hidden="true" />
      <div className="df-node df-gate">
        <span className="df-k">Only when</span>
        <b>A person presses Send</b>
      </div>
      <span className="df-arrow df-arrow-2" aria-hidden="true" />
      <div className="df-node df-out">
        <span className="df-k">Then</span>
        <b>The letter or email leaves</b>
      </div>
    </div>
  )
}

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

      {/* Hero: the project brain */}
      <section className="mk-hero2">
        <div className="mk-field mk-field-hero2" aria-hidden="true"><i /><i /><i /></div>
        <div className="mk-wrap mk-hero2-wrap">
          <div className="mk-hero2-top">
            <h1 className="mk-h1 mk-hero2-h1">The <span className="mk-grad">project brain</span> for Australian construction contracts.</h1>
            <div className="mk-hero2-side">
              <p className="mk-hero2-lede">
                Astruct reads the contract, the correspondence and the project mail, and shows what needs a notice and
                when. Every answer cites the clause and page. The notice is drafted on your letterhead before the time bar.
              </p>
              <div className="mk-hero2-cta">
                <div className="mk-cta-row">
                  <a className="mk-btn" href={TRIAL_URL}>{CTA_LABEL}</a>
                  <Link className="mk-link" href="#read">See how it works<IArrow /></Link>
                </div>
                <p className="mk-fine">{TRIAL_LINE}</p>
              </div>
            </div>
          </div>
          <div className="mk-hero2-stage">
            <ProjectBrain />
          </div>
          <nav className="mk-caps mk-brain-caps" aria-label="The project brain">
            {BRAIN.map((b) => (
              <a className="mk-cap" href={b.href} key={b.n}>
                <span className="mk-chip" data-c={b.c}>{b.n}. {b.title}</span>
                <span className="mk-cap-line">{b.line}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* The register: what is due, from which clause, and how long is left */}
      <section className="mk-sec mk-alt mk-sec-reg" id="register">
        <div className="mk-wrap">
          <div className="mk-reg-head">
            <h2 className="mk-h2">Every notice, its clause and the days left.</h2>
            <p className="mk-lede">
              Astruct keeps the register for you. Each notice and time bar comes from the contract, each date is counted
              in business days, and each one shows whether it went out on time.
            </p>
          </div>
          <NoticeRegister />
        </div>
      </section>

      {/* 1. Reads the contract */}
      <section className="mk-sec mk-feature-sec" id="read">
        <div className="mk-wrap mk-feature">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="teal">1. Reads the contract</span>
            <h2 className="mk-h2">Your contract, read in about a minute.</h2>
            <p className="mk-body mk-feature-body">
              Head contract or subcontract, standard form or bespoke. Special conditions are read with the general
              conditions, so a replaced clause is never the one relied on.
            </p>
            <Bullets items={[
              'Contract sum, date for practical completion and liquidated damages',
              'Reference dates for payment claims and the time for payment schedules',
              'Every notice period and time bar, with its clause and page',
            ]} />
          </div>
          <div className="mk-panel"><ReadLive /></div>
        </div>
        <div className="mk-marquee-in">
          <div className="mk-wrap">
            <div className="mk-marquee-head">
              <h3 id="reads">Reads the contracts you actually sign.</h3>
              <p>Standard forms, their subcontracts and the amendments that change them.</p>
            </div>
          </div>
          <Marquee items={CONTRACTS} dur={70} />
        </div>
      </section>

      {/* 2. Answers with the clause */}
      <section className="mk-sec mk-feature-sec mk-alt" id="ask">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="blue">2. Answers with the clause</span>
            <h2 className="mk-h2">Ask anything. Get the clause and the page.</h2>
            <p className="mk-body mk-feature-body">
              Ask in your own words. Astruct answers from the contract, its amendments and the correspondence, and cites
              the clause and page for each point.
            </p>
            <Bullets items={[
              'Reads AS 2124, AS 4000, AS 4300, AS 4902 and AS 4903 style contracts, their subcontracts and amendments',
              'Knows the security of payment time limits, such as under SOPA and Queensland’s BIF Act',
              'Every answer cites the clause and the page',
            ]} />
          </div>
          <div className="mk-panel mk-panel-card"><AskLive /></div>
        </div>
        <div className="mk-wrap mk-feature mk-feature-2" id="search">
          <div className="mk-feature-copy">
            <h3 className="mk-h2">Search thousands of documents.</h3>
            <p className="mk-body mk-feature-body">
              One search runs across every document and email in the project that you are allowed to see, in Boolean or
              plain English.
            </p>
            <Bullets items={[
              'AND, OR, NOT, “exact phrases”, brackets and wildcards',
              'Proximity: w/5, NEAR/10 and pre/3 for words close together or in order',
              'Results across documents and mail, each with its page reference',
            ]} />
            <p className="mk-fine mk-feature-note"><Link className="mk-link" href="/support/boolean-search">Boolean search reference<IArrow /></Link></p>
          </div>
          <div className="mk-panel mk-panel-card"><SearchLive /></div>
        </div>
      </section>

      {/* 3. Drafts the notice */}
      <section className="mk-sec mk-feature-sec" id="draft">
        <div className="mk-wrap mk-feature mk-feature-draft">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="violet">3. Drafts the notice</span>
            <h2 className="mk-h2">The notice, on your letterhead, before the time bar.</h2>
            <p className="mk-body mk-feature-body">
              Variation notices, delay notices, EOT claims and letters, drafted from the contract and the evidence.
              Upload a letter your company has sent and every draft uses its letterhead, fonts and layout.
            </p>
            <div className="mk-ask-card ui" aria-label="The request and what Astruct did">
              <div className="dp-sent">{DRAFT_PROMPT}</div>
              <div className="dp-steps">
                {DRAFT_STEPS.map((x) => <span key={x} className="dp-step is-in"><i />{x}</span>)}
              </div>
            </div>
            <Bullets items={[
              'The clause, dates, parties and references come from the project’s own documents',
              'Downloaded as a Word file, ready to check and sign',
              'Nothing leaves until a person on your team presses Send',
            ]} />
          </div>
          <div className="mk-draft-panel"><DraftLive /></div>
        </div>
      </section>

      {/* 4. Reads the project mail */}
      <section className="mk-sec mk-feature-sec mk-alt" id="watch">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="amber">4. Reads the project mail</span>
            <h2 className="mk-h2">Connect Outlook. Astruct reads the project mail.</h2>
            <p className="mk-body mk-feature-body">
              As mail arrives, Astruct reads it for variations, delays and claims. It compares each direction with your
              scope of work, flags likely variations and potential delays, links the evidence and works out when the
              notice is due. Upstream and downstream.
            </p>
            <Bullets items={[
              'Directions compared against the scope of work',
              'Potential delays flagged from mail, minutes and programme updates',
              'Claims and payment schedules picked up, with the dates the contract sets',
            ]} />
            <p className="mk-fine mk-feature-note">New mail is picked up within about five minutes. Astruct reads only the mailboxes you connect.</p>
          </div>
          <div className="mk-panel mk-panel-card"><WatchLive /></div>
        </div>
        <div className="mk-wrap">
          <div className="mk-srcs" id="sources" aria-label="What Astruct reads">
            <div className="mk-src">
              <span className="mk-int-logo" style={{ color: 'var(--ink)' }}><GUpload /></span>
              <div><b>Your documents</b><span>The contract, drawings, programme and correspondence. Files, folders, zips and saved emails.</span></div>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-src">
              <span className="mk-int-logo"><GOutlook /></span>
              <div><b>Outlook</b><span>Personal and shared Microsoft 365 mailboxes. Shared ones need your admin’s consent, once.</span></div>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-src">
              <span className="mk-int-logo mk-int-logo-2"><GGmail /><GSharePoint /></span>
              <div><b>Procore, Gmail and SharePoint</b><span>Set up with you during the trial. Tell us when you request it.</span></div>
              <span className="mk-int-status is-request"><i className="ui-dot" />On request</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mk-sec" id="see-it-work">
        <div className="mk-wrap">
          <div className="mk-head mk-center">
            <h3 className="mk-h2">From one email to a notice, ready for review.</h3>
            <p className="mk-lede">A walkthrough on the demo project: Arcline’s façade subcontract in Fortitude Valley, Brisbane, and the site instruction that changed its brackets.</p>
          </div>
          <div className="mk-walk">
            <Walkthrough label="Astruct walkthrough on the demo project" phone={<div className="ui mk-still-phone-pad"><Clause /></div>}>
              <IssueWindow />
            </Walkthrough>
            <div className="mk-walk-steps" aria-label="What the walkthrough shows">
              <span>Mail arrives</span><span>Direction flagged</span><span>Evidence linked</span><span>Clause found</span><span>Notice drafted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mk-sec mk-alt" id="security">
        <div className="mk-wrap">
          <div className="mk-sec-top">
            <div className="mk-head">
              <h2 className="mk-h2">Your project data is stored in Australia.</h2>
              <p className="mk-lede">
                Stored in Sydney. Model requests go to OpenAI in the United States under its business API terms and are
                not used for training. Nothing leaves until a person on your team presses Send.
              </p>
              <p style={{ marginTop: 24 }}><Link className="mk-link" href="/security">How Astruct handles your data<IArrow /></Link></p>
            </div>
            <DataFlow />
          </div>
          <div className="mk-sec-grid">
            {SAFE.map((s) => (
              <div className="mk-sec-item" key={s.title}>
                <span className="mk-sec-ic">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="mk-sec" id="who">
        <div className="mk-wrap">
          <div className="mk-head">
            <h2 className="mk-h2">Built for the people who give and answer the notices.</h2>
            <p className="mk-lede">Project managers, contract administrators and commercial managers, on either side of the contract.</p>
          </div>
          <div className="mk-who">
            {WHO.map((w) => (
              <div className="mk-who-card" key={w.title}>
                <h3 className="mk-who-h">{w.title}</h3>
                <div className="mk-who-item" data-c={w.item.c}>
                  <span className="mk-who-k"><i />{w.item.kind}</span>
                  <b>{w.item.title}</b>
                  <span>{w.item.meta}</span>
                </div>
                <p className="mk-who-body">{w.body}</p>
                <Bullets items={w.points} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing, with the company account */}
      <section className="mk-sec mk-alt" id="pricing">
        <div className="mk-wrap">
          <div className="mk-head">
            <h2 className="mk-h2">Priced per project. Every user included.</h2>
            <p className="mk-lede">AU$199 a month for your first project, and less for each one after. {TRIAL_LINE}</p>
          </div>
          <PricingCards />
          <div className="mk-company" id="company">
            {COMPANY.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
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
      <section className="mk-sec mk-alt mk-close">
        <div className="mk-field mk-field-close" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="mk-wrap mk-reveal">
          <h2 className="mk-h2">Start with one project.</h2>
          <p className="mk-lede" style={{ marginTop: 22, marginLeft: 'auto', marginRight: 'auto', maxWidth: 620 }}>
            Drop in the contract, connect Outlook and ask your first question.
          </p>
          <div className="mk-cta-row">
            <a className="mk-btn" href={TRIAL_URL}>{CTA_LABEL}</a>
            <Link className="mk-link" href="/support">Visit the help centre<IArrow /></Link>
          </div>
          <p className="mk-fine" style={{ marginTop: 18 }}>{TRIAL_LINE}</p>
        </div>
      </section>
    </>
  )
}
