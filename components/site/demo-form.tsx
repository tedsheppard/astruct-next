'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function DemoForm({ dark = false }: { dark?: boolean }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'demo',
          name,
          email,
          company,
          website,
          source: 'landing-notice-tracker',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`border px-5 py-4 ${dark ? 'border-white/20 bg-white/[0.04] text-white' : 'border-[var(--flat-border)] bg-white'}`}>
        <p className="flex items-center gap-2 text-[15px] font-semibold">
          <CheckCircle2 size={18} className="text-[var(--flat-gold)]" /> Thanks — we&apos;ll be in touch to book your demo.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          required
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <input
          required
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
      </div>
      <input
        type="text"
        placeholder="Company (optional)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <button type="submit" disabled={status === 'loading'} className="flat-btn flat-btn-gold w-full">
        {status === 'loading' ? 'Sending…' : 'Book a demo'} <ArrowRight size={16} />
      </button>
      {status === 'error' && <p className="text-[13.5px] text-[#e5484d]">{errorMsg}</p>}
      <p className={`text-[12.5px] ${dark ? 'text-white/50' : 'text-[var(--flat-muted)]'}`}>
        We&apos;ll reach out to set up a walkthrough. No spam.
      </p>
    </form>
  )
}
