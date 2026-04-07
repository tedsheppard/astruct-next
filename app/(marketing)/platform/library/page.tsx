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

export default function LibraryPage() {
  return (
    <div>
      {/* Hero — Dark */}
      <section className="bg-[#0C0C0C] py-28 sm:py-36">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-5">Document Library</p>
            <h1
              className="text-white text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              Your entire project, indexed and searchable
            </h1>
            <p className="mt-6 text-[#a8a29e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Upload your head contract, subcontracts, variations, site instructions, and correspondence. Astruct reads, classifies, and indexes everything so the AI Assistant can answer questions across your full document set.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* AI Classification — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <ScreenshotLight label="Document list with AI-generated classification tags" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">AI Classification</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Automatic tagging, zero manual entry
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  Drop a 200-page AS4000 contract into Astruct and it identifies the document type (head contract), the form (AS4000-1997), the parties (Principal, Contractor), the contract date, and the key commercial terms — without you filling in a single field.
                </p>
                <p>
                  The same applies to variations, superintendent instructions, payment certificates, and subcontracts. Each document is tagged with its type, reference number, date, and the parties or roles it relates to.
                </p>
                <p>
                  This classification drives everything else. When the AI Assistant searches for relevant clauses, it knows which document is the head contract, which is a subcontract, and which is a variation — so it can prioritise and contextualise its answers.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Drag-Drop Upload — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <Screenshot label="Drag-and-drop upload zone with progress indicators" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Upload</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Drag, drop, done
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  Upload PDFs and DOCX files by dragging them into the library. Upload multiple documents at once — a full project document set of 30+ files processes in minutes, not hours.
                </p>
                <p>
                  Scanned documents are processed with OCR so even old paper contracts, faxed variations, and photographed site instructions become searchable text. The AI can read them just like natively digital documents.
                </p>
                <p>
                  Large contracts (500+ pages) are handled without issue. Astruct chunks documents intelligently by clause structure, not arbitrary page breaks, so the AI understands where one clause ends and the next begins.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Semantic Search — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <ScreenshotLight label="Search results showing matching clauses across multiple documents" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Semantic Search</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Find what matters, even when you do not know the wording
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  Search for "delay damages" and Astruct finds clauses about liquidated damages, time-related costs, delay costs, and extension of time consequences — even when those exact words never appear together in your contract.
                </p>
                <p>
                  This is critical for bespoke contracts where standard clause numbering does not apply. Your client&apos;s heavily amended AS4000 might bury the notice requirements in a schedule rather than clause 34. Semantic search finds it regardless.
                </p>
                <p>
                  Results show the matching text in context with the full clause visible, so you can read around the match and understand the complete provision without opening the full document.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Re-indexing — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <Screenshot label="Re-index panel showing updated document version with change highlights" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Re-indexing</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Contracts change. Your AI keeps up.
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  When a variation amends the contract program, or a deed of amendment changes the defects liability period, upload the new document and Astruct re-indexes the affected clauses. The AI immediately starts using the updated terms.
                </p>
                <p>
                  You do not need to re-upload the entire contract set. Upload the amendment or variation and Astruct understands which clauses are affected. Previous versions remain accessible for historical reference.
                </p>
                <p>
                  This is particularly important for projects running under AS4000 where the superintendent may issue directions that modify contractual obligations. Each direction is indexed and the AI accounts for the cumulative effect.
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
              Upload your first contract
            </h2>
            <p className="mt-4 text-[#57534E] text-lg max-w-xl mx-auto">
              Drag in your AS4000 or AS4902 contract and watch Astruct classify and index it in under a minute.
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
