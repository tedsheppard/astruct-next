'use client'

import { useEffect, useRef, useState } from 'react'
import { startFreeHref } from '@/lib/site/brand'
import { useAxTheme } from '@/components/site/ax-chrome'

// The pinned hero. The section is a little over two screens tall; its
// content sticks while the reader scrolls through it, and the scroll
// position (0 to 1) drives three beats: the words set and the desk comes up
// from depth with the contract open; then the job is typed into the chat;
// then the finished claim is on screen in the drafter. Every frame is the
// product as it is, in the reader's theme. With reduced motion the finished
// desk shows at once.
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const seg = (p: number, from: number, to: number) => ease(clamp((p - from) / (to - from)))

const BEATS = [
  { at: 0, caption: 'The contract, open on Astruct’s computer' },
  { at: 0.5, caption: 'You ask for the variation and EOT claim' },
  { at: 0.74, caption: 'Drafted from the contract, cited, ready to send' },
]

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const [p, setP] = useState(0)
  const [still, setStill] = useState(false)
  const [theme] = useAxTheme()

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
  const arrive = seg(q, 0.04, 0.42)     // the desk comes up from depth and turns to face the reader
  const lift = seg(q, 0.24, 0.48)       // the words move up and away as the desk takes the screen
  const typed = seg(q, 0.48, 0.58)      // the job typed into the chat
  const letter = seg(q, 0.72, 0.82)     // the drafted claim on screen
  const beat = q >= 0.77 ? 2 : q >= 0.53 ? 1 : 0
  const captionOn = arrive > 0.95 ? 1 : 0
  const sceneStyle = { transform: `translateY(${(1 - arrive) * 46}vh) perspective(1600px) rotateX(${(1 - arrive) * 24}deg) scale(${0.74 + 0.26 * arrive})`, opacity: 0.2 + 0.8 * arrive }
  const t = theme === 'light' ? 'light' : 'dark'

  return (
    <section ref={root} className="ax-hero" aria-label="Astruct">
      <div className="ax-hero-pin">
        <div className="ax-hero-words" style={{ opacity: 1 - lift, transform: `translateY(${-lift * 40}vh)` }}>
          <h1>Your whole project, read.<br />Your paperwork, done.</h1>
          <p className="ax-lede">Upload the contract, the drawings, the emails and the claims. Astruct reads every page, answers with the page it came from, and prepares the letters, notices and claims you actually have to send.</p>
          <div className="ax-cta">
            <a className="ax-btn ax-btn-primary" href={startFreeHref()}>Start your free trial</a>
            <a className="ax-btn ax-btn-ghost" href="#work">See it work</a>
          </div>
          <p className="ax-fine">Free to start, no card. Plans from AU$59 a month.</p>
        </div>

        <div className="ax-scene" style={sceneStyle} aria-hidden="true">
          <img className="ax-desk" src={`/marketing/desk/desk-${t}.png`} width={1800} height={1125} alt="" />
          <div className="ax-scene-frame" style={{ opacity: typed }}><img src={`/marketing/desk/seq-typed-${t}.png`} width={1800} height={1125} alt="" loading="lazy" /></div>
          <div className="ax-scene-frame" style={{ opacity: letter }}><img src={`/marketing/desk/seq-letter-${t}.png`} width={1800} height={1125} alt="" loading="lazy" /></div>
          <div className="ax-scene-caption" style={{ opacity: captionOn, transition: 'opacity .3s ease' }} key={beat}>
            <span className="ax-orb" />{BEATS[beat].caption}
          </div>
        </div>

        <div className="ax-hero-hint" style={{ opacity: 1 - seg(q, 0, 0.1) }}>Scroll</div>
      </div>
    </section>
  )
}
