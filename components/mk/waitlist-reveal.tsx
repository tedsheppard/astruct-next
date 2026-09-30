'use client'

import { useEffect, useState } from 'react'

// The waitlist page loads behind a skeleton for 2.2 seconds, then fades in.
// Without JavaScript the page shows straight away (see the noscript style).
export default function WaitlistReveal({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2200)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      {!ready && (
        <div className="wl-main wl-skel" aria-busy="true" aria-label="Loading">
          <i className="wl-sk wl-sk-logo" />
          <i className="wl-sk wl-sk-date" />
          <i className="wl-sk wl-sk-h" />
          <i className="wl-sk wl-sk-h2" />
          <i className="wl-sk wl-sk-p" />
          <i className="wl-sk wl-sk-p" />
          <i className="wl-sk wl-sk-p3" />
          <div className="wl-card wl-sk-card">
            <div className="wl-grid">
              {[0, 1, 2].map((n) => (
                <div key={n} className={`wl-sk-f${n === 2 ? ' wl-span' : ''}`}><i className="wl-sk wl-sk-l" /><i className="wl-sk wl-sk-in" /></div>
              ))}
            </div>
            <i className="wl-sk wl-sk-btn" />
          </div>
        </div>
      )}
      <div className={`wl-real${ready ? ' is-in' : ''}`} hidden={!ready}>{children}</div>
    </>
  )
}
