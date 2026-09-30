'use client'

// For builders, subcontractors and developers: the labels stick on the left
// and the one whose panel is in view is highlighted. Phones show each label
// above its panel instead.
import { useEffect, useRef, useState } from 'react'

const WHO = [
  { label: 'For builders', body: 'Give notices to the principal on time, check subcontractor claims against their subcontracts, and give payment schedules inside the security of payment deadlines.' },
  { label: 'For subcontractors', body: 'Catch directions that change your scope, even when they say “no change”, and give variation notices, delay notices and EOT claims before the time bar.' },
  { label: 'For developers', body: 'Check each variation and EOT claim against the contract, the programme and the correspondence, and respond within the time the contract allows.' },
]

export function WhoScroll() {
  const [on, setOn] = useState(0)
  const panels = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i))
    }, { rootMargin: '-45% 0px -45% 0px' })
    panels.current.forEach((p) => p && io.observe(p))
    return () => io.disconnect()
  }, [])
  return (
    <div className="wh">
      <div className="wh-labels" aria-hidden="true">
        {WHO.map((w, i) => <span key={w.label} className={i === on ? 'is-on' : ''}>{w.label}</span>)}
      </div>
      <div className="wh-panels">
        {WHO.map((w, i) => (
          <div key={w.label} className={`wh-panel${i === on ? ' is-on' : ''}`} data-i={i} ref={(el) => { panels.current[i] = el }}>
            <h3>{w.label}</h3>
            <p>{w.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
