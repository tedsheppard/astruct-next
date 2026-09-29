// The product, drawn in HTML and CSS. Every fragment shows the synthetic demo
// project (Kestrel Street Mixed-Use, Stage 2: Arcline Façades' subcontract with
// Harrow & Vale Constructions). All names are fictional. The dates run as if
// today were Thursday 15 October 2026, in Queensland business days.
import { Mark, Wordmark } from './mark'
import { GOutlook, GSharePoint, GUpload, IDoc, IMail, ISide } from './icons'

const ISSUES = [
  { kind: 'Variation', title: 'Revised bracket system, levels 4 to 7', ref: 'SI-014', ev: 3, state: 'Draft prepared', due: 'Tue 20 Oct', left: '3 business days', soon: true },
  { kind: 'Delay', title: 'Crane 2 out of service, level 5 access late', ref: 'Crane log', ev: 4, state: 'Deadline set', due: 'Wed 21 Oct', left: '4 business days', soon: false },
  { kind: 'Variation', title: 'Additional fire-stopping at slab edge', ref: 'RFI 22', ev: 2, state: 'Evidence linked', due: 'Thu 22 Oct', left: '5 business days', soon: false },
  { kind: 'Instruction', title: 'Resequence east elevation panels', ref: 'SI-015', ev: 1, state: 'Detected', due: 'Check the clause', left: 'Rule not confirmed', soon: false },
]

