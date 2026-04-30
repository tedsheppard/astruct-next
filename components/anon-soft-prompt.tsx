'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'astruct_anon_soft_prompt'
const REAPPEAR_EVERY = 5

interface DismissState {
  dismissedAt: number
  dismissedAtMessageCount: number
}

/**
 * ChatGPT-style banner: sits above the chat input, fires after the first
 * assistant response, reappears every 5 messages once dismissed.
 *
 * Driven entirely by props — the parent passes the running message count
 * (it's already counting locally for streaming UX) and the show conditions
 * compose with localStorage dismissal.
 */
export function AnonSoftPrompt({
  isAnon,
  hasFirstResponse,
  messageCount,
  onSignUp,
  onLogin,
}: {
  isAnon: boolean
  hasFirstResponse: boolean
  messageCount: number
  onSignUp: () => void
  onLogin: () => void
}) {
  const [dismissed, setDismissed] = useState<DismissState | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setDismissed(JSON.parse(raw))
    } catch {
      // Ignore — banner will simply show.
    }
  }, [])

  if (!hydrated || !isAnon || !hasFirstResponse) return null

  const shouldReappear = dismissed
    ? messageCount - dismissed.dismissedAtMessageCount >= REAPPEAR_EVERY
    : true
  if (!shouldReappear) return null

  const handleDismiss = () => {
    const next: DismissState = {
      dismissedAt: Date.now(),
      dismissedAtMessageCount: messageCount,
    }
    setDismissed(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // No-op.
    }
  }

  return (
    <div className="mb-3 rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 flex items-center gap-3">
      <div className="flex-1 text-sm text-foreground/85 leading-snug">
        <span className="font-medium">Sign up to save your work,</span>{' '}
        draft notices, track deadlines, and unlock the rest of Astruct.
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" onClick={onSignUp}>
          Sign up free
        </Button>
        <Button size="sm" variant="outline" onClick={onLogin}>
          Log in
        </Button>
        <button
          aria-label="Dismiss"
          onClick={handleDismiss}
          className="p-1 rounded-md hover:bg-foreground/10 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
