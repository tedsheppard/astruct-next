'use client'

// "Drop in the whole project": a stack of project records dragged onto the
// project, the count racing to 4,812 documents, a request typed into the
// composer, and the Delay Notice composing itself on Arcline's letterhead.
// The notice is the demo pack's ARC-KS2-L-041 (fictional parties).
import { FINAL, fmt, prog, typed, typedEnd, useLoop } from './core'
import { DelayNoticePages } from './letter'

const PROMPT = 'Draft me a notice of delay for the crane outage and late Level 6 access, on our letterhead'
const TYPES = ['PDF', 'DOCX', 'XLSX', 'MSG', 'EML', 'ZIP', 'Drawing register']
const TOTAL = 4812

// Timeline (ms): about 15.5 s a loop
const GRAB = 350
const MOVE = 550
const DROP = 1450
const COUNT = 1550
const COUNT_END = 3000
const TYPE = 3250
const SEND = typedEnd(PROMPT, TYPE, 20) + 200
const WRITE = SEND + 300
const BLOCK_MS = 250
const BLOCKS = 15
const WRITTEN = WRITE + BLOCKS * BLOCK_MS
const SCROLL = WRITE + 9 * BLOCK_MS + 250
const BACK = 14000
const OUT = 14900
const LEN = 15500

const STACK = [
  { n: 'Contract', k: 'folder' },
  { n: 'Correspondence', k: 'folder' },
  { n: 'Drawings', k: 'folder' },
  { n: 'Programme Rev 8.pdf', k: 'pdf' },
  { n: 'Site diaries.zip', k: 'zip' },
]

const STEPS = [
  { at: WRITE, s: 'Read Subcontract HV2291-SC-014: SC 7.1, p 20' },
  { at: WRITE + 500, s: 'Found the crane emails of 23 September' },
  { at: WRITE + 1000, s: 'Checked Programme Rev 8 for the critical path' },
  { at: WRITE + 1500, s: 'Drafting on the Arcline letterhead' },
]

function FolderIcon({ k }: { k: string }) {
  if (k === 'folder') return <svg viewBox="0 0 20 16" aria-hidden="true"><path d="M1 3.2C1 2 2 1 3.2 1h4.2l2 2h7.4C18 3 19 4 19 5.2v7.6c0 1.2-1 2.2-2.2 2.2H3.2C2 15 1 14 1 12.8z" fill="#8fb5e8" /><path d="M1 5.5h18v7.3c0 1.2-1 2.2-2.2 2.2H3.2C2 15 1 14 1 12.8z" fill="#a9c8f1" /></svg>
  return <svg viewBox="0 0 16 20" aria-hidden="true"><path d="M2 1h8l5 5v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" fill="#fff" stroke="#c9ccd3" /><path d="M10 1v5h5" fill="none" stroke="#c9ccd3" /><rect x="3" y="12" width="10" height="4" rx="1" fill={k === 'pdf' ? '#e5484d' : '#8e8e93'} /></svg>
}

