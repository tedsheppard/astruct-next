import { type NextRequest } from 'next/server'
import { EMAIL_RE, clip, insertLead } from '@/lib/leads'

export const dynamic = 'force-dynamic'

// The sign-up waitlist (astruct.io/signup-waitlist), stored in `leads` as type
// 'waitlist'. Two steps: the contact details first (meta.step 'contact'), then
// optional follow-up answers (meta.step 'details'), matched by email. The site
// can only insert, never read back, so the answers arrive as a second row.
const ROLES = ['Head contractor', 'Subcontractor', 'Developer or principal', 'Consultant']
const SIZES = ['1 to 20 people', '21 to 100 people', '101 to 500 people', 'More than 500 people']
const PROJECTS = ['1 project', '2 to 5 projects', '6 to 20 projects', 'More than 20 projects']
const FORMS = ['AS 4000 or AS 4001', 'AS 2124 or AS 2545', 'AS 4902 or AS 4903', 'AS 4300 or AS 4303', 'GC21', 'Bespoke or heavily amended', 'Not sure']
const STATES = ['QLD', 'NSW', 'VIC', 'WA', 'SA', 'TAS', 'ACT', 'NT']
const MAIL = ['Outlook / Microsoft 365', 'Gmail / Google Workspace', 'Other']

const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 8
}

const one = (v: unknown, allowed: string[]) => (typeof v === 'string' && allowed.includes(v) ? v : null)
const many = (v: unknown, allowed: string[]) =>
  Array.isArray(v) ? Array.from(new Set(v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)))) : []

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (origin && origin !== req.nextUrl.origin) {
    return Response.json({ error: 'Please join through the Astruct website.' }, { status: 403 })
  }
  const raw = await req.text()
  if (raw.length > 8_000) return Response.json({ error: 'That is too long.' }, { status: 413 })

  let b: Record<string, unknown>
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape')
    b = parsed
  } catch {
    return Response.json({ error: 'We could not read that. Please try again.' }, { status: 400 })
  }

  // Honeypot and a minimum time on the page: quietly accept, store nothing.
  if (b.website || (typeof b.elapsed === 'number' && b.elapsed < 1500)) return Response.json({ success: true })

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) return Response.json({ error: 'Too many requests from this connection. Please try again later.' }, { status: 429 })

  const email = (clip(b.email, 254) || '').toLowerCase()
  const name = clip(b.name, 200)
  const company = clip(b.company, 200)
  const details = b.step === 'details'

  if (!details) {
    const missing: string[] = []
    if (!name) missing.push('your name')
    if (!EMAIL_RE.test(email)) missing.push('a valid work email')
    if (!company) missing.push('your company')
    if (missing.length) return Response.json({ error: `Please add ${missing.join(', ')}.` }, { status: 400 })
  } else if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'Please start again with your email.' }, { status: 400 })
  }

  const forms = many(b.contractForms, FORMS)
  const states = many(b.states, STATES)
  const result = await insertLead({
    type: 'waitlist',
    email,
    name,
    company,
    role: one(b.role, ROLES),
    company_size: details ? one(b.companySize, SIZES) : null,
    projects: details ? one(b.projects, PROJECTS) : null,
    contract_forms: details ? forms.join(', ') || null : null,
    mail_platform: details ? one(b.mail, MAIL) : null,
    jurisdiction: details ? states.join(', ') || null : null,
    pain: details ? clip(b.pain, 4000) : null,
    source: 'astruct.io/signup-waitlist',
    user_agent: req.headers.get('user-agent')?.slice(0, 400) || null,
    meta: { form: 'signup-waitlist', version: '2026-09-30', step: details ? 'details' : 'contact', referrer: clip(b.referrer, 300) },
  })

  if (!result.ok) {
    console.error('[waitlist] not stored', result.code)
    return Response.json(
      { error: 'We could not save that just now. Please try again, or email hello@astruct.io.' },
      { status: 503 },
    )
  }
  return Response.json({ success: true })
}
