// The project chronology for the demo project, as Astruct builds it from the
// documents and mail it has filed. A server component: the whole table is in
// the HTML on first paint. Facts are the demo pack's (Arcline Façades,
// subcontract HV2291-SC-014 with Harrow & Vale; fictional). Each entry names
// the folder it was filed to and the document or email it came from.
// Styles are the .rg-* rules in look.css.

type Tone = 'rose' | 'amber' | 'blue' | 'teal' | 'ink'
type Row = {
  entry: string
  about: string
  folder: string
  sub: string
  date: string
  source: string
  from: string
  open: string
  tone: Tone
}

const ROWS: Row[] = [
  {
    entry: 'Tower crane TC1 out of service', about: 'Façade lifts cancelled Wednesday to Friday',
    folder: 'Correspondence', sub: 'Email', date: 'Wed 23 Sep',
    source: 'Email · Craig Pellow', from: 'Harrow & Vale', open: 'Opens the email', tone: 'ink',
  },
  {
    entry: 'A-512 Rev C issued for construction', about: 'Façade bracket and slab edge details, supersedes Rev B',
    folder: 'Drawings', sub: 'Transmittal TR-0412', date: 'Wed 23 Sep',
    source: 'HV2291-TR-0412.pdf', from: 'HV Document Control', open: 'Opens p 1', tone: 'blue',
  },
  {
    entry: 'SI-014: façade brackets L4 to L9', about: '“Proceed as directed, no change to the subcontract sum.”',
    folder: 'Correspondence', sub: 'Site instruction', date: 'Fri 25 Sep, 3:12 pm',
    source: 'Email · Craig Pellow', from: 'Harrow & Vale', open: 'Opens the email', tone: 'ink',
  },
  {
    entry: 'Payment claim PC-09', about: 'Work to 25 September',
    folder: 'Payment claims', sub: 'Progress claim', date: 'Fri 25 Sep',
    source: 'ARC-PC-09.pdf', from: 'Arcline', open: 'Opens p 1', tone: 'amber',
  },
  {
    entry: 'Level 6 slab edge handover moved', about: 'Now Tue 6 Oct. The Level 5 unit start moves with it.',
    folder: 'Correspondence', sub: 'Email', date: 'Mon 28 Sep, 1:20 pm',
    source: 'Email · Rebecca Lindqvist', from: 'Harrow & Vale', open: 'Opens the email', tone: 'ink',
  },
  {
    entry: 'Notice of delay ARC-KS2-L-041', about: 'Tower crane TC1 and Level 6 access, under SC 7.1',
    folder: 'Notices', sub: 'Notice of delay', date: 'Tue 29 Sep',
    source: 'ARC-KS2-L-041.pdf', from: 'Sent by Arcline', open: 'Opens the letter', tone: 'teal',
  },
  {
    entry: 'Variation notice ARC-KS2-L-042', about: 'SI-014 façade brackets, under SC 8.1',
    folder: 'Notices', sub: 'Variation', date: 'Tue 29 Sep',
    source: 'ARC-KS2-L-042.pdf', from: 'Sent by Arcline', open: 'Opens the letter', tone: 'teal',
  },
]

// Two weeks of the diary. A ring marks a day with entries.
const DAYS: { d: string; n: number; we?: boolean; tone?: Tone; label?: string }[] = [
  { d: 'M', n: 21 }, { d: 'T', n: 22 },
  { d: 'W', n: 23, tone: 'blue', label: 'TC1, A-512 Rev C' },
  { d: 'T', n: 24 },
  { d: 'F', n: 25, tone: 'amber', label: 'SI-014, PC-09' },
  { d: 'S', n: 26, we: true }, { d: 'S', n: 27, we: true },
  { d: 'M', n: 28, tone: 'ink' },
  { d: 'T', n: 29, tone: 'teal', label: 'Two notices sent' },
  { d: 'W', n: 30 }, { d: 'T', n: 1 }, { d: 'F', n: 2 },
  { d: 'S', n: 3, we: true }, { d: 'S', n: 4, we: true },
]

export function Chronology() {
  return (
    <div className="rg" role="figure" aria-label="The chronology for the demo project Kestrel Street, Stage 2, from Wednesday 23 to Tuesday 29 September 2026. Each entry is linked to the document or email it came from.">
      <div className="rg-head">
        <div className="rg-title">
          <b>Chronology</b>
          <span>Kestrel Street, Stage 2 · Subcontract HV2291-SC-014 · demo project, fictional parties</span>
        </div>
        <div className="rg-stats">
          <span className="rg-stat"><b>412</b>entries</span>
          <span className="rg-stat"><b>4,812</b>documents and emails filed</span>
          <span className="rg-stat" data-tone="teal">Export CSV</span>
        </div>
      </div>

      <div className="rg-cal" aria-hidden="true">
        <div className="rg-cal-label"><b>Diary</b><span>21 Sep to 4 Oct 2026</span></div>
        <div className="rg-days">
          {DAYS.map((x) => (
            <div key={x.n} className={`rg-day${x.we ? ' is-we' : ''}`} data-tone={x.tone}>
              <span className="rg-dow">{x.d}</span>
              <span className="rg-n">{x.n}</span>
              {x.label && <span className="rg-mark"><i />{x.label}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="rg-table" role="table" aria-label="Chronology">
        <div className="rg-row rg-th" role="row">
          <span role="columnheader">Entry</span>
          <span role="columnheader">Filed to</span>
          <span role="columnheader">Date</span>
          <span role="columnheader">Source</span>
          <span role="columnheader">Link</span>
        </div>
        {ROWS.map((r) => (
          <div className="rg-row" role="row" key={r.entry} data-tone={r.tone}>
            <span className="rg-notice" role="cell"><i /><span><b>{r.entry}</b><small>{r.about}</small></span></span>
            <span className="rg-clause" role="cell"><b>{r.folder}</b><small>{r.sub}</small></span>
            <span className="rg-date" role="cell">{r.date}</span>
            <span className="rg-left rg-src" role="cell"><b>{r.source}</b><small>{r.from}</small></span>
            <span className="rg-status" role="cell">{r.open}</span>
          </div>
        ))}
      </div>
      <p className="rg-foot">Every entry opens the document or email it came from. The chronology exports as CSV.</p>
    </div>
  )
}
