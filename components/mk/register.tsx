// The notices and time-bar register for the demo project, as Astruct keeps it.
// A server component: the whole register is in the HTML on first paint.
// Facts are the demo pack's (Arcline Façades, subcontract HV2291-SC-014 with
// Harrow & Vale; fictional). "Today" is Monday 12 October 2026. Dates count
// Brisbane business days; Monday 5 October was the King's Birthday holiday.
//   Delay Notice SC 7.1: aware Wed 23 Sep + 5 BD = Wed 30 Sep (given Tue 29 Sep)
//   Variation Notice SC 8.1: SI-014 received Fri 25 Sep + 5 BD = Fri 2 Oct (given Tue 29 Sep)
//   EOT Claim SC 7.2: aware Wed 23 Sep + 15 BD = Thu 15 Oct
//   Variation Particulars SC 8.2: 10 BD after Fri 2 Oct = Mon 19 Oct
//   Payment schedule Item 27: claim PC-09 of Fri 25 Sep + 10 BD = Mon 12 Oct
//   Payment claim Item 24: reference date the 25th, Sun 25 Oct

type Tone = 'rose' | 'amber' | 'blue' | 'teal' | 'ink'
type Row = {
  notice: string
  about: string
  clause: string
  page: string
  due: string
  left: string
  leftSub?: string
  pct: number // share of the period already used, for the bar
  status: string
  tone: Tone
  done?: boolean
}

const ROWS: Row[] = [
  {
    notice: 'Payment schedule from Harrow & Vale', about: 'Response to payment claim PC-09 of Fri 25 Sep',
    clause: 'Item 27', page: 'p 17', due: 'Mon 12 Oct', left: 'Today', leftSub: 'Not yet received', pct: 1,
    status: 'Watching the mailbox', tone: 'blue',
  },
  {
    notice: 'EOT Claim', about: 'Tower crane TC1 outage and late Level 6 access',
    clause: 'SC 7.2', page: 'p 20', due: 'Thu 15 Oct, 5:00 pm', left: '3 days', leftSub: '3 business days', pct: 0.8,
    status: 'Draft ready for review', tone: 'rose',
  },
  {
    notice: 'Variation Particulars V-06', about: 'SI-014 façade brackets, L4 to L9',
    clause: 'SC 8.2', page: 'p 21', due: 'Mon 19 Oct, 5:00 pm', left: '7 days', leftSub: '5 business days', pct: 0.5,
    status: 'Quote Q-26-1187 linked', tone: 'amber',
  },
  {
    notice: 'Payment claim PC-10', about: 'Work to 25 October',
    clause: 'Item 24', page: 'p 17', due: 'Sun 25 Oct', left: '13 days', leftSub: 'Reference date', pct: 0.55,
    status: 'Claim being prepared', tone: 'ink',
  },
  {
    notice: 'Variation Notice V-06', about: 'SI-014 façade brackets, “no change to the subcontract sum”',
    clause: 'SC 8.1', page: 'p 21', due: 'Fri 2 Oct', left: 'Given Tue 29 Sep', pct: 1,
    status: 'On time', tone: 'teal', done: true,
  },
  {
    notice: 'Delay Notice', about: 'Tower crane TC1 outage and late Level 6 access',
    clause: 'SC 7.1', page: 'p 20', due: 'Wed 30 Sep', left: 'Given Tue 29 Sep', pct: 1,
    status: 'On time', tone: 'teal', done: true,
  },
]

// Two weeks from today, with what falls due on each day.
const DAYS: { d: string; n: number; we?: boolean; mark?: { tone: Tone; label: string } }[] = [
  { d: 'M', n: 12, mark: { tone: 'blue', label: 'Payment schedule due' } },
  { d: 'T', n: 13 }, { d: 'W', n: 14 },
  { d: 'T', n: 15, mark: { tone: 'rose', label: 'EOT Claim' } },
  { d: 'F', n: 16 }, { d: 'S', n: 17, we: true }, { d: 'S', n: 18, we: true },
  { d: 'M', n: 19, mark: { tone: 'amber', label: 'Particulars V-06' } },
  { d: 'T', n: 20 }, { d: 'W', n: 21 }, { d: 'T', n: 22 }, { d: 'F', n: 23 },
  { d: 'S', n: 24, we: true }, { d: 'S', n: 25, we: true, mark: { tone: 'ink', label: 'Claim PC-10' } },
]

export function NoticeRegister() {
  return (
    <div className="rg" role="figure" aria-label="The notices and time-bar register for the demo project Kestrel Street, Stage 2, as at Monday 12 October 2026.">
      <div className="rg-head">
        <div className="rg-title">
          <b>Notices and time bars</b>
          <span>Kestrel Street, Stage 2 · Subcontract HV2291-SC-014 · demo project, fictional parties</span>
        </div>
        <div className="rg-stats">
          <span className="rg-stat" data-tone="rose"><b>2</b>due this week</span>
          <span className="rg-stat" data-tone="teal"><b>2</b>given on time</span>
          <span className="rg-stat"><b>0</b>missed</span>
        </div>
      </div>

      <div className="rg-cal" aria-hidden="true">
        <div className="rg-cal-label"><b>Today</b><span>Mon 12 Oct 2026</span></div>
        <div className="rg-days">
          {DAYS.map((x) => (
            <div key={x.n} className={`rg-day${x.we ? ' is-we' : ''}${x.n === 12 ? ' is-today' : ''}`} data-tone={x.mark?.tone}>
              <span className="rg-dow">{x.d}</span>
              <span className="rg-n">{x.n}</span>
              {x.mark && <span className="rg-mark"><i />{x.mark.label}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="rg-table" role="table" aria-label="Register">
        <div className="rg-row rg-th" role="row">
          <span role="columnheader">Notice</span>
          <span role="columnheader">Clause</span>
          <span role="columnheader">Due</span>
          <span role="columnheader">Time left</span>
          <span role="columnheader">Status</span>
        </div>
        {ROWS.map((r) => (
          <div className={`rg-row${r.done ? ' is-done' : ''}`} role="row" key={r.notice} data-tone={r.tone}>
            <span className="rg-notice" role="cell"><i /><span><b>{r.notice}</b><small>{r.about}</small></span></span>
            <span className="rg-clause" role="cell"><b>{r.clause}</b><small>Subcontract {r.page}</small></span>
            <span className="rg-due" role="cell">{r.due}</span>
            <span className="rg-left" role="cell">
              <b>{r.left}</b>
              {r.done ? <small>Due {r.due}</small> : <><span className="rg-bar"><i style={{ width: `${Math.round(r.pct * 100)}%` }} /></span>{r.leftSub && <small>{r.leftSub}</small>}</>}
            </span>
            <span className="rg-status" role="cell">{r.done && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}{r.status}</span>
          </div>
        ))}
      </div>
      <p className="rg-foot">Dates count Brisbane business days; Monday 5 October was the King’s Birthday. Each row opens the clause and page it came from, and the letter that was sent.</p>
    </div>
  )
}
