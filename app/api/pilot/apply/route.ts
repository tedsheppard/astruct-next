import { type NextRequest } from 'next/server'
import { EMAIL_RE, clip, insertLead } from '@/lib/leads'

export const dynamic = 'force-dynamic'

// Allowed answers for the choice questions. Anything else is rejected, so the
// table only ever holds values the form offers.
const ROLES = ['Commercial manager', 'Contract administrator', 'Project manager', 'Quantity surveyor', 'Director or general manager', 'Other']
const SIZES = ['1 to 20 people', '21 to 100 people', '101 to 500 people', 'More than 500 people']
const ORG_TYPES = ['Head contractor', 'Subcontractor', 'Principal or developer', 'Consultant or contract administrator']
const PROJECTS = ['1 project', '2 to 5 projects', '6 to 20 projects', 'More than 20 projects']
const FORMS = ['AS 4000 or AS 4001', 'AS 2124 or AS 2545', 'AS 4902 or AS 4903', 'AS 4300 or AS 4303', 'GC21', 'Bespoke or heavily amended', 'Not sure']
const STATES = ['QLD', 'NSW', 'VIC', 'WA', 'SA', 'TAS', 'ACT', 'NT']
const MAIL = ['Outlook / Microsoft 365', 'Gmail / Google Workspace', 'Other']
const CONSENT = ['Yes, we can arrange it', 'Probably, we would need to ask', 'No', 'Not sure']

// A small per-instance limiter: enough to stop a script hammering the form.
const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

const one = (v: unknown, allowed: string[]) => (typeof v === 'string' && allowed.includes(v) ? v : null)
const many = (v: unknown, allowed: string[]) =>
  Array.isArray(v) ? Array.from(new Set(v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)))) : []

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (origin && origin !== req.nextUrl.origin) {
    return Response.json({ error: 'Please apply through the Astruct website.' }, { status: 403 })
  }
  const raw = await req.text()
  if (raw.length > 16_000) return Response.json({ error: 'That application is too long.' }, { status: 413 })

  let b: Record<string, unknown>
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('shape')
    b = parsed
  } catch {
    return Response.json({ error: 'We could not read that application. Please try again.' }, { status: 400 })
  }

  // Honeypot and a minimum time on the form: quietly accept, store nothing.
  if (b.website || (typeof b.elapsed === 'number' && b.elapsed < 2500)) return Response.json({ success: true })

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) return Response.json({ error: 'Too many applications from this connection. Please try again later.' }, { status: 429 })

  const email = (clip(b.email, 254) || '').toLowerCase()
  const name = clip(b.name, 200)
  const company = clip(b.company, 200)
  const role = one(b.role, ROLES)
  const size = one(b.companySize, SIZES)
  const orgType = one(b.orgType, ORG_TYPES)
  const projects = one(b.projects, PROJECTS)
  const forms = many(b.contractForms, FORMS)
  const states = many(b.states, STATES)
  const mail = one(b.mail, MAIL)
  const mailOther = clip(b.mailOther, 200)
  const consent = one(b.adminConsent, CONSENT)
  const pain = clip(b.pain, 4000)

  const missing: string[] = []
  if (!company) missing.push('company')
  if (!role) missing.push('role')
  if (!size) missing.push('company size')
  if (!projects) missing.push('number of projects')
  if (!mail) missing.push('where project mail lives')
  if (!consent) missing.push('admin consent')
  if (!pain) missing.push('biggest commercial pain')
  if (!name) missing.push('name')
  if (!EMAIL_RE.test(email)) missing.push('a valid work email')
  if (missing.length) {
    return Response.json({ error: `Please add ${missing.join(', ')}.` }, { status: 400 })
  }

  const result = await insertLead({
    type: 'pilot',
    email,
    name,
    company,
    role,
    company_size: size,
    projects,
    contract_forms: forms.join(', ') || null,
    mail_platform: mail === 'Other' && mailOther ? `Other: ${mailOther}` : mail,
    admin_consent: consent,
    pain,
    jurisdiction: states.join(', ') || null,
    source: clip(b.source, 100) || 'astruct.io/apply',
    user_agent: req.headers.get('user-agent')?.slice(0, 400) || null,
    meta: { form: 'private-pilot', version: '2026-09-29', org_type: orgType, referrer: clip(b.referrer, 300) },
  })

  if (!result.ok) {
    console.error('[pilot] application not stored', result.code)
    return Response.json(
      { error: 'We could not save your application just now. Please try again, or email hello@astruct.io.' },
      { status: 503 },
    )
  }
  return Response.json({ success: true })
}
