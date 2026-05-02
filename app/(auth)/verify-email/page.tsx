'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Email verification was deprecated in v1 — Supabase auto-confirms.
 * Anyone who lands here from a stale link / bookmark gets bounced into
 * the app.
 */
export default function VerifyEmailPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
      <div className="w-5 h-5 border-2 border-[#e5e5e3] border-t-[#0f0e0d] rounded-full animate-spin" />
    </div>
  )
}
