'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ─── Shared animation component ─────────────────────────────────────────────

export function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [visible, setVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.12 })
    obs.observe(ref)
    return () => obs.disconnect()
  }, [ref])

  return (
    <div
      ref={setRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Platform dropdown items ─────────────────────────────────────────────────

const PLATFORM_LINKS = [
  { href: '/platform/assistant', title: 'AI Assistant', desc: 'Ask questions, draft notices, analyse clauses' },
  { href: '/platform/library', title: 'Document Library', desc: 'Upload, classify, and search documents' },
  { href: '/platform/review', title: 'Review Tables', desc: 'Extract structured data across documents' },
  { href: '/platform/calendar', title: 'Time-Bar Calendar', desc: 'Track every contractual deadline' },
  { href: '/platform/correspondence', title: 'Correspondence', desc: 'Manage project correspondence with AI' },
]

const SOLUTION_LINKS = [
  { href: '/solutions/contractors', title: 'Contractors' },
  { href: '/solutions/subcontractors', title: 'Subcontractors' },
  { href: '/solutions/contract-administrators', title: 'Contract Administrators' },
  { href: '/solutions/construction-lawyers', title: 'Construction Lawyers' },
]

const FOOTER_SECTIONS = [
  {
    title: 'Platform',
    links: [
      { href: '/platform', label: 'Overview' },
      { href: '/platform/assistant', label: 'AI Assistant' },
      { href: '/platform/library', label: 'Document Library' },
      { href: '/platform/review', label: 'Review Tables' },
      { href: '/platform/calendar', label: 'Calendar' },
      { href: '/platform/correspondence', label: 'Correspondence' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/solutions/contractors', label: 'Contractors' },
      { href: '/solutions/subcontractors', label: 'Subcontractors' },
      { href: '/solutions/contract-administrators', label: 'Contract Administrators' },
      { href: '/solutions/construction-lawyers', label: 'Construction Lawyers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/security', label: 'Security' },
      { href: '/company', label: 'About' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [platformOpen, setPlatformOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(true)

  useEffect(() => {
    const dismissed = localStorage.getItem('astruct-banner-dismissed')
    if (!dismissed) setBannerDismissed(false)
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setPlatformOpen(false)
    setSolutionsOpen(false)
  }, [pathname])

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true)
    localStorage.setItem('astruct-banner-dismissed', '1')
  }, [])

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Announcement banner */}
      {!bannerDismissed && (
        <div className="bg-[#1a1a1a] text-white text-center text-xs py-2.5 px-6 relative">
          <span className="text-[#a8a29e]">Now supporting </span>
          <span className="font-medium">AS4000-2025</span>
          <span className="text-[#a8a29e]"> - the first major update in 28 years. </span>
          <Link href="/platform" className="underline text-white hover:text-[#6B7F5E] transition-colors">Learn more &rarr;</Link>
          <button onClick={dismissBanner} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors">&times;</button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0C0C0C]/95 backdrop-blur-md border-b border-[#222]' : 'bg-[#0C0C0C]'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/landing" className="text-white text-lg font-semibold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Astruct
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {/* Platform dropdown */}
            <div className="relative" onMouseEnter={() => setPlatformOpen(true)} onMouseLeave={() => setPlatformOpen(false)}>
              <button className="text-sm text-[#a8a29e] hover:text-white transition-colors flex items-center gap-1">
                Platform
                <svg className={`w-3 h-3 transition-transform ${platformOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {platformOpen && (
                <div className="absolute top-full left-0 pt-3">
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-2xl p-4 w-[340px]">
                    <Link href="/platform" className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#252525] transition-colors mb-1">
                      Platform Overview
                    </Link>
                    <div className="border-t border-[#2a2a2a] my-2" />
                    {PLATFORM_LINKS.map(l => (
                      <Link key={l.href} href={l.href} className="block px-3 py-2.5 rounded-lg hover:bg-[#252525] transition-colors">
                        <p className="text-sm font-medium text-white">{l.title}</p>
                        <p className="text-xs text-[#888] mt-0.5">{l.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Solutions dropdown */}
            <div className="relative" onMouseEnter={() => setSolutionsOpen(true)} onMouseLeave={() => setSolutionsOpen(false)}>
              <button className="text-sm text-[#a8a29e] hover:text-white transition-colors flex items-center gap-1">
                Solutions
                <svg className={`w-3 h-3 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {solutionsOpen && (
                <div className="absolute top-full left-0 pt-3">
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-2xl p-2 w-[240px]">
                    {SOLUTION_LINKS.map(l => (
                      <Link key={l.href} href={l.href} className="block px-3 py-2.5 rounded-lg text-sm text-[#ccc] hover:text-white hover:bg-[#252525] transition-colors">
                        {l.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/pricing" className="text-sm text-[#a8a29e] hover:text-white transition-colors">Pricing</Link>
            <Link href="/security" className="text-sm text-[#a8a29e] hover:text-white transition-colors">Security</Link>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#a8a29e] hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg bg-[#6B7F5E] text-white hover:bg-[#5a6e4e] transition-colors">
              Start free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-[#0C0C0C] z-40 overflow-y-auto px-6 py-8">
            <div className="space-y-1">
              <Link href="/platform" className="block py-3 text-lg text-white font-medium">Platform</Link>
              {PLATFORM_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block py-2 pl-4 text-sm text-[#888]">{l.title}</Link>
              ))}
              <div className="border-t border-[#222] my-4" />
              <Link href="/pricing" className="block py-3 text-lg text-white font-medium">Pricing</Link>
              <Link href="/security" className="block py-3 text-lg text-white font-medium">Security</Link>
              <div className="border-t border-[#222] my-4" />
              {SOLUTION_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block py-2 text-sm text-[#888]">{l.title}</Link>
              ))}
              <div className="border-t border-[#222] my-4" />
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="text-sm text-[#888]">Log in</Link>
                <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg bg-[#6B7F5E] text-white">Start free</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0C0C0C] border-t border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-white text-lg font-semibold" style={{ letterSpacing: '-0.02em' }}>Astruct</span>
              <p className="text-sm text-[#666] mt-3 leading-relaxed">AI contract intelligence for construction.</p>
              <p className="text-xs text-[#444] mt-4">Built in Brisbane, Australia</p>
            </div>

            {/* Link columns */}
            {FOOTER_SECTIONS.map(section => (
              <div key={section.title}>
                <p className="text-xs font-medium text-[#555] uppercase tracking-wider mb-4">{section.title}</p>
                <div className="space-y-2.5">
                  {section.links.map(l => (
                    <Link key={l.href} href={l.href} className="block text-sm text-[#777] hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-[#444]">&copy; 2026 Astruct Pty Ltd</span>
            <a href="mailto:hello@astruct.io" className="text-xs text-[#444] hover:text-[#888] transition-colors">hello@astruct.io</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
