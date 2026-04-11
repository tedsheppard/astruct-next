'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PAIN_POINTS = [
  {
    title: 'Missing time-bars means losing claims',
    description:
      'Under AS4000 clause 34.2, a contractor who fails to give notice within 28 days of becoming aware of an event loses the right to claim entirely. One missed deadline can cost you hundreds of thousands of dollars.',
  },
  {
    title: 'Responding to directions quickly',
    description:
      'When the head contractor issues a direction, you often have days -- not weeks -- to respond. Understanding whether a direction is within scope, and drafting the right response, should not require a lawyer every time.',
  },
  {
    title: 'Complex head contract flow-downs',
    description:
      'Your subcontract may incorporate the head contract by reference -- including obligations, liquidated damages, and indemnities you have never seen. Understanding what flows down to you is critical but rarely straightforward.',
  },
]

const CAPABILITIES = [
  {
    title: 'Time-bar alerts',
    description:
      'Astruct extracts every notice period and time-bar from your subcontract and tracks them in a calendar. You get alerts before a deadline approaches -- not after it has passed.',
  },
  {
    title: 'Quick notice drafting',
    description:
      'Ask Astruct to draft a variation notice, payment claim, or response to a direction. It reads your contract, identifies the correct clause, and generates a notice that meets your contractual requirements.',
  },
  {
    title: 'Clause research',
    description:
      'Ask plain-English questions about your subcontract. "What are my liquidated damages?" or "Can I claim delay costs?" Astruct gives you answers grounded in the actual clauses -- with references you can verify.',
  },
  {
    title: 'EOT claim generation',
    description:
      'When you need to claim an extension of time, Astruct identifies the relevant clause, the notice requirements, and the information you need to include. Draft a compliant EOT claim in minutes, not hours.',
  },
]

export default function SubcontractorsPage() {
  return (
    <div>
      {/* Hero — light */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wide uppercase mb-4">
              For Subcontractors
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Protect your claims. Never miss a deadline.
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              Time bars, flow-down clauses, and strict notice requirements mean subcontractors carry disproportionate risk. Astruct helps you understand and manage that risk so you get paid for the work you do.
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
                Talk to us
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
              The deck is stacked against subcontractors
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
              Do not let a missed deadline cost you a claim
            </h2>
            <p className="text-[#706d66] text-lg max-w-xl mx-auto mb-10">
              Astruct is built for the subcontractors who do the work. Understand your contracts, protect your rights, and get paid.
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
