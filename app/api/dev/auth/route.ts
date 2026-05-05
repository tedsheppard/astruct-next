import { type NextRequest } from 'next/server'
import {
  DEV_COOKIE,
  DEV_COOKIE_MAX_AGE_SECONDS,
  getDevAccessCode,
} from '@/lib/dev-auth'

export const dynamic = 'force-dynamic'

// Crude but effective rate-limit so a forgotten dev code doesn't get
// brute-forced over a weekend. In-memory map; resets on every cold start.
// Keyed by IP — falls back to a shared bucket if no IP header is present
// (which on Vercel basically never happens).
const attempts = new Map<string, { count: number; firstAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 8

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'

  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  let code = ''
  try {
    const body = await request.json()
    code = String(body?.code || '').trim()
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!code || code !== getDevAccessCode()) {
    return Response.json({ error: 'Wrong code.' }, { status: 401 })
  }

  const res = Response.json({ ok: true })
  res.headers.append(
    'set-cookie',
    `${DEV_COOKIE}=1; Path=/; Max-Age=${DEV_COOKIE_MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`,
  )
  return res
}

export async function DELETE() {
  const res = Response.json({ ok: true })
  res.headers.append(
    'set-cookie',
    `${DEV_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  )
  return res
}
