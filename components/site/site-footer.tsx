'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FOOTER, startFreeHref, DEMO_HREF } from '@/lib/site/brand'
import { AwSiteFooter } from './auswitness/header-footer'

function Col({ title, links }: { title: string; links: { title: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-white/65 transition-colors hover:text-white">
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SiteFooter() {
  const pathname = usePathname()
  if (pathname === '/landing') return <AwSiteFooter />

  return (
    <footer className="bg-[var(--site-ink)] text-white">
      {/* CTA cap */}
      <div className="border-b border-white/10">
        <div className="site-container-wide flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h3 className="max-w-xl text-[28px] font-bold leading-tight text-white sm:text-[34px]">
              Get paid what you&apos;re owed, on time, under the Act.
            </h3>
            <p className="mt-3 max-w-lg text-[15px] text-white/60">
              Compliant payment claims and schedules for every Australian jurisdiction — free to start.
            </p>
          </div>
          <div className="flex flex-none flex-col gap-3 sm:flex-row">
            <a href={startFreeHref()} className="site-btn site-btn-on-dark site-btn-lg">
              Start free
            </a>
            <Link href={DEMO_HREF} className="site-btn site-btn-lg border border-white/25 bg-transparent text-white hover:bg-white/10">
              Book a demo
            </Link>
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="site-container-wide grid grid-cols-2 gap-10 py-16 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#1b3be0] font-display text-[15px] font-bold text-white">A</span>
            <span className="font-display text-[19px] font-bold text-white">Astruct</span>
          </div>
          <p className="mt-4 max-w-[220px] text-[13.5px] leading-relaxed text-white/55">
            Security of Payment software for Australian head contractors and subcontractors.
          </p>
        </div>
        <Col title="Product" links={FOOTER.product} />
        <Col title="Who it's for" links={FOOTER.who} />
        <Col title="Security of Payment" links={FOOTER.resources} />
        <Col title="Company" links={FOOTER.company} />
      </div>

      {/* Legal strip */}
      <div className="border-t border-white/10">
        <div className="site-container-wide flex flex-col items-start justify-between gap-3 py-6 text-[12.5px] text-white/45 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Astruct. Made in Australia.</p>
          <p className="max-w-xl sm:text-right">
            General information only — not legal advice. Always check the legislation that applies to your contract.
          </p>
        </div>
      </div>
    </footer>
  )
}
