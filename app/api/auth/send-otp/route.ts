import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminSB } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// In-memory rate limiter (3 sends per phone per hour)
const rateLimits = new Map<string, { count: number; resetAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { phone } = await request.json()
    if (!phone || phone.length < 8) {
      return Response.json({ error: 'Valid phone number required' }, { status: 400 })
    }

    // Rate limit check
    const now = Date.now()
    const key = phone.replace(/\D/g, '')
    const limit = rateLimits.get(key)
    if (limit && limit.resetAt > now && limit.count >= 3) {
      return Response.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
    }
    if (!limit || limit.resetAt <= now) {
      rateLimits.set(key, { count: 1, resetAt: now + 3600000 })
    } else {
      limit.count++
    }

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // Store code in profile
    const admin = createAdminSB(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    await admin.from('profiles').update({
      phone_number: phone,
      phone_verification_code: code, // In production, hash this
      phone_verification_expires_at: expiresAt,
    }).eq('id', user.id)

    // Send via Twilio if configured
    const twilioSid = process.env.TWILIO_ACCOUNT_SID
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN
    const twilioService = process.env.TWILIO_VERIFY_SERVICE_SID

    if (twilioSid && twilioAuth && twilioService) {
      try {
        await fetch(`https://verify.twilio.com/v2/Services/${twilioService}/Verifications`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ To: phone, Channel: 'sms' }),
        })
        return Response.json({ success: true, devMode: false })
      } catch (e) {
        console.error('[OTP] Twilio error:', e)
      }
    }

    // Dev mode fallback
    console.log(`[OTP] Dev mode — code for ${phone}: ${code}`)
    return Response.json({ success: true, devMode: true, devCode: code })
  } catch (err) {
    return Response.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
