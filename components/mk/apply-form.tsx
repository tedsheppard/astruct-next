'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { trackPixel } from './client-bits'
import { IArrow } from './icons'
import { CONTACT_EMAIL, SIGNUP_URL } from './links'

const ROLES = ['Commercial manager', 'Contract administrator', 'Project manager', 'Quantity surveyor', 'Director or general manager', 'Other']
const SIZES = ['1 to 20 people', '21 to 100 people', '101 to 500 people', 'More than 500 people']
const ORG_TYPES = ['Head contractor', 'Subcontractor', 'Principal or developer', 'Consultant or contract administrator']
const PROJECTS = ['1 project', '2 to 5 projects', '6 to 20 projects', 'More than 20 projects']
const FORMS = ['AS 4000 or AS 4001', 'AS 2124 or AS 2545', 'AS 4902 or AS 4903', 'AS 4300 or AS 4303', 'GC21', 'Bespoke or heavily amended', 'Not sure']
const STATES = ['QLD', 'NSW', 'VIC', 'WA', 'SA', 'TAS', 'ACT', 'NT']
const MAIL = [
  { v: 'Outlook / Microsoft 365', hint: 'Personal or shared mailboxes' },
  { v: 'Gmail / Google Workspace', hint: '' },
  { v: 'Other', hint: 'Another mail system or a project platform' },
]
const CONSENT = ['Yes, we can arrange it', 'Probably, we would need to ask', 'No', 'Not sure']

type State = {
  company: string; role: string; companySize: string; orgType: string
  projects: string; contractForms: string[]; states: string[]
  mail: string; mailOther: string; adminConsent: string
  pain: string; name: string; email: string; website: string
}
const EMPTY: State = {
  company: '', role: '', companySize: '', orgType: '', projects: '', contractForms: [], states: [],
  mail: '', mailOther: '', adminConsent: '', pain: '', name: '', email: '', website: '',
}

const STEPS = [
  { label: 'Your company', title: 'Tell us about your company.', intro: 'So we can set the pilot up for the way you work.' },
  { label: 'Your projects', title: 'Your projects and contracts.', intro: 'Astruct works from your contract, so the form matters.' },
  { label: 'Mail and IT', title: 'Where your project mail lives.', intro: 'Mail is Astruct’s main source. This tells us what setup looks like.' },
  { label: 'You', title: 'The problem, and how to reach you.', intro: 'The more specific, the better we can judge whether the pilot fits.' },
]

function Radio({ name, value, checked, onChange, hint }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="mk-choice">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span><span>{value}{hint ? <small>{hint}</small> : null}</span></span>
    </label>
  )
}
function Check({ value, checked, onChange }: { value: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <label className="mk-choice">
      <input type="checkbox" value={value} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{value}</span>
    </label>
  )
}

