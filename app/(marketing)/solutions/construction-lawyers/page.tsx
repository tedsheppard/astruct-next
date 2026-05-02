'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'
import { getCtaTarget } from '@/lib/anon-flag'

const CTA = getCtaTarget()
const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PAIN_POINTS = [
  {
    title: 'Fast contract review for clients',
    description:
      'Clients send you a 200-page subcontract on Friday at 4pm and want a position by Monday. Reading every clause and cross-referencing the standard form is the bottleneck.',
  },
  {
    title: 'Drafting compliant notices',
    description:
      'Notices have to cite the right clause, follow the contractual format, and meet the time bar. A small mistake in form invalidates the notice — and the entitlement.',
  },
  {
    title: 'Tracking obligations across multiple matters',
    description:
      'You\'re juggling 10+ active matters with overlapping deadlines. Missing a single time bar can be a professional indemnity event.',
  },
]

const FEATURES = [
  {
    title: 'Cited answers, every time',
    description:
      'Astruct quotes the contract verbatim with the clause reference. No hallucinations — if the answer isn\'t in the document, Astruct says so.',
  },
  {
    title: 'Notice drafts in seconds',
    description:
      'Ask for a delay notice, EOT claim, or payment claim cover letter — Astruct uses the right clause references for THAT contract and follows the contract\'s required form.',
  },
  {
    title: 'Per-matter billing',
    description:
      '$29.95 AUD per active matter per month, GST inclusive. Bill it through to the client or fold it into the engagement letter.',
  },
  {
    title: 'AS-form fluent',
    description:
      'AS4000, AS4902, AS2124, AS4901, ABIC SW/MW, NEC4, FIDIC, JCT, GC21 — Astruct understands them all.',
  },
]

export default function ConstructionLawyersPage() {
  return (
    <div className="bg-[#FAF9F6]">
      {/* Hero */}
      <section className="bg-[#fafaf9] py-24 md:py-32">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8f8b85] mb-5">
              For construction lawyers
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl md:text-5xl lg:text-6xl"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Cut the contract-reading time. Keep the analysis.
            </h1>
            <p className="text-[#706d66] text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Astruct reads the contract for you and gives cited answers grounded in the actual text —
              so you spend your time on the legal analysis your clients are paying for.
            </p>
            <div className="mt-10">
              <Link
                href={CTA}
                className="inline-flex items-center px-7 py-3 rounded-lg bg-[#0f0e0d] text-[#fafaf9] font-medium hover:bg-[#33312c] transition-colors"
              >
                Try Astruct free
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pains */}
      <section className="py-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-[#1C1917] text-3xl md:text-4xl mb-3 text-center"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.01em' }}
            >
              What construction lawyers struggle with
            </h2>
            <p className="text-[#706d66] text-center mb-14 max-w-2xl mx-auto">
              The friction we built Astruct to remove.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div className="bg-white border border-[#e8e3d8] rounded-xl p-7 h-full">
                  <h3 className="text-[#1C1917] font-medium mb-2">{p.title}</h3>
                  <p className="text-[#57534E] text-sm leading-relaxed">{p.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0f0e0d]">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-[#fafaf9] text-3xl md:text-4xl mb-3 text-center"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.01em' }}
            >
              What Astruct does for you
            </h2>
            <p className="text-[#adaba5] text-center mb-14 max-w-2xl mx-auto">
              Concrete features, mapped to the problems above.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="border border-[#2a2826] rounded-xl p-7 h-full">
                  <h3 className="text-[#fafaf9] font-medium mb-2">{f.title}</h3>
                  <p className="text-[#a8a29e] text-sm leading-relaxed">{f.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f0e0d] py-16 border-t border-[#2a2826]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#fafaf9] text-3xl md:text-4xl mb-6"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Try it on the next contract that lands on your desk.
            </h2>
            <p className="text-[#adaba5] text-lg max-w-xl mx-auto mb-10">
              No signup, no card. Upload, ask, see what comes back.
            </p>
            <Link
              href={CTA}
              className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[#fafaf9] text-[#0f0e0d] font-medium hover:bg-[#eae6e0] transition-colors"
            >
              Try free
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
