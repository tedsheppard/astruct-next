'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { JURISDICTIONS } from '@/lib/site/brand'

type Props = { type: 'demo' | 'contact'; source?: string }

export default function LeadForm({ type, source }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', email: '', company: '', role: '', jurisdiction: '', message: '', preferred_times: '', website: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending'); setError(null)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, source, ...form }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Something went wrong.'); setStatus('error'); return }
      setStatus('done')
    } catch {
      setError('Network error. Please try again.'); setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="site-card flex flex-col items-center p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(18,160,106,.14)' }}>
          <Check size={24} className="text-[var(--site-green)]" />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[var(--site-text)]">
          {type === 'demo' ? 'Demo request received' : 'Message sent'}
        </h3>
        <p className="mt-2 max-w-sm text-[15px] text-[var(--site-body)]">
          Thanks {form.name.split(' ')[0] || 'there'} — we&apos;ll be in touch at {form.email} shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="site-card space-y-4 p-7">
      {/* honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" required><input className="site-input" value={form.name} onChange={set('name')} required /></Field>
        <Field label="Work email" required><input className="site-input" type="email" value={form.email} onChange={set('email')} required /></Field>
      </div>

      {type === 'demo' ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company"><input className="site-input" value={form.company} onChange={set('company')} /></Field>
            <Field label="I am a…">
              <select className="site-input" value={form.role} onChange={set('role')}>
                <option value="">Select…</option>
                <option value="main_contractor">Main / head contractor</option>
                <option value="subcontractor">Subcontractor</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary jurisdiction">
              <select className="site-input" value={form.jurisdiction} onChange={set('jurisdiction')}>
                <option value="">Select…</option>
                {JURISDICTIONS.map((j) => <option key={j.code} value={j.abbr}>{j.state}</option>)}
              </select>
            </Field>
            <Field label="Best times to reach you"><input className="site-input" placeholder="e.g. weekday mornings" value={form.preferred_times} onChange={set('preferred_times')} /></Field>
          </div>
          <Field label="Anything we should know?"><textarea className="site-input min-h-[96px]" value={form.message} onChange={set('message')} /></Field>
        </>
      ) : (
        <>
          <Field label="Company"><input className="site-input" value={form.company} onChange={set('company')} /></Field>
          <Field label="Message" required><textarea className="site-input min-h-[140px]" value={form.message} onChange={set('message')} required /></Field>
        </>
      )}

      {error && <p className="rounded-lg bg-[rgba(229,72,77,.08)] px-4 py-2.5 text-[14px] text-[var(--site-red)]">{error}</p>}

      <button type="submit" disabled={status === 'sending'} className={cn('site-btn site-btn-primary site-btn-lg w-full', status === 'sending' && 'opacity-70')}>
        {status === 'sending' ? 'Sending…' : type === 'demo' ? 'Request a demo' : 'Send message'}
      </button>
      <p className="text-center text-[12.5px] text-[var(--site-muted)]">
        We&apos;ll only use your details to respond. No spam.
      </p>

      <style jsx>{`
        .site-input { width: 100%; border: 1px solid var(--site-line-2); border-radius: 10px; padding: 10px 12px; font-size: 15px; color: var(--site-text); background: #fff; outline: none; transition: border-color .15s; font-family: var(--font-sans), sans-serif; }
        .site-input:focus { border-color: var(--site-brand); box-shadow: 0 0 0 3px rgba(27,59,224,.12); }
      `}</style>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13.5px] font-medium text-[var(--site-body)]">
        {label} {required && <span className="text-[var(--site-red)]">*</span>}
      </span>
      {children}
    </label>
  )
}
