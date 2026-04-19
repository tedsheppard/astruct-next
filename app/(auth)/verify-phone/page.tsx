'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerifyPhonePage() {
  const router = useRouter()
  const [phone, setPhone] = useState('+61')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      // Check if already verified
      supabase.from('profiles').select('phone_verified').eq('id', user.id).single().then(({ data }) => {
        if (data?.phone_verified) { router.push('/setup'); return }
        setChecking(false)
      })
    })
  }, [router])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || phone.length < 10) { setError('Enter a valid phone number'); return }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (res.ok) {
        setStep('code')
        if (data.devMode && data.devCode) setDevCode(data.devCode)
      } else {
        setError(data.error || 'Failed to send code')
      }
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) { setError('Enter the 6-digit code'); return }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/setup')
        router.refresh()
      } else {
        setError(data.error || 'Invalid code')
      }
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="w-5 h-5 border-2 border-[#e5e5e3] border-t-[#0f0e0d] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-6" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📱</div>
          <h1 className="text-xl font-semibold text-[#0f0e0d]">Verify your phone</h1>
          <p className="text-sm text-[#706d66] mt-2">We need to verify your phone number for security</p>
        </div>

        {devCode && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs">
            Dev mode — your code is: <strong>{devCode}</strong>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs text-[#8f8b85] mb-1.5">Phone number</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+61 400 000 000"
                className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-white text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-md bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors disabled:opacity-60 flex items-center justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Send verification code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-xs text-[#8f8b85] mb-1.5">Enter the 6-digit code sent to {phone}</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-white text-center text-lg font-mono tracking-[0.5em] text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors"
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-md bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors disabled:opacity-60 flex items-center justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Verify'}
            </button>
            <button type="button" onClick={() => { setStep('phone'); setCode(''); setDevCode(null) }}
              className="w-full text-xs text-[#adaba5] hover:text-[#706d66] transition-colors">
              Use a different number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
