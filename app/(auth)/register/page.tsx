'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/setup')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0f0e0d] p-12 flex-col justify-between">
        <div>
          <Link href="/landing" className="text-2xl text-white font-light" style={{ letterSpacing: '-0.02em' }}>Astruct</Link>
          <p className="text-xs text-[#706d66] mt-1">Contract Intelligence</p>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl text-white font-normal leading-[1.15]" style={{ fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif", letterSpacing: '-0.02em' }}>
            Start managing your contracts with AI
          </h2>
          <p className="mt-6 text-[#a8a29e] leading-relaxed">
            Upload your construction contracts. Ask questions. Draft notices. Track deadlines.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Ask your contract anything - cited answers in seconds',
              'Draft compliant notices, EOT claims, and payment claims',
              'Every time-bar tracked automatically',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[#6B7F5E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-[#cccac6]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#524f49]">Built for AS4000 &middot; AS4902 &middot; AS2124 &middot; AS4000-2025</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fafaf9]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 text-center">
            <h1 className="text-2xl font-light text-[#0f0e0d]">Astruct</h1>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#0f0e0d]">Create your account</h2>
              <p className="text-sm mt-1 text-[#706d66]">Free for your first project</p>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#8f8b85] mb-1.5">Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-white text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-[#8f8b85] mb-1.5">Email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
                  className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-white text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-[#8f8b85] mb-1.5">Password</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full h-11 px-3.5 rounded-md border border-[#e5e5e3] bg-white text-sm text-[#0f0e0d] placeholder:text-[#adaba5] focus:outline-none focus:border-[#0f0e0d] transition-colors" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-md bg-[#0f0e0d] text-[#fafaf9] text-sm font-medium hover:bg-[#33312c] transition-colors disabled:opacity-60 flex items-center justify-center">
                {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Create account'}
              </button>
            </form>

            <p className="text-center text-sm text-[#8f8b85]">
              Already have an account? <Link href="/login" className="text-[#0f0e0d] font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
