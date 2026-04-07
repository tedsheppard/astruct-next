'use client'

import Link from 'next/link'
import { FadeIn } from '../layout'

function ScreenshotFrame({ label, dark = false }: { label: string; dark?: boolean }) {
  const bg = dark ? '#1a1a1a' : '#f8f7f4'
  const border = dark ? '#2a2a2a' : '#e0ddd8'
  const dotColor = dark ? '#333' : '#ddd'
  const textColor = dark ? '#555' : '#999'
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}`, boxShadow: '0 25px 60px -15px rgba(0,0,0,0.25)' }}>
      <div className="h-9 flex items-center px-3.5 gap-1.5" style={{ background: dark ? '#151515' : '#f0ece6', borderBottom: `1px solid ${border}` }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor }} />
      </div>
      <div className="flex items-center justify-center text-sm" style={{ background: bg, color: textColor, aspectRatio: '16/9' }}>
        <div className="text-center px-4">
          <p className="text-xs opacity-60">Screenshot</p>
          <p className="text-xs mt-1 opacity-40">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div>
      {/* ─── HERO (dark) ─────────────────────────────────────────────── */}
      <section className="bg-[#0C0C0C] pt-28 pb-20 px-6">
        <div className="max-w-[820px] mx-auto text-center">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7F5E] mb-6">AI for construction contracts</p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-[64px] text-white font-normal leading-[1.08]" style={{ letterSpacing: '-0.03em', fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif" }}>
              Contract intelligence for construction
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="mt-7 text-lg text-[#a8a29e] leading-relaxed max-w-[600px] mx-auto">
              Upload your AS4000 contract. Ask anything. Draft compliant notices. Track every deadline. Built for Australian construction professionals.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 rounded-lg text-white text-sm font-medium bg-[#6B7F5E] hover:bg-[#5a6e4e] transition-colors">
                Start free
              </Link>
              <a href="#product" className="px-8 py-3.5 rounded-lg text-sm font-medium border border-[#333] text-[#ccc] hover:border-[#555] hover:text-white transition-colors">
                Watch demo
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <p className="mt-5 text-xs text-[#555]">Free for your first project &middot; No credit card required</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── PRODUCT SCREENSHOT (dark) ───────────────────────────────── */}
      <section id="product" className="bg-[#0C0C0C] pb-24 px-6">
        <FadeIn>
          <div className="max-w-[1100px] mx-auto">
            <ScreenshotFrame label="Astruct AI assistant with contract analysis and document preview" dark />
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <p className="text-center mt-10 text-xs text-[#444] tracking-wider">
            AS4000 &middot; AS4902 &middot; AS2124 &middot; AS4901 &middot; AS4903 &middot; FIDIC &middot; NEC &middot; SOPA compliant
          </p>
        </FadeIn>
      </section>

      {/* ─── VALUE PROPS (light) ─────────────────────────────────────── */}
      <section className="bg-[#FAF9F6] py-32 px-6">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7F5E] text-center mb-4">Why teams choose Astruct</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: 'Move fast, stay accurate',
                desc: 'From question to cited answer in seconds. Astruct searches your contracts, quotes the exact clause text, and verifies every citation against the source documents.',
              },
              {
                title: 'Draft with confidence',
                desc: 'Generate notices, claims, and correspondence with correct party names, clause references, and legal structure. Download as DOCX with your letterhead applied.',
              },
              {
                title: 'Never miss a deadline',
                desc: 'Every time-bar obligation is automatically extracted from your contract and tracked on a calendar with alerts. One click to draft the required notice.',
              },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white rounded-xl border border-[#e8e5e0] p-8 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-[#1C1917] mb-3" style={{ letterSpacing: '-0.01em' }}>{card.title}</h3>
                  <p className="text-[15px] text-[#57534E] leading-[1.7]">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS (dark) ────────────────────────────────────────────── */}
      <section className="bg-[#0C0C0C] py-24 px-6">
        <div className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {[
            { value: '12s', label: 'Average time to draft a compliant variation notice' },
            { value: '47+', label: 'Time-bar obligations in a typical AS4000 contract' },
            { value: '100%', label: 'Citations verified against source documents' },
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="text-5xl sm:text-6xl font-light text-white mb-3" style={{ letterSpacing: '-0.02em' }}>{stat.value}</div>
              <p className="text-sm text-[#666] leading-relaxed">{stat.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── PRODUCT FEATURES (light) ────────────────────────────────── */}
      <section className="bg-[#FAF9F6] py-32 px-6">
        <div className="max-w-[1100px] mx-auto">
          <FadeIn>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6B7F5E] text-center mb-4">The platform</p>
            <h2 className="text-3xl sm:text-4xl text-center text-[#1C1917] font-normal mb-20" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              One platform for your entire contract lifecycle
            </h2>
          </FadeIn>

          <div className="space-y-28">
            {[
              {
                title: 'AI Assistant',
                desc: 'Ask questions, analyse documents, and draft notices with AI that reads your actual contract text and cites every answer.',
                href: '/platform/assistant',
                label: 'Assistant responding with clause citations and sources panel',
              },
              {
                title: 'Document Library',
                desc: 'Upload, classify, and search your entire project document set. AI auto-categorises into 13 construction document types.',
                href: '/platform/library',
                label: 'Library with auto-classified documents and category filters',
              },
              {
                title: 'Review Tables',
                desc: 'Extract structured data - dates, amounts, clause references - across hundreds of documents into organised, exportable tables.',
                href: '/platform/review',
                label: 'Review table with extracted data and confidence indicators',
              },
              {
                title: 'Time-Bar Calendar',
                desc: 'Every contractual deadline and notice obligation, automatically extracted and tracked. One click to draft the required response.',
                href: '/platform/calendar',
                label: 'Calendar with colour-coded obligations and draft notice button',
              },
              {
                title: 'Correspondence',
                desc: 'Upload project letters and emails. AI extracts metadata, makes them searchable, and cross-references against contract deadlines.',
                href: '/platform/correspondence',
                label: 'Correspondence list with AI-extracted metadata and reading pane',
              },
            ].map((product, i) => (
              <FadeIn key={i}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <ScreenshotFrame label={product.label} />
                  </div>
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <h3 className="text-2xl font-semibold text-[#1C1917] mb-3" style={{ letterSpacing: '-0.01em' }}>{product.title}</h3>
                    <p className="text-[15px] text-[#57534E] leading-[1.7] mb-5">{product.desc}</p>
                    <Link href={product.href} className="text-sm font-medium text-[#6B7F5E] hover:text-[#5a6e4e] transition-colors">
                      Learn more &rarr;
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL (dark) ──────────────────────────────────────── */}
      <section className="bg-[#0C0C0C] py-32 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <FadeIn>
            <blockquote className="text-2xl sm:text-[28px] leading-relaxed text-white italic" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif" }}>
              &ldquo;The average construction contract has 47 time-bar obligations. Missing just one can cost you your entire claim.&rdquo;
            </blockquote>
            <p className="mt-8 text-sm text-[#666]">Astruct was built by construction professionals who have seen it happen.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── SUPPORTED CONTRACTS (light) ─────────────────────────────── */}
      <section className="bg-[#FAF9F6] py-24 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl text-[#1C1917] font-normal mb-12" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              Works with the contracts you use
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6">
              {[
                { name: 'AS4000', sub: 'Construct Only HC' },
                { name: 'AS4902', sub: 'D&C Head Contract' },
                { name: 'AS2124', sub: 'Construct Only HC' },
                { name: 'AS4903', sub: 'D&C Subcontract' },
                { name: 'AS4901', sub: 'Construct Only SC' },
                { name: 'FIDIC', sub: 'International' },
                { name: 'NEC', sub: 'Engineering' },
              ].map((c, i) => (
                <div key={i} className="py-3">
                  <p className="text-sm font-semibold text-[#1C1917]">{c.name}</p>
                  <p className="text-xs text-[#999] mt-1">{c.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#888] mt-8">Plus bespoke contracts, subcontracts, and any construction agreement.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA (dark) ──────────────────────────────────────────────── */}
      <section className="bg-[#0C0C0C] py-32 px-6">
        <div className="max-w-[560px] mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl text-white font-normal mb-4" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
              Start managing your contracts with AI
            </h2>
            <p className="text-[#888] mb-8">Free for your first project. No credit card required.</p>
            <Link href="/register" className="inline-block px-10 py-4 rounded-lg text-white text-sm font-medium bg-[#6B7F5E] hover:bg-[#5a6e4e] transition-colors">
              Create your account
            </Link>
            <p className="mt-4 text-xs text-[#555]">Takes 30 seconds. Upload your first contract and start asking questions immediately.</p>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
