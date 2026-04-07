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

const FAQ = [
  {
    q: 'Does the AI hallucinate contract terms?',
    a: 'Every answer includes a citation to a specific clause and page number in your uploaded documents. If the AI cannot find a relevant clause, it says so rather than guessing. You can click any citation to view the source document at that exact location.',
  },
  {
    q: 'Can it handle amended contracts and special conditions?',
    a: 'Yes. When you upload a contract with amendments or special conditions that override general conditions, Astruct indexes the full document set. The AI understands that special condition 47 may override AS4000 clause 34.2 and will cite both when relevant.',
  },
  {
    q: 'What contract forms does it understand?',
    a: 'Astruct is trained on Australian construction contracts including AS4000-1997, AS4000-2025, AS4902, AS2124, ABIC MW-1, and FIDIC. It also handles bespoke contracts — the AI reads what you upload, not a pre-loaded template.',
  },
  {
    q: 'Is my contract data used to train the AI?',
    a: 'No. Your documents are encrypted at rest and in transit. They are never used to train models, shared across accounts, or accessible to other users. See our Security page for full details.',
  },
  {
    q: 'Can I ask about SOPA rights even if my contract is silent on them?',
    a: 'Yes. Astruct understands that statutory rights under the Building and Construction Industry Security of Payment Act exist independently of the contract. It will distinguish between contractual and statutory entitlements in its answers.',
  },
]

