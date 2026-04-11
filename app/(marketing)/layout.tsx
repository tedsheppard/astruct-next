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
  { href: '/platform/calendar', title: 'Time-Bar Calendar', desc: 'Track every contractual deadline' },
  { href: '/platform/correspondence', title: 'Correspondence', desc: 'Manage project correspondence with AI' },
]

const SOLUTION_LINKS = [
  { href: '/solutions/developers', title: 'Developers / Principals', desc: 'Protect your position across every project in your portfolio.' },
  { href: '/solutions/contractors', title: 'Contractors', desc: 'Manage subcontracts, obligations, and payment cycles at scale.' },
  { href: '/solutions/subcontractors', title: 'Subcontractors', desc: 'Never miss a time-bar or lose a claim to a missed deadline.' },
  { href: '/solutions/contract-administrators', title: 'Contract Administrators', desc: 'Track correspondence, obligations, and compliance across all parties.' },
]

const FOOTER_SECTIONS = [
  {
    title: 'Platform',
    links: [
      { href: '/platform', label: 'Overview' },
      { href: '/platform/assistant', label: 'AI Assistant' },
      { href: '/platform/library', label: 'Document Library' },
      { href: '/platform/calendar', label: 'Calendar' },
      { href: '/platform/correspondence', label: 'Correspondence' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/solutions/contractors', label: 'Contractors' },
      { href: '/solutions/developers', label: 'Developers / Principals' },
      { href: '/solutions/subcontractors', label: 'Subcontractors' },
      { href: '/solutions/contract-administrators', label: 'Contract Administrators' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/pricing', label: 'Pricing' },
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
      {/* Navigation */}
      {/* Full-width dropdown panels (Harvey-style mega menu) */}
      {(platformOpen || solutionsOpen) && (
        <div className="fixed inset-0 top-0 z-40">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20" onClick={() => { setPlatformOpen(false); setSolutionsOpen(false) }} />

          {/* Panel */}
          <div
            className="relative bg-[#fafaf9] border-b border-[#e5e5e3]"
            style={{ paddingTop: bannerDismissed ? '64px' : '104px' }}
            onMouseLeave={() => { setPlatformOpen(false); setSolutionsOpen(false) }}
          >
            <div className="max-w-[1200px] mx-auto px-10 py-12">
              {platformOpen && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-5 space-y-6">
                    <Link href="/platform" className="block group" onClick={() => setPlatformOpen(false)}>
                      <p className="text-sm font-semibold text-[#0f0e0d]">Overview</p>
                      <p className="text-sm text-[#706d66] mt-1">A unified view of how Astruct&rsquo;s products work together.</p>
                    </Link>
                    {PLATFORM_LINKS.map(l => (
                      <Link key={l.href} href={l.href} className="block group" onClick={() => setPlatformOpen(false)}>
                        <p className="text-sm font-semibold text-[#0f0e0d]">{l.title}</p>
                        <p className="text-sm text-[#706d66] mt-1">{l.desc}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="col-span-7">
                    <Link href="/platform" className="block group" onClick={() => setPlatformOpen(false)}>
                      <div className="rounded-sm overflow-hidden border border-[#e5e5e3] bg-[#f2f1f0] aspect-video flex items-center justify-center">
                        <img src="/marketing/app-assistant.webp" alt="Astruct" className="w-full block" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      </div>
                      <p className="text-sm font-semibold text-[#0f0e0d] mt-4">Overview</p>
                      <p className="text-sm text-[#706d66] mt-1">See how Astruct works across the entire contract lifecycle.</p>
                    </Link>
                  </div>
                </div>
              )}
              {solutionsOpen && (
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-5 space-y-6">
                    {SOLUTION_LINKS.map(l => (
                      <Link key={l.href} href={l.href} className="block group" onClick={() => setSolutionsOpen(false)}>
                        <p className="text-sm font-semibold text-[#0f0e0d]">{l.title}</p>
                        <p className="text-sm text-[#706d66] mt-1">{l.desc}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="col-span-7">
                    <Link href="/platform" className="block group" onClick={() => setSolutionsOpen(false)}>
                      <div className="rounded-sm overflow-hidden border border-[#e5e5e3] bg-[#f2f1f0] aspect-video flex items-center justify-center">
                        <img src="/marketing/app-assistant.webp" alt="Astruct" className="w-full block" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      </div>
                      <p className="text-sm font-semibold text-[#0f0e0d] mt-4">See Astruct in action</p>
                      <p className="text-sm text-[#706d66] mt-1">Watch how construction teams use Astruct to draft notices, track deadlines, and search across thousands of documents.</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f0e0d]/95 backdrop-blur-md border-b border-[#33312c]' : 'bg-[#0f0e0d]'}`}>
        <div className="max-w-[1200px] mx-auto px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/landing" className="text-[#fafaf9] text-xl font-light tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Astruct
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Platform dropdown */}
            <div className="relative h-full flex items-center" onMouseEnter={() => { setPlatformOpen(true); setSolutionsOpen(false) }}>
              <button className={`text-sm font-medium transition-colors duration-300 flex items-center gap-1 ${platformOpen ? 'text-[#fafaf9]' : 'text-[#8f8b85] hover:text-[#fafaf9]'}`} style={{ transitionTimingFunction: 'cubic-bezier(0, 0.7, 0.3, 1)' }}>
                Platform
                <svg className={`w-3 h-3 transition-transform duration-300 ${platformOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {platformOpen && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fafaf9]" />}
            </div>

            {/* Solutions dropdown */}
            <div className="relative h-full flex items-center" onMouseEnter={() => { setSolutionsOpen(true); setPlatformOpen(false) }}>
              <button className={`text-sm font-medium transition-colors duration-300 flex items-center gap-1 ${solutionsOpen ? 'text-[#fafaf9]' : 'text-[#8f8b85] hover:text-[#fafaf9]'}`} style={{ transitionTimingFunction: 'cubic-bezier(0, 0.7, 0.3, 1)' }}>
                Solutions
                <svg className={`w-3 h-3 transition-transform duration-300 ${solutionsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {solutionsOpen && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fafaf9]" />}
            </div>

            <Link href="/pricing" className="text-sm text-[#a8a29e] hover:text-white transition-colors">Pricing</Link>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#a8a29e] hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg bg-[#fafaf9] text-[#0f0e0d] hover:bg-[#e5e5e3] transition-colors">
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
          <div className="lg:hidden fixed inset-0 top-16 bg-[#0f0e0d] z-40 overflow-y-auto px-6 py-8">
            <div className="space-y-1">
              <Link href="/platform" className="block py-3 text-lg text-white font-medium">Platform</Link>
              {PLATFORM_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block py-2 pl-4 text-sm text-[#888]">{l.title}</Link>
              ))}
              <div className="border-t border-[#222] my-4" />
              <Link href="/pricing" className="block py-3 text-lg text-white font-medium">Pricing</Link>
              <div className="border-t border-[#222] my-4" />
              {SOLUTION_LINKS.map(l => (
                <Link key={l.href} href={l.href} className="block py-2 text-sm text-[#888]">{l.title}</Link>
              ))}
              <div className="border-t border-[#222] my-4" />
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="text-sm text-[#888]">Log in</Link>
                <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg bg-[#fafaf9] text-[#0f0e0d]">Start free</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#0f0e0d] border-t border-[#1a1a1a]">
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
            <span className="text-xs text-[#444]">&copy; Astruct</span>
            <a href="mailto:hello@astruct.io" className="text-xs text-[#444] hover:text-[#888] transition-colors">hello@astruct.io</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
