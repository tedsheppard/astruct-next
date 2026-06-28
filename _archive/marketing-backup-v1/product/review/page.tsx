'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [v, setV] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return v
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const v = useInView(ref)
  return <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>{children}</div>
}

function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-[#e0ddd8] overflow-hidden" style={{ boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1)' }}>
      <div className="h-8 bg-[#f0ece6] flex items-center px-3 gap-1.5 border-b border-[#e0ddd8]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" />
      </div>
      <div className="aspect-video bg-[#f8f7f4] flex items-center justify-center text-sm text-[#999]">Screenshot: {label}</div>
    </div>
  )
}

const workflow = [
  {
    step: '01',
    title: 'Create a review table',
    description: 'Select the documents you want to review — a single contract, a batch of subcontracts, or an entire correspondence folder. Choose a preset template or start with a blank table.',
  },
  {
    step: '02',
    title: 'Define your columns',
    description: 'Tell the system what to extract. Each column has a name, a data type (text, date, currency, clause reference, yes/no), and a description of what to look for. For example: "Defects Liability Period — the number of days specified for the DLP."',
  },
  {
    step: '03',
    title: 'Process documents',
    description: 'The AI reads every document and extracts data into your table. Each cell includes the extracted value, the source clause or paragraph, and a confidence score. Processing runs in the background — you can work on other things while it runs.',
  },
  {
    step: '04',
    title: 'Review and export',
    description: 'Sort by confidence score to focus your manual review on the cells the AI was least sure about. Fix any errors directly in the table. Export to CSV or Excel when you are satisfied.',
  },
]

const presets = [
  {
    name: 'Payment schedule',
    description: 'Extract milestone dates, claim periods, payment terms, interest rates, and SOPA reference dates from progress payment clauses.',
    columns: ['Reference date', 'Payment claim due', 'Payment schedule due', 'Final payment date', 'Interest rate', 'Retention %'],
  },
  {
    name: 'Time-bar obligations',
    description: 'Identify every clause that imposes a time limit for notices, claims, or responses. Extract the trigger event, the time limit, and the consequence of non-compliance.',
    columns: ['Clause', 'Obligation', 'Time limit', 'Trigger event', 'Consequence', 'Notice form'],
  },
  {
    name: 'Insurance requirements',
    description: 'Extract all insurance obligations: policy types, minimum cover amounts, required endorsements, and proof-of-insurance deadlines.',
    columns: ['Policy type', 'Minimum cover', 'Required by', 'Endorsements', 'Proof due', 'Responsible party'],
  },
  {
    name: 'Subcontract comparison',
    description: 'Compare key commercial terms across multiple subcontracts: defects liability periods, retention rates, LD rates, EOT provisions, and payment terms.',
    columns: ['Subcontractor', 'DLP', 'Retention %', 'LD rate', 'EOT notice period', 'Payment terms'],
  },
]

const faqs = [
  {
    q: 'How does confidence scoring work?',
    a: 'Each extracted value receives a confidence score from 0 to 100. A score of 95+ means the AI found an explicit, unambiguous value in the text (e.g., "the Defects Liability Period shall be 12 months"). A score of 60-80 means the value was inferred from context or required interpretation. Below 60 means the AI is guessing — you should always verify these cells manually.',
  },
  {
    q: 'Can I process hundreds of documents at once?',
    a: 'Yes. The batch processing pipeline is designed for large document sets. We have tested it with correspondence folders of 500+ letters. Processing time depends on document length and the number of columns, but a typical 200-document run with 6 columns completes in under 10 minutes.',
  },
  {
    q: 'What if the AI extracts the wrong value?',
    a: 'Click any cell to see the source passage the AI used. If the extraction is wrong, you can correct the value directly in the table. Your corrections are saved alongside the original extraction, so you always have an audit trail of what the AI found versus what you confirmed.',
  },
  {
    q: 'Can I create my own column types?',
    a: 'Yes. Beyond the built-in types (text, date, currency, clause reference, boolean), you can define custom extraction instructions for any column. For example, you could create a column that extracts "the party responsible for obtaining development approval" — any free-text description of what to look for.',
  },
  {
    q: 'What export formats are supported?',
    a: 'CSV and Excel (.xlsx). The export includes the extracted values, source references, and confidence scores. Most teams import the CSV directly into their existing contract management spreadsheets or reporting tools.',
  },
]

