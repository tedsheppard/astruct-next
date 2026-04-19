import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminSB } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { code } = await request.json()
    if (!code || code.length !== 6) {
      return Response.json({ error: '6-digit code required' }, { status: 400 })
    }

    const admin = createAdminSB(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: profile } = await admin
      .from('profiles')
      .select('phone_verification_code, phone_verification_expires_at')
      .eq('id', user.id)
      .single()

    if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 })

    // Check expiry
    if (profile.phone_verification_expires_at && new Date(profile.phone_verification_expires_at) < new Date()) {
      return Response.json({ error: 'Code expired. Request a new one.' }, { status: 400 })
    }

    // Check code
    if (profile.phone_verification_code !== code) {
      return Response.json({ error: 'Invalid code' }, { status: 400 })
    }

    // Mark verified
    await admin.from('profiles').update({
      phone_verified: true,
      phone_verification_code: null,
      phone_verification_expires_at: null,
    }).eq('id', user.id)

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Verification failed' }, { status: 500 })
  }
}
