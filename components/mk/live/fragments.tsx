'use client'

// The four capabilities, alive: Ask types and streams, Search types a Boolean
// query and fills its results, Draft cycles through the kinds of document,
// Mail receives messages, files each one and opens an issue where it finds one. Every fact is the demo pack's
// (astruct/launch/demo): Arcline Façades' subcontract HV2291-SC-014 with
// Harrow & Vale, pages from the subcontract PDF (SC 7.1 p 20, SC 8.1 p 21,
// SC 9(b) p 22, Annexure C p 25). All fictional.
import { Fragment, useEffect, useState } from 'react'
import { FINAL, fmt, prog, typed, typedEnd, useActive, useLoop } from './core'
import { LetterPage, type LetterPara } from './letter'
import { IDoc, IMail, ISide } from '../icons'

function Caret({ on }: { on: boolean }) {
  return on ? <span className="lv-caret" aria-hidden="true" /> : null
}

// ── Ask ─────────────────────────────────────────────────────────────────
const ASK_Q = 'SI-014 says “no change to the subcontract sum”. What does the subcontract say about a variation notice for it?'
type Seg = { s: string; b?: boolean; sup?: string; br?: boolean }
const ASK_A: Seg[] = [
  { s: 'SC 8.1 (p 21) covers a Direction the Subcontractor considers a Variation, including “a Direction stated to involve no change to the Subcontract Sum”. The notice is to be given ' },
  { s: '“within 5 Business Days after receiving the Direction”', b: true },
  { s: '.' },
  { s: '', sup: '1' },
  { s: ' SC 9(b) (p 22) says such a statement “does not relieve the Subcontractor of the requirement to give a Variation Notice”.' },
  { s: '', sup: '2' },
  { s: '', br: true },
  { s: 'SC 4 (p 19) treats an email as received “when sent, if it is sent before 5.00 pm on a Business Day”. SI-014 was emailed on Fri 25 Sep at 3:12 pm.' },
  { s: '', sup: '3, 4' },
]
const ASK_LEN = ASK_A.reduce((n, x) => n + x.s.length, 0)
const A_Q0 = 500
const A_SEND = typedEnd(ASK_Q, A_Q0, 30) + 350
const A_READ = A_SEND + 400
const A_ANS = A_READ + 1300
const A_ANS_MS = 11
const A_CITE = A_ANS + ASK_LEN * A_ANS_MS + 200
const A_OUT = 15600
const A_LEN = 16200

