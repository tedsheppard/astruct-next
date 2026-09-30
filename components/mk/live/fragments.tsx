'use client'

// The four capabilities, alive: Ask types and streams, Search types a Boolean
// query and fills its results, Draft cycles through the kinds of document,
// Watch receives mail and flags it. Every fact is the demo pack's
// (astruct/launch/demo): Arcline Façades' subcontract HV2291-SC-014 with
// Harrow & Vale, pages from the subcontract PDF (SC 7.1 p 20, SC 8.1 p 21,
// SC 9(b) p 22, Annexure C p 25). All fictional.
import { Fragment, useEffect, useState } from 'react'
import { FINAL, fmt, prog, typed, typedEnd, useActive, useLoop } from './core'
import { ArclineMark, ArclineWordmark } from './letter'
import { IDoc, IMail, ISide } from '../icons'

function Caret({ on }: { on: boolean }) {
  return on ? <span className="lv-caret" aria-hidden="true" /> : null
}

// ── Ask ─────────────────────────────────────────────────────────────────
const ASK_Q = 'SI-014 says “no change to the subcontract sum”. Do we still need to give a variation notice, and by when?'
type Seg = { s: string; b?: boolean; sup?: string; br?: boolean }
const ASK_A: Seg[] = [
  { s: 'Yes. SC 8.1 applies to any Direction you consider a Variation, including “a Direction stated to involve no change to the Subcontract Sum”. SC 9(b) confirms the statement does not relieve you of the notice.' },
  { s: '', sup: '1, 2' },
  { s: '', br: true },
  { s: 'SI-014 was emailed on Fri 25 Sep at 3:12 pm, before 5:00 pm on a Business Day, so it was received that day.' },
  { s: '', sup: '3' },
  { s: ' Five Business Days takes the Variation Notice to ' },
  { s: 'Fri 2 Oct, 5:00 pm', b: true },
  { s: '.' },
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
              {t >= A_READ ? 'Reading Subcontract HV2291-SC-014, p 21 and p 22' : 'Thinking'}
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
                <><i>1</i>Subcontract HV2291-SC-014<b>p 21</b></>,
                <><i>2</i>Subcontract, SC 9(b)<b>p 22</b></>,
                <><i>3</i>Email · SI-014 · Fri 25 Sep</>,
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
    snip: <>&hellip;retrofit supplementary fixing plate SFP-16 with 2 additional M16 chemical <mark>anchors</mark> at each <mark>bracket</mark> position (Detail 7B)&hellip;</>,
  },
  {
    title: 'HV2291-TR-0412 Transmittal, A-512 Rev C', meta: 'Transmittals · PDF', page: 'p 1',
    snip: <>&hellip;FB-220HD <mark>bracket</mark> with 2 additional M16 chemical <mark>anchors</mark> at <mark>slab edge</mark>, L6–L9 and Roof&hellip;</>,
  },
  {
    title: 'SI-014 – Facade brackets L4-L9 to Detail 7/A-512 Rev C', meta: 'Email · Craig Pellow · Fri 25 Sep, 3:12 pm', page: 'Email',
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
  title: string
  ref: string
  meta: [string, string][]
  body: string[]
}
const DOCS: DraftDoc[] = [
  {
    kind: 'Letter', title: 'Request for TC1 maintenance and inspection records', ref: 'ARC-KS2-L-043',
    meta: [['To', 'Rebecca Lindqvist, Harrow & Vale Constructions Pty Ltd'], ['Date', 'Tuesday 29 September 2026']],
    body: [
      'Further to Arcline’s Delay Notice ARC-KS2-L-041, please provide the maintenance and inspection records for tower crane TC1 for the three months before 22 September 2026, so that Arcline can confirm whether the exception in Special Condition SC 11(c) applies.',
      'Please also confirm the handover of the Level 6 slab edge on Tuesday 6 October 2026, free of edge forms and back-props within 1.5 m of the edge (SC 12(a)).',
    ],
  },
  {
    kind: 'Email', email: true, title: 'RE: L6 slab edge handover – revised date', ref: 'Reply',
    meta: [['To', 'Rebecca Lindqvist'], ['Cc', 'Luke Farrant; contracts@harrowvale.example']],
    body: [
      'Dear Rebecca, thank you for your email of 28 September. On handover of the L6 slab edge on Tuesday 6 October, Arcline proposes to install the L6 brackets from 6 to 9 October, proof-test on 12 October and start the L5 units no earlier than 13 October.',
      'Arcline will give notice of this delay separately under Special Condition SC 7.1.',
    ],
  },
  {
    kind: 'Variation notice', title: 'Variation Notice V-06: Site Instruction SI-014', ref: 'ARC-KS2-L-042',
    meta: [['To', 'Rebecca Lindqvist, Harrow & Vale Constructions Pty Ltd'], ['Date', 'Tuesday 29 September 2026']],
    body: [
      'Arcline gives notice under Special Condition SC 8.1 that it considers the Direction in SI-014 to be a Variation. Arcline does not agree that SI-014 involves no change to the Subcontract Sum.',
      'Arcline will give its Variation Particulars under Special Condition SC 8.2 by Monday 19 October 2026.',
    ],
  },
  {
    kind: 'Notice of delay', title: 'Delay Notice under SC 7.1: TC1 and Level 6 access', ref: 'ARC-KS2-L-041',
    meta: [['To', 'Rebecca Lindqvist, Harrow & Vale Constructions Pty Ltd'], ['Date', 'Tuesday 29 September 2026']],
    body: [
      'Arcline gives notice under Special Condition SC 7.1 of two Qualifying Causes of Delay: tower crane TC1 unavailable during façade hook time on 23 to 25 September 2026, and late access to the Level 6 slab edge, now advised for 6 October 2026.',
      'Arcline became aware of both on 23 September 2026. Its preliminary estimate is a delay of not less than 12 days (7 Business Days).',
    ],
  },
  {
    kind: 'EOT claim', title: 'EOT Claim under SC 7.2: TC1 and Level 6 access', ref: 'ARC-KS2-L-044',
    meta: [['To', 'Rebecca Lindqvist, Harrow & Vale Constructions Pty Ltd'], ['Due', 'Thursday 15 October 2026']],
    body: [
      'Arcline claims an extension of time of 12 days to the Date for Practical Completion for the Qualifying Causes of Delay notified in ARC-KS2-L-041. The Level 5 unit start, on the critical path of Programme Rev 8, moves from 1 October to 13 October 2026.',
      'The delay is continuing. Arcline will update this claim every 10 Business Days, as SC 7.2(d) requires.',
    ],
  },
]

