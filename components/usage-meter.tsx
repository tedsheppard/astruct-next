'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UsageData {
  tier: string
  isAnonymous?: boolean
  projectsCreated?: number
  projectLimit?: number
  canCreateProject?: boolean
}

/**
 * Sidebar plan widget.
 *
 * - Anonymous (guest) users → render NOTHING. The header pill is the
 *   single source of truth for guest usage. The legacy "Queries 0/50,
 *   0 days left, Upgrade" widget made no sense for a session that has
 *   no time limit and no signup yet.
 * - Free (signed-up) users → "Free plan · 1 / 1 project" + Upgrade link
 *   when at the cap.
 * - Paid users → small "Pro plan" footer.
 */
export function UsageMeter({ collapsed }: { collapsed?: boolean }) {
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    fetch('/api/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then(setUsage)
      .catch(() => {})
  }, [])

  if (!usage) return null
  if (usage.isAnonymous) return null
  if (collapsed) return null

  if (usage.tier === 'paid') {
    return (
      <div className="px-3 py-2 text-[10px] text-muted-foreground/50">
        Pro plan
      </div>
    )
  }

  // Free tier — show project usage (the only limit that matters under the new model)
  const used = usage.projectsCreated ?? 0
  const limit = usage.projectLimit ?? 1
  const limitText = Number.isFinite(limit) ? limit : '∞'
  const atCap = !usage.canCreateProject

  return (
    <div
      className={`mx-3 mb-2 px-3 py-2.5 rounded-lg border text-xs ${
        atCap ? 'bg-amber-500/5 border-amber-500/20' : 'bg-muted/50 border-border'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Free plan</span>
        <span className={`font-medium ${atCap ? 'text-amber-600' : 'text-foreground'}`}>
          {used} / {limitText} project{limit === 1 ? '' : 's'}
        </span>
      </div>
      {atCap && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-amber-600 text-[11px]">Project limit reached</span>
          <Link
            href="/settings?tab=billing"
            className="text-[10px] font-medium text-foreground hover:underline"
          >
            Upgrade
          </Link>
        </div>
      )}
    </div>
  )
}
