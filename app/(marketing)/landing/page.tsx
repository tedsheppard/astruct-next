import type { Metadata } from 'next'
import Link from 'next/link'
import { Walkthrough } from '@/components/mk/media'
import { ProjectBrain } from '@/components/mk/brain/project-brain'
import { Clause, IssueWindow, Replay } from '@/components/mk/fragments'
import { AskLive, DraftLive, SearchLive, WatchLive } from '@/components/mk/live/fragments'
import { ReadLive } from '@/components/mk/live/read'
import { Chronology } from '@/components/mk/chronology'
import { DataFlow } from '@/components/mk/data-flow'
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
  { n: '1', href: '#read', c: 'teal', title: 'Reads the contract', line: 'Contract sum, practical completion, LDs, payment dates and every notice period, each with its clause and page.' },
  { n: '2', href: '#ask', c: 'blue', title: 'Answers with the clause', line: 'Search every page and email. Every answer cites the clause and page.' },
  { n: '3', href: '#draft', c: 'violet', title: 'Drafts from the contract', line: 'Notices, letters and claims in Word, on your letterhead. You send them.' },
  { n: '4', href: '#mail', c: 'amber', title: 'Files every record', line: 'Documents and email filed by project and type. Issues opened from the mail.' },
]

const SAFE: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: 'Astruct never sends', body: 'Astruct drafts. You check the draft and send it yourself. Nothing goes out from your mailbox.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14" {...ic} /><path d="M21 3l-7 18-4-7-7-4z" {...ic} /></svg>,
  },
  {
    title: 'Only what you connect', body: 'Astruct reads only the mailboxes and apps you connect. Disconnect one from Settings at any time.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...ic} /><circle cx="12" cy="12" r="2.8" {...ic} /></svg>,
  },
  {
    title: 'Your admin decides access', body: 'Owners and admins set roles and decide whose mailbox each person may search.',
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" {...ic} /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" {...ic} /><path d="M12 14.5v2.5" {...ic} /></svg>,
  },
]

// The company account: priced per project, every user included, and what each person gets.
const PLAN: { title: string; body: string }[] = [
  { title: 'Unlimited users', body: 'Astruct is priced per project, not per person. Add every contract administrator, project manager, estimator and executive on the job at no extra cost.' },
  { title: 'Spend follows your projects', body: 'You choose which projects are on Astruct, and the bill is the number of projects, plus credits for AI use.' },
  { title: 'A cloud computer for each user', body: 'A browser and a terminal in the cloud, for the web apps and files your projects run on.' },
  { title: 'Roles and access', body: 'Owners and admins invite people, set their roles and remove them. A person who is removed loses access to the company’s projects straight away.' },
]

type WhoItem = { kind: string; title: string; meta: string; c: 'rose' | 'amber' | 'blue' | 'teal' | 'violet' }
const WHO: { title: string; body: string; points: string[]; item: WhoItem }[] = [
  {
    title: 'Head contractors',
    body: 'Keep the head contract, every subcontract and the project mail in one place, and read each subcontractor claim against its subcontract with the clause and page.',
    points: ['Head contract and subcontracts read clause by clause', 'Subcontractor claims and notices filed to each project', 'Payment schedules drafted from the contract and the claim'],
    item: { kind: 'Payment claim received', title: 'Arcline PC-09, Fri 25 Sep', meta: 'Filed to Payment claims · Item 27, p 17', c: 'blue' },
  },
  {
    title: 'Subcontractors',
    body: 'See each direction next to your scope, including one that says “no change”, and draft variation notices, notices of delay and EOT claims from the evidence.',
    points: ['Variations found in the mail, with the evidence linked', 'Notices drafted from the clause and the evidence', 'Payment claims drafted for each reference date'],
    item: { kind: 'Variation notice', title: 'ARC-KS2-L-042, sent 29 Sep', meta: 'SC 8.1 · p 21 · filed to Notices', c: 'teal' },
  },
  {
    title: 'Developers',
    body: 'Read each variation and EOT claim against the contract, the programme and the correspondence, with the clause and page behind every answer.',
    points: ['Claims read against the contract and programme', 'The clause and page behind every answer', 'Responses drafted from the contract'],
    item: { kind: 'EOT claim received', title: '14 days claimed, wet weather', meta: 'AS 4000 cl 34.5 · evidence linked', c: 'amber' },
  },
]

