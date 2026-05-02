'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const cleanEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("That doesn't look like a valid email address.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://app.astruct.io'
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${origin}/reset-password`,
    })
    setLoading(false)

    if (resetErr) {
      const m = resetErr.message?.toLowerCase() || ''
      if (m.includes('rate limit')) {
        setError("Too many reset requests right now — please try again in a minute.")
      } else {
        // Don't leak whether the email exists. Always show success-like state.
        setSent(true)
      }
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="hidden lg:flex w-1/2 bg-[#0f0e0d] p-12 flex-col justify-between">
        <div>
          <Link href="/landing" className="text-2xl text-white font-light" style={{ letterSpacing: '-0.02em' }}>Astruct</Link>
          <p className="text-xs text-[#706d66] mt-1">Contract Intelligence</p>
        </div>
        <div className="max-w-md">
          <h2
            className="text-4xl text-white font-normal leading-[1.15]"
            style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}
          >
            Reset your password
          </h2>
          <p className="mt-6 text-[#a8a29e] leading-relaxed">
            We&apos;ll send you a link to set a new one.
          </p>
        </div>
        <p className="text-xs text-[#524f49]">Built for AS4000 &middot; AS4902 &middot; AS2124 &middot; AS4000-2025</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-[#fafaf9]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-2xl font-light text-[#0f0e0d]">Astruct</h1>
          </div>

          {sent ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#0f0e0d]">Check your email</h2>
              <p className="text-sm text-[#706d66] leading-relaxed">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. The link expires in 1 hour.
              </p>
              <p className="text-xs text-[#8f8b85] pt-2">
                Didn&apos;t get it? Check your spam folder, or{' '}
                <button
                  onClick={() => { setSent(false); setError(null) }}
                  className="text-[#0f0e0d] font-medium hover:underline"
                >
                  try again
                </button>
                .
              </p>
              <p className="text-center text-sm text-[#8f8b85] pt-6">
                <Link href="/login" className="text-[#0f0e0d] font-medium hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-[#0f0e0d]">Forgot your password?</h2>
                <p className="text-sm mt-1 text-[#706d66]">
                  Enter the email associated with your account and we&apos;ll send a reset link.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#8f8b85] mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-white text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-md bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Send reset link'}
                </button>
              </form>

              <p className="text-center text-sm text-[#8f8b85]">
                Remembered it?{' '}
                <Link href="/login" className="text-[#0f0e0d] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