export function DropInLive() {
  const [ref, t] = useLoop<HTMLDivElement>(LEN, 0.2)
  const fin = t >= FINAL
  const out = t >= OUT && !fin
  const move = prog(t, MOVE, DROP)
  const dropped = t >= DROP
  const count = fin ? TOTAL : Math.round(TOTAL * prog(t, COUNT, COUNT_END))
  const prompt = fin || t >= SEND ? PROMPT : typed(PROMPT, t, TYPE, 20)
  const sent = fin || t >= SEND
  const upto = fin ? 99 : t < WRITE ? 0 : Math.floor((t - WRITE) / BLOCK_MS) + 1
  const scrolled = !fin && t >= SCROLL && t < BACK
  const writing = !fin && t >= WRITE && t < WRITTEN

  return (
    <div className={`dp${out ? ' is-out' : ''}`} ref={ref}>
      <div className="dp-work">
        <div className="dp-drop">
          <div className={`dp-card${t >= MOVE && t < DROP + 400 && !fin ? ' is-target' : ''}${fin || t >= DROP + 500 ? ' is-home' : ''}`}>
            <div className="dp-card-head">
              <span className="dp-card-ic"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4.3c0-.7.5-1.2 1.2-1.2h3l1.5 1.6h5.1c.7 0 1.2.5 1.2 1.2v6.2c0 .7-.5 1.2-1.2 1.2H3.2c-.7 0-1.2-.5-1.2-1.2z" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></span>
              <div>
                <b>Kestrel Street, Stage 2</b>
                <small>Subcontract HV2291-SC-014 · Arcline Façades</small>
              </div>
            </div>
            <div className="dp-count">
              <b>{fmt(count)}</b>
              <span>{fin || t >= COUNT_END ? 'documents indexed' : dropped ? 'documents indexing' : 'Drop files and folders here'}</span>
            </div>
            <div className="dp-meter" aria-hidden="true"><i style={{ transform: `scaleX(${fin ? 1 : prog(t, COUNT, COUNT_END)})` }} /></div>
            <div className="dp-types">
              {TYPES.map((x, i) => (
                <span key={x} className={`dp-type lv-chip${fin || t >= COUNT + 150 + i * 170 ? ' is-in' : ''}`}>{x}</span>
              ))}
            </div>
          </div>
          {!fin && t < DROP + 500 && (
            <div
              className={`dp-stack${t >= DROP ? ' is-dropped' : ''}${t >= GRAB ? ' is-held' : ''}`}
              style={{ transform: `translate(${move * 108}%, ${move * -8}%) rotate(${t >= GRAB && t < DROP ? -3 : 0}deg)` }}
              aria-hidden="true"
            >
              {STACK.map((f, i) => (
                <span key={f.n} className="dp-file" style={{ ['--i' as string]: i }}><FolderIcon k={f.k} />{f.n}</span>
              ))}
              <span className="dp-badge">4,812</span>
              <svg className="dp-cursor" viewBox="0 0 20 24" aria-hidden="true"><path d="M3 2l14 11.5-6.3.8 3.7 7.3-2.6 1.3-3.7-7.4L3 20z" fill="#111" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            </div>
          )}
        </div>
        <div className="dp-composer">
          {sent && <div className="dp-sent lv-pop">{PROMPT}</div>}
          <div className="dp-steps" aria-hidden={!sent}>
            {STEPS.map((s) => (
              <span key={s.s} className={`dp-step${fin || t >= s.at ? ' is-in' : ''}${!fin && t >= s.at && t < WRITTEN && s === STEPS.filter((x) => t >= x.at).pop() ? ' is-now' : ''}`}>
                <i />{s.s}
              </span>
            ))}
          </div>
          <div className="dp-input">
            <span className={!sent && prompt ? 'lv-typed' : 'lv-ph'}>{!sent && prompt ? prompt : 'Ask or draft for Kestrel Street, Stage 2'}</span>
            {!sent && t >= TYPE && <span className="lv-caret" aria-hidden="true" />}
            <span className={`lv-send${t >= SEND - 300 && t < SEND + 250 ? ' is-hot' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 16 16"><path d="M8 13V3.5M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
        </div>
      </div>

      <div className="dp-out">
        <div className="dp-viewer">
          <div className={`dp-pages${scrolled ? ' is-scrolled' : ''}${writing ? ' is-writing' : ''}`}>
            <DelayNoticePages upto={upto} />
          </div>
        </div>
        <div className="dp-foot">
          <span className={`lv-chip${fin || upto >= BLOCKS ? ' is-in' : ''}`}>Word file</span>
          <span className={`lv-chip${fin || upto >= BLOCKS ? ' is-in' : ''}`}>Prepared for review</span>
          <span className={`lv-chip${fin || upto >= BLOCKS ? ' is-in' : ''}`}>Not sent</span>
        </div>
      </div>
    </div>
  )
}
