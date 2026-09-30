'use client'

import { useRef, useState } from 'react'

const ROLES = ['Head contractor', 'Subcontractor', 'Developer or principal', 'Consultant']

export default function WaitlistForm() {
  const started = useRef(Date.now())
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending') return
    const f = new FormData(e.currentTarget)
    const body = {
      name: f.get('name'),
      email: f.get('email'),
      company: f.get('company'),
      role: f.get('role') || null,
      website: f.get('website'),
      elapsed: Date.now() - started.current,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    }
    setError('')
    setState('sending')
    try {
      const r = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || 'We could not save that just now. Please try again.')
      setEmail(String(body.email || ''))
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not save that just now. Please try again.')
      setState('idle')
    }
  }

  if (state === 'done') {
    return (
      <div className="wl-done" role="status">
        <span className="wl-tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <p className="wl-done-h">You&rsquo;re on the waitlist.</p>
        <p className="wl-done-p">We&rsquo;ll email {email ? <b>{email}</b> : 'you'} as soon as your place is ready.</p>
      </div>
    )
  }

  return (
    <form className="wl-form" onSubmit={submit} noValidate>
      <div className="wl-grid">
        <label className="wl-l">
          <span>Name</span>
          <input className="mk-input" name="name" autoComplete="name" required maxLength={200} />
        </label>
        <label className="wl-l">
          <span>Work email</span>
          <input className="mk-input" name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label className="wl-l">
          <span>Company</span>
          <input className="mk-input" name="company" autoComplete="organization" required maxLength={200} />
        </label>
        <label className="wl-l">
          <span>You are a</span>
          <select className="mk-input wl-select" name="role" defaultValue="" required>
            <option value="" disabled>Choose one</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      </div>
      <input className="wl-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <p className="wl-err" role="alert">{error}</p> : null}
      <button className="mk-btn wl-btn" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Joining…' : 'Join the waitlist'}
      </button>
    </form>
  )
}
