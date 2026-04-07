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

const features = [
  {
    title: 'AI Assistant',
    href: '/assistant',
    description: 'Ask questions about your contract in plain English. Get verified answers with clause-level citations.',
    screenshot: 'AI Assistant responding to a question about liquidated damages with source citations',
    points: [
      { label: 'Natural language queries', text: 'Ask "What are my notification obligations under clause 34?" and get a precise, cited answer.' },
      { label: 'Clause-level citations', text: 'Every response includes the exact clause reference, so you can verify the answer against the source document.' },
      { label: 'Query rewriting', text: 'The system rewrites your question into multiple search variants to ensure nothing is missed across the contract.' },
      { label: 'Extended thinking', text: 'For complex questions involving multiple interacting clauses, the AI reasons step-by-step before answering.' },
      { label: 'Conversation history', text: 'Follow-up questions maintain context, so you can drill into a topic without repeating yourself.' },
      { label: 'Multi-document awareness', text: 'Answers draw from the head contract, amendments, and correspondence in a single response.' },
    ],
  },
  {
    title: 'Document Generation',
    href: '/features',
    description: 'Draft contractually compliant notices, claims, and correspondence in seconds. Every document references the correct clauses and meets formal requirements.',
    screenshot: 'Generated Extension of Time claim with clause references and SOPA-compliant formatting',
    points: [
      { label: 'Extension of Time claims', text: 'Generate EOT notices that reference the correct clause, include the qualifying cause of delay, and meet the prescribed form.' },
      { label: 'Variation notices', text: 'Draft variation directions and claims that comply with clause 36 requirements, including valuation methodology.' },
      { label: 'Payment claims', text: 'Produce SOPA-compliant payment claims with reference dates, due dates, and supporting schedule calculations.' },
      { label: 'Show cause notices', text: 'Generate show cause notices under clause 39 with proper particulars and response timeframes.' },
      { label: 'Custom templates', text: 'Define your own document templates with variable fields that auto-populate from contract data.' },
    ],
  },
  {
    title: 'Review Tables',
    href: '/review',
    description: 'Extract structured data from contracts and correspondence into sortable, exportable tables. Define your own columns or use presets.',
    screenshot: 'Review table showing extracted payment milestones with confidence scores',
    points: [
      { label: 'Custom column definitions', text: 'Define exactly what data you want extracted: dates, dollar amounts, obligations, party names, clause references.' },
      { label: 'Preset templates', text: 'Start with built-in templates for common tasks: payment schedules, time-bar obligations, insurance requirements.' },
      { label: 'Confidence scoring', text: 'Every extracted value includes a confidence score, so you know where to focus your manual review.' },
      { label: 'Batch processing', text: 'Run extraction across hundreds of documents in a single operation. Process an entire project correspondence folder in minutes.' },
      { label: 'CSV and Excel export', text: 'Export your review tables directly to CSV or Excel for use in existing workflows and reporting tools.' },
    ],
  },
  {
    title: 'Time-Bar Calendar',
    href: '/calendar',
    description: 'Automatically extract every time-bar obligation from your contract and track deadlines in a visual calendar. Never miss a notice period again.',
    screenshot: 'Calendar view showing upcoming time-bar deadlines with color-coded status indicators',
    points: [
      { label: 'Auto-extraction', text: 'Upload your AS4000 contract and the system identifies every clause with a time-bar obligation, including notice periods and response windows.' },
      { label: 'Color-coded status', text: 'Deadlines are color-coded: upcoming (blue), due soon (amber), overdue (red), completed (green). See your exposure at a glance.' },
      { label: 'One-click notice drafting', text: 'Click any obligation to draft the corresponding notice. The system pre-fills clause references, dates, and required content.' },
      { label: 'Recurring obligations', text: 'Monthly progress claims, quarterly reports, annual insurance renewals — recurring obligations are tracked automatically.' },
      { label: 'Correspondence linking', text: 'When correspondence triggers a new obligation, the calendar updates automatically with the correct response deadline.' },
    ],
  },
  {
    title: 'Document Library',
    href: '/features',
    description: 'A structured repository for every project document. Upload contracts, amendments, correspondence, and drawings. Full-text search across everything.',
    screenshot: 'Document library showing folder structure with contract, amendments, and correspondence',
    points: [
      { label: 'Drag-and-drop upload', text: 'Upload PDFs, Word documents, and images. The system OCRs scanned documents and indexes everything for search.' },
      { label: 'Automatic categorisation', text: 'Documents are automatically tagged by type: contract, amendment, RFI, site instruction, payment certificate, correspondence.' },
      { label: 'Version tracking', text: 'Track multiple versions of the same document. See what changed between amendment A and amendment B.' },
      { label: 'Full-text search', text: 'Search across every document in your project. Find every mention of "liquidated damages" across contracts, amendments, and letters.' },
      { label: 'Secure sharing', text: 'Share specific documents or entire folders with team members. Control who can view, edit, or download.' },
    ],
  },
  {
    title: 'Correspondence Management',
    href: '/features',
    description: 'Track every letter, email, and notice. Link correspondence to contract clauses and obligations. Build a complete audit trail.',
    screenshot: 'Correspondence register showing linked letters with status and response deadlines',
    points: [
      { label: 'Chronological register', text: 'Every piece of correspondence is logged with date, sender, recipient, subject, and linked contract clause.' },
      { label: 'Obligation detection', text: 'When a letter triggers a contractual obligation (e.g., a direction to accelerate), the system flags it and creates a deadline.' },
      { label: 'Response tracking', text: 'Track which letters require a response, what the deadline is, and whether a response has been sent.' },
      { label: 'Clause linking', text: 'Link correspondence to specific contract clauses. When reviewing clause 34, see every letter that references it.' },
      { label: 'Export for disputes', text: 'Export a chronological bundle of all correspondence related to a specific issue, formatted for adjudication or arbitration.' },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div style={{ background: '#FAFAF8', color: '#1a1a1a' }}>
      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-[820px] mx-auto text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-medium leading-[1.1]" style={{ letterSpacing: '-0.03em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Everything you need to manage construction contracts
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-7 text-lg sm:text-xl text-[#555] leading-relaxed max-w-[640px] mx-auto">
              Astruct combines AI-powered contract analysis, automated document generation, and deadline tracking into a single platform built specifically for Australian construction.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Feature sections */}
      {features.map((feature, i) => (
        <section key={feature.title} className={`py-20 px-6 ${i % 2 === 1 ? 'bg-[#f5f3ef]' : ''}`}>
          <div className="max-w-[1100px] mx-auto">
            <div className={`grid md:grid-cols-2 gap-14 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
              {/* Text */}
              <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                <FadeIn>
                  <p className="text-xs font-semibold text-[#5C6B52] uppercase tracking-wider mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {feature.title}
                  </h2>
                  <p className="mt-4 text-[#555] leading-relaxed">{feature.description}</p>
                </FadeIn>
                <FadeIn delay={100}>
                  <ul className="mt-8 space-y-4">
                    {feature.points.map((point) => (
                      <li key={point.label} className="flex gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5C6B52] shrink-0" />
                        <span className="text-sm text-[#666] leading-relaxed">
                          <strong className="text-[#1a1a1a] font-medium">{point.label}.</strong> {point.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </FadeIn>
                {feature.href !== '/features' && (
                  <FadeIn delay={200}>
                    <Link href={feature.href} className="inline-block mt-8 text-sm font-medium text-[#5C6B52] hover:text-[#4d5a45] transition-colors">
                      Learn more &rarr;
                    </Link>
                  </FadeIn>
                )}
              </div>

              {/* Screenshot */}
              <FadeIn delay={150} className={i % 2 === 1 ? 'md:col-start-1' : ''}>
                <ScreenshotPlaceholder label={feature.screenshot} />
              </FadeIn>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 px-6">
        <FadeIn>
          <div className="max-w-[640px] mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Ready to stop managing contracts manually?
            </h2>
            <p className="mt-5 text-[#555] leading-relaxed">
              Upload your first contract and see what Astruct finds. Most teams discover missed obligations within the first ten minutes.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 rounded-lg text-white text-sm font-medium bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
                Start free
              </Link>
              <Link href="/landing" className="px-8 py-3.5 rounded-lg text-sm font-medium border border-[#d5d0c8] text-[#444] hover:border-[#999] transition-colors">
                Back to overview
              </Link>
            </div>
            <p className="mt-5 text-xs text-[#999]">Free for your first project &middot; No credit card required</p>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}