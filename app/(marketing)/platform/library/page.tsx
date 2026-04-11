'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const FEATURES = [
  {
    title: 'AI auto-classification',
    description:
      'Upload a document and Astruct classifies it into one of 13 construction document types — contract, tender, drawings, specs, RFIs, variations, notices, and more. Zero manual tagging.',
  },
  {
    title: 'Semantic search',
    description:
      'Every document is vector-embedded on upload. Search for "delay damages" and find matching clauses even when those exact words never appear together in your contract.',
  },
  {
    title: 'AI-generated summaries',
    description:
      'Each document receives an automatic summary highlighting key terms, parties, dates, and obligations. Understand a 200-page contract at a glance before diving into the detail.',
  },
  {
    title: 'One-click re-index',
    description:
      'When contracts are amended or new documents arrive, re-index your entire library with a single click. The AI immediately starts using the updated content.',
  },
]

export default function LibraryPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wider uppercase mb-5">
              Document Library
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Your entire project,
              <br className="hidden sm:block" /> indexed and searchable
            </h1>
            <p className="mt-6 text-[#706d66] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Upload PDFs, DOCX files, images, and spreadsheets. Astruct reads, classifies, and vector-embeds everything so the AI can search across thousands of documents with semantic understanding.
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
                src="/marketing/library-movie.mp4"
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
              Upload once, search everything
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
              Upload your first contract
            </h2>
            <p className="mt-4 text-[#706d66] text-lg max-w-xl mx-auto">
              Drag in your contract and watch Astruct classify and index it in under a minute.
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
