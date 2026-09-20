'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AlarmClock, Bell, Calendar, Camera, Check, Clock, FileSignature, FileText, Files, GitCompare, Mail, MailSearch, MessageSquareText, Minus, PenLine, Search, Send, X } from 'lucide-react'
import { startFreeHref } from '@/lib/site/brand'
import { ConnectorGlyph } from '@/components/site/connector-glyphs'

// The story after the hero. Each section comes up as it enters the view
// (an intersection observer adds is-in; the CSS does the rest). Every
// screen and every document shown is real: the contract and the letter are
// the ones on Astruct's own demonstration project.

const SOURCES = [
  { icon: FileSignature, name: 'The contract', note: 'Formal instrument, general conditions, annexures' },
  { icon: Files, name: 'Drawings and revisions', note: 'A-101 Rev C next to Rev D, region by region' },
  { icon: Mail, name: 'Emails and letters', note: 'Gmail, Outlook, or forwarded to your Astruct address' },
  { icon: FileText, name: 'Claims and schedules', note: 'Payment claims, schedules, variations, EOTs' },
  { icon: Calendar, name: 'Programmes', note: 'Primavera, Microsoft Project, spreadsheets' },
  { icon: Camera, name: 'Site diaries and photos', note: 'Dated, read, and searchable' },
]

const QA = [
  { q: 'When is the next reference date, and when does the payment schedule have to issue?', a: <><b>The reference date is the 25th of each month</b> (Annexure Part A, Item 11). The Principal&rsquo;s Representative must issue a payment schedule within <b>10 business days</b> of the claim (Item 12, clause 37.2). For the claim of 25 March, that is 8 April.</>, cites: ['Annexure Part A, p. 3', 'Clause 37.2, p. 41'] },
  { q: 'Has direction PR-031 been valued yet?', a: <>No. PR-031 (12 February) was claimed as a variation on 3 March at <b>$152,600</b>. No assessment under clause 36.4 has been received; the 28 days run out on <b>31 March</b>.</>, cites: ['Letter XYZ-HSR-VAR-014, p. 1', 'Clause 36.4, p. 39'] },
]

const CAN = [
  { icon: GitCompare, name: 'Variations', text: 'Spots the direction, values the work under the clause, writes the claim.' },
  { icon: AlarmClock, name: 'Notices of delay', text: 'The cause, the clause, the date counted on the calendar, sent in time.' },
  { icon: Clock, name: 'Extension of time claims', text: 'Critical path from the programme, the days claimed, the time bar met.' },
  { icon: PenLine, name: 'Correspondence', text: 'Letters and replies in your house style, on your letterhead.' },
  { icon: MessageSquareText, name: 'Answers questions', text: 'From the whole project, with the page every answer came from.' },
  { icon: Search, name: 'Finds any document', text: 'By what it says, not only what it is called. Drawings by number and revision.' },
  { icon: Send, name: 'Emails', text: 'Drafted and put in Outlook or Gmail for you to review and send.' },
  { icon: FileText, name: 'Payment claims and schedules', text: 'Every figure computed from the last one; retention, GST, the lot.' },
]

const CONTRACTS = [
  ['AS 4000-1997', 'General conditions'], ['AS 2124-1992', 'General conditions'], ['AS 4902-2000', 'Design and construct'], ['AS 4300-1995', 'Design and construct'],
  ['AS 4901-1998', 'Subcontract'], ['AS 4903-2000', 'D&C subcontract'], ['AS 4905-2002', 'Minor works'], ['AS 4906-2002', 'Minor works subcontract'],
  ['AS 4915-2002', 'Project management'], ['AS 4916-2002', 'Construction management'], ['AS 4917-2003', 'Trade contract'], ['AS 4122-2010', 'Consultants'],
  ['ABIC MW-2018', 'Major works'], ['ABIC SW-2018', 'Simple works'], ['HIA', 'Residential contracts'], ['Master Builders', 'Residential and commercial'],
  ['GC21', 'NSW Government'], ['PC-1 1998', 'Project contract'], ['NEC4', 'Engineering and construction'], ['FIDIC', 'Red, Yellow and Silver'], ['Bespoke', 'Amended and special conditions'],
]

const SYSTEMS: { id: string; name: string }[] = [
  { id: 'gmail', name: 'Gmail' }, { id: 'outlook', name: 'Outlook' }, { id: 'gdrive', name: 'Google Drive' }, { id: 'onedrive', name: 'OneDrive' },
  { id: 'sharepoint', name: 'SharePoint' }, { id: 'gcal', name: 'Google Calendar' }, { id: 'procore', name: 'Procore' }, { id: 'aconex', name: 'Aconex' },
  { id: 'hammertech', name: 'HammerTech' }, { id: 'payapps', name: 'Payapps' },
]

