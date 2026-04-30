import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ANON_FIRST_ENABLED } from '@/lib/anon-flag'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const MAX_SIGNUPS_PER_IP_PER_24H = 3
const SIGNUP_WINDOW_HOURS = 24

function hashIdentifier(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function getClientIp(request: NextRequest): string {
  // Vercel sets x-forwarded-for; fall back to a stable value so dev still works.
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') || '0.0.0.0'
}

/**
 * POST /api/auth/anon-start
 *
 * Body: { seed_sample?: boolean }
 *
 * Creates an anonymous Supabase session for the caller, throttled to
 * MAX_SIGNUPS_PER_IP_PER_24H per IP in a rolling 24h window. If `seed_sample`
 * is true, clones the sample contract into the new anon user's account so
 * they have something to query immediately.
 *
 * Returns { ok, contract_id?, message? }. Cookies are set by Supabase via the
 * SSR client when signInAnonymously runs.
 */
export async function POST(request: NextRequest) {
  if (!ANON_FIRST_ENABLED) {
    return Response.json(
      { ok: false, error: 'Anonymous sign-in disabled' },
      { status: 403 }
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user: existingUser } } = await supabase.auth.getUser()

    // Reuse the session if the caller is already an anonymous user.
    if (existingUser?.is_anonymous) {
      return Response.json({ ok: true, user_id: existingUser.id, reused: true })
    }
    // Authenticated users don't need anon sessions.
    if (existingUser && !existingUser.is_anonymous) {
      return Response.json({ ok: true, user_id: existingUser.id, reused: true })
    }

    const body = await request.json().catch(() => ({}))
    const { seed_sample, create_blank } = body as {
      seed_sample?: boolean
      create_blank?: boolean
    }

    const admin = createAdminClient()
    const ipHash = hashIdentifier(getClientIp(request))

    // Throttle by hashed IP.
    const since = new Date(Date.now() - SIGNUP_WINDOW_HOURS * 60 * 60 * 1000).toISOString()
    const { count: recentCount } = await admin
      .from('anon_signup_log')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since)

    if ((recentCount || 0) >= MAX_SIGNUPS_PER_IP_PER_24H) {
      return Response.json(
        {
          ok: false,
          error:
            'Too many guest sessions started recently. Sign up to keep going — your work will be saved.',
        },
        { status: 429 }
      )
    }

    // Create the anon session via the SSR client so cookies are set.
    const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously()
    if (signInError || !signInData.user) {
      return Response.json(
        { ok: false, error: signInError?.message || 'Failed to start guest session' },
        { status: 500 }
      )
    }

    const userId = signInData.user.id

    // Log the signup for throttling.
    await admin.from('anon_signup_log').insert({
      ip_hash: ipHash,
      user_agent_hash: hashIdentifier(request.headers.get('user-agent') || ''),
    })

    // Provision a contract for the new guest. Two paths:
    //  - seed_sample → clone the curated AS4000 sample (text + chunks + embeds)
    //  - create_blank (default) → empty contract, intro modal will populate it
    let contractId: string | null = null
    if (seed_sample) {
      try {
        const { cloneSampleForUser } = await import('@/lib/sample-contract')
        contractId = await cloneSampleForUser(admin, userId)
      } catch (e) {
        console.error('[anon-start] sample seed failed', e)
      }
    } else if (create_blank !== false) {
      try {
        const { data: contract } = await admin
          .from('contracts')
          .insert({
            user_id: userId,
            name: 'Untitled project',
            contract_form: 'bespoke',
            party1_role: 'Principal',
            party2_role: 'Contractor',
            user_is_party: 'party2',
            status: 'active',
          })
          .select('id')
          .single()
        contractId = contract?.id || null
      } catch (e) {
        console.error('[anon-start] blank contract create failed', e)
      }
    }

    return Response.json({ ok: true, user_id: userId, contract_id: contractId })
  } catch (err) {
    console.error('[anon-start] error:', err)
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
