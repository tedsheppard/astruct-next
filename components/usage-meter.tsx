'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UsageData {
  tier: string
  trialQueriesUsed: number
  queryLimit: number
  trialDaysLeft: number
  canQuery: boolean
  trialExpired: boolean
}

export function UsageMeter({ collapsed }: { collapsed?: boolean }) {
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    fetch('/api/usage')
      .then(r => r.ok ? r.json() : null)
      .then(setUsage)
      .catch(() => {})
  }, [])

  if (!usage || usage.tier === 'paid') {
    if (usage?.tier === 'paid' && !collapsed) {
      return (
        <div className="px-3 py-2 text-[10px] text-muted-foreground/50">
          Pro plan
        </div>
      )
    }
    return null
  }

  const queryPct = Math.min(100, (usage.trialQueriesUsed / usage.queryLimit) * 100)
  const isWarning = queryPct > 80 || usage.trialDaysLeft <= 3
  const isDanger = !usage.canQuery || usage.trialExpired

  if (collapsed) return null

  return (
    <div className={`mx-3 mb-2 px-3 py-2.5 rounded-lg border text-xs ${isDanger ? 'bg-red-500/5 border-red-500/20' : isWarning ? 'bg-amber-500/5 border-amber-500/20' : 'bg-muted/50 border-border'}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-muted-foreground">Queries</span>
        <span className={`font-medium ${isDanger ? 'text-red-500' : isWarning ? 'text-amber-600' : 'text-foreground'}`}>
          {usage.trialQueriesUsed}/{usage.queryLimit}
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-foreground/30'}`}
          style={{ width: `${queryPct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className={`${isDanger ? 'text-red-500' : isWarning ? 'text-amber-600' : 'text-muted-foreground'}`}>
          {usage.trialExpired ? 'Trial expired' : `${usage.trialDaysLeft} days left`}
        </span>
        {(isDanger || isWarning) && (
          <Link href="/settings?tab=billing" className="text-[10px] font-medium text-foreground hover:underline">
            Upgrade
          </Link>
        )}
      </div>
    </div>
  )
}
