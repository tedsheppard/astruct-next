'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { loginHref, startFreeHref } from '@/lib/site/brand'

// The site's chrome: a floating glass bar with the wordmark, the few links,
// the theme switch and the two calls to action; and the footer. The theme
// is the reader's choice, kept on this device (astruct-site-theme) and
// following the system until they choose; the inline script in AxRoot
// applies it before first paint so nothing flashes.
export const THEME_KEY = 'astruct-site-theme'
export type AxTheme = 'light' | 'dark'
export const THEME_SCRIPT = `try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-ax-theme',t)}catch(e){}`

export function useAxTheme(): [AxTheme, (t: AxTheme) => void] {
  const [theme, setTheme] = useState<AxTheme>('dark')
  useEffect(() => {
    const cur = document.documentElement.getAttribute('data-ax-theme')
    if (cur === 'light' || cur === 'dark') setTheme(cur)
  }, [])
  const set = (t: AxTheme) => {
    setTheme(t)
    document.documentElement.setAttribute('data-ax-theme', t)
    try { localStorage.setItem(THEME_KEY, t) } catch { /* private mode */ }
  }
  return [theme, set]
}

export function AxRoot({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`ax ${className}`}>
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {children}
    </div>
  )
}

export function AxHeader() {
  const [theme, setTheme] = useAxTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <header className="ax-bar">
      <div className="ax-bar-pill">
        <Link href="/" className="ax-wordmark" aria-label="Astruct"><span className="ax-orb" aria-hidden="true" />Astruct</Link>
        <nav className="ax-bar-nav">
          <Link href="/#work">Product</Link>
          <Link href="/#pip">Pip</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/support">Support</Link>
        </nav>
        <div className="ax-bar-end">
          <button type="button" className="ax-theme" onClick={() => setTheme(next)} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a className="ax-bar-login" href={loginHref()}>Log in</a>
          <a className="ax-btn ax-btn-primary" href={startFreeHref()}>Start free</a>
        </div>
      </div>
    </header>
  )
}

export function AxFooter() {
  return (
    <footer className="ax-foot">
      <div className="ax-foot-top">
        <div>
          <Link href="/" className="ax-wordmark" aria-label="Astruct"><span className="ax-orb" aria-hidden="true" />Astruct</Link>
          <p className="ax-foot-blurb">The AI that reads your whole construction project and does the paperwork. Made in Australia.</p>
        </div>
        <nav className="ax-foot-cols" aria-label="Site">
          <div>
            <b>Product</b>
            <Link href="/#import">Project import</Link>
            <Link href="/#work">Finished work</Link>
            <Link href="/#pip">Pip</Link>
            <Link href="/#compare">Astruct vs a chatbot</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div>
            <b>Company</b>
            <Link href="/support">Support</Link>
            <Link href="/contact">Contact</Link>
            <a href={loginHref()}>Log in</a>
            <a href={startFreeHref()}>Start free</a>
          </div>
          <div>
            <b>Legal</b>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
          </div>
        </nav>
      </div>
      <div className="ax-foot-bottom">
        <span>© {new Date().getFullYear()} Astruct Pty Ltd, Australia</span>
        <span>Astruct is an AI tool, not legal advice. Everything it prepares is held for your review.</span>
      </div>
    </footer>
  )
}
