'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      if (user.email_confirmed_at) {
        setVerified(true)
        router.push('/verify-phone')
        return
      }
      setChecking(false)
    }
    checkVerification()

    // Poll every 5 seconds to detect when email is confirmed
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email_confirmed_at) {
        setVerified(true)
        clearInterval(interval)
        router.push('/verify-phone')
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [router])

  if (checking || verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="w-5 h-5 border-2 border-[#e5e5e3] border-t-[#0f0e0d] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-4">📧</div>
        <h1 className="text-xl font-semibold text-[#0f0e0d] mb-2">Check your email</h1>
        <p className="text-sm text-[#706d66] mb-6">
          We sent a verification link to your email address. Click the link to verify your account and continue.
        </p>
        <div className="text-xs text-[#adaba5] mb-8">
          Didn&apos;t receive it? Check your spam folder, or{' '}
          <button
            onClick={async () => {
              const supabase = createClient()
              const { data: { user } } = await supabase.auth.getUser()
              if (user?.email) {
                await supabase.auth.resend({ type: 'signup', email: user.email })
              }
            }}
            className="text-[#0f0e0d] underline"
          >
            resend
          </button>
        </div>
        <Link href="/login" className="text-xs text-[#adaba5] hover:text-[#706d66]">Back to login</Link>
      </div>
    </div>
  )
}