/** The desktop still frame: the project page with its "Needs attention" list. */
export function AppWindow({ toast = true }: { toast?: boolean }) {
  return (
    <div className="ui ui-window">
      <aside className="ui-side">
        <div className="ui-side-brand"><Mark /><Wordmark /></div>
        <span className="ui-nav"><ISide.chat className="ui-ic" />New chat</span>
        <span className="ui-nav"><ISide.search className="ui-ic" />Search</span>
        <span className="ui-nav"><ISide.library className="ui-ic" />Library</span>
        <span className="ui-nav"><ISide.draft className="ui-ic" />Draft</span>
        <span className="ui-nav"><ISide.team className="ui-ic" />Team</span>
        <span className="ui-nav"><ISide.mail className="ui-ic" />Mail</span>
        <span className="ui-nav"><ISide.computer className="ui-ic" />Computer</span>
        <div className="ui-side-label">Projects</div>
        <span className="ui-nav is-on"><ISide.folder className="ui-ic" />Kestrel Street, Stage 2</span>
        <span className="ui-nav"><ISide.folder className="ui-ic" />Harbourside Tower</span>
        <span className="ui-nav"><ISide.folder className="ui-ic" />Northgate Depot</span>
      </aside>
      <div className="ui-main">
        <div>
          <div className="ui-proj-title">Kestrel Street Mixed-Use, Stage 2</div>
          <div className="ui-proj-meta">
            <span>Subcontract, AS 4903 amended</span>
            <span>Arcline Façades for Harrow &amp; Vale</span>
            <span>QLD</span>
            <span className="ui-live"><i className="ui-dot" />2 mailboxes · 1 folder · synced 3 min ago</span>
          </div>
        </div>
        <div>
          <div className="ui-section-title"><span>Needs attention</span><span className="ui-muted" style={{ fontWeight: 500, fontSize: 12 }}>Sorted by deadline</span></div>
          <div className="ui-card ui-list" style={{ marginTop: 10 }}>
            {ISSUES.map((i) => (
              <div className="ui-issue" key={i.ref}>
                <div>
                  <div className="ui-issue-title">{i.title}</div>
                  <div className="ui-issue-meta">
                    <span className="ui-kind">{i.kind}</span>
                    <span className="ui-mono">{i.ref}</span>
                    <span>{i.ev} evidence</span>
                    <span className={`ui-tag${i.state === 'Draft prepared' ? ' ui-tag-accent' : ''}`}>{i.state}</span>
                  </div>
                </div>
                <div className={`ui-deadline${i.soon ? ' is-soon' : ''}`}>{i.due}<small>{i.left}</small></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="ui-section-title"><span>Time bars</span></div>
          <TimeBars />
        </div>
      </div>
      {toast && (
        <div className="ui-toast mk-glass">
          <span className="ui-muted" style={{ fontSize: 11.5 }}>New mail · Project mailbox · 4:12 pm</span>
          <b>SI-014 Revised bracket system L4 to L7</b>
          <span className="ui-sub">Linked to a new variation. Notice due Tue 20 Oct.</span>
        </div>
      )}
    </div>
  )
}

function TimeBars() {
  const days = ['Thu 15', 'Fri 16', 'Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23']
  const marks: Record<string, string> = { 'Tue 20': 'SI-014 notice', 'Wed 21': 'Delay notice', 'Thu 22': 'RFI 22 notice' }
  return (
    <div className="ui-card" style={{ marginTop: 10, padding: '14px 16px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 6 }}>
        {days.map((d, i) => (
          <div key={d} style={{ display: 'grid', gap: 8 }}>
            <span className="ui-muted" style={{ fontSize: 11.5, fontWeight: i === 0 ? 650 : 500, color: i === 0 ? 'var(--ink)' : undefined }}>{i === 0 ? 'Today' : d}</span>
            <i style={{ display: 'block', height: 4, borderRadius: 4, background: marks[d] ? (d === 'Tue 20' ? 'var(--accent)' : 'var(--ink)') : 'var(--line)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 550, minHeight: 16, color: d === 'Tue 20' ? 'var(--accent-ink)' : 'var(--ink-2)' }}>{marks[d] || ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** The walkthrough still: one issue open, evidence and clause beside the prepared notice. */
export function IssueWindow() {
  const steps = [['Detected', 'done'], ['Evidence linked', 'done'], ['Deadline set', 'done'], ['Draft prepared', 'now'], ['Sent', '']]
  return (
    <div className="ui ui-window">
      <aside className="ui-side">
        <div className="ui-side-brand"><Mark /><Wordmark /></div>
        <span className="ui-nav"><ISide.chat className="ui-ic" />New chat</span>
        <span className="ui-nav"><ISide.search className="ui-ic" />Search</span>
        <span className="ui-nav"><ISide.library className="ui-ic" />Library</span>
        <span className="ui-nav"><ISide.draft className="ui-ic" />Draft</span>
        <span className="ui-nav"><ISide.mail className="ui-ic" />Mail</span>
        <div className="ui-side-label">Projects</div>
        <span className="ui-nav is-on"><ISide.folder className="ui-ic" />Kestrel Street, Stage 2</span>
        <span className="ui-nav"><ISide.folder className="ui-ic" />Harbourside Tower</span>
      </aside>
      <div className="ui-main" style={{ gap: 16 }}>
        <div>
          <div className="ui-muted" style={{ fontSize: 12 }}>Kestrel Street, Stage 2 · Issues · <span className="ui-mono">SI-014</span></div>
          <div className="ui-proj-title" style={{ marginTop: 4 }}>Revised bracket system, levels 4 to 7</div>
        </div>
        <div className="ui-steps" style={{ maxWidth: 620 }}>
          {steps.map(([s, st]) => (
            <div key={s} className={`ui-stp${st === 'done' ? ' is-done' : st === 'now' ? ' is-now' : ''}`}><i />{s}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="ui-card ui-pad" style={{ display: 'grid', gap: 12 }}>
              <span className="ui-kind">Evidence · 3</span>
              <div className="ui-quote">&ldquo;<mark>Proceed with the revised bracket system</mark> to drawing A-5102 rev D for levels 4 to 7.&rdquo;</div>
              <div className="ui-ev-src" style={{ marginTop: 0 }}><IMail className="" /><span>Email · Harrow &amp; Vale · Tue 13 Oct, 4:12 pm</span></div>
              <div className="ui-quote">&ldquo;Bracket type <mark>BR-3 replaces BR-1</mark> at levels 4 to 7.&rdquo;</div>
              <div className="ui-ev-src" style={{ marginTop: 0 }}><IDoc className="" /><span>Drawing A-5102 rev D · note 4</span></div>
            </div>
            <div className="ui-card">
              <div className="ui-pad" style={{ paddingBottom: 14 }}>
                <div className="ui-clause-head"><span className="ui-kind">Clause 36.2 · Notice of variation</span><span className="ui-tag">Check the clause</span></div>
                <p className="ui-clause-text" style={{ fontSize: 13 }}>&hellip;must give the Contractor written notice <mark>within 5 Business Days after receiving the direction</mark>&hellip;</p>
              </div>
              <div className="ui-deadline-box">
                <div><div className="ui-deadline-calc">Notice due</div><div className="ui-deadline-date" style={{ fontSize: 19 }}>Tue 20 Oct</div></div>
                <span className="ui-btn ui-btn-dark">Confirm rule</span>
              </div>
            </div>
          </div>
          <Notice />
        </div>
      </div>
    </div>
  )
}

/** The phone still frame: one issue, as it would surface. */
export function PhoneStill() {
  return (
    <div className="ui" style={{ position: 'absolute', inset: 0, padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
      <div className="ui-toast mk-glass" style={{ position: 'relative', inset: 'auto', width: 'auto' }}>
        <span className="ui-muted" style={{ fontSize: 11.5 }}>New mail · Project mailbox · 4:12 pm</span>
        <b>SI-014 Revised bracket system L4 to L7</b>
        <span className="ui-sub">Linked to a new variation.</span>
      </div>
      <IssueCard compact />
    </div>
  )
}

/** One issue with its deadline, evidence and prepared notice. */
export function IssueCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ui-card">
      <div className="ui-pad" style={{ display: 'grid', gap: 10 }}>
        <div className="ui-row" style={{ justifyContent: 'space-between' }}>
          <span className="ui-kind">Variation · <span className="ui-mono">SI-014</span></span>
          <span className="ui-tag ui-tag-accent">Draft prepared</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 650, letterSpacing: '-0.025em', lineHeight: 1.25 }}>Revised bracket system, levels 4 to 7</div>
        <div className="ui-quote">&ldquo;<mark>Proceed with the revised bracket system</mark> to drawing A-5102 rev D for levels 4 to 7.&rdquo;</div>
        <div className="ui-ev-src"><IMail className="" /><span>Email · Harrow &amp; Vale · Tue 13 Oct, 4:12 pm</span></div>
      </div>
      <div className="ui-deadline-box" style={compact ? { borderRadius: 0 } : undefined}>
        <div>
          <div className="ui-deadline-calc">Notice of variation due</div>
          <div className="ui-deadline-date">Tue 20 Oct</div>
        </div>
        <div style={{ textAlign: 'right', display: 'grid', gap: 6, justifyItems: 'end' }}>
          <span className="ui-tag">cl 36.2 · Check the clause</span>
          <span className="ui-deadline-calc">3 business days left</span>
        </div>
      </div>
      {compact && (
        <div className="ui-doc-bar" style={{ borderRadius: '0 0 16px 16px' }}>
          <span className="ui-review"><IDoc className="" />Notice prepared for review</span>
          <span className="ui-btn ui-btn-dark">Open</span>
        </div>
      )}
    </div>
  )
}

/** Beat 1: the project's mail, as it already is. */
export function MailList() {
  const rows = [
    { from: 'Harrow & Vale', subj: 'SI-014 Revised bracket system L4 to L7', time: '4:12 pm' },
    { from: 'Harrow & Vale', subj: 'Crane 2 out of service Wed and Thu', time: '11:40 am' },
    { from: 'Arcline site team', subj: 'Site diary 13 Oct: crew stood down 2 hrs', time: 'Tue' },
    { from: 'Harrow & Vale', subj: 'RFI 22 response: slab edge fire-stopping', time: 'Mon' },
    { from: 'Harrow & Vale', subj: 'Programme revision 7 issued', time: 'Mon' },
    { from: 'Kestrel Street DC', subj: 'Drawing transmittal A-5102 rev D', time: 'Mon' },
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

/** Beat 2: the live sources Astruct keeps reading. */
export function Sources() {
  const rows = [
    { g: <GOutlook />, name: 'Project mailbox', sub: 'Outlook · Microsoft 365', st: 'Synced 3 min ago' },
    { g: <GOutlook />, name: 'Commercial shared mailbox', sub: 'Outlook · admin consent given', st: 'Synced 4 min ago' },
    { g: <GSharePoint />, name: 'Kestrel St / Commercial', sub: 'SharePoint document library', st: 'Synced 12 min ago' },
    { g: <GUpload />, name: 'Uploads', sub: 'Subcontract, programme, drawings register', st: '214 documents' },
  ]
  return (
    <div className="ui">
      <div className="ui-card">
        {rows.map((r) => (
          <div className="ui-src" key={r.name}>
            <span className="ui-src-ic">{r.g}</span>
            <span><b>{r.name}</b><small>{r.sub}</small></span>
            <span className="ui-src-status"><i className="ui-dot" />{r.st}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Beat 3: the issue it spotted and the evidence it linked. */
export function Evidence() {
  const ev = [
    { q: <>&ldquo;<mark>Proceed with the revised bracket system</mark> to drawing A-5102 rev D for levels 4 to 7.&rdquo;</>, src: 'Email · Harrow & Vale · Tue 13 Oct, 4:12 pm', role: 'Trigger', icon: <IMail className="" /> },
    { q: <>&ldquo;Bracket type <mark>BR-3 replaces BR-1</mark> at levels 4 to 7.&rdquo;</>, src: 'Drawing A-5102 rev D · note 4', role: 'Supporting', icon: <IDoc className="" /> },
    { q: <>&ldquo;Crew stood down 2 hrs <mark>awaiting revised brackets</mark>.&rdquo;</>, src: 'Site diary · Wed 14 Oct', role: 'Supporting', icon: <IDoc className="" /> },
  ]
  return (
    <div className="ui">
      <div className="ui-card">
        <div className="ui-pad" style={{ paddingBottom: 14 }}>
          <div className="ui-row" style={{ justifyContent: 'space-between' }}>
            <span className="ui-kind">New issue · Variation</span>
            <span className="ui-mono ui-muted">SI-014</span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 650, letterSpacing: '-0.025em', marginTop: 6 }}>Revised bracket system, levels 4 to 7</div>
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

/** Beat 4: the clause that governs it and the deadline it sets. */
export function Clause() {
  return (
    <div className="ui">
      <div className="ui-card">
        <div className="ui-pad">
          <div className="ui-clause-head">
            <span className="ui-kind">Subcontract · clause 36.2 · page 31</span>
            <span className="ui-tag">Check the clause</span>
          </div>
          <p className="ui-clause-text">
            If the Subcontractor considers that a direction is a Variation, it must give the Contractor written notice{' '}
            <mark>within 5 Business Days after receiving the direction</mark>, and written particulars within 10 Business Days.
            Giving notice is a condition precedent to any entitlement.
          </p>
        </div>
        <div className="ui-deadline-box">
          <div>
            <div className="ui-deadline-calc">Direction received Tue 13 Oct · 5 business days · QLD</div>
            <div className="ui-deadline-date">Notice due Tue 20 Oct</div>
            <div className="ui-deadline-calc">Particulars due Tue 27 Oct</div>
          </div>
          <span className="ui-btn ui-btn-dark">Confirm rule</span>
        </div>
      </div>
    </div>
  )
}

/** Beat 5: the issue's state and its history. */
export function StateHistory() {
  const steps = [
    ['Detected', 'done'], ['Evidence linked', 'done'], ['Deadline set', 'done'], ['Draft prepared', 'now'], ['Sent', ''],
  ]
  const hist = [
    ['Tue 4:16 pm', 'Detected in the project mailbox from SI-014'],
    ['Tue 4:16 pm', 'Linked the email and drawing A-5102 rev D'],
    ['Tue 4:17 pm', 'Deadline set from clause 36.2, marked check the clause'],
    ['Wed 9:02 am', 'Linked the site diary for 14 Oct'],
    ['Thu 8:30 am', 'Notice of variation prepared for review'],
  ]
  return (
    <div className="ui">
      <div className="ui-card ui-pad">
        <div className="ui-steps">
          {steps.map(([s, st]) => (
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

/** Beat 6: the prepared notice, waiting for a person. */
export function Notice() {
  return (
    <div className="ui">
      <div className="ui-card ui-doc">
        <div className="ui-doc-page">
          <h5>Notice of Variation</h5>
          <div className="ui-doc-grid">
            <span>To</span><span>Harrow &amp; Vale Constructions Pty Ltd</span>
            <span>Subcontract</span><span>Kestrel Street Mixed-Use, Stage 2 · Façade package</span>
            <span>Date</span><span>15 October 2026</span>
          </div>
          <p>We refer to Site Instruction SI-014 dated 13 October 2026, directing the revised bracket system to drawing A-5102 revision D for levels 4 to 7.</p>
          <p>Under clause 36.2 of the Subcontract, we give notice that we consider this direction a Variation.</p>
          <p>Our written particulars will follow within 10 Business Days, by 27 October 2026.</p>
        </div>
        <div className="ui-doc-bar">
          <span className="ui-review"><IDoc className="" />Prepared for review · Not sent</span>
          <span className="ui-btn">Download .docx</span>
          <span className="ui-btn ui-btn-dark">Open in Draft</span>
        </div>
      </div>
    </div>
  )
}
