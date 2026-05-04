'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useContract } from '@/lib/contract-context'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

/**
 * /contracts/new — canonical "create a new project" entry.
 *
 * Behaviour: create a blank project via POST /api/contracts and redirect
 * to its assistant with ?intro=1 so the upload modal opens. Same flow
 * for anon and signed-in users.
 *
 * Anon users at the cap (1 contract limit) get the lock card instead.
 *
 * The legacy multi-field manual form was removed — the upload-extract-confirm
 * modal is the single create flow now.
 */
export default function NewProjectPage() {
  const router = useRouter()
  const { selectContractAndNavigate } = useContract()
  const [error, setError] = useState<string | null>(null)
  const [anonBlocked, setAnonBlocked] = useState<{ existingId: string } | null>(null)
  const [freeBlocked, setFreeBlocked] = useState<{ existingId: string | null } | null>(null)
  const [paidBlocked, setPaidBlocked] = useState<{ message: string; existingId: string | null } | null>(null)
  const ranOnceRef = useRef(false)

  useEffect(() => {
    if (ranOnceRef.current) return
    ranOnceRef.current = true

    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        // Public visitor — bounce to the assistant entry which spins up
        // an anon session and opens the intro modal.
        router.replace('/assistant')
        return
      }

      // Anon at cap: show lock card
      if (user.is_anonymous) {
        const { data: existing } = await supabase
          .from('contracts')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
        if (cancelled) return
        if (existing && existing.length >= 1) {
          setAnonBlocked({ existingId: existing[0].id })
          return
        }
      }

      const r = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New project' }),
      })
      const d = await r.json().catch(() => ({}))
      if (cancelled) return

      if (r.status === 403) {
        const { data: existing } = await supabase
          .from('contracts')
          .select('id').eq('user_id', user.id)
          .order('created_at', { ascending: false }).limit(1)
        const existingId = existing?.[0]?.id || null
        if (d?.code === 'ANON_CONTRACT_LIMIT') {
          if (existingId) setAnonBlocked({ existingId })
        } else if (d?.code === 'FREE_CONTRACT_LIMIT') {
          setFreeBlocked({ existingId })
        } else if (d?.code === 'PAID_CONTRACT_LIMIT') {
          setPaidBlocked({ message: d?.error || 'You\'ve reached your subscription quota.', existingId })
        } else {
          setError(d?.error || 'Could not start a new project.')
        }
        return
      }

      if (!r.ok || !d?.id) {
        setError(d?.error || 'Could not start a new project. Please try again.')
        return
      }

      selectContractAndNavigate(d.id, `/contracts/${d.id}/assistant?intro=1`)
    })()
    return () => { cancelled = true }
  }, [router, selectContractAndNavigate])

  if (anonBlocked) {
    return (
      <div className="p-6 h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Sign up to add another project</h2>
            <p className="text-sm text-muted-foreground">
              Guest accounts can have one project at a time. Sign up free to add more — your existing project stays exactly as it is.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <Button onClick={() => router.push(`/contracts/${anonBlocked.existingId}/assistant`)} variant="outline">
                Back to project
              </Button>
              <Button onClick={() => router.push('/register')}>Sign up free</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (freeBlocked) {
    return (
      <div className="p-6 h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Upgrade to add another project</h2>
            <p className="text-sm text-muted-foreground">
              Free accounts include one project. Upgrade to Pro Contract — $29.95 AUD per project per month, GST inclusive — to add more.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              {freeBlocked.existingId && (
                <Button onClick={() => router.push(`/contracts/${freeBlocked.existingId}/assistant`)} variant="outline">
                  Back to project
                </Button>
              )}
              <Button onClick={() => router.push('/settings/billing')}>Upgrade to Pro</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paidBlocked) {
    return (
      <div className="p-6 h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Add another contract slot</h2>
            <p className="text-sm text-muted-foreground">{paidBlocked.message}</p>
            <div className="flex gap-2 justify-center pt-2">
              {paidBlocked.existingId && (
                <Button onClick={() => router.push(`/contracts/${paidBlocked.existingId}/assistant`)} variant="outline">
                  Back to project
                </Button>
              )}
              <Button onClick={() => router.push('/settings/billing')}>Manage billing</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Couldn&apos;t start your project</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => { ranOnceRef.current = false; setError(null); router.refresh() }}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Setting up your project…
      </div>
    </div>
  )
}
