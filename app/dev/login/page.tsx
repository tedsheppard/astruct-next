'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DevLoginPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch('/api/dev/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      if (r.ok) {
        router.replace('/dev')
        return
      }
      const d = await r.json().catch(() => ({}))
      setError(d?.error || 'Wrong code.')
    } catch {
      setError('Network error.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 border border-white/10 rounded-lg p-6 bg-white/[0.02]"
      >
        <div>
          <h1 className="text-lg font-medium">Astruct dev</h1>
          <p className="text-xs text-white/40 mt-1">Enter the access code.</p>
        </div>
        <input
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code"
          className="w-full bg-black border border-white/15 rounded-md px-3 py-2 text-sm font-mono tracking-widest outline-none focus:border-white/40"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !code.trim()}
          className="w-full bg-white text-black text-sm font-medium rounded-md py-2 disabled:opacity-40"
        >
          {submitting ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