export function AskLive() {
  const [ref, t] = useLoop(A_LEN)
  const sent = t >= A_SEND
  const q = sent ? '' : typed(ASK_Q, t, A_Q0, 30)
  let budget = t >= FINAL ? Infinity : t < A_ANS ? 0 : Math.floor((t - A_ANS) / A_ANS_MS)
  const answering = t >= A_ANS
  const out = t >= A_OUT && t < FINAL
  return (
    <div className={`ui lv${out ? ' is-out' : ''}`} ref={ref}>
      <div className="ui-card ui-chat lv-chat">
        <div className="lv-chat-body">
          <div className={`ui-chat-q lv-fade${sent ? ' is-in' : ''}`}>{ASK_Q}</div>
          <div className="ui-chat-a lv-answer">
            <div className={`lv-reading${sent && t < A_ANS ? ' is-in' : ''}`} aria-hidden="true">
              <span className="lv-dots"><i /><i /><i /></span>
              {t >= A_READ ? 'Reading Subcontract HV2291-SC-014, p 19, p 21 and p 22' : 'Thinking'}
            </div>
            <p>
              {ASK_A.map((seg, i) => {
                if (seg.br) return <Fragment key={i}><br /><br /></Fragment>
                if (seg.sup) return <sup key={i} className={budget > 0 ? '' : 'lv-ghost'}>{seg.sup}</sup>
                const n = Math.max(0, Math.min(seg.s.length, budget))
                budget -= seg.s.length
                const shown = seg.s.slice(0, n)
                const rest = seg.s.slice(n)
                const body = <>{shown}{n > 0 && n < seg.s.length && answering && <Caret on />}<span className="lv-ghost">{rest}</span></>
                return seg.b ? <b key={i}>{body}</b> : <Fragment key={i}>{body}</Fragment>
              })}
            </p>
            <div className="ui-cites">
              {[
                <><i>1</i>Subcontract, SC 8.1<b>p 21</b></>,
                <><i>2</i>Subcontract, SC 9(b)<b>p 22</b></>,
                <><i>3</i>Subcontract, SC 4<b>p 19</b></>,
                <><i>4</i>Email · SI-014 · Fri 25 Sep</>,
              ].map((c, i) => (
                <span key={i} className={`ui-cite lv-chip${t >= A_CITE + i * 220 ? ' is-in' : ''}`}>{c}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="lv-composer">
          <span className={q ? 'lv-typed' : 'lv-ph'}>{q || 'Ask about Kestrel Street, Stage 2'}</span>
          <Caret on={!sent && t > 0 && t < FINAL} />
          <span className={`lv-send${t >= A_SEND - 350 && t < A_SEND + 200 ? ' is-hot' : ''}`} aria-hidden="true">
            <svg viewBox="0 0 16 16"><path d="M8 13V3.5M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Search ──────────────────────────────────────────────────────────────
const S_Q = 'bracket* w/5 ("slab edge" OR anchor*) AND "Rev C"'
const S_Q0 = 400
const S_RUN = typedEnd(S_Q, S_Q0, 42) + 300
const S_COUNT = S_RUN + 900
const S_TOTAL = 14
const S_OUT = 14400
const S_LEN = 15000

function highlightQuery(q: string) {
  const parts = q.split(/(\bAND\b|\bOR\b|\bNOT\b|w\/\d*|NEAR\/\d*|pre\/\d*|[()])/g)
  return parts.map((p, i) =>
    /^(AND|OR|NOT)$|^(w|NEAR|pre)\//.test(p) ? <em key={i}>{p}</em> : p === '(' || p === ')' ? <b key={i}>{p}</b> : <span key={i}>{p}</span>,
  )
}

const RESULTS = [
  {
    title: 'HV2291-SI-014 Site Instruction', meta: 'Site instructions · PDF', page: 'p 1',
    why: 'bracket within 5 words of anchors; “Rev C” on p 1',
    snip: <>&hellip;retrofit supplementary fixing plate SFP-16 with 2 additional M16 chemical <mark>anchors</mark> at each <mark>bracket</mark> position (Detail 7B)&hellip;</>,
  },
  {
    title: 'HV2291-TR-0412 Transmittal, A-512 Rev C', meta: 'Transmittals · PDF', page: 'p 1',
    why: 'bracket within 5 words of anchors and slab edge; “Rev C” in the title',
    snip: <>&hellip;FB-220HD <mark>bracket</mark> with 2 additional M16 chemical <mark>anchors</mark> at <mark>slab edge</mark>, L6–L9 and Roof&hellip;</>,
  },
  {
    title: 'SI-014 – Facade brackets L4-L9 to Detail 7/A-512 Rev C', meta: 'Email · Craig Pellow · Fri 25 Sep, 3:12 pm', page: 'Email',
    why: 'bracket within 5 words of slab edges; “Rev C” in the subject',
    snip: <>&hellip;change the facade <mark>bracket</mark> system at <mark>slab edges</mark> L4 to L9 to Detail 7/A-512 <mark>Rev C</mark>&hellip;</>,
  },
]

export function SearchLive() {
  const [ref, t] = useLoop(S_LEN)
  const q = t >= FINAL ? S_Q : typed(S_Q, t, S_Q0, 42)
  const running = t >= S_RUN && t < S_COUNT
  const count = t >= FINAL ? S_TOTAL : Math.round(S_TOTAL * prog(t, S_COUNT, S_COUNT + 900))
  const out = t >= S_OUT && t < FINAL
  return (
    <div className={`ui lv${out ? ' is-out' : ''}`} ref={ref}>
      <div className="ui-card ui-search">
        <div className="ui-search-bar">
          <ISide.search className="ui-ic" />
          <code className="ui-q">{highlightQuery(q)}<Caret on={t < S_RUN && t > 0} /></code>
        </div>
        <div className="ui-search-sub">
          <span className="ui-seg"><span className="is-on">Boolean</span><span>Plain English</span></span>
          <span className="ui-muted lv-count">
            {running ? 'Searching 4,812 documents and emails' : t >= S_COUNT ? `${fmt(count)} results · 4,812 searched` : 'Kestrel Street, Stage 2'}
          </span>
        </div>
        <div className={`lv-bar${running ? ' is-run' : ''}`} aria-hidden="true"><i /></div>
        <div className="ui-results lv-results">
          {RESULTS.map((r, i) => {
            const at = S_COUNT + 150 + i * 330
            return (
              <div className={`ui-result lv-row${t >= at ? ' is-in' : ''}`} key={r.title}>
                <div className="ui-result-head">
                  <span className="ui-result-ic">{r.page === 'Email' ? <IMail className="" /> : <IDoc className="" />}</span>
                  <span className="ui-result-title">{r.title}</span>
                  <span className={`ui-page lv-chip${t >= at + 260 ? ' is-in' : ''}`}>{r.page}</span>
                </div>
                <div className="ui-result-meta">{r.meta}</div>
                <div className="ui-result-snip">{r.snip}</div>
                <div className="ui-result-meta ui-result-why">Matches: {r.why}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Draft ───────────────────────────────────────────────────────────────
type DraftDoc = {
  kind: string
  email?: boolean
  refNo: string
  date: string
  subject: string[]
  paras: LetterPara[]
  /** Where the document stands on Mon 12 Oct in the demo. Astruct drafts; Arcline sends. */
  status: string[]
}
const PROJ = 'Kestrel Street Mixed-Use, Stage 2: Subcontract HV2291-SC-014 (Façade Package)'
const DOCS: DraftDoc[] = [
  {
    kind: 'EOT claim', refNo: 'ARC-KS2-L-044', date: '12 October 2026',
    subject: [PROJ, 'EOT Claim under Special Condition SC 7.2: tower crane TC1 and access to the Level 6 slab edge'],
    paras: [
      { h: 'Claim.', body: 'Arcline claims an extension of time of 12 days to the Date for Practical Completion for the Qualifying Causes of Delay notified in ARC-KS2-L-041.' },
      { h: 'Critical path.', body: 'The curtain wall units are top-hung and Programme Rev 8 has no float in the façade sequence. The Level 5 unit start moves from 1 October to 13 October 2026.' },
      { h: 'Records.', body: 'Attached are the site diary for the week ending 25 September 2026, the crane schedule for week 39 and your emails of 23 and 28 September 2026.' },
      { h: 'Continuing delay.', body: 'The delay is continuing. Arcline will update this claim every 10 Business Days, as SC 7.2(d) requires.' },
    ],
    status: ['Draft for review', 'Not sent', 'Word and PDF'],
  },
  {
    kind: 'Notice of delay', refNo: 'ARC-KS2-L-041', date: '29 September 2026',
    subject: [PROJ, 'Delay Notice under Special Condition SC 7.1: tower crane TC1 and access to the Level 6 slab edge'],
    paras: [
      { h: 'Notice.', body: 'Arcline gives notice under Special Condition SC 7.1 of two Qualifying Causes of Delay, each of which has delayed Arcline in reaching Practical Completion.' },
      { h: 'Causes.', body: 'Tower crane TC1 was unavailable during Arcline’s allocated façade hook time on 23, 24 and 25 September 2026 (SC 11(b)). The Level 6 slab edge, programmed for 23 September 2026, is now to be handed over on 6 October 2026 (SC 12(b)).' },
      { h: 'Awareness.', body: 'Arcline first became aware of both causes on Wednesday 23 September 2026.' },
      { h: 'Estimate.', body: 'Arcline’s preliminary estimate is a delay to Practical Completion of not less than 12 days (7 Business Days).' },
    ],
    status: ['Sent by Arcline, Tue 29 Sep'],
  },
  {
    kind: 'Variation notice', refNo: 'ARC-KS2-L-042', date: '29 September 2026',
    subject: [PROJ, 'Variation Notice under Special Condition SC 8.1: Site Instruction SI-014 (Arcline variation V-06)'],
    paras: [
      { h: 'The Direction.', body: 'On Friday 25 September 2026 at 3.12 pm, Craig Pellow, Site Manager, issued Site Instruction SI-014 by email. It directs Arcline to change the façade bracket system at slab edges L4 to L9 to Detail 7/A-512 Rev C.' },
      { h: 'Notice.', body: 'Arcline gives notice under Special Condition SC 8.1 that it considers the Direction in SI-014 to be a Variation. Arcline does not agree that SI-014 involves no change to the Subcontract Sum.' },
      { h: 'Why it is a Variation.', body: 'Annexure Part C, C3 includes A-512 Rev B, whose Detail 7 specifies FB-150 brackets with 2 × M12 anchors. Rev C changes the bracket and fixing system and requires work already carried out at L4 and L5 to be modified.' },
      { h: 'Particulars.', body: 'Arcline will give its Variation Particulars under Special Condition SC 8.2 by Monday 19 October 2026.' },
    ],
    status: ['Sent by Arcline, Tue 29 Sep'],
  },
  {
    kind: 'Letter', refNo: 'ARC-KS2-L-043', date: '29 September 2026',
    subject: [PROJ, 'Tower crane TC1: request for maintenance and inspection records'],
    paras: [
      { h: 'Request.', body: 'Further to Arcline’s Delay Notice ARC-KS2-L-041, please provide the maintenance and inspection records for tower crane TC1 for the three months before 22 September 2026.' },
      { h: 'Purpose.', body: 'Arcline needs the records to confirm whether the exception in Special Condition SC 11(c) applies to the outage.' },
      { h: 'Level 6 access.', body: 'Please also confirm in writing that the Level 6 slab edge will be handed over on Tuesday 6 October 2026, free of edge forms, screens and back-props within 1.5 m of the edge (SC 12(a)).' },
    ],
    status: ['Sent by Arcline, Tue 29 Sep'],
  },
  {
    kind: 'Email', email: true, refNo: '', date: '', subject: ['RE: L6 slab edge handover – revised date'],
    paras: [],
    status: ['Sent by Arcline, Tue 29 Sep'],
  },
]

function EmailDraft() {
  return (
    <div className="lt-page em-page">
      <div className="em-rows">
        <div><span>From</span><b>Maya Brennan &lt;maya.brennan@arcline.example&gt;</b></div>
        <div><span>To</span>Rebecca Lindqvist &lt;rebecca.lindqvist@harrowvale.example&gt;</div>
        <div><span>Cc</span>Luke Farrant; contracts@harrowvale.example</div>
        <div><span>Subject</span><b>RE: L6 slab edge handover – revised date</b></div>
      </div>
      <div className="em-body">
        <p>Dear Rebecca</p>
        <p>Thank you for your email of 28 September. On handover of the Level 6 slab edge on Tuesday 6 October, Arcline proposes to re-sequence as follows:</p>
        <ul>
          <li>Level 6 brackets installed from 6 to 9 October</li>
          <li>Proof-testing on 12 October</li>
          <li>Level 5 units to start no earlier than 13 October</li>
        </ul>
        <p>Arcline will give notice of this delay separately under Special Condition SC 7.1.</p>
        <p>Kind regards</p>
        <p className="em-sig"><b>Maya Brennan</b><br />Commercial Manager<br />Arcline Façades Pty Ltd · T 07 5550 0860</p>
      </div>
    </div>
  )
}

export function DraftLive() {
  const [ref, active] = useActive(0.35)
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  // The first document is in the HTML, complete. Only a change of tab composes.
  const [moved, setMoved] = useState(false)
  useEffect(() => {
    if (!active || paused) return
    const id = window.setInterval(() => { setMoved(true); setIdx((i) => (i + 1) % DOCS.length) }, 6500)
    return () => window.clearInterval(id)
  }, [active, paused])
  const d = DOCS[idx]
  return (
    <div className="ui lv" ref={ref}>
      <div className="dr-tabs" role="tablist" aria-label="Kinds of draft">
        {DOCS.map((x, i) => (
          <button
            key={x.kind}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`dr-tab${i === idx ? ' is-on' : ''}${i === idx && active && !paused ? ' is-timing' : ''}`}
            onClick={() => { setMoved(true); setIdx(i); setPaused(true) }}
          >
            {x.kind}
          </button>
        ))}
      </div>
      <div className="dr-canvas" role="tabpanel" aria-label={d.kind}>
        <div className={`dr-page${moved ? ' lv-compose' : ''}`} key={d.kind}>
          {d.email ? <EmailDraft /> : <LetterPage refNo={d.refNo} date={d.date} subject={d.subject} paras={d.paras} />}
        </div>
      </div>
      <div className="dr-bar">
        <span className="dr-file"><IDoc className="" />{d.email ? 'Draft email' : `${d.refNo}.docx`}</span>
        {d.status.map((c) => <span className="dr-chip" key={c}>{c}</span>)}
      </div>
    </div>
  )
}

// ── Mail: filed, and issues opened ──────────────────────────────────────
const W_LEN = 15000
const W_OUT = 14400

export function WatchLive() {
  const [ref, t] = useLoop(W_LEN)
  const at = (ms: number) => (t >= ms ? ' is-in' : '')
  const out = t >= W_OUT && t < FINAL
  return (
    <div className={`ui lv${out ? ' is-out' : ''}`} ref={ref}>
      <div className="ui-card ui-watch">
        <div className="ui-watch-head">
          <span className="ui-watch-title"><ISide.mail className="ui-ic" />Mail · Kestrel Street, Stage 2</span>
          <span className="ui-live"><i className="ui-dot lv-pulse" />Outlook connected</span>
        </div>
        <div className={`lv-mailrow${at(5200)}`}>
          <div className="ui-watch-row">
            <div className="ui-watch-mail">
              <b>Rebecca Lindqvist</b><span className="ui-muted">Mon 28 Sep, 1:20 pm</span>
              <div className="ui-watch-subj">RE: L6 slab edge handover – revised date</div>
            </div>
            <div className={`ui-flag lv-flag${at(6200)}`} data-c="amber">
              <span className="ui-flag-k">Issue opened · Delay</span>
              <span>L6 slab edge now handed over Tue 6 Oct, not Wed 30 Sep. Linked to the TC1 issue and Programme Rev 8.</span>
            </div>
          </div>
        </div>
        <div className={`lv-mailrow${at(500)}`}>
          <div className="ui-watch-row">
            <div className="ui-watch-mail">
              <b>Craig Pellow</b><span className="ui-muted">Fri 25 Sep, 3:12 pm</span>
              <div className="ui-watch-subj">SI-014 – Facade brackets L4-L9 to Detail 7/A-512 Rev C</div>
            </div>
            <div className={`ui-flag lv-flag${at(1500)}`} data-c="blue">
              <span className="ui-flag-k">Issue opened · Variation</span>
              <span className="ui-cmp">
                <span className={`lv-chip${at(2300)}`}><small>Scope · Annexure C, p 25</small>FB-150 brackets, 2 × M12 anchors</span>
                <span className={`lv-chip${at(2800)}`}><small>SI-014</small>FB-220HD brackets, 2 extra M16 anchors</span>
              </span>
            </div>
          </div>
        </div>
        <div className={`lv-mailrow${at(8800)}`}>
          <div className="ui-watch-row is-quiet">
            <div className="ui-watch-mail">
              <b>Jess Nguyen</b><span className="ui-muted">16 Sep</span>
              <div className="ui-watch-subj">Variation to meeting time – Façade coordination Thu 17 Sep now 1.30 pm</div>
            </div>
            <div className={`ui-flag is-none lv-flag${at(9600)}`}><span>Filed to General correspondence · Meeting minutes</span></div>
          </div>
        </div>
        <div className="ui-dl">
          <div className={`lv-mailrow${at(7200)}`}>
            <div className="ui-dl-row">
              <span><b>Notice of delay</b><small>SC 7.1 · Subcontract p 20 · 5 business days from the event</small></span>
              <span className="ui-dl-when">Period ends Wed 30 Sep<span className="ui-tag ui-tag-accent">3 documents linked</span></span>
            </div>
          </div>
          <div className={`lv-mailrow${at(3600)}`}>
            <div className="ui-dl-row">
              <span><b>Variation notice</b><small>SC 8.1 · Subcontract p 21 · 5 business days from receipt</small></span>
              <span className="ui-dl-when">Period ends Fri 2 Oct<span className="ui-tag ui-tag-accent">Evidence linked</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
