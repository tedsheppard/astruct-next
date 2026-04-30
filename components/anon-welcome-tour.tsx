'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ANON_FIRST_ENABLED } from '@/lib/anon-flag'
import { ArrowRight, X, Lock, Sparkles, MessageSquare, FolderOpen, CalendarDays, FileText, BookOpen } from 'lucide-react'

type Step = {
  title: string
  description: string
  locked?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

const STEPS: Step[] = [
  {
    title: 'Welcome to Astruct',
    description:
      'AI contract intelligence for Australian construction. Upload a contract, ask anything, draft notices in seconds — all without an account.',
    icon: Sparkles,
  },
  {
    title: 'Library',
    description:
      'This is where your contract documents live. Drop a PDF and Astruct reads every page, classifies it, and indexes the clauses for search.',
    icon: FolderOpen,
  },
  {
    title: 'Assistant',
    description:
      'Ask any question about your contract. Answers are cited to the actual clause. Try: "What are the time bars for variation claims?"',
    icon: MessageSquare,
  },
  {
    title: 'Calendar',
    description:
      'Every time bar and notice deadline tracked automatically once you sign up.',
    icon: CalendarDays,
    locked: true,
  },
  {
    title: 'Notice Templates',
    description:
      'Draft compliant notices in clause-perfect language. Available once you sign up.',
    icon: FileText,
    locked: true,
  },
  {
    title: 'Knowledge Base',
    description:
      'Reference precedents and BIF Act guidance. Available once you sign up.',
    icon: BookOpen,
    locked: true,
  },
  {
    title: "You're ready",
    description:
      'Upload your contract or try the sample to see Astruct work. When you want to keep your work and unlock the rest, sign up free.',
    icon: Sparkles,
  },
]

const STORAGE_KEY = 'astruct_anon_tour_completed'

/**
 * Anon welcome + tour modal.
 *
 * Triggered when:
 *  - localStorage flag astruct_anon_landed is set (means /assistant bootstrap fired) AND
 *  - profile.walkthrough_completed is false (or not yet set)
 *
 * Replayable from the dashboard help menu via the `?tour=1` query param.
 */
export function AnonWelcomeTour({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  const close = useCallback(async (markComplete: boolean) => {
    setShow(false)
    if (markComplete) {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.from('profiles').update({ walkthrough_completed: true }).eq('id', user.id)
        }
      } catch {
        // No-op — localStorage flag is the source of truth for anon users.
      }
    }
    onComplete?.()
  }, [onComplete])

  useEffect(() => {
    if (!ANON_FIRST_ENABLED) return

    // The intro modal handles first-visit onboarding now. The tour is opt-in:
    // it only fires when the user clicks "Replay tour" in the header menu,
    // which adds ?tour=1 to the URL.
    const params = new URLSearchParams(window.location.search)
    if (params.get('tour') === '1') {
      setShow(true)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  // Keyboard handlers — Esc closes, ←/→ step, Enter advances.
  useEffect(() => {
    if (!show) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close(true)
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        setStep((s) => (s < STEPS.length - 1 ? s + 1 : s))
        if (step === STEPS.length - 1) close(true)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setStep((s) => Math.max(0, s - 1))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [show, step, close])

  if (!show) return null

  const current = STEPS[step]
  const Icon = current.icon || Sparkles

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="anon-tour-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => close(true)} />
      <div className="relative w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-foreground transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <button
          onClick={() => close(true)}
          className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Icon className="h-3.5 w-3.5" />
            Step {step + 1} of {STEPS.length}
            {current.locked && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border border-amber-500/40 bg-amber-500/10 text-amber-600">
                <Lock className="h-2.5 w-2.5" />
                Sign up to unlock
              </span>
            )}
          </div>

          <h2
            id="anon-tour-title"
            className="text-xl font-semibold text-foreground mb-3"
          >
            {current.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => close(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {step === STEPS.length - 1 ? 'Done' : 'Skip tour'}
            </button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step < STEPS.length - 1) setStep(step + 1)
                  else close(true)
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {step === STEPS.length - 1 ? 'Get started' : 'Next'}
                {step < STEPS.length - 1 && <ArrowRight className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
