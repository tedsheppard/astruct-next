'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { APP_ORIGIN, loginHref } from '@/lib/site/brand'

// The pinned hero. The section is three screens tall; its content sticks
// to the viewport while the reader scrolls through it, and the scroll
// position (0 to 1 across the section) drives the scene: the headline sets
// first, then the three parts of the desk (dock, the contract in the
// viewer, the chat) come in from depth and turn to face the reader, and at
// the end the real screenshot of the desk is laid over them, crisp. With
// reduced motion the finished desk shows at once.
const OPEN = APP_ORIGIN
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
// A stage's progress: 0 before `from`, 1 after `to`, eased between.
const seg = (p: number, from: number, to: number) => ease(clamp((p - from) / (to - from)))

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const [p, setP] = useState(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setStill(mq.matches)
    let raf = 0
    const read = () => {
      raf = 0
      const el = root.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      setP(total > 0 ? clamp(-r.top / total) : 1)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  const q = still ? 1 : p
  const arrive = seg(q, 0.05, 0.7)      // the desk comes up from depth and turns to face the reader
  const lift = seg(q, 0.3, 0.75)        // the headline moves up and away as the desk takes the screen
  const sceneStyle = { transform: `translateY(${(1 - arrive) * 46}vh) perspective(1600px) rotateX(${(1 - arrive) * 24}deg) scale(${0.74 + 0.26 * arrive})`, opacity: 0.2 + 0.8 * arrive }


  return (
    <section ref={root} className="ax-hero" aria-label="Astruct">
      <div className="ax-hero-pin">
        <header className="ax-bar">
          <Link href="/" className="ax-wordmark" aria-label="Astruct"><span className="ax-orb" aria-hidden="true" />Astruct</Link>
          <nav className="ax-bar-nav">
            <Link href="/pricing">Pricing</Link>
            <Link href="/support">Support</Link>
            <a href={loginHref()}>Log in</a>
            <a className="ax-btn ax-btn-light" href={OPEN}>Open Astruct</a>
          </nav>
        </header>

        <div className="ax-hero-words" style={{ opacity: 1 - lift, transform: `translateY(${-lift * 40}vh)` }}>
          <p className="ax-eyebrow">For developers, builders and subcontractors</p>
          <h1>The AI computer for construction.</h1>
          <p className="ax-lede">Give it a job. It reads the whole project, drives its own computer, searches the web and the law, works inside the systems your project lives in, and hands you finished work.</p>
          <div className="ax-cta">
            <a className="ax-btn ax-btn-light" href={OPEN}>Open Astruct</a>
            <Link className="ax-btn ax-btn-ghost" href="/book-a-demo">Book a demo</Link>
          </div>
          <p className="ax-fine">Free to start, with AU$5 of work included. Plans from AU$59 a month.</p>
        </div>

        <div className="ax-scene" style={sceneStyle} aria-hidden="true">
          <img className="ax-desk" src="/marketing/desk/desk-dark.png" alt="Astruct's desk: a contract open in the viewer, the dock down the left, the conversation on the right" />
        </div>

        <div className="ax-hero-hint" style={{ opacity: 1 - seg(q, 0, 0.12) }}>Scroll</div>
      </div>
    </section>
  )
}
