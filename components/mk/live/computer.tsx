'use client'

// Astruct on its own computer: a desktop drawn to a fixed 760 × 520 design
// and scaled to fit. The cursor opens the subcontract, searches "SC 9(b)",
// lands on the clause on p 22 and drafts paragraph 3 of the Variation Notice
// citing it. The clause text is the demo subcontract's own (SC 9(b), p 22).
import { useEffect, useRef, useState } from 'react'
import { FINAL, typed, typedEnd, useLoop } from './core'
import { Mark } from '../mark'
import { ContractCover, ContractPage22, LetterPage } from './letter'

const W = 760
const H = 520

const Q = 'SC 9(b)'
const PARA = 'SI-014 states that it involves no change to the subcontract sum. Under Special Condition SC 9(b), that statement does not relieve Arcline of the requirement to give this notice, and Arcline does not accept it.'

// Timeline (ms)
const T_OPEN = 1700
const T_SEARCH_CLICK = 3300
const T_TYPE = 3600
const T_ENTER = typedEnd(Q, T_TYPE, 120) + 250
const T_FOUND = T_ENTER + 500
const T_POINT = T_FOUND + 900
const T_DOC = T_POINT + 1500
const T_DRAFT = T_DOC + 1400
const T_DRAFTED = typedEnd(PARA, T_DRAFT, 22)
const T_OUT = T_DRAFTED + 5200
const LEN = T_OUT + 600

// Where the cursor is (design px), keyed by time.
const PATH: [number, number, number][] = [
  [0, 520, 300],
  [600, 112, 140], // the subcontract in the tree
  [2300, 637, 117], // the search box
  [T_ENTER + 300, 637, 117],
  [T_FOUND + 200, 500, 402], // the highlighted clause
  [T_POINT + 400, 130, 308], // the draft in the tree
  [T_DOC + 200, 330, 340], // into the editor, para 3
]
const CLICKS = [1300, 1500, T_SEARCH_CLICK, T_POINT + 1100, T_DOC + 1150]

export const STEPS = [
  { at: T_OPEN, s: 'Opened Subcontract HV2291-SC-014.pdf' },
  { at: T_ENTER, s: 'Searched “SC 9(b)”' },
  { at: T_FOUND, s: 'Found it on p 22 of 28' },
  { at: T_DOC, s: 'Opened ARC-KS2-L-042 Variation Notice.docx' },
  { at: T_DRAFTED, s: 'Drafted para 3, citing SC 9(b), p 22' },
]

function cursorAt(t: number): [number, number] {
  let p = PATH[0]
  for (const x of PATH) if (t >= x[0]) p = x
  return [p[1], p[2]]
}

function Tree({ t, fin }: { t: number; fin: boolean }) {
  const pdfOn = !fin && t >= 1300 && t < T_POINT + 1100
  const docOn = fin || t >= T_POINT + 1100
  const row = (label: string, depth: number, opts: { folder?: boolean; open?: boolean; on?: boolean; n?: string } = {}) => (
    <div className={`cm-row${opts.on ? ' is-on' : ''}`} style={{ paddingLeft: 10 + depth * 14 }}>
      {opts.folder ? <span className="cm-tw">{opts.open ? '▾' : '▸'}</span> : <span className="cm-tw" />}
      <span className={`cm-ico${opts.folder ? ' is-folder' : ''}`} />
      <span className="cm-lbl">{label}</span>
      {opts.n && <span className="cm-n">{opts.n}</span>}
    </div>
  )
  return (
    <div className="cm-tree">
      {row('Kestrel Street, Stage 2', 0, { folder: true, open: true })}
      {row('Contract', 1, { folder: true, open: true })}
      {row('Subcontract HV2291-SC-014.pdf', 2, { on: pdfOn })}
      {row('Tender clarifications.pdf', 2)}
      {row('Correspondence', 1, { folder: true, n: '1,204' })}
      {row('Drawings', 1, { folder: true, n: '386' })}
      {row('Programme', 1, { folder: true })}
      {row('Site records', 1, { folder: true })}
      {row('Drafts', 1, { folder: true, open: true })}
      {row('ARC-KS2-L-042 Variation Notice.docx', 2, { on: docOn })}
    </div>
  )
}