export default function AssistantPage() {
  return (
    <div>
      {/* Hero — Dark */}
      <section className="bg-[#0C0C0C] py-28 sm:py-36">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-5">AI Assistant</p>
            <h1
              className="text-white text-4xl sm:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: headlineFont }}
            >
              AI that actually reads your contract
            </h1>
            <p className="mt-6 text-[#a8a29e] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Ask a question in plain language. Get an answer grounded in your specific contract documents, with clause citations you can verify in one click. No generic legal summaries — your project, your amendments, your special conditions.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Hybrid Search — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <ScreenshotLight label="Hybrid search results showing semantic + keyword matches" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Hybrid Search</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Semantic understanding meets keyword precision
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  Construction contracts use precise language where a single word changes everything. "Practical completion" is not "substantial completion." "Shall" is not "may." Astruct combines semantic search (understanding what you mean) with keyword search (finding exactly what the contract says).
                </p>
                <p>
                  Ask "what happens if I miss the notice deadline for a variation?" and the AI searches across your entire document set — head contract, special conditions, subcontracts — finding relevant clauses even when they use different terminology. It then ranks results by relevance, not just keyword frequency.
                </p>
                <p>
                  This matters because AS4000 clause 40.2 uses "claim" while your special conditions might use "application." A keyword-only search misses one or the other. Astruct finds both.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Citation Verification — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <Screenshot label="Citation panel showing source clause highlighted in uploaded PDF" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Citation Verification</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Every answer has a source you can check
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  AI without citations is a liability in construction. A wrong answer about a time-bar can cost hundreds of thousands of dollars. Astruct cites every clause it references — document name, clause number, page number — and lets you click through to the source.
                </p>
                <p>
                  When the AI says "Under clause 34.2 of the head contract, the Contractor must give written notice of a claim within 28 days," you can click the citation to see clause 34.2 highlighted in your actual uploaded PDF. Not a template. Not a standard form. Your contract.
                </p>
                <p>
                  If your special conditions amend a general condition, Astruct shows both — the original clause and the amendment — so you see the full picture before acting on the answer.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Concrete Example — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3 text-center">Example</p>
            <h2
              className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-12 text-center"
              style={{ fontFamily: headlineFont }}
            >
              What it actually looks like
            </h2>

            {/* Example conversation */}
            <div className="space-y-6">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#6B7F5E] text-white rounded-2xl rounded-br-md px-5 py-3 max-w-md text-sm leading-relaxed">
                  The superintendent rejected our extension of time claim. What are our options under the contract?
                </div>
              </div>

              {/* AI response */}
              <div className="flex justify-start">
                <div className="bg-white border border-[#e5e2dc] rounded-2xl rounded-bl-md px-5 py-4 max-w-lg text-sm leading-relaxed text-[#1C1917]">
                  <p className="mb-3">Under your head contract (AS4000-1997 with amendments), you have two paths:</p>
                  <p className="mb-3">
                    <strong>1. Request reconsideration (Clause 34.4)</strong><br />
                    <span className="text-[#57534E]">
                      You may request the Superintendent reconsider the decision. The request must be in writing and made within 28 days of receiving the Superintendent&apos;s decision.
                    </span>
                    <span className="inline-block ml-1 text-xs text-[#6B7F5E] font-medium cursor-pointer hover:underline">[Head Contract, cl. 34.4, p.47]</span>
                  </p>
                  <p className="mb-3">
                    <strong>2. Dispute resolution (Clause 42)</strong><br />
                    <span className="text-[#57534E]">
                      If you disagree with the Superintendent&apos;s decision (or reconsideration), you may give a notice of dispute. This triggers the contractual dispute resolution process: negotiation, then mediation, then arbitration or litigation.
                    </span>
                    <span className="inline-block ml-1 text-xs text-[#6B7F5E] font-medium cursor-pointer hover:underline">[Head Contract, cl. 42.1, p.58]</span>
                  </p>
                  <p className="text-[#57534E]">
                    <strong>Note:</strong> Your Special Condition 14 amends clause 42.1 to require arbitration (not litigation) as the final step. The arbitration must be conducted under the Resolution Institute rules.
                    <span className="inline-block ml-1 text-xs text-[#6B7F5E] font-medium cursor-pointer hover:underline">[Special Conditions, SC14, p.3]</span>
                  </p>
                </div>
              </div>

              {/* Follow-up */}
              <div className="flex justify-end">
                <div className="bg-[#6B7F5E] text-white rounded-2xl rounded-br-md px-5 py-3 max-w-md text-sm leading-relaxed">
                  Draft me a notice requesting reconsideration.
                </div>
              </div>

              {/* AI drafting indicator */}
              <div className="flex justify-start">
                <div className="bg-white border border-[#e5e2dc] rounded-2xl rounded-bl-md px-5 py-4 max-w-lg text-sm leading-relaxed text-[#57534E] italic">
                  Drafting notice under clause 34.4 referencing your original claim dated 12 March 2026...
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Document Generation — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <Screenshot label="Generated notice document with clause references and editable fields" />
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Document Generation</p>
              <h2
                className="text-white text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                Draft compliant notices from conversation
              </h2>
              <div className="space-y-4 text-[#a8a29e] text-sm leading-relaxed">
                <p>
                  After answering your question, the AI can draft the notice, letter, or response you need. It pulls the correct clause references, required content, and addressing details from your uploaded contracts.
                </p>
                <p>
                  A delay notice under AS4000 clause 34.2 requires specific content: the cause of delay, the qualifying cause of delay category, the expected duration, and the extension sought. Astruct knows this and structures the draft accordingly.
                </p>
                <p>
                  Generated documents are editable before download. You review, adjust, and export — the AI handles the boilerplate and contractual compliance, you handle the project-specific detail.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Conversation Context — Light */}
      <section className="bg-[#FAF9F6] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center lg:[direction:rtl]">
            <FadeIn className="lg:[direction:ltr]">
              <ScreenshotLight label="Multi-turn conversation with follow-up questions" />
            </FadeIn>
            <FadeIn delay={150} className="lg:[direction:ltr]">
              <p className="text-[#6B7F5E] text-sm font-medium tracking-wider uppercase mb-3">Conversation Context</p>
              <h2
                className="text-[#1C1917] text-3xl sm:text-4xl leading-tight mb-6"
                style={{ fontFamily: headlineFont }}
              >
                It remembers what you already discussed
              </h2>
              <div className="space-y-4 text-[#57534E] text-sm leading-relaxed">
                <p>
                  Real contract analysis is not a single question. You ask about an extension of time, then about the notice requirements, then about what happens if the superintendent does not respond. Each question builds on the last.
                </p>
                <p>
                  Astruct maintains full conversation context. When you say "and what about the subcontractor?" it knows you are still talking about the EOT claim you discussed three messages ago. No need to repeat yourself or re-explain the situation.
                </p>
                <p>
                  Conversations are saved per project. Come back next week and pick up where you left off, with all your prior questions and answers intact.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ — Dark */}
      <section className="bg-[#0C0C0C] py-24 sm:py-32">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeIn>
            <h2
              className="text-white text-3xl sm:text-4xl leading-tight mb-12 text-center"
              style={{ fontFamily: headlineFont }}
            >
              Frequently asked questions
            </h2>
          </FadeIn>
          <div className="space-y-8">
            {FAQ.map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="border-b border-[#222] pb-8">
                  <h3 className="text-white text-base font-medium mb-3">{item.q}</h3>
                  <p className="text-[#a8a29e] text-sm leading-relaxed">{item.a}</p>
                </div>
              </FadeIn>
            ))}
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
              Try asking your contract a question
            </h2>
            <p className="mt-4 text-[#57534E] text-lg max-w-xl mx-auto">
              Upload your AS4000 or AS4902 contract and ask the AI anything. First project is free.
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
