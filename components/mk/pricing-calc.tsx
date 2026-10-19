'use client'

// How much a month for n projects: a stepper and a slider over the graduated
// bands in pricing-tiers.ts. It renders the worked example (8 projects) on the
// server, so the figure is there before any JavaScript runs.
import { useId, useState } from 'react'
import { EXAMPLE_PROJECTS, aud, quote } from './pricing-tiers'

const MAX = 60

export function PriceCalculator() {
  const [n, setN] = useState(EXAMPLE_PROJECTS)
  const id = useId()
  const q = quote(n)
  const clamp = (v: number) => Math.min(MAX, Math.max(1, Math.round(v) || 1))
  const set = (v: number) => setN(clamp(v))
  const step = (d: number) => setN((p) => clamp(p + d))

  return (
    <div className="mk-calc">
      <h3>Work out your price</h3>
      <div className="mk-calc-row">
        <label htmlFor={`${id}-n`}>Projects</label>
        <div className="mk-calc-step">
          <button type="button" aria-label="One fewer project" onClick={() => step(-1)} disabled={n <= 1}>−</button>
          <input
            id={`${id}-n`}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX}
            value={n}
            onChange={(e) => set(Number(e.target.value))}
          />
          <button type="button" aria-label="One more project" onClick={() => step(1)} disabled={n >= MAX}>+</button>
        </div>
      </div>
      <input
        className="mk-calc-range"
        type="range"
        min={1}
        max={MAX}
        value={n}
        aria-label="Projects"
        onChange={(e) => set(Number(e.target.value))}
      />
      <div className="mk-calc-total" aria-live="polite">
        <span className="mk-big">{aud(q.total)}</span>
        <span className="mk-calc-unit">per month, ex GST, for {n} {n === 1 ? 'project' : 'projects'}</span>
      </div>
      <ul className="mk-calc-lines">
        {q.lines.map((l) => (
          <li key={l.tier.label}>
            <span>{l.tier.label}</span>
            <span>{l.count} × {aud(l.tier.price)}</span>
            <b>{aud(l.subtotal)}</b>
          </li>
        ))}
      </ul>
      <p className="mk-fine">Average {aud(Math.round(q.average * 100) / 100)} per project. Unlimited users on every project.</p>
    </div>
  )
}
