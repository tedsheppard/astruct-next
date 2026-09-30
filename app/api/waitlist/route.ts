import { type NextRequest } from 'next/server'
import { EMAIL_RE, clip, insertLead } from '@/lib/leads'

export const dynamic = 'force-dynamic'

// The sign-up waitlist (astruct.io/signup-waitlist). Stored in `leads` as
// type 'waitlist', beside pilot applications and contact requests.
const ROLES = ['Head contractor', 'Subcontractor', 'Developer or principal', 'Consultant']

const hits = new Map<string, number[]>()
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (origin && origin !== req.nextUrl.origin) {
    return Response.json({ error: 'Please join through the Astruct website.' }, { status: 403 })
  }
  const raw = await req.text()
  if (raw.length > 4_000) return Response.json({ error: 'That is too long.' }, { status: 413 })

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
  const role = typeof b.role === 'string' && ROLES.includes(b.role) ? b.role : null

  const missing: string[] = []
  if (!name) missing.push('your name')
  if (!EMAIL_RE.test(email)) missing.push('a valid work email')
  if (!company) missing.push('your company')
  if (missing.length) return Response.json({ error: `Please add ${missing.join(', ')}.` }, { status: 400 })

  const result = await insertLead({
    type: 'waitlist',
    email,
    name,
    company,
    role,
    source: clip(b.source, 100) || 'astruct.io/signup-waitlist',
    user_agent: req.headers.get('user-agent')?.slice(0, 400) || null,
    meta: { form: 'signup-waitlist', version: '2026-09-30', referrer: clip(b.referrer, 300) },
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
