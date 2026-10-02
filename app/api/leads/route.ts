import { type NextRequest } from 'next/server'
import { EMAIL_RE, clip, insertLead } from '@/lib/leads'

export const dynamic = 'force-dynamic'

// General contact requests. The site itself now offers email only
// (info@astruct.io); this stays for anything that still posts here.
// Private-pilot applications use /api/pilot/apply.
export async function POST(request: NextRequest) {
  try {
    const b = (await request.json()) as Record<string, unknown>
    if (b.website) return Response.json({ success: true })

    const email = (clip(b.email, 254) || '').toLowerCase()
    const name = clip(b.name, 200)
    const message = clip(b.message, 4000)
    if (!name || !EMAIL_RE.test(email)) return Response.json({ error: 'Please add your name and a valid email address.' }, { status: 400 })
    if (!message) return Response.json({ error: 'Please include a message.' }, { status: 400 })

    const result = await insertLead({
      type: 'contact',
      email,
      name,
      company: clip(b.company, 200),
      role: clip(b.role, 200),
      jurisdiction: clip(b.jurisdiction, 100),
      message,
      source: clip(b.source, 100),
      user_agent: request.headers.get('user-agent')?.slice(0, 400) || null,
    })
    if (!result.ok) {
      console.error('[leads] not stored', result.code)
      return Response.json({ error: 'Something went wrong. Please email info@astruct.io.' }, { status: 503 })
    }
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Something went wrong. Please email info@astruct.io.' }, { status: 500 })
  }
}