export function DraftLive() {
  const [ref, active] = useActive(0.35)
  const [idx, setIdx] = useState(2)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (!active || paused) return
    const id = window.setInterval(() => setIdx((i) => (i + 1) % DOCS.length), 5200)
    return () => window.clearInterval(id)
  }, [active, paused])
  const d = DOCS[idx]
  return (
    <div className="ui lv" ref={ref}>
      <div className="ui-kinds" role="tablist" aria-label="Kinds of draft">
        {DOCS.map((x, i) => (
          <button
            key={x.kind}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`ui-kindchip${i === idx ? ' is-on' : ''}${i === idx && active && !paused ? ' is-timing' : ''}`}
            onClick={() => { setIdx(i); setPaused(true) }}
          >
            {x.kind}
          </button>
        ))}
      </div>
      <div className="ui-card ui-doc lv-doc" role="tabpanel" aria-label={d.kind}>
        <div className="ui-doc-page lv-compose" key={d.kind}>
          {d.email ? (
            <div className="lv-mailhead" style={{ ['--i' as string]: 0 }}>
              <span><b>Maya Brennan</b> maya.brennan@arcline.example</span>
              <span className="ui-muted">Draft · not sent</span>
            </div>
          ) : (
            <div className="lv-lh" style={{ ['--i' as string]: 0 }}>
              <span className="lv-lh-brand"><ArclineMark className="lv-lh-mark" /><ArclineWordmark /></span>
              <span className="lv-lh-ref">{d.ref}</span>
            </div>
          )}
          <h5 style={{ ['--i' as string]: 1 }}>{d.title}</h5>
          <div className="ui-doc-grid" style={{ ['--i' as string]: 2 }}>
            {d.meta.map(([k, v]) => <Fragment key={k}><span>{k}</span><span>{v}</span></Fragment>)}
          </div>
          {d.body.map((p, i) => <p key={i} style={{ ['--i' as string]: 3 + i }}>{p}</p>)}
        </div>
        <div className="ui-doc-bar">
          <span className="ui-review"><IDoc className="" />{d.email ? 'Draft email · Not sent' : 'Word file · Prepared for review · Not sent'}</span>
          <span className="ui-btn">{d.email ? 'Open in Outlook' : 'Download .docx'}</span>
        </div>
      </div>
    </div>
  )
}

// ── Watch ───────────────────────────────────────────────────────────────
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
          <span className="ui-live"><i className="ui-dot lv-pulse" />Watching</span>
        </div>
        <div className={`lv-mailrow${at(5200)}`}>
          <div className="ui-watch-row">
            <div className="ui-watch-mail">
              <b>Rebecca Lindqvist</b><span className="ui-muted">Mon 1:20 pm</span>
              <div className="ui-watch-subj">RE: L6 slab edge handover – revised date</div>
            </div>
            <div className={`ui-flag lv-flag${at(6200)}`} data-c="amber">
              <span className="ui-flag-k">Possible delay</span>
              <span>L6 slab edge now handed over Tue 6 Oct, not Wed 30 Sep. L5 unit start moves.</span>
            </div>
          </div>
        </div>
        <div className={`lv-mailrow${at(500)}`}>
          <div className="ui-watch-row">
            <div className="ui-watch-mail">
              <b>Craig Pellow</b><span className="ui-muted">Fri 3:12 pm</span>
              <div className="ui-watch-subj">SI-014 – Facade brackets L4-L9 to Detail 7/A-512 Rev C</div>
            </div>
            <div className={`ui-flag lv-flag${at(1500)}`} data-c="rose">
              <span className="ui-flag-k">Direction outside scope</span>
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
            <div className={`ui-flag is-none lv-flag${at(9600)}`}><span>No action. A meeting time, not the works.</span></div>
          </div>
        </div>
        <div className="ui-dl">
          <div className={`lv-mailrow${at(7200)}`}>
            <div className="ui-dl-row">
              <span><b>Delay Notice</b><small>SC 7.1 · Subcontract p 20 · aware Wed 23 Sep</small></span>
              <span className="ui-dl-when">Wed 30 Sep, 5:00 pm<span className="ui-tag">Check the clause</span></span>
            </div>
          </div>
          <div className={`lv-mailrow${at(3600)}`}>
            <div className="ui-dl-row">
              <span><b>Variation Notice</b><small>SC 8.1 · Subcontract p 21 · received Fri 25 Sep</small></span>
              <span className="ui-dl-when">Fri 2 Oct, 5:00 pm<span className="ui-tag">Check the clause</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
