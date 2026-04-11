'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PAIN_POINTS = [
  {
    title: 'Time-bars across dozens of subcontracts',
    description:
      'Every subcontract has its own notice periods, response deadlines, and time-bar clauses. Tracking them manually across 20 to 50 subcontracts on a single project is a recipe for missed deadlines and lost entitlements.',
  },
  {
    title: 'Drafting variations under pressure',
    description:
      'Site teams need variation notices drafted quickly and correctly. Finding the right clause, meeting the contractual requirements, and issuing on time is a constant pressure when you are managing multiple packages.',
  },
  {
    title: 'Monthly payment claim cycles',
    description:
      'Each subcontract has its own payment claim format, submission deadline, and supporting documentation requirements. Managing this cycle across every package every month is time-consuming and error-prone.',
  },
]

const CAPABILITIES = [
  {
    title: 'AI-drafted compliant notices',
    description:
      'Astruct reads your contract and drafts notices that reference the correct clauses, meet the prescribed format, and use appropriate contractual language. Review and send -- rather than starting from a blank page.',
  },
  {
    title: 'Auto-track all obligations',
    description:
      'Every notice period, defects liability window, and payment milestone is extracted automatically. Your project team gets a single dashboard showing what is due, what is overdue, and what is coming up across every contract.',
  },
  {
    title: 'Bulk document search',
    description:
      'Search across your head contract, every subcontract, amendments, and correspondence in seconds. Ask questions in plain English and get answers with clause references -- no more opening PDFs one by one.',
  },
  {
    title: 'Payment cycle management',
    description:
      'Astruct understands the payment claim requirements for each subcontract -- the format, the supporting documents, the submission deadline. Stay on top of every package every month.',
  },
]

export default function ContractorsPage() {
  return (
    <div>
      {/* Hero — light */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wide uppercase mb-4">
              For Head Contractors
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl leading-tight max-w-3xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Contract intelligence for head contractors
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              You manage dozens of subcontracts, hundreds of obligations, and thousands of pages of contract documents. Astruct gives your project team instant answers and ensures nothing falls through the cracks.
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
              Managing subcontracts at scale is unsustainable without better tools
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
              Stop losing claims to missed deadlines
            </h2>
            <p className="text-[#706d66] text-lg max-w-xl mx-auto mb-10">
              Join the head contractors using Astruct to manage their contract obligations with confidence.
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
