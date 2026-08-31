'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV, DEMO_HREF, startFreeHref, loginHref, type NavGroup } from '@/lib/site/brand'
import { AwSiteHeader } from './auswitness/header-footer'

function Wordmark({ onDark }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Astruct home">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-[7px] font-display text-[15px] font-bold text-white"
        style={{ background: onDark ? '#1b3be0' : 'var(--site-ink)' }}
      >
        A
      </span>
      <span className={cn('font-display text-[19px] font-bold tracking-tight', onDark ? 'text-white' : 'text-[var(--site-text)]')}>
        Astruct
      </span>
    </Link>
  )
}

export default function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [mobile, setMobile] = useState(false)

  // The notice-tracker homepage is a literal port of AusWitness's own
  // header/footer (square corners, flat navy/gold), scoped to that one
  // route so /pricing, /features etc keep the existing Astruct header.
  const isHome = pathname === '/landing'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile])

  if (isHome) return <AwSiteHeader />

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-200',
        scrolled ? 'border-b border-[var(--site-line)] bg-white/85 backdrop-blur-xl' : 'border-b border-transparent bg-white',
      )}
    >
      <div className="site-container-wide flex h-16 items-center justify-between gap-4">
        <Wordmark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpen(null)}>
          {NAV.map((group) => (
            <NavItem key={group.label} group={group} open={open === group.label} onOpen={() => setOpen(group.label)} />
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <a href={loginHref()} className="px-3 py-2 text-[14px] font-medium text-[var(--site-body)] transition-colors hover:text-[var(--site-text)]">
            Log in
          </a>
          <Link href={DEMO_HREF} className="site-btn site-btn-ghost site-btn-sm">
            Book a demo
          </Link>
          <a href={startFreeHref()} className="site-btn site-btn-primary site-btn-sm">
            Start free
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--site-text)] lg:hidden"
          onClick={() => setMobile((v) => !v)}
          aria-label="Menu"
        >
          {mobile ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobile && <MobileMenu onClose={() => setMobile(false)} />}
    </header>
  )
}

function NavItem({ group, open, onOpen }: { group: NavGroup; open: boolean; onOpen: () => void }) {
  if (!group.items) {
    return (
      <Link
        href={group.href!}
        className="rounded-lg px-3 py-2 text-[14px] font-medium text-[var(--site-body)] transition-colors hover:text-[var(--site-text)]"
        onMouseEnter={onOpen}
      >
        {group.label}
      </Link>
    )
  }
  return (
    <div className="relative" onMouseEnter={onOpen}>
      <button
        className={cn(
          'flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors',
          open ? 'text-[var(--site-text)]' : 'text-[var(--site-body)] hover:text-[var(--site-text)]',
        )}
      >
        {group.label}
        <ChevronDown size={15} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2">
          <div
            className={cn(
              'site-fade overflow-hidden rounded-2xl border border-[var(--site-line)] bg-white p-2 shadow-[0_24px_60px_-30px_rgba(10,17,36,.4)]',
              group.feature ? 'grid w-[640px] grid-cols-2 gap-1' : 'w-[360px]',
            )}
          >
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-0.5 rounded-xl p-3 transition-colors hover:bg-[var(--site-paper)]"
              >
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[var(--site-text)]">
                  {item.title}
                  <ArrowRight size={13} className="opacity-0 transition-opacity group-hover:opacity-60" />
                </span>
                {item.desc && <span className="text-[12.5px] leading-snug text-[var(--site-muted)]">{item.desc}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white px-5 py-4 lg:hidden">
      <div className="flex flex-col divide-y divide-[var(--site-line)]">
        {NAV.map((group) =>
          group.items ? (
            <details key={group.label} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[16px] font-semibold text-[var(--site-text)]">
                {group.label}
                <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="flex flex-col gap-0.5 pb-2">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} onClick={onClose} className="rounded-lg px-3 py-2.5 text-[15px] text-[var(--site-body)] hover:bg-[var(--site-paper)]">
                    {item.title}
                  </Link>
                ))}
              </div>
            </details>
          ) : (
            <Link key={group.label} href={group.href!} onClick={onClose} className="py-4 text-[16px] font-semibold text-[var(--site-text)]">
              {group.label}
            </Link>
          ),
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <a href={startFreeHref()} className="site-btn site-btn-primary site-btn-lg w-full">
          Start free
        </a>
        <Link href={DEMO_HREF} onClick={onClose} className="site-btn site-btn-ghost site-btn-lg w-full">
          Book a demo
        </Link>
        <a href={loginHref()} className="py-2 text-center text-[15px] font-medium text-[var(--site-body)]">
          Log in
        </a>
      </div>
    </div>
  )
}
