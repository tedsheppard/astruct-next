'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PAIN_POINTS = [
  {
    title: 'Obligations across multiple parties',
    description:
      'You are tracking obligations for the principal, head contractor, and every subcontractor on the project. Each contract has different notice periods, response deadlines, and requirements. Keeping it all straight in spreadsheets does not scale.',
  },
  {
    title: 'Tracking correspondence',
    description:
      'Hundreds of letters, emails, and directions flow through your office every month. When a dispute arises six months later, you need to find the relevant correspondence quickly -- not spend hours searching through folders.',
  },
  {
    title: 'Ensuring compliance',
    description:
      'Every notice, direction, and response needs to meet the contractual requirements -- the right clause, the right format, the right recipient, and the right deadline. One mistake can undermine a claim or expose your client to liability.',
  },
]

const CAPABILITIES = [
  {
    title: 'Correspondence management',
    description:
      'Upload incoming and outgoing correspondence. Astruct indexes it, links it to the relevant contract clauses, and makes it searchable. Find the relevant letter in seconds, not hours.',
  },
  {
    title: 'Obligation tracking',
    description:
      'Every notice period, defects liability window, and payment milestone is extracted from every contract on your project. A single dashboard shows what is due across all contracts -- no more relying on memory.',
  },
  {
    title: 'Document analysis',
    description:
      'Search across your entire contract set in seconds. Ask questions in plain English and get answers with clause references. Your site teams get instant, accurate answers grounded in the actual contract documents.',
  },
  {
    title: 'Deadline monitoring',
    description:
      'Astruct tracks every deadline across every contract and alerts you before they pass. Time bars, response periods, and submission deadlines are all visible in a single calendar view.',
  },
  {
    title: 'Draft contract correspondence',
    description:
      'Generate first drafts of notices, directions, responses to claims, and other contract correspondence. Astruct references the correct clauses and uses appropriate contractual language.',
  },
  {
    title: 'Compare amendments and variations',
    description:
      'When the principal issues amended special conditions or a deed of variation, Astruct highlights exactly what changed -- clause by clause. Understand the impact before you advise.',
  },
]

export default function ContractAdministratorsPage() {
  return (
    <div>
      {/* Hero — light */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wide uppercase mb-4">
              For Contract Administrators
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Your entire contract set, searchable in seconds
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              You are the person everyone comes to with contract questions. Astruct gives you an AI assistant that knows every clause in every document on your project -- so you can answer in seconds, not hours.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#0f0e0d] text-[#fafaf9] font-medium hover:bg-[#2a2927] transition-colors"
              >
                Start free trial
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-[#d6d3ce] text-[#706d66] hover:text-[#0f0e0d] hover:border-[#0f0e0d] transition-colors"
              >
                Book a demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem — dark */}
      <section className="bg-[#0f0e0d] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-[#fafaf9] text-3xl md:text-4xl max-w-2xl mb-14"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Managing 30+ documents across a project is unsustainable without better tools
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((point, i) => (
              <FadeIn key={point.title} delay={i * 100}>
                <div className="border-l-2 border-[#3a3835] pl-6">
                  <h3
                    className="text-[#fafaf9] text-lg mb-3"
                    style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
                  >
                    {point.title}
                  </h3>
                  <p className="text-[#a8a29e] text-sm leading-relaxed">{point.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities — light */}
      <section className="bg-[#fafaf9] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl md:text-4xl mb-14"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              How Astruct helps
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {CAPABILITIES.map((cap, i) => (
              <FadeIn key={cap.title} delay={i * 80}>
                <div className="border-l-2 border-[#d6d3ce] pl-6">
                  <h3
                    className="text-[#0f0e0d] text-xl mb-4"
                    style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
                  >
                    {cap.title}
                  </h3>
                  <p className="text-[#706d66] text-sm leading-relaxed">{cap.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fafaf9] border-t border-[#e5e5e3] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl md:text-4xl mb-6"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Spend less time searching. More time administering.
            </h2>
            <p className="text-[#706d66] text-lg max-w-xl mx-auto mb-10">
              Astruct is the contract administration tool built for the people who actually run construction projects.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#0f0e0d] text-[#fafaf9] font-medium hover:bg-[#2a2927] transition-colors"
            >
              Start your free trial
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
