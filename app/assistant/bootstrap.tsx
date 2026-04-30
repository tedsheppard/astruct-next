'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/**
 * Client-side bootstrap for /assistant when no Supabase session exists.
 *
 * Auto-fires /api/auth/anon-start on mount, then redirects straight into the
 * blank contract's assistant page with ?intro=1. The upload modal does the rest.
 *
 * Shows nothing but a brief spinner. No welcome card — the welcome IS the modal.
 */
export default function AnonAssistantBootstrap() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    if (typeof window !== 'undefined') {
      localStorage.setItem('astruct_anon_landed', '1')
    }

    ;(async () => {
      try {
        const res = await fetch('/api/auth/anon-start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ create_blank: true }),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) {
          setError(data.error || 'Could not start a guest session.')
          return
        }
        if (data.contract_id) {
          router.replace(`/contracts/${data.contract_id}/assistant?intro=1`)
        } else {
          router.replace('/contracts/new?guest=1')
        }
      } catch {
        setError('Network error — please try again.')
      }
    })()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        {error ? (
          <>
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <button
              onClick={() => {
                fired.current = false
                window.location.reload()
              }}
              className="text-sm text-foreground underline"
            >
              Try again
            </button>
          </>
        ) : (
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Starting your guest session…
          </div>
        )}
      </div>
    </div>
  )
}