export default function ReviewPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ background: '#FAFAF8', color: '#1a1a1a' }}>
      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-[820px] mx-auto text-center">
          <FadeIn>
            <p className="text-xs font-semibold text-[#5C6B52] uppercase tracking-wider mb-5">Review Tables</p>
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-medium leading-[1.1]" style={{ letterSpacing: '-0.03em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Extract structured data from every document
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-7 text-lg sm:text-xl text-[#555] leading-relaxed max-w-[640px] mx-auto">
              Define the data you need. Point it at your documents. Get a structured table with source references and confidence scores — ready to review, correct, and export.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 rounded-lg text-white text-sm font-medium bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
                Try it free
              </Link>
              <Link href="/features" className="px-8 py-3.5 rounded-lg text-sm font-medium border border-[#d5d0c8] text-[#444] hover:border-[#999] transition-colors">
                All features
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={300}>
          <div className="max-w-[900px] mx-auto mt-16">
            <ScreenshotPlaceholder label="Review table with extracted payment schedule data, confidence scores, and source clause references" />
          </div>
        </FadeIn>
      </section>

      {/* Workflow */}
      <section className="py-24 px-6 bg-[#f5f3ef]">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15] text-center" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Four steps from documents to data
            </h2>
          </FadeIn>

          <div className="mt-16 grid sm:grid-cols-2 gap-8">
            {workflow.map((item, i) => (
              <FadeIn key={item.step} delay={i * 100}>
                <div className="bg-white rounded-xl p-8 border border-[#e8e5e0]">
                  <span className="text-xs font-semibold text-[#5C6B52] tracking-wider">{item.step}</span>
                  <h3 className="mt-3 text-xl font-medium" style={{ letterSpacing: '-0.01em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#666] leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Preset templates */}
      <section className="py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15] text-center" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Preset templates for common tasks
            </h2>
            <p className="mt-5 text-center text-[#555] leading-relaxed max-w-[600px] mx-auto">
              Start with a built-in template and customise the columns to match your needs. Each template has been developed from real contract review workflows.
            </p>
          </FadeIn>

          <div className="mt-14 grid sm:grid-cols-2 gap-6">
            {presets.map((preset, i) => (
              <FadeIn key={preset.name} delay={i * 80}>
                <div className="bg-white rounded-xl p-7 border border-[#e8e5e0] h-full">
                  <h3 className="text-lg font-medium" style={{ letterSpacing: '-0.01em' }}>{preset.name}</h3>
                  <p className="mt-2 text-sm text-[#666] leading-relaxed">{preset.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {preset.columns.map(col => (
                      <span key={col} className="text-xs px-2.5 py-1 rounded-md bg-[#f5f3ef] text-[#888] border border-[#e8e5e0]">{col}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Confidence scoring */}
      <section className="py-24 px-6 bg-[#f5f3ef]">
        <div className="max-w-[900px] mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Confidence scoring tells you where to look
                </h2>
                <p className="mt-5 text-[#555] leading-relaxed">
                  Not every extraction is equally reliable. A payment amount stated explicitly in Annexure Part A is different from a defects liability period that has to be inferred from three interacting clauses.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-[#4ade80] shrink-0" />
                    <span className="text-sm text-[#666] leading-relaxed">
                      <strong className="text-[#1a1a1a] font-medium">95-100: High confidence.</strong> Explicit value found in the text. Minimal risk of error.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-[#facc15] shrink-0" />
                    <span className="text-sm text-[#666] leading-relaxed">
                      <strong className="text-[#1a1a1a] font-medium">60-94: Medium confidence.</strong> Value inferred from context or requires interpretation. Worth a quick manual check.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 w-3 h-3 rounded-full bg-[#f87171] shrink-0" />
                    <span className="text-sm text-[#666] leading-relaxed">
                      <strong className="text-[#1a1a1a] font-medium">Below 60: Low confidence.</strong> The AI is uncertain. Always verify these cells against the source document.
                    </span>
                  </li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <ScreenshotPlaceholder label="Table cells with color-coded confidence indicators and source clause pop-over" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-[720px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15] text-center" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Frequently asked questions
            </h2>
          </FadeIn>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className="bg-white rounded-xl border border-[#e8e5e0] overflow-hidden">
                  <button
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-medium text-[#1a1a1a]">{faq.q}</span>
                    <svg className={`w-4 h-4 text-[#999] shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-[#666] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#f5f3ef]">
        <FadeIn>
          <div className="max-w-[640px] mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Turn 200 pages into a spreadsheet
            </h2>
            <p className="mt-5 text-[#555] leading-relaxed">
              Extract payment schedules, time-bar obligations, insurance requirements, and any other structured data from your contracts. Review the AI&apos;s work, then export.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 rounded-lg text-white text-sm font-medium bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
                Start free
              </Link>
              <Link href="/features" className="px-8 py-3.5 rounded-lg text-sm font-medium border border-[#d5d0c8] text-[#444] hover:border-[#999] transition-colors">
                See all features
              </Link>
            </div>
            <p className="mt-5 text-xs text-[#999]">Free for your first project &middot; No credit card required</p>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}