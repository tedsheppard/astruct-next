'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, Upload, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Phase = 'welcome' | 'starting' | 'error'

/**
 * Client bootstrap for /assistant.
 *
 * On mount we present the welcome card with two CTAs:
 *   1. "Try with a sample contract" — POST anon-start with seed_sample=true,
 *      then push to the new contract's assistant.
 *   2. "Upload my contract" — POST anon-start (no seed), then push to
 *      /contracts/new which will accept the upload.
 *
 * If the user is already an anon session (hasSession=true) we skip the anon-start
 * call and just clone-or-create directly.
 */
export default function AnonAssistantBootstrap({ hasSession }: { hasSession: boolean }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('welcome')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Stash a hint so the dashboard knows to show the welcome modal once we
    // land in /contracts/[id]/assistant.
    if (typeof window !== 'undefined') {
      localStorage.setItem('astruct_anon_landed', '1')
    }
  }, [])

  const start = async (seedSample: boolean) => {
    setPhase('starting')
    setError(null)
    try {
      const res = await fetch('/api/auth/anon-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed_sample: seedSample }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Could not start a guest session.')
        setPhase('error')
        return
      }
      if (data.contract_id) {
        router.push(`/contracts/${data.contract_id}/assistant`)
        return
      }
      // No sample — go to the upload flow.
      router.push('/contracts/new?guest=1')
    } catch {
      setError('Network error — please try again.')
      setPhase('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Try Astruct
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground font-normal leading-[1.1] mb-4"
            style={{
              fontFamily: "var(--font-serif-display), 'DM Serif Display', Georgia, serif",
              letterSpacing: '-0.02em',
            }}
          >
            AI contract intelligence — no signup, no credit card.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Upload your construction contract and ask anything. Astruct reads every clause,
            cites its answers, and drafts compliant notices in seconds.
          </p>

          {phase === 'starting' ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Starting your guest session…</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => start(false)}
                  className="group relative rounded-xl border border-border bg-background hover:border-foreground/30 hover:bg-muted/30 transition-colors p-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Upload my contract</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Drop in a PDF — Astruct reads, classifies, and indexes it.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="absolute top-5 right-5 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => start(true)}
                  className="group relative rounded-xl border border-border bg-background hover:border-foreground/30 hover:bg-muted/30 transition-colors p-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Try with a sample</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Demo against a fictional AS4000 head contract.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="absolute top-5 right-5 h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground/70 mt-6">
                Free forever for your first project. Sign up to save your work and add more
                projects when you&apos;re ready.{' '}
                <a href="/login" className="text-foreground hover:underline">
                  Already have an account?
                </a>
              </p>
            </>
          )}

          {phase === 'error' && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setPhase('welcome')}
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
