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

function ScreenshotPlaceholder({ label, aspect = '16/9' }: { label: string; aspect?: string }) {
  return (
    <div className="rounded-xl border border-[#e0ddd8] overflow-hidden" style={{ boxShadow: '0 20px 50px -12px rgba(0,0,0,0.1)' }}>
      <div className="h-8 bg-[#f0ece6] flex items-center px-3 gap-1.5 border-b border-[#e0ddd8]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" />
        <div className="flex-1 mx-6"><div className="h-4 rounded bg-[#e8e5e0] max-w-[240px] mx-auto" /></div>
      </div>
      <div className="bg-[#f8f7f4] flex items-center justify-center text-sm text-[#999]" style={{ aspectRatio: aspect }}>
        <div className="text-center px-4">
          <p className="font-medium text-[#888]">Screenshot</p>
          <p className="text-xs mt-1 text-[#bbb]">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [heroSlide, setHeroSlide] = useState(0)
  const slides = [
    'AI assistant mid-response with sources panel',
    'Document preview showing generated variation notice',
    'Calendar with time-bar obligation dots',
  ]

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div style={{ background: '#FAFAF8', color: '#1a1a1a' }}>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-[820px] mx-auto text-center">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-medium leading-[1.08]" style={{ letterSpacing: '-0.03em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Contract intelligence for construction
            </h1>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="mt-7 text-lg sm:text-xl text-[#555] leading-relaxed max-w-[640px] mx-auto">
              Upload your AS4000 contract. Ask questions in plain English. Draft compliant notices in seconds. Track every time-bar deadline automatically.
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 rounded-lg text-white text-sm font-medium bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
                Start free
              </Link>
              <a href="#product" className="px-8 py-3.5 rounded-lg text-sm font-medium border border-[#d5d0c8] text-[#444] hover:border-[#999] transition-colors">
                Watch demo
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <p className="mt-5 text-xs text-[#999]">Free for your first project &middot; No credit card required</p>
            <p className="mt-6 text-xs text-[#bbb] tracking-wide">AS4000-1997 &middot; AS4000-2025 &middot; AS4902 &middot; AS2124 &middot; SOPA compliant &middot; Australian-built</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── Product carousel ─────────────────────────────────────────── */}
      <section id="product" className="pb-28 px-6">
        <FadeIn>
          <div className="max-w-[960px] mx-auto">
            <div className="rounded-xl border border-[#e0ddd8] overflow-hidden" style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.12)' }}>
              <div className="h-9 bg-[#f0ece6] flex items-center px-3 gap-1.5 border-b border-[#e0ddd8]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" /><div className="w-2.5 h-2.5 rounded-full bg-[#ddd]" />
                <div className="flex-1 mx-6"><div className="h-4 rounded bg-[#e8e5e0] max-w-[280px] mx-auto text-center text-[10px] text-[#bbb] leading-4">astruct.io/contracts/riverside-towers/assistant</div></div>
              </div>
              <div className="aspect-video bg-[#f8f7f4] flex items-center justify-center relative overflow-hidden">
                {slides.map((s, i) => (
                  <div key={i} className="absolute inset-0 flex items-center justify-center transition-opacity duration-700" style={{ opacity: heroSlide === i ? 1 : 0 }}>
                    <div className="text-center px-4">
                      <p className="text-sm text-[#999]">Screenshot {i + 1}</p>
                      <p className="text-xs text-[#bbb] mt-1">{s}</p>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setHeroSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${heroSlide === i ? 'bg-[#5C6B52]' : 'bg-[#ddd]'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── What Astruct Actually Does (alternating) ─────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-[1100px] mx-auto space-y-32">
          {/* Feature 1 */}
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <ScreenshotPlaceholder label="Assistant responding with clause text and sources" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-medium mb-4" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Ask your contract anything. Get cited answers.
                </h2>
                <p className="text-[15px] text-[#555] leading-[1.75] mb-6">
                  Type a question in plain English. Astruct searches your uploaded documents - contract, special conditions, correspondence - and returns the exact clause text with the source document and page number. Every answer is verified against the actual documents.
                </p>
                <div className="rounded-lg bg-[#f5f3ef] border border-[#e8e5e0] p-5">
                  <p className="text-xs font-medium text-[#999] uppercase tracking-wider mb-3">Example</p>
                  <p className="text-sm text-[#444] mb-2"><span className="font-medium text-[#1a1a1a]">You:</span> &ldquo;What&rsquo;s the time bar for variation claims?&rdquo;</p>
                  <p className="text-sm text-[#555] leading-relaxed"><span className="font-medium text-[#1a1a1a]">Astruct:</span> &ldquo;Under Clause 13.3 of the Subcontract, the Contractor must give notice within 14 days of receiving a direction that it considers to be a Variation.&rdquo;</p>
                  <p className="text-xs text-[#999] mt-2">Source: 7216-SUB-090-WP8-Pensar-FINAL-signed.pdf, Clause 13.3</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Feature 2 */}
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-medium mb-4" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Draft notices and correspondence in seconds.
                </h2>
                <p className="text-[15px] text-[#555] leading-[1.75] mb-6">
                  Variation notices, delay claims, EOT applications, dispute notices, payment claims - all generated with the correct clause references, real party names and addresses, and proper legal structure. Download as DOCX or copy to your template.
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-light" style={{ color: '#5C6B52' }}>12s</span>
                  <span className="text-sm text-[#888]">Average time to draft a compliant variation notice</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <ScreenshotPlaceholder label="Document preview showing generated variation notice" />
              </div>
            </div>
          </FadeIn>

          {/* Feature 3 */}
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <ScreenshotPlaceholder label="Calendar with colored obligation dots and popover" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-medium mb-4" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Never miss a time bar again.
                </h2>
                <p className="text-[15px] text-[#555] leading-[1.75] mb-6">
                  Astruct reads your contract and correspondence and automatically extracts every notice period, payment deadline, and time-bar obligation. They appear on your calendar with countdown alerts. Click any deadline to draft the required notice instantly.
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-light" style={{ color: '#5C6B52' }}>47+</span>
                  <span className="text-sm text-[#888]">Time-bar obligations in the average AS4000 contract</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Feature 4 */}
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-medium mb-4" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Extract structured data across all your documents.
                </h2>
                <p className="text-[15px] text-[#555] leading-[1.75]">
                  Create a review table, define what you need to extract - dates, amounts, clause references, parties - and Astruct processes every document in your library. Get a structured spreadsheet of key data points across 30+ documents in minutes, not days.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <ScreenshotPlaceholder label="Review table with extracted data columns" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Who it's for ─────────────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: '#F5F5F0' }}>
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium text-center mb-16" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Built for construction professionals
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Contract Administrators', desc: 'Track obligations, draft notices, and manage correspondence across multiple subcontracts. Astruct does the document searching so you can focus on the decisions.' },
              { title: 'Project Managers', desc: 'Get instant answers about your contract without calling your lawyer. Know your time-bar deadlines before they expire. Generate payment claims and variation notices on demand.' },
              { title: 'Construction Lawyers', desc: 'Review contracts faster with AI-assisted clause analysis. Extract obligations across document sets. Generate first-draft correspondence with correct citations.' },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-white rounded-xl border border-[#e8e5e0] p-7">
                  <h3 className="text-lg font-semibold mb-3" style={{ letterSpacing: '-0.01em' }}>{p.title}</h3>
                  <p className="text-[15px] text-[#666] leading-[1.7]">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quote ────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <FadeIn>
            <blockquote className="text-2xl sm:text-[26px] leading-relaxed italic" style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
              &ldquo;The average construction contract has 47 time-bar obligations. Missing just one can cost you your entire claim.&rdquo;
            </blockquote>
            <p className="mt-8 text-sm text-[#999]">Astruct was built by construction professionals who have seen it happen.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── Supported Contracts ──────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#F5F5F0' }}>
        <div className="max-w-[900px] mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-medium mb-12" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Works with the contracts you use
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-6">
              {[
                { name: 'AS4000', sub: 'Construct Only Head Contract' },
                { name: 'AS4902', sub: 'D&C Head Contract' },
                { name: 'AS2124', sub: 'Construct Only Head Contract' },
                { name: 'AS4903', sub: 'D&C Subcontract' },
                { name: 'AS4901', sub: 'Construct Only Subcontract' },
                { name: 'FIDIC', sub: 'International' },
                { name: 'NEC', sub: 'Engineering' },
              ].map((c, i) => (
                <div key={i} className="py-4">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{c.name}</p>
                  <p className="text-xs text-[#999] mt-1">{c.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#888] mt-8">Plus bespoke contracts, subcontracts, and any construction agreement.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-[560px] mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-medium mb-4" style={{ letterSpacing: '-0.02em', fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Start managing your contracts with AI
            </h2>
            <p className="text-[#666] mb-8">Free for your first project. No credit card required.</p>
            <Link href="/register" className="inline-block px-10 py-4 rounded-lg text-white text-sm font-medium bg-[#5C6B52] hover:bg-[#4d5a45] transition-colors">
              Create your account
            </Link>
            <p className="mt-4 text-xs text-[#999]">Takes 30 seconds. Upload your first contract and start asking questions immediately.</p>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
