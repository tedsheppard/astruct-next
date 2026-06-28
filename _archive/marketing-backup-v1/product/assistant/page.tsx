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

const howItWorks = [
  {
    step: '01',
    title: 'Query rewriting',
    description: 'Your question is rewritten into multiple search variants. Asking "What happens if I\'m late?" becomes searches for "delay," "time for completion," "liquidated damages," "extension of time," and "practical completion" — covering every clause that could be relevant.',
  },
  {
    step: '02',
    title: 'Hybrid search',
    description: 'Each search variant runs against your contract using both semantic (meaning-based) and keyword search. This catches clauses that use different terminology from your question — like finding "Superintendent\'s direction" when you asked about "instructions."',
  },
  {
    step: '03',
    title: 'Citation verification',
    description: 'Before presenting an answer, the system verifies every claim against the source text. If a clause doesn\'t actually say what the model thinks it says, that citation is discarded. You see only verified references.',
  },
  {
    step: '04',
    title: 'Extended thinking',
    description: 'For questions that involve multiple interacting clauses — like how delay damages interact with EOT provisions and force majeure — the AI reasons through the chain of dependencies step-by-step before producing a final answer.',
  },
]

const faqs = [
  {
    q: 'How accurate are the answers?',
    a: 'Every answer includes clause-level citations that you can verify against the source document. The citation verification step discards any claim the model can\'t back up with specific contract text. That said, Astruct is a research tool, not legal advice. It helps you find and understand clauses faster — you (or your lawyer) still make the decisions.',
  },
  {
    q: 'Which contract forms are supported?',
    a: 'Astruct is built for Australian construction contracts. It works best with AS4000-1997, AS4000-2025, AS4902, and AS2124 standard forms. It also handles amended versions of these standards, bespoke contracts based on Australian Standards, and subcontract forms like AS4903. If you\'re working with NEC or FIDIC, reach out — support is in development.',
  },
  {
    q: 'What happens to my contract data?',
    a: 'Your documents are encrypted at rest and in transit. They are never used to train AI models. Your contract data is stored in Australian data centres and is only accessible to your team. You can delete all project data at any time, and it is permanently removed within 24 hours.',
  },
  {
    q: 'What AI model powers the assistant?',
    a: 'Astruct uses Anthropic\'s Claude as the underlying language model, combined with a custom retrieval pipeline built specifically for construction contracts. The retrieval layer — query rewriting, hybrid search, citation verification — is what makes the answers reliable. A general-purpose chatbot would hallucinate clause references. Astruct doesn\'t.',
  },
  {
    q: 'Does it support languages other than English?',
    a: 'The assistant can answer questions asked in other languages, but the contract analysis pipeline is optimised for English-language Australian construction contracts. If you\'re working with bilingual contracts (e.g., English/Mandarin for international JVs), the system will index and search the English portions.',
  },
]

export default function AssistantPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ background: '#FAFAF8', color: '#1a1a1a' }}>
      {/* Hero */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-[820px] mx-auto text-center">
          <FadeIn>
            <p className="text-xs font-semibold text-[#5C6B52] uppercase tracking-wider mb-5">AI Assistant</p>
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-medium leading-[1.1]" style={{ letterSpacing: '-0.03em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              AI that actually reads your contract
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-7 text-lg sm:text-xl text-[#555] leading-relaxed max-w-[640px] mx-auto">
              Ask questions in plain English. Get answers with verified clause references — not hallucinated ones. Every citation links back to the exact paragraph in your contract.
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
            <ScreenshotPlaceholder label="AI Assistant conversation showing a question about liquidated damages with cited clause references in the source panel" />
          </div>
        </FadeIn>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-[#f5f3ef]">
        <div className="max-w-[1000px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15] text-center" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              How it works
            </h2>
            <p className="mt-5 text-center text-[#555] leading-relaxed max-w-[600px] mx-auto">
              Most AI tools just feed your document into a chatbot. Astruct runs a four-stage pipeline designed to eliminate hallucinated references.
            </p>
          </FadeIn>

          <div className="mt-16 grid sm:grid-cols-2 gap-8">
            {howItWorks.map((item, i) => (
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

      {/* Example walkthrough */}
      <section className="py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15] text-center" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              A real example
            </h2>
            <p className="mt-5 text-center text-[#555] leading-relaxed max-w-[600px] mx-auto">
              Here is what happens when a project manager asks about delay liability on an AS4000 contract.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="mt-14 space-y-8">
              {/* User question */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#e8e5e0] flex items-center justify-center text-xs font-medium text-[#888] shrink-0">Q</div>
                <div className="bg-white rounded-xl p-6 border border-[#e8e5e0] flex-1">
                  <p className="text-[#1a1a1a] font-medium">&ldquo;We&apos;re 3 weeks behind program. What are our obligations and exposure?&rdquo;</p>
                </div>
              </div>

              {/* System processing */}
              <div className="ml-12 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#999]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5C6B52]" />
                  Rewriting query into 6 search variants: &ldquo;delay,&rdquo; &ldquo;time for completion,&rdquo; &ldquo;extension of time,&rdquo; &ldquo;liquidated damages,&rdquo; &ldquo;practical completion,&rdquo; &ldquo;notice of delay&rdquo;
                </div>
                <div className="flex items-center gap-2 text-xs text-[#999]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5C6B52]" />
                  Found 14 relevant passages across 8 clauses
                </div>
                <div className="flex items-center gap-2 text-xs text-[#999]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5C6B52]" />
                  Verified 11 citations, discarded 3
                </div>
              </div>

              {/* AI answer */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#5C6B52] flex items-center justify-center text-xs font-medium text-white shrink-0">A</div>
                <div className="bg-white rounded-xl p-6 border border-[#e8e5e0] flex-1">
                  <div className="text-sm text-[#444] leading-relaxed space-y-4">
                    <p>Under your contract, you have three immediate obligations:</p>
                    <p><strong className="text-[#1a1a1a]">1. Notice of delay (clause 34.2).</strong> You must give written notice to the Superintendent within 14 days of becoming aware of anything that will probably cause delay. If you are already 3 weeks behind, this notice is arguably overdue.</p>
                    <p><strong className="text-[#1a1a1a]">2. EOT claim (clause 34.3).</strong> Within 28 days of the delay event, you must deliver a formal Extension of Time claim with details of the cause and the expected delay period.</p>
                    <p><strong className="text-[#1a1a1a]">3. Exposure.</strong> Liquidated damages under clause 35.6 are set at $12,500 per calendar day. Three weeks of delay represents approximately $262,500 in potential LD exposure, which accrues from the Date for Practical Completion.</p>
                    <p className="text-xs text-[#999] border-t border-[#f0ece6] pt-3">Sources: cl. 34.2, cl. 34.3, cl. 34.5, cl. 35.6, Annexure Part A item 28</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="mt-12 bg-[#f5f3ef] rounded-xl p-6 border border-[#e8e5e0]">
              <p className="text-sm text-[#666] leading-relaxed">
                <strong className="text-[#1a1a1a]">What a general chatbot would have said:</strong> &ldquo;You should check your contract for delay provisions.&rdquo; No clause numbers. No dollar amounts. No mention of the time-bar for notice. Astruct gives you the specific answer with the specific references because it actually searches your specific contract.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-[#f5f3ef]">
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
      <section className="py-24 px-6">
        <FadeIn>
          <div className="max-w-[640px] mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-medium leading-[1.15]" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Stop Ctrl+F-ing through 200-page contracts
            </h2>
            <p className="mt-5 text-[#555] leading-relaxed">
              Upload your contract. Ask your first question. Get a cited answer in under 10 seconds.
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