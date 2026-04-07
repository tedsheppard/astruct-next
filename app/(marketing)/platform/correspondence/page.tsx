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

export default function CorrespondencePage() {
  return (
    <div>
      {/* Hero — Dark */}
      <section className="bg-[#0C0C0C] py-28 sm:py-36">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-5">Correspondence</p>
            <h1
              className="text-white text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              Every letter, indexed and actionable
            </h1>
            <p className="mt-6 text-[#a8a29e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Project correspondence is where contractual rights are exercised and lost. A superintendent&apos;s direction buried in a letter, a time-bar triggered by a notice you missed — Astruct reads every letter and makes it searchable, trackable, and connected to your contract.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Upload & AI Extraction — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <ScreenshotLight label="Correspondence upload with AI-extracted metadata fields" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">AI Extraction</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Upload a letter, get structured data back
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  Upload a PDF letter and Astruct extracts the sender, recipient, date, subject, reference numbers, and a summary of the content. No manual data entry into a correspondence register — the AI reads the letterhead, the addressing block, and the body text.
                </p>
                <p>
                  For superintendent&apos;s directions under AS4000 clause 23, the AI identifies the direction, the clause it is issued under, and whether it triggers any time-bar obligations for the contractor. A direction to accelerate work, for example, triggers the contractor&apos;s right to claim additional costs under clause 33.
                </p>
                <p>
                  Batch upload works for catching up on historical correspondence. Drop 200 letters from a project folder and Astruct processes them all, building a chronological register automatically.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Reading Pane — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <Screenshot label="Reading pane showing letter content alongside extracted metadata panel" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Reading Pane</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Read the letter, see the context
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  The reading pane shows the full letter alongside a metadata panel. The panel displays extracted fields (sender, date, references), related correspondence (letters this one responds to or references), and connected contract clauses.
                </p>
                <p>
                  When a letter references "your notice dated 15 February," Astruct links to that notice in the correspondence log. When it references "clause 34.2 of the contract," the panel shows a link to that clause in the Document Library.
                </p>
                <p>
                  This turns isolated letters into a connected narrative. Instead of manually cross-referencing correspondence with the contract and prior letters, the connections are surfaced automatically. You see the full picture without leaving the page.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Searchable by Assistant — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <ScreenshotLight label="AI Assistant answering a question with correspondence citations" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Connected to the AI</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Ask the AI about your correspondence
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  All uploaded correspondence is searchable by the AI Assistant. Ask "what did the superintendent say about the delay on level 3?" and the AI searches across both your contract documents and your correspondence to build a complete answer.
                </p>
                <p>
                  This is powerful for dispute preparation. Ask "summarise all correspondence about the waterproofing defect" and get a chronological summary with dates, parties, and key statements — each cited back to the specific letter.
                </p>
                <p>
                  For SOPA adjudication applications, having your correspondence indexed means you can quickly find and cite every relevant letter. The AI can identify the payment claim, the payment schedule (or absence of one), and the supporting correspondence chain.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Deadline Scanning — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <Screenshot label="Letter with highlighted deadline trigger and calendar link" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Deadline Scanning</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                A letter can start the clock. Astruct catches it.
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  Under AS4000, receiving a superintendent&apos;s decision starts a 28-day clock for requesting reconsideration (clause 34.4) and a separate clock for giving a notice of dispute (clause 42.1). If the letter sits unread in a project folder, those clocks run silently.
                </p>
                <p>
                  Astruct scans every uploaded letter for language that triggers contractual time-bars. When it detects a trigger — a direction, a decision, a rejection, a notice — it creates or links to the corresponding calendar obligation with the correct deadline calculated from the letter date.
                </p>
                <p>
                  This closes the gap between correspondence management and time-bar tracking. The letter arrives, the deadline appears in the calendar, and the notice can be drafted — all within the same system, without manual entry or reliance on someone remembering to update the tracker.
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
              Stop losing rights in your inbox
            </h2>
            <p className="mt-4 text-[#57534E] text-lg max-w-xl mx-auto">
              Upload your project correspondence and let Astruct find the deadlines you are about to miss.
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
