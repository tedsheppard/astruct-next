'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const FEATURES = [
  {
    title: 'AI metadata extraction',
    description:
      'Upload a letter or email and Astruct extracts the sender, recipient, date, subject, and clause references. No manual data entry into a correspondence register.',
  },
  {
    title: 'Direction and categorisation',
    description:
      'Each item is categorised as Incoming, Outgoing, or Neutral. The AI detects response deadlines and automatically adds them to your time-bar calendar.',
  },
  {
    title: 'Contract cross-referencing',
    description:
      'When a letter references "clause 34.2 of the contract," Astruct links it to that clause in your document library. Every letter becomes part of a connected narrative.',
  },
  {
    title: 'Platform integrations',
    description:
      'Pull correspondence directly from Procore, Aconex, Asite, Hammertech, and InEight. No duplicate uploads or manual syncing between systems.',
  },
]

export default function CorrespondencePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wider uppercase mb-5">
              Correspondence
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Every letter, indexed
              <br className="hidden sm:block" /> and actionable
            </h1>
            <p className="mt-6 text-[#706d66] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Project correspondence is where contractual rights are exercised and lost. Upload letters and emails, and Astruct extracts metadata, detects deadlines, and cross-references everything against your contract obligations.
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
                src="/marketing/corro-movie.mp4"
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
              From inbox to contract register
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

      {/* CTA */}
      <section className="bg-[#eae6e0] py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Stop losing rights in your inbox
            </h2>
            <p className="mt-4 text-[#706d66] text-lg max-w-xl mx-auto">
              Upload your project correspondence and let Astruct find the deadlines you are about to miss.
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
