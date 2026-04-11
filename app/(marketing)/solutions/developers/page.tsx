'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PAIN_POINTS = [
  {
    title: 'Visibility across multiple contractors',
    description:
      'As a principal or developer, you rely on contractors and superintendents to manage the detail. But when disputes arise, you need to understand what happened, what was notified, and whether time-bars were met -- often months after the fact.',
  },
  {
    title: 'Payment claim review under time pressure',
    description:
      'SOPA deadlines are strict. You need to assess progress claims, verify entitlements, and issue payment schedules within tight statutory timeframes. Manual review of supporting documents is slow and risky.',
  },
  {
    title: 'Contract risk across your portfolio',
    description:
      'Managing multiple projects means multiple contracts, each with different terms, amendment schedules, and obligation frameworks. Keeping track of your exposure across the portfolio is a constant challenge.',
  },
]

const CAPABILITIES = [
  {
    title: 'Portfolio-wide obligation tracking',
    description:
      'See every contractual deadline, notice requirement, and payment milestone across all your projects in one dashboard. Know what is due, what is overdue, and what is coming up.',
  },
  {
    title: 'Rapid payment claim assessment',
    description:
      'Upload a progress claim and its supporting documents. Astruct cross-references against contract terms, previous claims, and approved variations to help you assess entitlements quickly.',
  },
  {
    title: 'Contract analysis and comparison',
    description:
      'Ask questions about any contract in plain English. Compare terms across projects, identify non-standard amendments, and understand your risk position without reading every page.',
  },
  {
    title: 'Correspondence and notice audit trail',
    description:
      'Every letter, direction, and notice is indexed, classified, and searchable. When disputes arise, find the relevant correspondence and trace the contractual history in seconds.',
  },
]

export default function DevelopersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wide uppercase mb-4">
              For Developers and Principals
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Protect your position across every project
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              As a developer or principal, your contracts define your rights and your exposure. Astruct gives you the tools to understand, track, and enforce your contractual position across your entire portfolio.
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

      {/* Problem */}
      <section className="bg-[#0f0e0d] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-[#fafaf9] text-3xl md:text-4xl max-w-2xl mb-14"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Your exposure grows with every project you commission
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

      {/* Capabilities */}
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
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {CAPABILITIES.map((cap, i) => (
              <FadeIn key={cap.title} delay={i * 100}>
                <div className="border-l-2 border-[#d6d3ce] pl-6">
                  <h3
                    className="text-[#0f0e0d] text-xl md:text-2xl mb-4"
                    style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
                  >
                    {cap.title}
                  </h3>
                  <p className="text-[#706d66] leading-relaxed">{cap.description}</p>
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
              Take control of your contract portfolio
            </h2>
            <p className="text-[#706d66] text-lg max-w-xl mx-auto mb-10">
              Join the developers and principals using Astruct to protect their position on every project.
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
