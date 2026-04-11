'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const FEATURES = [
  {
    title: 'Auto-extracted deadlines',
    description:
      'Upload your contract and Astruct identifies every time-sensitive obligation — payment claims (25th monthly), payment schedules (14th), EOT notices, dispute timeframes, and more.',
  },
  {
    title: 'Traffic-light status tracking',
    description:
      'Each obligation is colour-coded: red for expired, amber for due within 7 days, green for compliant. Open the calendar on Monday morning and see exactly where you stand.',
  },
  {
    title: 'Recurring obligations',
    description:
      'Weekly delay updates, monthly payment claims, quarterly insurance certificates. Astruct creates recurring entries based on contract terms and clause requirements.',
  },
  {
    title: 'One-click draft response',
    description:
      'Every deadline includes a draft action. Click it and the AI generates a notice with the correct clause references, required content, and proper addressing.',
  },
]

const CONTRACT_FORMS = ['AS4000', 'AS4902', 'NEC', 'FIDIC']

export default function CalendarPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wider uppercase mb-5">
              Time-Bar Calendar
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Never miss a contractual
              <br className="hidden sm:block" /> deadline again
            </h1>
            <p className="mt-6 text-[#706d66] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              A typical head contract contains dozens of time-sensitive obligations. Miss one notice period and you lose the right to claim — regardless of merit. Astruct extracts every time-bar and tracks them all in one calendar.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Video showcase */}
      <section className="bg-[#fafaf9] pb-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <div className="w-full rounded-xl overflow-hidden border border-[#e5e2dc]" style={{ aspectRatio: '16/9' }}>
              <video
                src="/marketing/timebars-movie.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-[#fafaf9] py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl sm:text-4xl leading-tight mb-16 text-center"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Every deadline your contract creates
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-12">
            {FEATURES.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 100}>
                <div>
                  <h3 className="text-[#0f0e0d] text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-[#706d66] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Supported contract forms */}
      <section className="bg-[#eae6e0] py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl sm:text-4xl leading-tight mb-4"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Built for standard forms
            </h2>
            <p className="text-[#706d66] text-base max-w-xl mx-auto mb-12">
              Understands time-bar provisions across the major contract forms, including amended and bespoke versions.
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="flex flex-wrap justify-center gap-3">
              {CONTRACT_FORMS.map((form) => (
                <span
                  key={form}
                  className="px-5 py-2.5 rounded-lg bg-[#fafaf9] text-[#0f0e0d] text-sm font-medium border border-[#e5e2dc]"
                >
                  {form}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fafaf9] py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Find every deadline hiding in your contract
            </h2>
            <p className="mt-4 text-[#706d66] text-lg max-w-xl mx-auto">
              Upload your contract and see how many time-bar obligations you have been tracking manually — or not tracking at all.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-7 py-3 rounded-lg bg-[#0f0e0d] text-white text-sm font-medium hover:bg-[#2a2927] transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/platform"
                className="px-7 py-3 rounded-lg border border-[#d6d3cc] text-[#0f0e0d] text-sm font-medium hover:border-[#aaa] transition-colors"
              >
                Back to platform overview
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
