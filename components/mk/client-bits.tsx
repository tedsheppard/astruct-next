'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { fbq?: (...args: any[]) => void; _fbq?: unknown }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

/** Meta Pixel: loads once when NEXT_PUBLIC_META_PIXEL_ID is set, and fires
 *  PageView on first load and on every client-side navigation. Inert without the id. */
export function MetaPixel() {
  const pathname = usePathname()
  useEffect(() => {
    if (!PIXEL_ID || typeof window === 'undefined') return
    if (!window.fbq) {
      // Standard Meta Pixel bootstrap.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q: any = function (...args: unknown[]) { if (q.callMethod) q.callMethod(...args); else q.queue.push(args) }
      q.push = q; q.loaded = true; q.version = '2.0'; q.queue = []
      window.fbq = q
      if (!window._fbq) window._fbq = q
      const s = document.createElement('script')
      s.async = true
      s.src = 'https://connect.facebook.net/en_US/fbevents.js'
      document.head.appendChild(s)
      q('init', PIXEL_ID)
    }
    window.fbq?.('track', 'PageView')
  }, [pathname])
  useEffect(() => { captureAttribution() }, [])
  return null
}

const ATTR_KEY = 'astruct_attr'
const ATTR_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']

/** First touch: keeps the ad parameters a visitor arrived with (for 30 days),
 *  so a sign-up on a later page can say which ad brought it. */
function captureAttribution() {
  try {
    const q = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    for (const k of ATTR_PARAMS) { const v = q.get(k); if (v) found[k] = v.slice(0, 200) }
    if (!Object.keys(found).length) return
    const prev = JSON.parse(localStorage.getItem(ATTR_KEY) || 'null')
    if (prev && Date.now() - (prev.at || 0) < 30 * 864e5) return
    localStorage.setItem(ATTR_KEY, JSON.stringify({ ...found, landing: window.location.pathname, at: Date.now() }))
  } catch { /* storage may be blocked */ }
}

/** The stored first-touch parameters, plus any on the current URL. */
export function readAttribution(): Record<string, string> {
  const out: Record<string, string> = {}
  try {
    const prev = JSON.parse(localStorage.getItem(ATTR_KEY) || 'null')
    if (prev) for (const [k, v] of Object.entries(prev)) if (k !== 'at') out[k] = String(v).slice(0, 200)
  } catch { /* storage may be blocked */ }
  try {
    const q = new URLSearchParams(window.location.search)
    for (const k of ATTR_PARAMS) { const v = q.get(k); if (v && !out[k]) out[k] = v.slice(0, 200) }
  } catch { /* ignore */ }
  return out
}

/** Fire a standard Meta Pixel event. Never throws. */
export function trackPixel(event: 'Lead' | 'ViewContent' | 'CompleteRegistration', params?: Record<string, unknown>) {
  try { window.fbq?.('track', event, params || {}) } catch { /* analytics never breaks the page */ }
}

/** Adds .is-in to .mk-reveal elements as they scroll into view. Without JS
 *  (or with reduced motion) everything is simply visible. */
export function Reveal() {
  const pathname = usePathname()
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('mk-js')
    const els = Array.from(document.querySelectorAll<HTMLElement>('.mk-reveal:not(.is-in)'))
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return }
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [pathname])
  return null
}

type Mode = 'system' | 'light' | 'dark'

/** System / Light / Dark. Stored under the same key the root layout reads before first paint. */
export function ThemeSwitch() {
  const [mode, setMode] = useState<Mode>('system')
  useEffect(() => {
    try {
      const v = localStorage.getItem('astruct-theme')
      if (v === 'light' || v === 'dark') setMode(v)
    } catch { /* storage blocked */ }
  }, [])
  const choose = (m: Mode) => {
    setMode(m)
    const c = document.documentElement.classList
    c.remove('light', 'dark')
    if (m !== 'system') c.add(m)
    try { if (m === 'system') localStorage.removeItem('astruct-theme'); else localStorage.setItem('astruct-theme', m) } catch { /* ignore */ }
  }
  return (
    <div className="mk-theme" role="group" aria-label="Appearance">
      {(['system', 'light', 'dark'] as Mode[]).map((m) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => choose(m)}>
          {m[0].toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  )
}
