// The product, drawn in HTML and CSS, using the demo pack's own facts so the
// site, the 15-second explainer, the demo account and the walkthrough match.
// Source of truth: astruct/launch/demo/story.md and mail/mail.json (Kestrel
// Street Mixed-Use, Stage 2: Arcline Façades' subcontract HV2291-SC-014 with
// Harrow & Vale Constructions). Everyone in it is fictional. Quotes are
// verbatim from the pack. The frames are set at the demo's "now": Tuesday
// 29 September 2026, mid-afternoon, Brisbane business days.
import { Mark, Wordmark } from './mark'
import { IDoc, IMail, ISide } from './icons'

const ISSUE_TITLE = 'SI-014 changes bracket system L4–L9'

/** Beat 1: the project's mail, as it already is (senders and subjects from mail.json). */
export function MailList() {
  const rows = [
    { from: 'Jess Nguyen · Harrow & Vale', subj: 'Two-week lookahead – weeks 40–41 (28 Sep – 9 Oct)', time: '2:30 pm' },
    { from: 'Rebecca Lindqvist · Harrow & Vale', subj: 'RE: L6 slab edge handover – revised date', time: 'Mon' },
    { from: 'Warren Deeks · Tasman Anchor Systems', subj: 'Quote Q-26-1187 – FB-220HD / SFP-16 / M16 anchors – Kestrel St', time: 'Mon' },
    { from: 'Craig Pellow · Harrow & Vale', subj: 'SI-014 – Facade brackets L4-L9 to Detail 7/A-512 Rev C', time: 'Fri' },
    { from: 'HV Document Control', subj: 'HV2291-TR-0412 – A-512 Rev C / S-204 Rev E – Façade bracket and slab edge details – For construction', time: '23 Sep' },
    { from: 'Craig Pellow · Harrow & Vale', subj: 'TC1 out of service – facade lifts cancelled Wed–Fri', time: '23 Sep' },
  ]
  return (
    <div className="ui">
      <div className="ui-card ui-mail">
        {rows.map((r) => (
          <div className="ui-mail-row" key={r.subj}>
            <span className="ui-mail-from">{r.from}</span>
            <span className="ui-mail-time">{r.time}</span>
            <span className="ui-mail-subj">{r.subj}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Beat 3: the issue it spotted and the evidence it linked (verbatim quotes). */
export function Evidence() {
  const ev = [
    {
      q: <>&ldquo;You are directed to <mark>change the facade bracket system at slab edges L4 to L9</mark> to Detail 7/A-512 Rev C&rdquo;</>,
      src: 'Email · Craig Pellow, Harrow & Vale · Fri 25 Sep, 3:12 pm', role: 'Trigger', icon: <IMail className="" />,
    },
    {
      q: <>&ldquo;<mark>Proceed as directed, no change to the subcontract sum.</mark>&rdquo;</>,
      src: 'Same email · SC 9(b), p 22 deals with this wording', role: 'Quoted', icon: <IMail className="" />,
    },
    {
      q: <>&ldquo;A-512 Rev C – Façade Bracket and Slab Edge Details (22/09/2026) – <mark>supersedes Rev B</mark>&rdquo;</>,
      src: 'Transmittal TR-0412 · Wed 23 Sep', role: 'Supporting', icon: <IDoc className="" />,
    },
  ]
  return (
    <div className="ui">
      <div className="ui-card">
        <div className="ui-pad" style={{ paddingBottom: 14 }}>
          <div className="ui-row" style={{ justifyContent: 'space-between' }}>
            <span className="ui-kind">New issue · Variation</span>
            <span className="ui-mono ui-muted">Kestrel Street, Stage 2</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 650, letterSpacing: '-0.025em', marginTop: 6 }}>{ISSUE_TITLE}</div>
        </div>
        <div className="ui-sep" />
        <div className="ui-pad ui-ev">
          {ev.map((e, i) => (
            <div key={i}>
              <div className="ui-quote">{e.q}</div>
              <div className="ui-ev-src">{e.icon}<span>{e.src}</span><span className="ui-tag" style={{ height: 20 }}>{e.role}</span><span className="ui-open">Open</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Beat 4: the clause, quoted, and the period it states. */
export function Clause() {
  return (
    <div className="ui">
      <div className="ui-card">
        <div className="ui-pad">
          <div className="ui-clause-head">
            <span className="ui-kind">Special Condition SC 8.1 · replaces clause 19.3</span>
            <span className="ui-tag">Check the clause</span>
          </div>
          <p className="ui-clause-text">
            &ldquo;&hellip;or a Direction stated to involve no change to the Subcontract Sum) involves or constitutes a
            Variation, the Subcontractor must, <mark>within 5 Business Days after receiving the Direction</mark>&hellip;&rdquo;
          </p>
        </div>
        <div className="ui-period-box">
          <div>
            <div className="ui-period-calc">Counted in Brisbane business days from receipt, Fri 25 Sep, 3:12 pm</div>
            <div className="ui-period-calc" style={{ marginTop: 6 }}>Period ends</div>
            <div className="ui-period-date">Fri 2 Oct</div>
            <div className="ui-period-calc">SC 8.2 particulars: a further 10 business days. Mon 5 Oct is the King’s Birthday.</div>
          </div>
          <span className="ui-btn ui-btn-dark">Open p 21</span>
        </div>
      </div>
    </div>
  )
}

const STEPS: [string, string][] = [
  ['Read from mail', 'done'], ['Evidence linked', 'done'], ['Clause linked', 'done'], ['Draft prepared', 'now'], ['Sent by you', ''],
]

/** Beat 5: the issue's state and its history. */
export function StateHistory() {
  const hist = [
    ['Fri 3:16 pm', 'Issue opened from SI-014 in the project mailbox'],
    ['Fri 3:16 pm', 'Linked TR-0412 and A-512 Rev C'],
    ['Fri 3:17 pm', 'Linked SC 8.1, p 21 and SC 9(b), p 22'],
    ['Mon 9:44 am', 'Linked Tasman quote Q-26-1187'],
    ['Tue 8:30 am', 'Variation notice V-06 prepared for review'],
  ]
  return (
    <div className="ui">
      <div className="ui-card ui-pad">
        <div className="ui-steps">
          {STEPS.map(([s, st]) => (
            <div key={s} className={`ui-stp${st === 'done' ? ' is-done' : st === 'now' ? ' is-now' : ''}`}><i />{s}</div>
          ))}
        </div>
        <div className="ui-hist">
          {hist.map(([t, h], i) => (
            <div key={i}><time>{t}</time><span>{h}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Beat 6: the drafted notice (ARC-KS2-L-042), for Arcline to check and send. */
export function Notice() {
  return (
    <div className="ui">
      <div className="ui-card ui-doc">
        <div className="ui-doc-page">
          <h5>Variation notice</h5>
          <div className="ui-doc-grid">
            <span>Our ref</span><span>ARC-KS2-L-042 (V-06)</span>
            <span>To</span><span>Rebecca Lindqvist, Harrow &amp; Vale Constructions Pty Ltd</span>
            <span>Date</span><span>Tuesday 29 September 2026</span>
          </div>
          <p>Arcline gives notice under Special Condition SC 8.1 that it considers the Direction in SI-014 to be a Variation. Arcline does not agree that SI-014 involves no change to the Subcontract Sum.</p>
          <p>Arcline will give its Variation Particulars under Special Condition SC 8.2 by Monday 19 October 2026.</p>
          <p>This letter is also a Delay Notice under Special Condition SC 7.1.</p>
          <p style={{ marginTop: 12, color: 'var(--ink)' }}>Maya Brennan<br /><span style={{ color: 'var(--ink-3)' }}>Commercial Manager, Arcline Façades Pty Ltd</span></p>
        </div>
        <div className="ui-doc-bar">
          <span className="ui-review"><IDoc className="" />Draft for review · Not sent</span>
          <span className="ui-btn">Download .docx</span>
          <span className="ui-btn ui-btn-dark">Open in Draft</span>
        </div>
      </div>
    </div>
  )
}

function IDiary() {
  return (
    <svg className="ui-ic" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.5" y="3.2" width="11" height="10.3" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 6.5h11M5.5 2v2.4M10.5 2v2.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/** The walkthrough is a replay: the frames are as they stood on Tue 29 Sep, before Arcline sent the notice. */
export function Replay() {
  return <span className="ui-replay"><i aria-hidden="true" />Replay · Tue 29 Sep, 2:40 pm</span>
}

/** The walkthrough still: the issue open, evidence and clause beside the prepared notice. */
export function IssueWindow() {
  return (
    <div className="ui ui-window">
      <aside className="ui-side">
        <div className="ui-side-brand"><Mark /><Wordmark /></div>
        <div className="ui-side-proj"><ISide.folder className="ui-ic" /><span><b>Kestrel Street, Stage 2</b><small>Façade subcontract</small></span></div>
        <span className="ui-nav"><ISide.search className="ui-ic" />Search</span>
        <span className="ui-nav"><ISide.computer className="ui-ic" />Computer</span>
        <span className="ui-nav"><ISide.library className="ui-ic" />Library</span>
        <span className="ui-nav"><IDiary />Chronology</span>
        <span className="ui-nav"><ISide.draft className="ui-ic" />Draft</span>
        <span className="ui-nav is-on"><ISide.mail className="ui-ic" />Mail<em className="ui-count">3 issues</em></span>
        <div className="ui-side-label">Other projects</div>
        <span className="ui-nav"><ISide.folder className="ui-ic" />Wharf Lane Apartments</span>
        <span className="ui-nav"><ISide.folder className="ui-ic" />Northgate Health Hub</span>
      </aside>
      <div className="ui-main" style={{ gap: 16 }}>
        <div className="ui-issue-head">
          <div>
            <div className="ui-muted" style={{ fontSize: 12 }}>Kestrel Street, Stage 2 · Mail · Issue · Variation</div>
            <div className="ui-proj-title" style={{ marginTop: 4 }}>{ISSUE_TITLE}</div>
          </div>
          <Replay />
        </div>
        <div className="ui-steps" style={{ maxWidth: 620 }}>
          {STEPS.map(([s, st]) => (
            <div key={s} className={`ui-stp${st === 'done' ? ' is-done' : st === 'now' ? ' is-now' : ''}`}><i />{s}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="ui-card ui-pad" style={{ display: 'grid', gap: 12 }}>
              <span className="ui-kind">Evidence</span>
              <div className="ui-quote">&ldquo;<mark>Proceed as directed, no change to the subcontract sum.</mark>&rdquo;</div>
              <div className="ui-ev-src" style={{ marginTop: 0 }}><IMail className="" /><span>Email · Craig Pellow, Harrow &amp; Vale · Fri 25 Sep, 3:12 pm</span></div>
              <div className="ui-quote">&ldquo;15:12 SI-014 received by email from C. Pellow&rdquo;</div>
              <div className="ui-ev-src" style={{ marginTop: 0 }}><IDoc className="" /><span>Arcline site diary · Fri 25 Sep</span></div>
            </div>
            <div className="ui-card">
              <div className="ui-pad" style={{ paddingBottom: 14 }}>
                <div className="ui-clause-head"><span className="ui-kind">SC 8.1 · Variation notice · p 21</span><span className="ui-tag">Check the clause</span></div>
                <p className="ui-clause-text" style={{ fontSize: 13 }}>&ldquo;&hellip;the Subcontractor must, <mark>within 5 Business Days after receiving the Direction</mark>&hellip;&rdquo;</p>
              </div>
              <div className="ui-period-box">
                <div><div className="ui-period-calc">Period ends · 5 business days from receipt</div><div className="ui-period-date" style={{ fontSize: 19 }}>Fri 2 Oct</div></div>
                <span className="ui-btn ui-btn-dark">Open p 21</span>
              </div>
            </div>
          </div>
          <Notice />
        </div>
      </div>
    </div>
  )
}
