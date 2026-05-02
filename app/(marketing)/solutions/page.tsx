'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const AUDIENCES = [
  {
    slug: 'contractors',
    title: 'Contractors',
    blurb: 'For tier-2 and tier-3 head contractors managing multiple subcontracts at once.',
  },
  {
    slug: 'developers',
    title: 'Developers / Principals',
    blurb: 'For developers and principals administering head contracts with multiple contractors.',
  },
  {
    slug: 'subcontractors',
    title: 'Subcontractors',
    blurb: 'For subcontractors who need compliant payment claims, EOTs and notices on time, every time.',
  },
  {
    slug: 'contract-administrators',
    title: 'Contract Administrators',
    blurb: 'For contract admins, project managers and CMs running 5+ active contracts in parallel.',
  },
  {
    slug: 'construction-lawyers',
    title: 'Construction Lawyers',
    blurb: 'For construction lawyers reviewing contracts, drafting notices, and advising on time bars.',
  },
]

export default function SolutionsHubPage() {
  return (
    <div className="bg-[#FAF9F6]">
      <section className="bg-[#fafaf9] py-24 md:py-32">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <FadeIn>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Built for everyone in the chain.
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Whatever your role on a project, Astruct meets you where the contract lives.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-2 gap-6">
          {AUDIENCES.map((a, i) => (
            <FadeIn key={a.slug} delay={i * 80}>
              <Link
                href={`/solutions/${a.slug}`}
                className="block bg-white border border-[#e8e3d8] rounded-xl p-8 hover:border-[#0f0e0d]/30 transition-colors h-full"
              >
                <h2 className="text-[#1C1917] text-xl font-medium" style={{ fontFamily: headlineFont, letterSpacing: '-0.01em' }}>
                  {a.title}
                </h2>
                <p className="text-[#57534E] mt-3 leading-relaxed">{a.blurb}</p>
                <p className="text-sm text-[#0f0e0d] mt-6 inline-flex items-center gap-1">
                  Learn more →
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  )
}
