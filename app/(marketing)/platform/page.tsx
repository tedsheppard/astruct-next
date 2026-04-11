'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const PRODUCTS = [
  {
    title: 'AI Assistant',
    href: '/platform/assistant',
    video: '/marketing/assistant-movie.mp4',
    description:
      'Ask questions in plain language about your contracts, draft notices, and analyse clauses. Powered by Claude Sonnet 4.6 with retrieval-augmented generation across your contract documents, correspondence, knowledge base, and the web. Every response cites specific clauses and can be exported as a formatted DOCX with full citations.',
  },
  {
    title: 'Document Library',
    href: '/platform/library',
    video: '/marketing/library-movie.mp4',
    description:
      'Upload PDFs, DOCX files, and images. Astruct automatically classifies each document into one of 13 construction document types — Contract, Tender, Drawings, Specs, Project Letters, RFIs, Variations, Notices of Delay, EOT Claims, Payment Claims, Payment Schedules, Third-Party Invoices, and Other. Every document is vector-embedded for semantic search across your entire project.',
  },
  {
    title: 'Time-Bar Calendar',
    href: '/platform/calendar',
    video: '/marketing/timebars-movie.mp4',
    description:
      'Contractual deadlines are automatically extracted from your uploaded documents — payment claim cycles, EOT notice periods, dispute timeframes, and every other obligation buried in the fine print. Each deadline is tracked with red, amber, and green status indicators, with an upcoming deadlines list so nothing slips through.',
  },
  {
    title: 'Correspondence',
    href: '/platform/correspondence',
    video: '/marketing/corro-movie.mp4',
    description:
      'Upload project letters and emails. Astruct extracts metadata — parties, dates, subject lines, and clause references — then cross-references each item against your contractual deadlines. Integrates with Procore, Aconex, and Asite to pull correspondence directly from your existing systems.',
  },
]

export default function PlatformPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wider uppercase mb-5">
              Platform
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              One platform for your entire
              <br className="hidden sm:block" /> contract lifecycle
            </h1>
            <p className="mt-6 text-[#706d66] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Astruct is a unified AI platform for construction contract management. Upload your documents, ask questions, track deadlines, and manage correspondence — all in one place.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Product sections — alternating light backgrounds */}
      {PRODUCTS.map((product, i) => {
        const isEven = i % 2 === 0
        return (
          <section
            key={product.title}
            className={isEven ? 'bg-[#eae6e0]' : 'bg-[#fafaf9]'}
          >
            <div className="max-w-[1200px] mx-auto px-6 py-32">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  !isEven ? 'lg:[direction:rtl]' : ''
                }`}
              >
                {/* Video */}
                <FadeIn className={!isEven ? 'lg:[direction:ltr]' : ''}>
                  <div className="w-full rounded-xl overflow-hidden border border-[#e5e2dc]" style={{ aspectRatio: '16/9' }}>
                    <video
                      src={product.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </FadeIn>

                {/* Text */}
                <FadeIn delay={150} className={!isEven ? 'lg:[direction:ltr]' : ''}>
                  <p className="text-[#adaba5] text-sm font-medium tracking-wider uppercase mb-3">
                    0{i + 1}
                  </p>
                  <h2
                    className="text-[#0f0e0d] text-3xl sm:text-4xl leading-tight mb-6"
                    style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
                  >
                    {product.title}
                  </h2>
                  <p className="text-[#706d66] text-base leading-relaxed">
                    {product.description}
                  </p>
                  <div className="mt-8">
                    <Link
                      href={product.href}
                      className="text-sm font-medium text-[#0f0e0d] inline-flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                    >
                      Learn more
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Start managing your contracts with AI
            </h2>
            <p className="mt-4 text-[#706d66] text-lg max-w-xl mx-auto">
              Upload your first contract and see what Astruct finds in under two minutes. No credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-7 py-3 rounded-lg bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 rounded-lg border border-[#e5e2dc] text-[#0f0e0d] text-sm font-medium hover:border-[#adaba5] transition-colors"
              >
                Book a demo
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