const COMPARE: { row: string; note?: string; bot: 'yes' | 'no' | 'part'; ax: 'yes' | 'no' | 'part' }[] = [
  { row: 'Reads the whole project', note: 'Up to 2,000 documents, every page indexed', bot: 'no', ax: 'yes' },
  { row: 'Answers with the page it came from', bot: 'no', ax: 'yes' },
  { row: 'Knows your contract’s clauses, items and time bars', bot: 'no', ax: 'yes' },
  { row: 'Counts dates on the calendar and checks every figure', bot: 'part', ax: 'yes' },
  { row: 'Drafts on your letterhead, in your house style', bot: 'no', ax: 'yes' },
  { row: 'Edits your Word file with tracked changes', bot: 'no', ax: 'yes' },
  { row: 'Watches the inbox for directions, delays and time bars', bot: 'no', ax: 'yes' },
  { row: 'Connects to Procore, Aconex, SharePoint, Outlook and Gmail', bot: 'no', ax: 'yes' },
  { row: 'Respects who can see what in the source system', bot: 'no', ax: 'yes' },
  { row: 'Never trains on your documents', note: 'Consumer chatbot plans may use your uploads to train', bot: 'no', ax: 'yes' },
  { row: 'Data held in Australia', note: 'Sydney region for the database and files', bot: 'no', ax: 'yes' },
  { row: 'Retention and deletion you control', bot: 'part', ax: 'yes' },
  { row: 'Every action on the record', note: 'What was read, written, sent, and who approved it', bot: 'no', ax: 'yes' },
]

function Mark({ v }: { v: 'yes' | 'no' | 'part' }) {
  if (v === 'yes') return <span className="ax-mark is-yes" aria-label="Yes"><Check size={15} /></span>
  if (v === 'no') return <span className="ax-mark is-no" aria-label="No"><X size={15} /></span>
  return <span className="ax-mark is-part" aria-label="Partly"><Minus size={14} /></span>
}

// The letter, a real page: as the reader scrolls the section, the page
// scrolls inside its frame so the whole of it is read.
function Letter() {
  const frame = useRef<HTMLDivElement>(null)
  const page = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const f = frame.current, pg = page.current
      if (!f || !pg) return
      const r = f.getBoundingClientRect()
      const vh = window.innerHeight
      const prog = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)))
      const travel = Math.max(0, pg.offsetHeight - r.height + 40)
      setY(-Math.round(travel * prog))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return (
    <div ref={frame} className="ax-letter-frame" aria-label="A variation and extension of time claim prepared by Astruct">
      <div className="ax-letter-marks" aria-hidden="true">
        <span className="ax-letter-mark"><Check size={13} /> <b>Clause 36.4</b> valuation cited</span>
        <span className="ax-letter-mark"><Check size={13} /> <b>28-day</b> time bar met</span>
        <span className="ax-letter-mark"><Check size={13} /> Total <b>$152,600</b> checked</span>
      </div>
      <div ref={page} className="ax-letter" style={{ transform: `translateY(${y}px)` }}>
        <div className="ax-letter-head">
          <div><b>XYZ Builders Pty Ltd</b><small>ABN 77 604 211 380 &middot; 16 Distribution Place, Seven Hills NSW 2147 &middot; contracts@xyzbuilders.example</small></div>
        </div>
        <div className="ax-letter-meta">
          <span>Our ref</span><span>XYZ-HSR-VAR-014 / EOT-006</span>
          <span>Your ref</span><span>PR-031</span>
          <span>Date</span><span>3 March 2026</span>
        </div>
        <address>ABC Developments Pty Ltd<br />Level 12, 1 Martin Place<br />Sydney NSW 2000<br /><br />Attention: Mr D. Carter, Principal&rsquo;s Representative<br />By email: d.carter@abcdevelopments.example</address>
        <p className="ax-letter-subject">Harbour Street Residences, 42 Harbour Street, Pyrmont<br />Contract No. ABC-2026-HSR-01 (AS 4902-2000 as amended)<br />Variation claim for direction PR-031 (relocation of fire booster assembly) and claim for extension of time</p>
        <p style={{ marginBottom: 10 }}>Dear Mr Carter,</p>
        <ol>
          <li>We refer to the Principal&rsquo;s Representative&rsquo;s direction PR-031 dated 12 February 2026 requiring the fire booster assembly to be relocated from the Harbour Street frontage to the Pirrama Road boundary, as shown on Fire Services drawing FS-201 Revision D.</li>
          <li><b>Variation.</b> The relocation is a variation within the meaning of clause 36.1. The work is not part of the Contractor&rsquo;s design obligations under clause 2.2 or the Principal&rsquo;s project requirements, and it was directed in writing by the Principal&rsquo;s Representative. Under clause 36.4 the variation is to be valued in accordance with Item 15 of Annexure Part A, and the Contractor&rsquo;s price is:
            <table>
              <tbody>
                <tr><td>Demolition of the installed booster cabinet and pipework</td><td>$18,420.00</td></tr>
                <tr><td>New booster assembly, pipework and civil works at Pirrama Road</td><td>$96,730.00</td></tr>
                <tr><td>Redesign and re-certification (FS-201 Rev D, hydraulic certification)</td><td>$14,900.00</td></tr>
                <tr><td>Preliminaries and supervision, 11 working days</td><td>$22,550.00</td></tr>
                <tr className="total"><td>Total (excluding GST)</td><td>$152,600.00</td></tr>
              </tbody>
            </table>
          </li>
          <li><b>Extension of time.</b> The direction was received on 12 February 2026. The relocation is on the critical path through fire services commissioning and the occupation certificate. In accordance with clause 34.3 the Contractor claims an extension of time of 11 working days to the Date for Practical Completion, from 18 December 2026 to 6 January 2027. This claim is made within 28 days of the Contractor becoming aware of the cause of delay, as Item 13 of Annexure Part A requires.</li>
          <li><b>Delay damages.</b> Under clause 34.9 the Contractor will claim delay damages for the extension at the rate in Item 14, and reserves its position pending the Principal&rsquo;s Representative&rsquo;s assessment.</li>
          <li><b>Enclosed:</b> direction PR-031; drawing FS-201 Revision D; Hydroflow Fire Pty Ltd quotation dated 24 February 2026; programme extract showing the critical path; site diary entries, 12 to 27 February 2026.</li>
          <li>We request the Principal&rsquo;s Representative&rsquo;s assessment of the variation under clause 36.4 and of the extension of time under clause 34.5 within 28 days.</li>
        </ol>
        <div className="ax-letter-sign">
          <p>Yours faithfully,</p>
          <b>Sarah Nguyen</b>
          <span>Contracts Administrator, XYZ Builders Pty Ltd</span>
          <p style={{ marginTop: 14, color: '#555' }}>Enclosures (5)</p>
        </div>
      </div>
    </div>
  )
}

