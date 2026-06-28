import { type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

type LeadBody = {
  type?: 'demo' | 'contact'
  name?: string
  email?: string
  company?: string
  role?: string
  jurisdiction?: string
  message?: string
  preferred_times?: string
  source?: string
  website?: string // honeypot — must be empty
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const b = (await request.json()) as LeadBody

    // Honeypot: silently accept bot submissions without storing.
    if (b.website) return Response.json({ success: true })

    const type = b.type === 'demo' ? 'demo' : 'contact'
    const name = (b.name || '').trim()
    const email = (b.email || '').trim()

    if (!name || !email) return Response.json({ error: 'Name and email are required.' }, { status: 400 })
    if (!EMAIL_RE.test(email)) return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    if (type === 'contact' && !(b.message || '').trim())
      return Response.json({ error: 'Please include a message.' }, { status: 400 })

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { error } = await supabase.from('leads').insert({
      type,
      name,
      email,
      company: (b.company || '').trim() || null,
      role: (b.role || '').trim() || null,
      jurisdiction: (b.jurisdiction || '').trim() || null,
      message: (b.message || '').trim() || null,
      preferred_times: (b.preferred_times || '').trim() || null,
      source: (b.source || '').trim() || null,
      user_agent: request.headers.get('user-agent')?.slice(0, 400) || null,
    })

    if (error) {
      console.error('[leads] insert error', error)
      return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }

    // Best-effort email notification (no-op if RESEND_API_KEY is unset).
    notify(type, b).catch((e) => console.warn('[leads] notify failed', e))

    return Response.json({ success: true })
  } catch (err) {
    console.error('[leads] error', err)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

async function notify(type: string, b: LeadBody) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  const { Resend } = await import('resend')
  const resend = new Resend(key)
  const to = process.env.LEADS_NOTIFY_TO || process.env.RESEND_REPLY_TO || 'support@astruct.io'
  const lines = [
    `New ${type} lead from the Astruct website`,
    '',
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    b.company && `Company: ${b.company}`,
    b.role && `Role: ${b.role}`,
    b.jurisdiction && `Jurisdiction: ${b.jurisdiction}`,
    b.preferred_times && `Preferred times: ${b.preferred_times}`,
    b.message && `\nMessage:\n${b.message}`,
  ].filter(Boolean)
  await resend.emails.send({
    from: process.env.RESEND_FROM || 'Astruct <hello@astruct.io>',
    to,
    replyTo: b.email,
    subject: `New ${type} lead — ${b.name}`,
    text: lines.join('\n'),
    html: `<pre style="font:14px ui-monospace,monospace">${lines.join('\n').replace(/</g, '&lt;')}</pre>`,
  })
}