export default function ApplyForm() {
  const [s, setS] = useState<State>(EMPTY)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const started = useRef<number>(0)
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => { started.current = Date.now() }, [])

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }))
  const toggle = (k: 'contractForms' | 'states', v: string, on: boolean) =>
    setS((p) => ({ ...p, [k]: on ? [...p[k], v] : p[k].filter((x) => x !== v) }))

  const problems = (i: number): string[] => {
    const m: string[] = []
    if (i === 0) {
      if (!s.company.trim()) m.push('your company')
      if (!s.role) m.push('your role')
      if (!s.companySize) m.push('company size')
    }
    if (i === 1 && !s.projects) m.push('how many live projects you run')
    if (i === 2) {
      if (!s.mail) m.push('where your project mail lives')
      if (!s.adminConsent) m.push('whether admin consent is possible')
    }
    if (i === 3) {
      if (!s.pain.trim()) m.push('your biggest commercial pain')
      if (!s.name.trim()) m.push('your name')
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.email.trim())) m.push('a valid work email')
    }
    return m
  }

  const scrollTop = () => {
    const el = top.current
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const next = () => {
    const m = problems(step)
    if (m.length) { setError(`Please add ${m.join(', ')}.`); return }
    setError('')
    setStep((x) => x + 1)
    scrollTop()
  }

  const submit = async () => {
    const m = problems(3)
    if (m.length) { setError(`Please add ${m.join(', ')}.`); return }
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/pilot/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s, elapsed: Date.now() - started.current, referrer: document.referrer || null }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) { setError(j.error || `Something went wrong. Please try again, or email ${CONTACT_EMAIL}.`); return }
      trackPixel('Lead', { content_name: 'private_pilot' })
      setDone(true)
      scrollTop()
    } catch {
      setError(`We could not reach Astruct. Check your connection and try again, or email ${CONTACT_EMAIL}.`)
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    const first = s.name.trim().split(/\s+/)[0]
    const consentNote =
      s.mail === 'Outlook / Microsoft 365'
        ? 'Each person can connect their own mailbox. Shared mailboxes and SharePoint need a Microsoft 365 administrator to grant consent to Astruct once. We will send a short note for your admin covering what Astruct can access and how to revoke it.'
        : s.mail === 'Gmail / Google Workspace'
          ? 'Each person connects their own Gmail account. On Google Workspace, your admin may need to allow Astruct first. We will send a short note for your admin covering what Astruct can access and how to revoke it.'
          : 'We will talk through the options for bringing your project mail in, and what your IT team would need to do.'
    return (
      <div className="mk-form" ref={top} aria-live="polite">
        <div className="mk-progress" aria-hidden="true">{STEPS.map((_, i) => <i key={i} className="is-on" />)}</div>
        <div className="mk-form-step-label">Application received</div>
        <h2>Thanks{first ? `, ${first}` : ''}. We have your application.</h2>
        <p className="mk-form-intro">Here is what happens next.</p>
        <ol className="mk-done-list">
          <li><span>1</span><div><b>A reply within two business days</b><p>The Astruct team replies from {CONTACT_EMAIL} to {s.email.trim()}, with a few questions about the project you have in mind.</p></div></li>
          <li><span>2</span><div><b>A guided setup</b><p>We set up the first project with you: the contract, the mailboxes and folders to connect, and the notice rules your team confirms.</p></div></li>
          <li><span>3</span><div><b>Admin consent</b><p>{consentNote}</p></div></li>
        </ol>
        <p className="mk-fine">Want to look around first? The free trial needs no card.</p>
        <div className="mk-cta-row" style={{ marginTop: 18 }}>
          <a className="mk-btn" href={SIGNUP_URL}>Start free trial</a>
          <Link className="mk-link" href="/">Back to astruct.io<IArrow /></Link>
        </div>
      </div>
    )
  }

  const st = STEPS[step]
  return (
    <div ref={top}>
    <form
      className="mk-form"
      noValidate
      onSubmit={(e) => { e.preventDefault(); if (step < 3) next(); else submit() }}
    >
      <div className="mk-progress" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1} aria-label="Application progress">
        {STEPS.map((_, i) => <i key={i} className={i <= step ? 'is-on' : ''} />)}
      </div>
      <div className="mk-form-step-label">Step {step + 1} of 4 · {st.label}</div>
      <h2>{st.title}</h2>
      <p className="mk-form-intro">{st.intro}</p>

      {error && <p className="mk-form-error" role="alert">{error}</p>}

      {step === 0 && (
        <>
          <div className="mk-field">
            <label htmlFor="company">Company</label>
            <input id="company" className="mk-input" autoComplete="organization" value={s.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" maxLength={200} />
          </div>
          <fieldset className="mk-field">
            <legend>Your role</legend>
            <div className="mk-choices">{ROLES.map((r) => <Radio key={r} name="role" value={r} checked={s.role === r} onChange={(v) => set('role', v)} />)}</div>
          </fieldset>
          <fieldset className="mk-field">
            <legend>Company size</legend>
            <div className="mk-choices">{SIZES.map((r) => <Radio key={r} name="size" value={r} checked={s.companySize === r} onChange={(v) => set('companySize', v)} />)}</div>
          </fieldset>
          <fieldset className="mk-field">
            <legend>Your company is mainly a <span className="mk-muted" style={{ fontWeight: 400 }}>(optional)</span></legend>
            <div className="mk-choices">{ORG_TYPES.map((r) => <Radio key={r} name="orgType" value={r} checked={s.orgType === r} onChange={(v) => set('orgType', v)} />)}</div>
          </fieldset>
        </>
      )}

      {step === 1 && (
        <>
          <fieldset className="mk-field">
            <legend>How many live projects do you run?</legend>
            <div className="mk-choices">{PROJECTS.map((r) => <Radio key={r} name="projects" value={r} checked={s.projects === r} onChange={(v) => set('projects', v)} />)}</div>
          </fieldset>
          <fieldset className="mk-field">
            <legend>Contract forms you work under <span className="mk-muted" style={{ fontWeight: 400 }}>(choose any)</span></legend>
            <div className="mk-choices">{FORMS.map((r) => <Check key={r} value={r} checked={s.contractForms.includes(r)} onChange={(on) => toggle('contractForms', r, on)} />)}</div>
          </fieldset>
          <fieldset className="mk-field">
            <legend>States and territories <span className="mk-muted" style={{ fontWeight: 400 }}>(choose any)</span></legend>
            <div className="mk-choices" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))' }}>
              {STATES.map((r) => <Check key={r} value={r} checked={s.states.includes(r)} onChange={(on) => toggle('states', r, on)} />)}
            </div>
          </fieldset>
        </>
      )}

      {step === 2 && (
        <>
          <fieldset className="mk-field">
            <legend>Where does your project mail live?</legend>
            <div className="mk-choices mk-choices-1">{MAIL.map((m) => <Radio key={m.v} name="mail" value={m.v} hint={m.hint} checked={s.mail === m.v} onChange={(v) => set('mail', v)} />)}</div>
          </fieldset>
          {s.mail === 'Other' && (
            <div className="mk-field">
              <label htmlFor="mailOther">Which system?</label>
              <input id="mailOther" className="mk-input" value={s.mailOther} onChange={(e) => set('mailOther', e.target.value)} placeholder="For example, Aconex mail or an on-premises Exchange server" maxLength={200} />
            </div>
          )}
          <fieldset className="mk-field">
            <legend>Could your IT admin grant consent to a new app?</legend>
            <p className="mk-hint">Shared mailboxes and SharePoint need an administrator to approve Astruct once for your organisation.</p>
            <div className="mk-choices">{CONSENT.map((r) => <Radio key={r} name="consent" value={r} checked={s.adminConsent === r} onChange={(v) => set('adminConsent', v)} />)}</div>
          </fieldset>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mk-field">
            <label htmlFor="pain">What is your biggest commercial pain right now?</label>
            <p className="mk-hint">For example, variations directed on site that never get notified, or EOT notices written in a rush the day before the time bar.</p>
            <textarea id="pain" className="mk-textarea" value={s.pain} onChange={(e) => set('pain', e.target.value)} maxLength={4000} />
          </div>
          <div className="mk-field">
            <label htmlFor="name">Your name</label>
            <input id="name" className="mk-input" autoComplete="name" value={s.name} onChange={(e) => set('name', e.target.value)} maxLength={200} />
          </div>
          <div className="mk-field">
            <label htmlFor="email">Work email</label>
            <input id="email" className="mk-input" type="email" inputMode="email" autoComplete="email" value={s.email} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com.au" maxLength={254} />
          </div>
        </>
      )}

      <div className="mk-hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={s.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div className="mk-form-nav">
        {step > 0 ? (
          <button type="button" className="mk-back" onClick={() => { setError(''); setStep((x) => x - 1) }}>Back</button>
        ) : <span style={{ marginRight: 'auto' }} />}
        <button type="submit" className="mk-btn" disabled={busy}>
          {step < 3 ? 'Continue' : busy ? 'Sending…' : 'Send application'}
        </button>
      </div>
      {step === 3 && (
        <p className="mk-form-fine">
          We use these details only to reply about the pilot. See the <Link href="/legal/privacy">privacy policy</Link>.
        </p>
      )}
    </form>
    </div>
  )
}
