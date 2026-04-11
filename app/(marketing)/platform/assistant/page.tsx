'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

const FEATURES = [
  {
    title: 'Four modes of operation',
    description:
      'Generate notices, draft correspondence, analyse documents, or ask contract questions. Choose the mode that fits your task and get purpose-built output every time.',
  },
  {
    title: 'Hybrid search across everything',
    description:
      'Combines keyword precision with semantic vector search across contract documents (13 categories), correspondence, knowledge base (standards, legislation, templates), and the web.',
  },
  {
    title: 'Grounded citations',
    description:
      'Every answer references specific clauses, pages, and documents. Click any citation to view the source. If the AI cannot find a relevant clause, it says so rather than guessing.',
  },
  {
    title: 'DOCX export and auto-save',
    description:
      'Download generated notices and letters as formatted DOCX files with your company letterhead. Documents auto-save to the Notices section for future reference.',
  },
]

const NOTICE_TYPES = [
  'Payment Claim',
  'Variation',
  'Delay',
  'Extension of Time',
  'Dispute',
  'Show Cause',
  'Other',
]

export default function AssistantPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#8f8b85] text-sm font-medium tracking-wider uppercase mb-5">
              AI Assistant
            </p>
            <h1
              className="text-[#0f0e0d] text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              AI that actually reads
              <br className="hidden sm:block" /> your contract
            </h1>
            <p className="mt-6 text-[#706d66] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Powered by Claude Sonnet 4.6. Ask questions in plain language, generate compliant notices, and draft correspondence — all grounded in your specific contract documents with verifiable clause citations.
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
                src="/marketing/assistant-movie.mp4"
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
              Contract intelligence, not generic AI
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

      {/* Notice types */}
      <section className="bg-[#eae6e0] py-24">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#0f0e0d] text-3xl sm:text-4xl leading-tight mb-4"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Seven notice types, one click
            </h2>
            <p className="text-[#706d66] text-base max-w-xl mx-auto mb-12">
              Generate contract-compliant notices with correct clause references, required content, and proper addressing. Each notice auto-saves and can be exported with your company template applied.
            </p>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="flex flex-wrap justify-center gap-3">
              {NOTICE_TYPES.map((type) => (
                <span
                  key={type}
                  className="px-4 py-2 rounded-lg bg-[#fafaf9] text-[#0f0e0d] text-sm font-medium border border-[#e5e2dc]"
                >
                  {type}
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
              Try asking your contract a question
            </h2>
            <p className="mt-4 text-[#706d66] text-lg max-w-xl mx-auto">
              Upload your contract and ask the AI anything. First project is free.
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
