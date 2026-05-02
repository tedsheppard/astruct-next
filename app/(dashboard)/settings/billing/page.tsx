'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ExternalLink, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface UsageResponse {
  contractCount: number
  contractLimit: number
  queriesThisMonth: number
  queryLimit: number
  isPaid?: boolean
  tokens: {
    includedTokens: number
    usedTokens: number
    overageTokens: number
    overageCents: number
    pctOfIncluded: number
    periodStart: string | null
    periodEnd: string | null
    contractQuantity: number
    capCents: number
    hasSubscription: boolean
  }
}

const CAP_OPTIONS = [
  { value: '5000', label: '$50 / month' },
  { value: '10000', label: '$100 / month' },
  { value: '20000', label: '$200 / month (default)' },
  { value: '50000', label: '$500 / month' },
  { value: 'null', label: 'Unlimited' },
]

function fmtCents(c: number): string {
  return `$${(c / 100).toFixed(2)} AUD`
}
function fmtDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BillingPage() {
  const params = useSearchParams()
  const [usage, setUsage] = useState<UsageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const refresh = useCallback(async () => {
    const r = await fetch('/api/usage')
    if (r.ok) {
      const d = await r.json()
      setUsage(d)
      if (d.tokens?.contractQuantity) setQuantity(d.tokens.contractQuantity)
    }
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  useEffect(() => {
    const checkout = params.get('checkout')
    if (checkout === 'success') toast.success('Subscription active — welcome aboard!')
    if (checkout === 'cancel') toast.info('Checkout cancelled. No charge made.')
    // Land-with-intent: anon → upgraded → "Add a contract" — auto-fire checkout
    // so the user lands directly on Stripe instead of having to click again.
    if (checkout === 'intent') {
      // Defer so the page paints first
      setTimeout(() => startCheckout(2), 250)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  async function startCheckout(qty: number) {
    setBusy('checkout')
    try {
      const r = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_quantity: qty }),
      })
      const d = await r.json()
      if (d.url) window.location.href = d.url
      else toast.error(d.error || 'Could not start checkout')
    } catch {
      toast.error('Network error — please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function openPortal() {
    setBusy('portal')
    try {
      const r = await fetch('/api/stripe/portal', { method: 'POST' })
      const d = await r.json()
      if (d.url) window.location.href = d.url
      else toast.error(d.error || 'Portal unavailable')
    } catch {
      toast.error('Network error.')
    } finally {
      setBusy(null)
    }
  }

  async function setCap(value: string | null) {
    if (!value) return
    setBusy('cap')
    const cap_cents = value === 'null' ? null : Number(value)
    try {
      const r = await fetch('/api/stripe/cap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cap_cents }),
      })
      if (r.ok) {
        toast.success('Overage cap updated')
        refresh()
      } else {
        const d = await r.json()
        toast.error(d.error || 'Could not update cap')
      }
    } finally {
      setBusy(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-[60vh]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if (!usage) {
    return <div className="p-6 text-sm text-muted-foreground">Could not load billing.</div>
  }

  const t = usage.tokens
  const hasSub = t.hasSubscription
  const pct = t.pctOfIncluded
  const showOverage = t.overageTokens > 0
  const projectedTotal = (t.contractQuantity * 2995) + t.overageCents

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {hasSub
            ? `Pro Contract — ${t.contractQuantity} active contract${t.contractQuantity === 1 ? '' : 's'}.`
            : 'Free tier — 1 project, generous limits, forever.'}
        </p>
      </div>

      {/* Plan card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Plan</div>
              <div className="text-lg font-medium flex items-center gap-2">
                {hasSub ? 'Pro Contract' : 'Free'}
                {hasSub && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">Active</span>}
              </div>
              {hasSub && (
                <div className="text-sm text-muted-foreground mt-1">
                  Renews {fmtDate(t.periodEnd)} · {fmtCents(projectedTotal)} projected this cycle
                </div>
              )}
            </div>
            {hasSub ? (
              <Button onClick={openPortal} disabled={busy === 'portal'} variant="outline">
                {busy === 'portal' ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <ExternalLink className="h-3.5 w-3.5 mr-1.5" />}
                Manage in Stripe
              </Button>
            ) : (
              <Button onClick={() => startCheckout(quantity)} disabled={busy === 'checkout'}>
                {busy === 'checkout' ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                Upgrade to Pro
              </Button>
            )}
          </div>

          {/* Contract stepper — visible always so the user can pick a quantity */}
          <div className="rounded-md border border-border p-4 bg-muted/20">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Contract slots</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-2xl font-semibold w-12 text-center tabular-nums">{quantity}</div>
              <button
                onClick={() => setQuantity(q => Math.min(50, q + 1))}
                className="h-9 w-9 rounded-md border border-border flex items-center justify-center hover:bg-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="ml-3 text-sm text-muted-foreground">
                = {fmtCents(quantity * 2995)} / month, GST included
              </div>
            </div>
            {hasSub && quantity !== t.contractQuantity && (
              <div className="mt-3 text-xs text-muted-foreground">
                Use the Stripe portal to change quantity; proration applies automatically.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">AI usage this cycle</div>
              <div className="text-lg font-medium">
                {t.usedTokens.toLocaleString()} / {t.includedTokens.toLocaleString()} tokens
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {t.periodStart && t.periodEnd
                  ? `${fmtDate(t.periodStart)} → ${fmtDate(t.periodEnd)}`
                  : 'Calendar month'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">{pct}%</div>
              <div className="text-xs text-muted-foreground">of included</div>
            </div>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                pct >= 100 ? 'bg-amber-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>

          {showOverage && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-amber-700">
                  Overage active — {t.overageTokens.toLocaleString()} tokens above included
                </div>
                <div className="text-amber-700/80 mt-0.5">
                  Currently {fmtCents(t.overageCents)} this cycle. Cap: {t.capCents === null ? 'Unlimited' : fmtCents(t.capCents)}.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overage cap setter */}
      {hasSub && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Monthly overage cap</div>
              <div className="text-sm text-muted-foreground">
                We'll stop AI calls at this cap so a bad prompt can't blow your bill. You can change it any time.
              </div>
            </div>
            <Select
              value={t.capCents === null ? 'null' : String(t.capCents)}
              onValueChange={setCap}
              disabled={busy === 'cap'}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAP_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* What's included reminder */}
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
          <div className="flex items-start gap-2 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>$29.95 AUD per contract per month, GST inclusive — Stripe-secured, cancel anytime.</div>
          </div>
          <div className="flex items-start gap-2 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>2,000,000 input + 500,000 output tokens included per contract per cycle.</div>
          </div>
          <div className="flex items-start gap-2 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>Overage at $0.10 AUD per 10,000 tokens, capped where you set it.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