export default function Story() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) e.target.classList.add('is-in') }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
    el.querySelectorAll('[data-in]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={root} className="ax-story">
      <section className="ax-sec" id="import" data-in>
        <div className="ax-sec-head">
          <span className="ax-pill"><i />Project import</span>
          <h2>Bring the whole project in. Then just ask.</h2>
          <p className="ax-lede">Drop in the folders as they are, or connect the drive the project already lives on. Astruct reads the contract first and sets the project up from it: the parties, your side, the sum, the dates, the reference date, the notice rules. Then everything else, every page indexed.</p>
        </div>
        <div className="ax-in">
          <div>
            <div className="ax-in-sources">
              {SOURCES.map((s) => <div key={s.name} className="ax-in-source"><s.icon size={18} /><div>{s.name}<small>{s.note}</small></div></div>)}
            </div>
            <p className="ax-fine" style={{ marginTop: 14 }}>Up to 2,000 documents a project. PDF, Word, Excel, drawings, scans, photos and email. Scans are read; drawings are registered by number and revision.</p>
          </div>
          <div className="ax-qa" aria-label="Questions answered from the project">
            {QA.map((x) => (
              <div key={x.q} style={{ display: 'contents' }}>
                <div className="ax-q">{x.q}</div>
                <div className="ax-a">{x.a}<div>{x.cites.map((c) => <cite key={c}><FileText size={11} />{c}</cite>)}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ax-sec ax-sec-split" id="work" data-in>
        <div className="ax-sec-text">
          <span className="ax-pill"><i />Finished work</span>
          <h2>Letters, notices and claims, set out properly.</h2>
          <p>Ask for the variation claim and you get a letter the way a good contracts administrator writes one: your letterhead and reference numbers, numbered paragraphs, the clause behind every point, each date counted on the calendar, each figure adding up. Then it is yours to check and send.</p>
          <p>Hand it your own draft instead and Astruct edits that Word file, with tracked changes, and leaves the formatting alone.</p>
          <div className="ax-cta"><a className="ax-btn ax-btn-primary" href={startFreeHref()}>Start your free trial</a></div>
        </div>
        <Letter />
      </section>

      <section className="ax-sec" data-in>
        <div className="ax-sec-head">
          <span className="ax-pill"><i />What it does</span>
          <h2>The paperwork of a project, handled.</h2>
        </div>
        <div className="ax-can">
          {CAN.map((c) => <article key={c.name} className="ax-can-item"><c.icon size={20} /><h3>{c.name}</h3><p>{c.text}</p></article>)}
        </div>
      </section>

      <section className="ax-sec" data-in style={{ paddingTop: 0 }}>
        <div className="ax-sec-head" style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 'clamp(24px, 2.6vw, 32px)' }}>Built for the contracts you actually sign.</h2>
        </div>
        <div className="ax-band" aria-label="Contract forms Astruct works with">
          <div className="ax-band-track">
            {[...CONTRACTS, ...CONTRACTS].map(([k, v], i) => <span key={`${k}-${i}`} className="ax-band-item"><b>{k}</b><span>{v}</span></span>)}
          </div>
        </div>
      </section>

      <section className="ax-dark" id="pip" data-in style={{ paddingTop: '6vh', paddingBottom: '6vh' }}>
        <div className="ax-dark-card">
          <div className="ax-pip-grid">
            <div>
              <span className="ax-pill"><i />Pip</span>
              <h2>Pip watches the project, so nothing slips.</h2>
              <p>Pip is Astruct&rsquo;s agent, and it is on the project around the clock. As emails and documents arrive it reads them for directions, variations, delays and anything with a time bar on it, and tells you what should go out and by when.</p>
              <p>It prepares the notice, holds it for you to check, and keeps the record of what was sent.</p>
              <ul className="ax-pip-list">
                <li><Bell size={16} /> Directions and instructions found in the mail</li>
                <li><AlarmClock size={16} /> Delays, and the days left to give notice</li>
                <li><GitCompare size={16} /> Variations to claim before the bar closes</li>
                <li><Calendar size={16} /> Claims and schedules due by the calendar</li>
                <li><MailSearch size={16} /> Nothing sent without you</li>
              </ul>
            </div>
            <div className="ax-pip-feed" aria-label="What Pip tells you">
              <div className="ax-pip-note"><span className="ax-orb" /><div><b>Direction received: PR-031</b><span>Fire booster to be relocated to Pirrama Road. That is a variation under clause 36.1; the claim is due by 12 March.</span><small>Draft claim prepared</small></div></div>
              <div className="ax-pip-note"><span className="ax-orb" /><div><b>Delay: tower crane out of service</b><span>The site diary for 19 February has the crane down for two days. A notice under clause 34.2 is due within 5 days.</span><small>Notice drafted, held for you</small></div></div>
              <div className="ax-pip-note"><span className="ax-orb" /><div><b>Payment claim due today</b><span>Reference date 25 February. Last month&rsquo;s certified figure and retention carried; the claim is ready.</span><small>Ready to send</small></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="ax-dark" data-in style={{ paddingBottom: '6vh' }}>
        <div className="ax-dark-card">
          <div className="ax-sys-head">
            <span className="ax-pill"><i />Where your project lives</span>
            <h2>Connected to the systems you already use.</h2>
            <p>Mail, drives and construction systems connect to the project. Astruct reads and searches what you connect, respecting who can see what in the source, and files what it finds where it belongs.</p>
          </div>
          <ul className="ax-systems">
            {SYSTEMS.map((s) => <li key={s.id}><ConnectorGlyph id={s.id} size={30} /><span>{s.name}</span></li>)}
          </ul>
          <p className="ax-note">Google Workspace and Microsoft 365 connect with your sign-in. Procore, Aconex, HammerTech and Payapps connect once your account is enabled with them.</p>
        </div>
      </section>

      <section className="ax-sec" id="compare" data-in>
        <div className="ax-sec-head">
          <span className="ax-pill"><i />Astruct or a chatbot</span>
          <h2>A general chatbot has read the internet. Astruct has read your project.</h2>
          <p className="ax-lede">Pasting a clause into a chatbot gets you an opinion. Astruct works from the whole record, cites it, and keeps your documents where they belong.</p>
        </div>
        <div className="ax-cmp">
          <table>
            <thead><tr><th scope="col">&nbsp;</th><th scope="col">General AI chatbot</th><th scope="col">Astruct</th></tr></thead>
            <tbody>
              {COMPARE.map((r) => <tr key={r.row}><th scope="row">{r.row}{r.note && <small>{r.note}</small>}</th><td><Mark v={r.bot} /></td><td><Mark v={r.ax} /></td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="ax-cmp-legend"><span><Check size={13} /> yes</span><span><Minus size={13} /> partly, or depends on the plan</span><span><X size={13} /> no</span></div>
      </section>

      <section className="ax-sec ax-close" data-in>
        <h2>Give it a job.</h2>
        <div className="ax-cta">
          <a className="ax-btn ax-btn-primary" href={startFreeHref()}>Start your free trial</a>
          <Link className="ax-btn ax-btn-ghost" href="/pricing">See pricing</Link>
        </div>
        <p className="ax-fine">Free to start, no card. Your documents stay yours, in Australia.</p>
      </section>
    </div>
  )
}
