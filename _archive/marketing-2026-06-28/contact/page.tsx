'use client'

import { useState } from 'react'
import { FadeIn } from '../layout'

const headlineFont = "var(--font-serif-display), 'DM Serif Display', Georgia, serif"

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, company: form.company, role: `Contact: ${form.message.slice(0, 200)}` }),
      })
      if (res.ok) setSubmitted(true)
    } catch {}
    finally { setSubmitting(false) }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#fafaf9] pt-32 pb-12 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <FadeIn>
            <h1
              className="text-4xl sm:text-5xl text-[#0f0e0d] font-normal leading-[1.1]"
              style={{ fontFamily: headlineFont, letterSpacing: '-0.02em' }}
            >
              Get in touch
            </h1>
            <p className="mt-5 text-[#706d66]">
              Questions about Astruct? Want a demo? Reach out and we will get back to you within 24 hours.
            </p>
            <p className="mt-4 text-sm">
              <a href="mailto:hello@astruct.io" className="text-[#0f0e0d] underline underline-offset-4 decoration-[#d6d3ce] hover:decoration-[#0f0e0d] transition-colors">hello@astruct.io</a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form */}
      <section className="bg-[#fafaf9] pb-32 px-6">
        <div className="max-w-[480px] mx-auto">
          <FadeIn>
            {submitted ? (
              <div className="rounded-xl border border-[#e5e5e3] bg-white p-10 text-center">
                <div className="text-3xl mb-4 text-[#0f0e0d]">&#10003;</div>
                <h3 className="text-lg font-semibold text-[#0f0e0d] mb-2">Message sent</h3>
                <p className="text-sm text-[#8f8b85]">We will be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-xl border border-[#e5e5e3] bg-white p-8 space-y-5">
                <div>
                  <label className="block text-xs text-[#8f8b85] mb-1.5">Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-md bg-[#fafaf9] border border-[#e5e5e3] text-sm text-[#0f0e0d] placeholder:text-[#8f8b85] focus:outline-none focus:border-[#0f0e0d] transition-colors"
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-xs text-[#8f8b85] mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-md bg-[#fafaf9] border border-[#e5e5e3] text-sm text-[#0f0e0d] placeholder:text-[#8f8b85] focus:outline-none focus:border-[#0f0e0d] transition-colors"
                    placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block text-xs text-[#8f8b85] mb-1.5">Company</label>
                  <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    className="w-full px-4 py-3 rounded-md bg-[#fafaf9] border border-[#e5e5e3] text-sm text-[#0f0e0d] placeholder:text-[#8f8b85] focus:outline-none focus:border-[#0f0e0d] transition-colors"
                    placeholder="Company name" />
                </div>
                <div>
                  <label className="block text-xs text-[#8f8b85] mb-1.5">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4}
                    className="w-full px-4 py-3 rounded-md bg-[#fafaf9] border border-[#e5e5e3] text-sm text-[#0f0e0d] placeholder:text-[#8f8b85] focus:outline-none focus:border-[#0f0e0d] transition-colors resize-none"
                    placeholder="How can we help?" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 rounded-md text-[#fafaf9] text-sm font-medium bg-[#0f0e0d] hover:bg-[#2a2927] transition-colors disabled:opacity-60">
                  {submitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