export function ComputerLive() {
  const [ref, t] = useLoop<HTMLDivElement>(LEN, 0.3)
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const fin = t >= FINAL
  const out = t >= T_OUT && !fin
  const view: 'empty' | 'pdf' | 'doc' = fin || t >= T_DOC ? 'doc' : t >= T_OPEN ? 'pdf' : 'empty'
  const found = fin || t >= T_FOUND
  const q = fin ? Q : t >= T_TYPE ? typed(Q, t, T_TYPE, 120) : ''
  const para = fin ? PARA : typed(PARA, t, T_DRAFT, 22)
  const [cx, cy] = cursorAt(fin ? 0 : t)
  const clicking = !fin && CLICKS.some((c) => t >= c && t < c + 260)
  const stepsOn = STEPS.filter((s) => fin || t >= s.at)

  return (
    <div className={`cm${out ? ' is-out' : ''}`} ref={ref}>
      <div className="cm-wrap" ref={wrap} style={{ height: H * scale }}>
        <div className="cm-desk" style={{ width: W, height: H, transform: `scale(${scale})` }} aria-hidden="true">
          <div className="cm-wall" />
          <div className="cm-menubar">
            <Mark className="cm-apple" />
            <b>Astruct</b><span>File</span><span>Edit</span><span>View</span><span>Window</span>
            <span className="cm-clock">Tue 29 Sep 2:41 pm</span>
          </div>
          <div className="cm-win">
            <div className="cm-bar">
              <span className="cm-lights"><i /><i /><i /></span>
              <span className="cm-title">Kestrel Street, Stage 2</span>
            </div>
            <div className="cm-body">
              <Tree t={t} fin={fin} />
              <div className="cm-main">
                <div className="cm-tabs">
                  <span className={`cm-tab${view === 'pdf' ? ' is-on' : ''}${view === 'empty' ? ' is-hidden' : ''}`}>Subcontract HV2291-SC-014.pdf</span>
                  <span className={`cm-tab${view === 'doc' ? ' is-on' : ''}${view !== 'doc' ? ' is-hidden' : ''}`}>ARC-KS2-L-042.docx</span>
                </div>
                {view === 'empty' && <div className="cm-empty">Kestrel Street, Stage 2 · 4,812 documents</div>}
                {view === 'pdf' && (
                  <>
                    <div className="cm-tool">
                      <span className="cm-pg">{found ? 'p 22 of 28' : 'p 1 of 28'}</span>
                      <span className={`cm-find${t >= T_SEARCH_CLICK ? ' is-focus' : ''}`}>
                        <svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m10.4 10.4 3.2 3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        <span>{q || 'Find in document'}</span>
                        {t >= T_TYPE && t < T_ENTER && <span className="lv-caret" />}
                        {found && <small>1 of 1</small>}
                      </span>
                    </div>
                    <div className="cm-sheetwrap">
                      <div className="cm-ct" key={found ? 'p22' : 'p1'}>
                        {found ? <ContractPage22 hit={found} /> : <ContractCover />}
                      </div>
                    </div>
                  </>
                )}
                {view === 'doc' && (
                  <>
                    <div className="cm-tool cm-wordbar">
                      <span className="cm-fmt"><b>B</b><i>I</i><u>U</u></span>
                      <span className="cm-style">Body text</span>
                      <span className="cm-saved">Saved</span>
                    </div>
                    <div className="cm-sheetwrap">
                      <div className={`cm-docpage${fin || t >= T_DRAFT - 500 ? ' is-down' : ''}`}>
                        <LetterPage
                          refNo="ARC-KS2-L-042"
                          date="29 September 2026"
                          subject={['Kestrel Street Mixed-Use, Stage 2: Subcontract HV2291-SC-014 (Façade Package)', 'Variation Notice under Special Condition SC 8.1: Site Instruction SI-014 (Arcline variation V-06)']}
                          sign={false}
                          paras={[
                            { h: 'The Direction.', body: 'On Friday 25 September 2026 at 3.12 pm, Craig Pellow, Site Manager, issued Site Instruction SI-014 by email. It directs Arcline to change the façade bracket system at slab edges L4 to L9 to Detail 7/A-512 Rev C.' },
                            { h: 'Notice.', body: 'Arcline gives notice under Special Condition SC 8.1 that it considers the Direction in SI-014 to be a Variation.' },
                            ...(fin || t >= T_DRAFT ? [{
                              h: 'Statement in SI-014.',
                              body: <>{para}{!fin && t < T_DRAFTED && <i className="lv-caret" />}{(fin || t >= T_DRAFTED) && <em className="cm-cite lv-pop">SC 9(b) · p 22</em>}</>,
                            }] : []),
                          ]}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {!fin && (
            <div className={`cm-cursor${clicking ? ' is-click' : ''}`} style={{ transform: `translate(${cx}px, ${cy}px)` }}>
              <svg viewBox="0 0 20 24"><path d="M3 2l14 11.5-6.3.8 3.7 7.3-2.6 1.3-3.7-7.4L3 20z" fill="#111" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            </div>
          )}
        </div>
      </div>
      <ol className="cm-log" aria-label="What Astruct did">
        {STEPS.map((s, i) => {
          const on = stepsOn.includes(s)
          const now = !fin && on && stepsOn[stepsOn.length - 1] === s && i < STEPS.length - 1
          return (
            <li key={s.s} className={`${on ? 'is-in' : ''}${now ? ' is-now' : ''}`}>
              <i>{i + 1}</i><span>{s.s}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
