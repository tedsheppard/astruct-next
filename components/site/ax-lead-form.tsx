'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { JURISDICTIONS } from '@/lib/site/brand'

// The contact and demo form, on the site's glass. Same fields and the same
// /api/leads payload as before; only the dress is new.
type Props = { type: 'demo' | 'contact'; source?: string }

export default function AxLeadForm({ type, source }: Props) {
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
      <div className="ax-form ax-form-done">
        <span className="ax-form-done-ico"><Check size={24} /></span>
        <h3>{type === 'demo' ? 'Demo request received' : 'Message sent'}</h3>
        <p>Thanks {form.name.split(' ')[0] || 'there'}, we will be in touch at {form.email} shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="ax-form">
      {/* honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} style={{ display: 'none' }} aria-hidden />

      <div className="ax-form-row">
        <Field label="Name" required><input className="ax-input" value={form.name} onChange={set('name')} required /></Field>
        <Field label="Work email" required><input className="ax-input" type="email" value={form.email} onChange={set('email')} required /></Field>
      </div>

      {type === 'demo' ? (
        <>
          <div className="ax-form-row">
            <Field label="Company"><input className="ax-input" value={form.company} onChange={set('company')} /></Field>
            <Field label="I am a">
              <select className="ax-input" value={form.role} onChange={set('role')}>
                <option value="">Select</option>
                <option value="main_contractor">Main or head contractor</option>
                <option value="subcontractor">Subcontractor</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <div className="ax-form-row">
            <Field label="Primary jurisdiction">
              <select className="ax-input" value={form.jurisdiction} onChange={set('jurisdiction')}>
                <option value="">Select</option>
                {JURISDICTIONS.map((j) => <option key={j.code} value={j.abbr}>{j.state}</option>)}
              </select>
            </Field>
            <Field label="Best times to reach you"><input className="ax-input" placeholder="e.g. weekday mornings" value={form.preferred_times} onChange={set('preferred_times')} /></Field>
          </div>
          <Field label="Anything we should know?"><textarea className="ax-input" value={form.message} onChange={set('message')} /></Field>
        </>
      ) : (
        <>
          <Field label="Company"><input className="ax-input" value={form.company} onChange={set('company')} /></Field>
          <Field label="Message" required><textarea className="ax-input" style={{ minHeight: 140 }} value={form.message} onChange={set('message')} required /></Field>
        </>
      )}

      {error && <p className="ax-form-error">{error}</p>}

      <button type="submit" disabled={status === 'sending'} className="ax-btn ax-btn-primary" style={status === 'sending' ? { opacity: 0.7 } : undefined}>
        {status === 'sending' ? 'Sending' : type === 'demo' ? 'Request a demo' : 'Send message'}
      </button>
      <p className="ax-fine ax-form-note">We will only use your details to respond. No spam.</p>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label>
      <span>{label} {required && <em aria-hidden="true">*</em>}</span>
      {children}
    </label>
  )
}
