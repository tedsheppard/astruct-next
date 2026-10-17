'use client'

import { useRef, useState } from 'react'
import { readAttribution, trackPixel } from './client-bits'
import { CTA_LABEL } from './links'

// The free-trial request: contact details first, stored straight away as a
// lead, then optional answers that help set the trial up. Posts to
// /api/waitlist, which keeps the leads row type 'waitlist'.

const ROLES = ['Head contractor', 'Subcontractor', 'Developer or principal', 'Consultant']
const SIZES = ['1 to 20 people', '21 to 100 people', '101 to 500 people', 'More than 500 people']
const PROJECTS = ['1 project', '2 to 5 projects', '6 to 20 projects', 'More than 20 projects']
const MAIL = ['Outlook / Microsoft 365', 'Gmail / Google Workspace', 'Other']
const FORMS = ['AS 4000 or AS 4001', 'AS 2124 or AS 2545', 'AS 4902 or AS 4903', 'AS 4300 or AS 4303', 'GC21', 'Bespoke or heavily amended', 'Not sure']
const STATES = ['QLD', 'NSW', 'VIC', 'WA', 'SA', 'TAS', 'ACT', 'NT']
const APPS = ['Procore', 'Aconex', 'Asite', 'InEight / TeamBinder', 'Autodesk Construction Cloud', 'SharePoint / OneDrive', 'Payapps', 'CostX', 'Bluebeam', 'HammerTech', 'Sitemate Dashpivot', 'SafetyCulture', 'Microsoft Project', 'Primavera P6', 'Jobpac', 'Viewpoint Vista', 'Xero', 'MYOB']

type Step = 'contact' | 'details' | 'done'

// The one message shown when a request does not go through. Raw browser or
// server text (for example "Failed to fetch") is never shown.
const SEND_ERROR = "We couldn't send that just now. Please try again, or email info@astruct.io."
// The same check the server makes (lib/leads.ts EMAIL_RE).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function post(body: Record<string, unknown>) {
  const r = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`waitlist ${r.status}`)
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="wl-l">
      <span>{label}</span>
      <select className="mk-input wl-select" name={name} defaultValue="" required>
        <option value="" disabled>Choose one</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

function Toggles({ legend, options, value, onChange }: { legend: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="wl-set">
      <legend>{legend}</legend>
      <div className="wl-toggles">
        {options.map((o) => {
          const on = value.includes(o)
          return (
            <button key={o} type="button" className={`wl-tog${on ? ' is-on' : ''}`} aria-pressed={on}
              onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}>{o}</button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function TrialRequestForm() {
  const started = useRef(Date.now())
  const [step, setStep] = useState<Step>('contact')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [who, setWho] = useState({ name: '', email: '', company: '' })
  const [forms, setForms] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [apps, setApps] = useState<string[]>([])

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    const f = new FormData(e.currentTarget)
    const next = { name: String(f.get('name') || '').trim(), email: String(f.get('email') || '').trim(), company: String(f.get('company') || '').trim() }
    // Checked here, in the form's own words, so a server reply is never shown.
    const missing = [!next.name && 'your name', !EMAIL_RE.test(next.email) && 'a work email address', !next.company && 'your company'].filter(Boolean)
    if (missing.length) { setError(`Please add ${missing.join(', ')}.`); return }
    setError('')
    setBusy(true)
    try {
      await post({ ...next, website: f.get('website'), elapsed: Date.now() - started.current, referrer: document.referrer, attribution: readAttribution() })
      trackPixel('Lead', { content_name: 'trial-request' })
      setWho(next)
      setStep('details')
    } catch {
      setError(SEND_ERROR)
    } finally {
      setBusy(false)
    }
  }

  async function submitDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    const f = new FormData(e.currentTarget)
    setError('')
    setBusy(true)
    try {
      await post({
        step: 'details', ...who,
        role: f.get('role') || null, companySize: f.get('companySize') || null, projects: f.get('projects') || null,
        mail: f.get('mail') || null, contractForms: forms, states, apps, pain: f.get('pain') || null,
        elapsed: Date.now() - started.current,
      })
      trackPixel('CompleteRegistration', { content_name: 'trial-request-details' })
      setStep('done')
    } catch {
      setError(SEND_ERROR)
    } finally {
      setBusy(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="wl-done" role="status">
        <span className="wl-tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <p className="wl-done-h">Request received.</p>
        <p className="wl-done-p">We&rsquo;ll email your invite link to <b>{who.email}</b>.</p>
      </div>
    )
  }

  if (step === 'details') {
    return (
      <form className="wl-form wl-details" onSubmit={submitDetails} noValidate>
        <p className="wl-step-h">Thanks. We have your request.</p>
        <p className="wl-step-p">A few quick questions help us set up your trial. All optional.</p>
        <div className="wl-grid">
          <Select name="role" label="You are a" options={ROLES} />
          <Select name="companySize" label="Company size" options={SIZES} />
          <Select name="projects" label="Live projects" options={PROJECTS} />
          <Select name="mail" label="Project mail is in" options={MAIL} />
        </div>
        <Toggles legend="Contracts you work under" options={FORMS} value={forms} onChange={setForms} />
        <Toggles legend="States" options={STATES} value={states} onChange={setStates} />
        <Toggles legend="Which of these applications do you use?" options={APPS} value={apps} onChange={setApps} />
        <label className="wl-l wl-pain">
          <span>Biggest contract headache right now</span>
          <textarea className="mk-input wl-ta" name="pain" rows={2} maxLength={4000} />
        </label>
        {error ? <p className="wl-err" role="alert">{error}</p> : null}
        <div className="wl-row">
          <button className="wl-skip" type="button" onClick={() => setStep('done')}>Skip</button>
          <button className="mk-btn wl-btn wl-btn-inline" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send'}</button>
        </div>
      </form>
    )
  }

  return (
    <form className="wl-form" onSubmit={submitContact} noValidate>
      <div className="wl-grid wl-grid-3">
        <label className="wl-l">
          <span>Name</span>
          <input className="mk-input" name="name" autoComplete="name" placeholder="First and last name" required maxLength={200} />
        </label>
        <label className="wl-l">
          <span>Work email</span>
          <input className="mk-input" name="email" type="email" autoComplete="email" placeholder="you@yourcompany.com.au" required maxLength={254} />
        </label>
        <label className="wl-l wl-span">
          <span>Company</span>
          <input className="mk-input" name="company" autoComplete="organization" placeholder="Arcline Façades Pty Ltd" required maxLength={200} />
        </label>
      </div>
      <input className="wl-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <p className="wl-err" role="alert">{error}</p> : null}
      <button className="mk-btn wl-btn" type="submit" disabled={busy}>
        {busy ? 'Sending…' : CTA_LABEL}
      </button>
    </form>
  )
}
