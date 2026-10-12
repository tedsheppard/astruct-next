'use client'

// "Drop in the contract": the demo subcontract is read page by page, then the
// particulars and notice periods land one by one, each with its clause and
// page. Every figure is the demo pack's own (astruct/launch/demo/subcontract:
// HV2291-SC-014, 28 pages; Agreement cl 2 p 2, Items 12, 15, 16 p 16, Items
// 24, 27 p 17, SC 7.1 and 7.2 p 20, SC 8.1 and 8.2 p 21). All fictional.
import { FINAL, useLoop } from './core'
import { IDoc } from '../icons'

const PAGES = 28
const READ = 400
const READ_END = 3200
const ROW0 = 3500
const ROW_MS = 420
const LEN = 15000
const OUT = 14400

type Row = { k: string; src: string; v: string; tag?: string }

const FACTS: Row[] = [
  { k: 'Subcontract Sum', src: 'Agreement cl 2 · p 2', v: '$4,862,540.00 ex GST' },
  { k: 'Practical completion', src: 'Item 12 · p 16', v: 'Fri 11 Dec 2026' },
  { k: 'Liquidated damages', src: 'Items 15 and 16 · p 16', v: '$3,850 a day, cap 10%' },
  { k: 'Payment claims', src: 'Item 24 · p 17', v: '25th of each month' },
  { k: 'Payment schedule', src: 'Item 27 · p 17', v: '10 Business Days' },
]

const NOTICES: Row[] = [
  { k: 'Delay Notice', src: 'SC 7.1 · p 20', v: '5 Business Days' },
  { k: 'EOT Claim', src: 'SC 7.2 · p 20', v: '15 Business Days' },
  { k: 'Variation Notice', src: 'SC 8.1 · p 21', v: '5 Business Days', tag: 'Replaces GC 19.3' },
  { k: 'Variation Particulars', src: 'SC 8.2 · p 21', v: '10 more Business Days' },
]

export function ReadLive() {
  const [ref, t] = useLoop(LEN)
  const reading = t >= READ && t < READ_END
  const done = t >= READ_END
  const page = Math.min(PAGES, Math.max(1, Math.ceil(((t - READ) / (READ_END - READ)) * PAGES)))
  const at = (i: number) => (t >= ROW0 + i * ROW_MS ? ' is-in' : '')
  const out = t >= OUT && t < FINAL

  const row = (r: Row, i: number) => (
    <div className={`lv-row${at(i)}`} key={r.k}>
      <div className="ui-dl-row">
        <span><b>{r.k}</b><small>{r.src}</small></span>
        <span className="ui-dl-when">{r.v}{r.tag && <span className="ui-tag">{r.tag}</span>}</span>
      </div>
    </div>
  )

  return (
    <div className={`ui lv${out ? ' is-out' : ''}`} ref={ref}>
      <div className="ui-card ui-watch">
        <div className="ui-watch-head">
          <span className="ui-watch-title"><IDoc className="ui-ic" />Subcontract HV2291-SC-014.pdf</span>
          <span className="ui-live lv-count">
            {done
              ? <><i className="ui-dot" />Read, {PAGES} pages</>
              : <><span className="lv-dots" aria-hidden="true"><i /><i /><i /></span>{reading ? `Page ${page} of ${PAGES}` : 'Uploading'}</>}
          </span>
        </div>
        <div className={`lv-bar${reading ? ' is-run' : ''}`}><i /></div>
        <div className="ui-dl">
          {FACTS.map((r, i) => row(r, i))}
        </div>
        <div className="ui-pad lv-read-sub"><span className="ui-kind">Notice periods and time bars</span></div>
        <div className="ui-dl">
          {NOTICES.map((r, i) => row(r, FACTS.length + i))}
        </div>
      </div>
    </div>
  )
}
