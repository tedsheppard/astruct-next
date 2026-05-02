'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, Lock, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type HardWallReason =
  | 'message_limit'
  | 'upload_limit'
  | 'second_project'
  | 'locked_feature'
  | 'save_action'

const COPY: Record<HardWallReason, { title: string; subhead: string }> = {
  message_limit: {
    title: 'Sign up to keep going',
    subhead:
      "You've hit the guest message limit. Your conversation is saved — sign up to keep working with it.",
  },
  upload_limit: {
    title: 'Sign up to upload more',
    subhead:
      'Guest accounts can upload up to 50MB. Your contract is saved — sign up to remove the limit on your first project.',
  },
  second_project: {
    title: 'Sign up to add another project',
    subhead:
      'Free accounts include one project, forever. Sign up to upgrade and add more.',
  },
  locked_feature: {
    title: 'Sign up to unlock this',
    subhead:
      'Calendar, Letterheads, Notice Templates and the Knowledge Base are available with a free account.',
  },
  save_action: {
    title: 'Sign up to save this',
    subhead: "Your work is held in a guest session — sign up free and we'll save it permanently.",
  },
}

interface Props {
  open: boolean
  reason: HardWallReason
  onClose?: () => void // Some reasons are dismissible (locked_feature); message/upload aren't.
  onConverted?: () => void
}

export function AnonHardWall({ open, reason, onClose, onConverted }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setError(null)
      setSubmitting(false)
    }
  }, [open])

  const dismissible = reason === 'locked_feature'

  // Focus trap + Esc handler.
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) onClose?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, dismissible, onClose])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password
    if (!cleanEmail || !cleanPassword) {
      setError('Email and password are required.')
      return
    }
    // Same permissive regex as /register — covers the cases real users
    // actually have, including plus-addressing.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("That doesn't look like a valid email address.")
      return
    }
    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    try {
      // We expect the caller to be an anonymous Supabase user; updateUser
      // attaches an email/password identity to the existing UID.
      const { data: userResult } = await supabase.auth.getUser()
      const isAnon = userResult.user?.is_anonymous === true

      if (isAnon) {
        const { error: updateErr } = await supabase.auth.updateUser({ email: cleanEmail, password: cleanPassword })
        if (updateErr) {
          const msg = updateErr.message?.toLowerCase() || ''
          if (msg.includes('registered')) {
            setError('That email is already registered. Log in instead to merge your guest work.')
          } else if (msg.includes('rate limit')) {
            setError("We're sending too many confirmation emails right now — please try again in a minute.")
          } else if (msg.includes('invalid') && msg.includes('email')) {
            // Supabase sometimes returns the email back blank inside its error
            // string (e.g. `Email address "" is invalid`) when its server-side
            // validator rejects the format. Show the value we actually sent so
            // the user knows which email is being rejected.
            setError(`The email "${cleanEmail}" was rejected. Try a different address.`)
          } else {
            setError(updateErr.message || 'Could not upgrade your account.')
          }
          setSubmitting(false)
          return
        }

        await supabase
          .from('profiles')
          .update({
            name: name || null,
            email: cleanEmail,
            is_anonymous: false,
            anon_linked_at: new Date().toISOString(),
          })
          .eq('id', userResult.user!.id)
      } else {
        // Fallback to a pure new-user signup — should be rare in practice.
        const { error: signUpErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: { data: { name } },
        })
        if (signUpErr) {
          const m = signUpErr.message?.toLowerCase() || ''
          if (m.includes('registered')) {
            setError('That email is already registered. Try signing in instead.')
          } else if (m.includes('rate limit')) {
            setError("We're sending too many confirmation emails right now — please try again in a minute.")
          } else if (m.includes('invalid') && m.includes('email')) {
            setError(`The email "${cleanEmail}" was rejected. Try a different address (some test/disposable domains are blocked).`)
          } else {
            setError(signUpErr.message || 'Could not create your account.')
          }
          setSubmitting(false)
          return
        }
      }

      onConverted?.()
      // For the second-project reason, send the new account straight into
      // the billing flow so they can buy a contract slot immediately.
      if (reason === 'second_project') {
        router.push('/settings/billing?checkout=intent')
        return
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upgrade your account.')
      setSubmitting(false)
    }
  }

  const copy = COPY[reason]

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hard-wall-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismissible ? onClose : undefined} />
      <div className="relative w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-9 w-9 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
              {reason === 'locked_feature' ? (
                <Lock className="h-4 w-4" />
              ) : reason === 'upload_limit' || reason === 'message_limit' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="hard-wall-title" className="text-lg font-semibold text-foreground">
                {copy.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{copy.subhead}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="hw-name" className="text-xs text-muted-foreground">
                Name (optional)
              </Label>
              <Input
                id="hw-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hw-email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <Input
                id="hw-email"
                type="text"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hw-password" className="text-xs text-muted-foreground">
                Password
              </Label>
              <Input
                id="hw-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Sign up free
            </Button>

            <p className="text-xs text-muted-foreground text-center pt-1">
              Already have an account?{' '}
              <a href="/login" className="text-foreground hover:underline">
                Log in
              </a>
            </p>
          </form>

          {dismissible && (
            <button
              onClick={onClose}
              className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
