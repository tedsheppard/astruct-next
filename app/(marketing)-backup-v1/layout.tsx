'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const FEATURE_LINKS = [
  { href: '/features', label: 'All Features' },
  { href: '/product/assistant', label: 'AI Assistant' },
  { href: '/product/review', label: 'Review Tables' },
  { href: '/product/calendar', label: 'Time-Bar Calendar' },
]

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false); setFeaturesOpen(false) }, [pathname])

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-[#e8e5e0] bg-[#FAFAF8]/95 backdrop-blur-sm' : 'bg-[#FAFAF8]'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="text-lg font-semibold tracking-tight" style={{ letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            Astruct
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Features dropdown */}
            <div className="relative" onMouseEnter={() => setFeaturesOpen(true)} onMouseLeave={() => setFeaturesOpen(false)}>
              <button className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors flex items-center gap-1">
                Features
                <svg className={`w-3 h-3 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {featuresOpen && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="bg-white rounded-xl border border-[#e8e5e0] shadow-lg py-2 w-48">
                    {FEATURE_LINKS.map(l => (
                      <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm text-[#444] hover:bg-[#f5f3ef] hover:text-[#1a1a1a] transition-colors">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/pricing" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Pricing</Link>
            <Link href="/login" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Log in</Link>
            <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg text-white bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
              Start free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#e8e5e0] bg-[#FAFAF8] px-6 py-4 space-y-3">
            {FEATURE_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="block text-sm text-[#444] py-1">{l.label}</Link>
            ))}
            <Link href="/pricing" className="block text-sm text-[#444] py-1">Pricing</Link>
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="text-sm text-[#666]">Log in</Link>
              <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg text-white bg-[#5C6B52]">Start free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#e8e5e0] bg-[#FAFAF8]">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Col 1 */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-semibold" style={{ letterSpacing: '-0.02em', color: '#1a1a1a' }}>Astruct</span>
              <p className="text-sm text-[#888] mt-2 leading-relaxed">AI contract intelligence for Australian construction.</p>
              <p className="text-xs text-[#bbb] mt-4">Built in Brisbane, Australia</p>
            </div>
            {/* Col 2 */}
            <div>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4">Product</p>
              <div className="space-y-2.5">
                <Link href="/features" className="block text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Features</Link>
                <Link href="/product/assistant" className="block text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">AI Assistant</Link>
                <Link href="/product/review" className="block text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Review Tables</Link>
                <Link href="/product/calendar" className="block text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Calendar</Link>
              </div>
            </div>
            {/* Col 3 */}
            <div>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4">Company</p>
              <div className="space-y-2.5">
                <Link href="/pricing" className="block text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Pricing</Link>
                <Link href="/privacy" className="block text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">Terms of Service</Link>
              </div>
            </div>
            {/* Col 4 */}
            <div>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4">Contact</p>
              <a href="mailto:hello@astruct.io" className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors">hello@astruct.io</a>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-[#e8e5e0] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-[#bbb]">&copy; 2026 Astruct Pty Ltd</span>
            <span className="text-xs text-[#ccc]">AS4000 &middot; AS4902 &middot; AS2124 &middot; SOPA compliant</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