// The request and the steps beside the drafted letter (demo pack, fictional).
const DRAFT_PROMPT = 'Draft the EOT claim for the crane outage and the Level 6 access, on our letterhead'
const DRAFT_STEPS = [
  'Read Subcontract HV2291-SC-014: SC 7.2, p 20',
  'Linked notice of delay ARC-KS2-L-041 of 29 September',
  'Checked Programme Rev 8 for the critical path',
  'Drafted on the Arcline letterhead as ARC-KS2-L-044.docx',
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

      {/* Hero: what it is, who it is for, and the project brain */}
      <section className="mk-hero2">
        <div className="mk-field mk-field-hero2" aria-hidden="true"><i /><i /><i /></div>
        <div className="mk-wrap mk-hero2-wrap">
          <div className="mk-hero2-top">
            <h1 className="mk-h1 mk-hero2-h1">Contract administration for construction. <span className="mk-grad">Every clause cited.</span></h1>
            <div className="mk-hero2-side">
              <p className="mk-hero2-lede">
                For contract administrators at Australian builders and subcontractors. Astruct reads the contract, files every
                document and email to its project, keeps the chronology, and drafts notices and claims from the contract
                and the evidence, on your letterhead. You check them and send them.
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

      {/* The chronology: the project diary, each entry linked to its source */}
      <section className="mk-sec mk-alt mk-sec-reg" id="chronology">
        <div className="mk-wrap">
          <div className="mk-reg-head">
            <h2 className="mk-h2">The project diary, every entry linked to its source.</h2>
            <p className="mk-lede">
              Astruct builds the chronology from the documents and email it files, day by day. Each entry opens the
              letter, email or drawing it came from. Export it as CSV.
            </p>
          </div>
          <Chronology />
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
              conditions, and every figure links to the words it came from.
            </p>
            <Bullets items={[
              'Contract sum, date for practical completion and liquidated damages',
              'Reference dates for payment claims and the time for payment schedules',
              'Every notice period, with its clause and page',
              'A project brain map where each clause opens its quoted words and page',
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
              Ask in your own words. Astruct answers from the contract, its amendments and the correspondence, quotes
              the clause and cites the page for each point. You read the clause and decide.
            </p>
            <Bullets items={[
              'Reads AS 2124, AS 4000, AS 4300, AS 4902 and AS 4903 style contracts, their subcontracts and amendments',
              'Each point quotes the clause and cites its page',
              'What the documents say, not legal advice',
            ]} />
          </div>
          <div className="mk-panel mk-panel-card"><AskLive /></div>
        </div>
        <div className="mk-wrap mk-feature mk-feature-2" id="search">
          <div className="mk-feature-copy">
            <h3 className="mk-h2">Search every page of every document and email.</h3>
            <p className="mk-body mk-feature-body">
              Plain English or exact Boolean, across the whole project you are allowed to see. Each result says in a
              line why it matches.
            </p>
            <Bullets items={[
              'AND, OR, NOT, “exact phrases”, brackets and wildcards',
              'Proximity: w/5, NEAR/10 and pre/3 for words close together or in order',
              'Each result opens on its page, documents and email together',
            ]} />
            <p className="mk-fine mk-feature-note"><Link className="mk-link" href="/support/boolean-search">Boolean search reference<IArrow /></Link></p>
          </div>
          <div className="mk-panel mk-panel-card"><SearchLive /></div>
        </div>
      </section>

      {/* 3. Drafts from the contract */}
      <section className="mk-sec mk-feature-sec" id="draft">
        <div className="mk-wrap mk-feature mk-feature-draft">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="violet">3. Drafts from the contract</span>
            <h2 className="mk-h2">Notices and claims, drafted from the contract and the evidence.</h2>
            <p className="mk-body mk-feature-body">
              Notices of delay, EOT claims, variation notices, payment claims and letters, in a real Word editor on
              your letterhead. It opens as .docx, in Arial or Times as Word has them, and downloads as PDF.
            </p>
            <div className="mk-ask-card ui" aria-label="The request and what Astruct did">
              <div className="dp-sent">{DRAFT_PROMPT}</div>
              <div className="dp-steps">
                {DRAFT_STEPS.map((x) => <span key={x} className="dp-step is-in"><i />{x}</span>)}
              </div>
            </div>
            <Bullets items={[
              'The clause, dates, parties and references come from the project’s own documents',
              'Opens in Word as .docx, or downloads as PDF',
              'Astruct never sends. You check it and send it yourself',
            ]} />
          </div>
          <div className="mk-draft-panel"><DraftLive /></div>
        </div>
      </section>

      {/* 4. Files every record */}
      <section className="mk-sec mk-feature-sec mk-alt" id="mail">
        <div className="mk-wrap mk-feature mk-feature-flip">
          <div className="mk-feature-copy">
            <span className="mk-kicker" data-c="amber">4. Files every record</span>
            <h2 className="mk-h2">Every document and email, filed to its project.</h2>
            <p className="mk-body mk-feature-body">
              Upload files and folders, or connect Outlook. Astruct files each one by type, from contract and
              correspondence to notices, payment claims, RFIs and drawings. Notices of delay, EOT claims, variations and
              payment claims in the mail become issues, with the evidence linked and the period the contract states.
            </p>
            <Bullets items={[
              'Uploads keep their folders',
              'Issues from the mail, with the evidence and the clause linked',
              'Astruct reads mail. It never sends from your mailbox',
            ]} />
            <p className="mk-fine mk-feature-note">New mail is picked up within about five minutes. Astruct reads only the mailboxes you connect.</p>
          </div>
          <div className="mk-panel mk-panel-card"><WatchLive /></div>
        </div>
        <div className="mk-wrap">
          <div className="mk-srcs" id="sources" aria-label="What Astruct reads">
            <div className="mk-src">
              <span className="mk-int-logo" style={{ color: 'var(--ink)' }}><GUpload /></span>
              <div><b>Your documents</b><span>The contract, drawings, programme and correspondence. Uploaded with their folder structure.</span></div>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-src">
              <span className="mk-int-logo"><GOutlook /></span>
              <div><b>Outlook</b><span>Personal and shared Microsoft 365 mailboxes. Shared ones need your admin’s consent, once.</span></div>
              <span className="mk-int-status"><i className="ui-dot" />Live</span>
            </div>
            <div className="mk-src">
              <span className="mk-int-logo mk-int-logo-2"><GGmail /><GSharePoint /></span>
              <div><b>Procore, Gmail, SharePoint and more</b><span>Connected from the Apps page, or opened in your cloud computer.</span></div>
              <span className="mk-int-status is-request"><i className="ui-dot" />Apps</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mk-sec" id="see-it-work">
        <div className="mk-wrap">
          <div className="mk-head">
            <h3 className="mk-h2">From one email to a drafted notice.</h3>
            <p className="mk-lede">A replay from Tue 29 Sep on the demo project: Arcline’s façade subcontract in Fortitude Valley, Brisbane, and the site instruction that changed its brackets. Astruct opened the issue, linked the evidence and the clause, and drafted the notice. Arcline checked it and sent it that afternoon.</p>
          </div>
          <div className="mk-walk">
            <Walkthrough label="Astruct on the demo project, a replay from Tuesday 29 September" phone={<div className="ui mk-still-phone-pad"><Replay /><Clause /></div>}>
              <IssueWindow />
            </Walkthrough>
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
                not used for training. If you add your own API key, those requests go to OpenAI under your agreement with them.
                Astruct never sends a letter or email. You do.
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
            <p className="mk-lede">Contract administrators, project managers and commercial managers, on either side of the contract.</p>
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
            <p className="mk-lede">From AU$199 a project a month ex GST, with unlimited users, plus credits for AI use. {TRIAL_LINE}</p>
          </div>
          <PricingCards />
          <div className="mk-company" id="company">
            {PLAN.map((c) => (
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
        <div className="mk-wrap mk-faq-grid">
          <div className="mk-faq-side">
            <h2 className="mk-h2">Questions</h2>
            <p className="mk-body">What people ask before they start a trial.</p>
            <p><Link className="mk-link" href="/support">More answers in the help centre<IArrow /></Link></p>
          </div>
          <Faq items={HOME_FAQ} />
        </div>
      </section>

      {/* Close */}
      <section className="mk-sec mk-alt mk-close">
        <div className="mk-field mk-field-close" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="mk-wrap">
          <h2 className="mk-h2">Start with one project.</h2>
          <p className="mk-lede" style={{ marginTop: 22, marginLeft: 'auto', marginRight: 'auto', maxWidth: 620 }}>
            Upload the contract, connect Outlook and ask your first question.
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
