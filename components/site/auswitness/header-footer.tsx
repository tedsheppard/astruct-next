'use client'

/**
 * Ported from auswitness/src/components/site.tsx (SiteHeader / SiteFooter).
 *
 * Same markup, spacing and interaction pattern as the source — sticky
 * hairline header with a hover dropdown, mobile sheet, dark-navy footer with
 * a link grid and a legal strip — with AusWitness's own nav content (path
 * picker, jurisdictions, practitioner login) swapped for Astruct's real
 * marketing routes. Rendered only on the homepage: see site-header.tsx /
 * site-footer.tsx, which pick this variant by pathname so every other
 * marketing page keeps the existing Astruct header/footer untouched.
 */
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Container } from './ui'
import { startFreeHref, loginHref, DEMO_HREF } from '@/lib/site/brand'

const AW_NAV: { href: string; label: string }[] = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/landing#how', label: 'How it works' },
  { href: '/main-contractors', label: 'Main contractors' },
  { href: '/subcontractors', label: 'Subcontractors' },
]

function AwLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Astruct home">
      <span className="flex h-7 w-7 items-center justify-center rounded-none bg-[var(--aw-ink)] text-[15px] font-bold text-white">
        A
      </span>
      <span className="text-[19px] font-bold tracking-tight text-[var(--aw-ink)]">Astruct</span>
    </Link>
  )
}

export function AwSiteHeader() {
  const [mobile, setMobile] = useState(false)

  return (
    <header className="aw-home sticky top-0 z-50 border-b border-[var(--aw-border)] bg-white">
      <Container className="flex h-[72px] items-center justify-between">
        <AwLogo />

        <nav className="hidden items-center gap-8 text-[15px] font-medium text-[var(--aw-ink)] lg:flex">
          {AW_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--aw-brand)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={loginHref()}
            className="hidden rounded-none border border-[var(--aw-border-strong)] px-4 py-2 text-sm font-medium text-[var(--aw-ink)] hover:bg-[var(--aw-surface-muted)] sm:inline-flex"
          >
            Log in
          </a>
          <a
            href={startFreeHref()}
            className="inline-flex h-10 items-center justify-center rounded-none bg-[var(--aw-brand)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--aw-brand-strong)] whitespace-nowrap"
          >
            Start free
          </a>
          <button
            type="button"
            onClick={() => setMobile((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-none border border-[var(--aw-border-strong)] lg:hidden"
            aria-label="Menu"
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {mobile && (
        <div className="border-t border-[var(--aw-border)] bg-white lg:hidden">
          <Container className="grid gap-1 py-4">
            {AW_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobile(false)}
                className="rounded-none px-3 py-2.5 text-[15px] font-medium text-[var(--aw-ink)] hover:bg-[var(--aw-surface-muted)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-[var(--aw-border)]" />
            <a
              href={loginHref()}
              onClick={() => setMobile(false)}
              className="rounded-none px-3 py-2.5 text-[15px] font-medium text-[var(--aw-ink)] hover:bg-[var(--aw-surface-muted)]"
            >
              Log in
            </a>
            <Link
              href={DEMO_HREF}
              onClick={() => setMobile(false)}
              className="rounded-none px-3 py-2.5 text-[15px] font-medium text-[var(--aw-ink)] hover:bg-[var(--aw-surface-muted)]"
            >
              Book a demo
            </Link>
          </Container>
        </div>
      )}
    </header>
  )
}

function FooterCol({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div className="text-sm">
      <p className="font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-2.5 text-white/65">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AwSiteFooter() {
  return (
    <footer className="aw-home border-t border-[var(--aw-border)] bg-[var(--aw-navy-deep)] text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-[15px] font-bold text-[var(--aw-navy-deep)]">
              A
            </span>
            <span className="text-[19px] font-bold text-white">Astruct</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Astruct watches your project emails, identifies events that trigger contractual notices, and makes sure
            you never miss a time bar.
          </p>
        </div>

        <FooterCol
          title="Who it's for"
          links={[
            ['/main-contractors', 'Main contractors'],
            ['/subcontractors', 'Subcontractors'],
          ]}
        />
        <FooterCol
          title="Product"
          links={[
            ['/landing#how', 'How it works'],
            ['/pricing', 'Pricing'],
            ['/book-a-demo', 'Book a demo'],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ['/about', 'About'],
            ['/support', 'Support'],
            ['/contact', 'Contact'],
            ['/legal/terms', 'Terms of Service'],
            ['/legal/privacy', 'Privacy Policy'],
          ]}
        />
      </Container>

      <Container className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Astruct. All rights reserved.</p>
        <p className="max-w-xl md:text-right">General information only — not legal advice. Always check the contract that applies to you.</p>
      </Container>
    </footer>
  )
}
