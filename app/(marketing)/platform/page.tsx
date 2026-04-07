'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

function Screenshot({ label }: { label: string }) {
  return (
    <div
      className="w-full rounded-xl border border-[#2a2a2a] bg-[#141414] flex items-center justify-center text-[#555] text-sm"
      style={{ aspectRatio: '16/9' }}
    >
      Screenshot: {label}
    </div>
  )
}

function ScreenshotLight({ label }: { label: string }) {
  return (
    <div
      className="w-full rounded-xl border border-[#e5e2dc] bg-[#f0eee9] flex items-center justify-center text-[#999] text-sm"
      style={{ aspectRatio: '16/9' }}
    >
      Screenshot: {label}
    </div>
  )
}

const PRODUCTS = [
  {
    title: 'AI Assistant',
    href: '/platform/assistant',
    theme: 'light' as const,
    screenshot: 'AI Assistant answering a time-bar question with clause citation',
    bullets: [
      'Ask questions in plain language and get answers grounded in your uploaded contract documents',
      'Every response cites specific clauses — clause 34.2 of AS4000, not "the contract says..."',
      'Hybrid search combines semantic understanding with keyword precision across hundreds of pages',
      'Draft notices, payment claims, and EOT responses directly from the conversation',
      'Full conversation context — follow-up questions reference prior answers without re-explaining',
    ],
  },
  {
    title: 'Document Library',
    href: '/platform/library',
    theme: 'dark' as const,
    screenshot: 'Document Library with AI classification tags and search bar',
    bullets: [
      'Drag-and-drop upload for contracts, variations, RFIs, site instructions, and correspondence',
      'AI classification automatically tags document type, parties, dates, and contract references',
      'Semantic search finds relevant clauses even when you don\'t know the exact wording',
      'Re-index documents after amendments or variations without re-uploading the full set',
      'Supports PDF, DOCX, and scanned documents with OCR processing',
    ],
  },
  {
    title: 'Review Tables',
    href: '/platform/review',
    theme: 'light' as const,
    screenshot: 'Review Table extracting notice periods from AS4000 clauses',
    bullets: [
      'Extract structured data from contracts — notice periods, liability caps, insurance requirements',
      'AI reads every page and populates columns you define, with confidence scores per cell',
      'Pre-built templates for AS4000, AS4902, AS2124, and ABIC MW-1 contracts',
      'Compare extracted terms across multiple contracts or subcontract packages',
      'Export to CSV or PDF for board reports, tender assessments, or legal review',
    ],
  },
  {
    title: 'Time-Bar Calendar',
    href: '/platform/calendar',
    theme: 'dark' as const,
    screenshot: 'Calendar view showing colour-coded contractual deadlines',
    bullets: [
      'Automatically extracts every time-bar obligation from your contract — not just the ones you remember',
      'Colour-coded status: upcoming (green), due soon (amber), overdue (red), completed (grey)',
      'One-click drafting — generate a compliant notice directly from a calendar obligation',
      'Handles recurring obligations like monthly progress claims and quarterly insurance certificates',
      'Built for Australian construction: understands "business days" per AS4000 clause 2',
    ],
  },
  {
    title: 'Correspondence',
    href: '/platform/correspondence',
    theme: 'light' as const,
    screenshot: 'Correspondence log with AI-extracted metadata and reading pane',
    bullets: [
      'Upload project correspondence and Astruct extracts sender, recipient, date, subject, and references',
      'Reading pane shows the full letter alongside extracted metadata and related documents',
      'All correspondence is searchable by the AI Assistant — ask "what did the superintendent say about delay?"',
      'Deadline scanning identifies when a letter triggers a contractual obligation or time-bar',
      'Chronological log builds automatically — no manual data entry into spreadsheet trackers',
    ],
  },
]

export default function PlatformPage() {
  return (
    <div>
      {/* Hero — Dark */}
      <section className="bg-[#0C0C0C] py-28 sm:py-36">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-5">Platform</p>
            <h1
              className="text-white text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              Engineered for every project
            </h1>
            <p className="mt-6 text-[#a8a29e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Five integrated tools that read your contracts, track your deadlines, and draft your notices. Built specifically for Australian construction — AS4000, AS4902, SOPA, and the contracts your projects actually use.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Product sections */}
      {PRODUCTS.map((product, i) => {
        const isDark = product.theme === 'dark'
        return (
          <section
            key={product.title}
            className={isDark ? 'bg-[#0C0C0C]' : 'bg-[#FAF9F6]'}
          >
            <div className="max-w-[1200px] mx-auto px-6 py-24 sm:py-32">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
                <FadeIn className={i % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  {isDark ? (
                    <Screenshot label={product.screenshot} />
                  ) : (
                    <ScreenshotLight label={product.screenshot} />
                  )}
                </FadeIn>

                <FadeIn delay={150} className={i % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                  <p className={`text-sm font-medium tracking-wider uppercase mb-3 ${isDark ? 'text-[#6B7F5E]' : 'text-[#6B7F5E]'}`}>
                    0{i + 1}
                  </p>
                  <h2
                    className={`text-3xl sm:text-4xl leading-tight mb-6 ${isDark ? 'text-white' : 'text-[#1C1917]'}`}
                    style={{ fontFamily: headlineFont }}
                  >
                    {product.title}
                  </h2>
                  <ul className="space-y-4">
                    {product.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="text-[#6B7F5E] mt-1.5 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </span>
                        <span className={`text-sm leading-relaxed ${isDark ? 'text-[#a8a29e]' : 'text-[#57534E]'}`}>
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={product.href}
                      className={`text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${
                        isDark ? 'text-white hover:text-[#6B7F5E]' : 'text-[#1C1917] hover:text-[#6B7F5E]'
                      }`}
                    >
                      Learn more
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-white text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              Stop reading contracts manually
            </h2>
            <p className="mt-4 text-[#a8a29e] text-lg max-w-xl mx-auto">
              Upload your first contract and see what Astruct finds in under two minutes. No credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-7 py-3 rounded-lg bg-[#6B7F5E] text-white text-sm font-medium hover:bg-[#5a6e4e] transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 rounded-lg border border-[#333] text-white text-sm font-medium hover:border-[#555] transition-colors"
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
