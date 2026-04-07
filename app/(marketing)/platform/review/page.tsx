'use client'

import Link from 'next/link'
import { FadeIn } from '../../layout'

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

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Define your columns',
    desc: 'Choose what you want to extract: notice periods, liability caps, insurance requirements, defects liability periods, liquidated damages rates — whatever matters for your review.',
  },
  {
    step: '02',
    title: 'Select documents',
    desc: 'Pick one contract for a deep-dive or select multiple contracts for a comparison table. Works across head contracts, subcontracts, and consultant agreements.',
  },
  {
    step: '03',
    title: 'AI extracts and populates',
    desc: 'Astruct reads every page of every selected document and fills in each cell with the relevant clause text, value, or summary. Each cell includes a confidence score.',
  },
  {
    step: '04',
    title: 'Review and export',
    desc: 'Check the AI\'s work — click any cell to see the source clause. Edit where needed. Export the final table to CSV or PDF for your records.',
  },
]

const TEMPLATES = [
  { name: 'AS4000 Risk Register', desc: 'Notice periods, time-bars, liability caps, insurance, and indemnities for AS4000-1997 and AS4000-2025' },
  { name: 'AS4902 Subcontract Comparison', desc: 'Compare payment terms, retention, SOPA compliance, and back-to-back provisions across subcontract packages' },
  { name: 'Insurance Schedule', desc: 'Extract insurance types, minimum amounts, required endorsements, and proof-of-currency obligations' },
  { name: 'SOPA Compliance Check', desc: 'Verify payment claim procedures, due dates, and adjudication provisions against Security of Payment Act requirements' },
  { name: 'Tender Assessment', desc: 'Compare key commercial terms across multiple tender responses or contract offers' },
  { name: 'Defects & Warranty', desc: 'Defects liability periods, notification requirements, rectification timeframes, and warranty obligations' },
]

export default function ReviewPage() {
  return (
    <div>
      {/* Hero — Dark */}
      <section className="bg-[#0C0C0C] py-28 sm:py-36">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-5">Review Tables</p>
            <h1
              className="text-white text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              Extract structured data from every document
            </h1>
            <p className="mt-6 text-[#a8a29e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Define the columns. Select the documents. Astruct reads every page and populates a structured table with clause references, values, and confidence scores. Contract review that took days now takes minutes.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Workflow — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[900px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3 text-center">How It Works</p>
            <h2
              className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-16 text-center"
              style={{ fontFamily: headlineFont }}
            >
              Four steps from contract to structured data
            </h2>
          </FadeIn>
          <div className="space-y-12">
            {WORKFLOW_STEPS.map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="flex gap-6">
                  <div className="text-[#6B7F5E] text-2xl font-semibold shrink-0 w-10 pt-0.5" style={{ fontFamily: headlineFont }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-[#1C1917] text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-[#57534E] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <Screenshot label="Review Table with extracted notice periods and confidence scores" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Confidence Scoring</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Know when to trust the extraction
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  Every cell in a Review Table includes a confidence score. High confidence means the AI found an explicit clause that directly answers the column question — "28 days" for a notice period, "$50,000 per day" for liquidated damages.
                </p>
                <p>
                  Medium confidence means the AI found a relevant clause but the answer required interpretation — for example, a notice period that is defined as "a reasonable time" rather than a fixed number of days.
                </p>
                <p>
                  Low confidence means the contract may be silent on that topic, or the AI found conflicting provisions (common when special conditions partially amend general conditions). These cells are flagged for manual review.
                </p>
                <p>
                  This matters because a contract administrator reviewing 15 subcontracts needs to know which cells to check manually and which ones the AI has nailed. Confidence scoring makes that triage instant.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Templates — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3 text-center">Templates</p>
            <h2
              className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-12 text-center"
              style={{ fontFamily: headlineFont }}
            >
              Pre-built for Australian construction contracts
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((t, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white rounded-xl border border-[#e5e2dc] p-6 h-full">
                  <h3 className="text-[#1C1917] text-base font-medium mb-2">{t.name}</h3>
                  <p className="text-[#57534E] text-sm leading-relaxed">{t.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <p className="text-center text-[#57534E] text-sm mt-8">
              Templates are starting points. Add, remove, or rename columns to match your specific review requirements.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Export — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <Screenshot label="Export dialog with CSV and PDF options" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Export</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                From AI extraction to board report
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  Export completed Review Tables to CSV for further analysis in Excel, or to a formatted PDF for inclusion in board papers, tender assessments, or legal briefing documents.
                </p>
                <p>
                  The exported table includes the source clause references for every cell, so the reader can verify any value back to the original contract. This is not a summary — it is a traceable extraction.
                </p>
                <p>
                  For tender assessments, export a comparison table showing how five different subcontract offers handle retention, payment terms, and liability caps side by side. The commercial team sees the differences immediately.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <h2
              className="text-[#1C1917] text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              Review your first contract in minutes
            </h2>
            <p className="mt-4 text-[#57534E] text-lg max-w-xl mx-auto">
              Upload a contract, pick a template, and see what Astruct extracts. No credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-7 py-3 rounded-lg bg-[#6B7F5E] text-white text-sm font-medium hover:bg-[#5a6e4e] transition-colors"
              >
                Start free
              </Link>
              <Link
                href="/platform"
                className="px-7 py-3 rounded-lg border border-[#d6d3cc] text-[#1C1917] text-sm font-medium hover:border-[#aaa] transition-colors"
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
