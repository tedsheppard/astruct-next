'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brand } from './mark'
import { IClose, IMenu } from './icons'
import { CTA_LABEL, LOGIN_URL, TRIAL_URL } from './links'

const NAV = [
  { href: '/#project', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/security', label: 'Security' },
  { href: '/support', label: 'Support' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  // The menu is open for the page it was opened on, so it closes on navigation.
  const page = pathname ?? ''
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === page
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenOn((cur) => {
    const was = cur === page
    return (typeof v === 'function' ? v(was) : v) ? page : null
  })

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Close the menu on Escape.
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenOn(null) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  return (
    <header className={`mk-header${scrolled || open ? ' is-scrolled' : ''}`}>
      <div className="mk-header-bar">
        <Brand />
        <nav className="mk-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
        </nav>
        <div className="mk-header-cta">
          <a className="mk-login" href={LOGIN_URL}>Log in</a>
          <a className="mk-btn mk-btn-sm" href={TRIAL_URL} aria-label={CTA_LABEL}><span className="mk-cta-full">{CTA_LABEL}</span><span className="mk-cta-short" aria-hidden="true">Free trial</span></a>
          <button
            type="button"
            className="mk-menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mk-sheet"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IClose /> : <IMenu />}
          </button>
        </div>
      </div>
      {open && (
        <div id="mk-sheet" className="mk-sheet">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
          <a href={LOGIN_URL}>Log in</a>
          <a className="mk-btn" href={TRIAL_URL}>{CTA_LABEL}</a>
        </div>
      )}
    </header>
  )
}
