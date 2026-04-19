'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

interface UpgradeWallProps {
  reason: 'trial_expired' | 'query_limit_reached' | 'contract_limit_reached'
  onClose: () => void
}

const MESSAGES = {
  trial_expired: { title: 'Your trial has ended', desc: 'Upgrade to Pro to continue using Astruct with unlimited queries and contracts.' },
  query_limit_reached: { title: 'Query limit reached', desc: 'You\'ve used all 50 queries in your trial. Upgrade to Pro for unlimited queries.' },
  contract_limit_reached: { title: 'Contract limit reached', desc: 'Your trial includes 1 contract. Upgrade to Pro for up to 5 contracts.' },
}

export function UpgradeWall({ reason, onClose }: UpgradeWallProps) {
  const msg = MESSAGES[reason]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-6">
          <div className="text-3xl mb-3">🚀</div>
          <h2 className="text-lg font-semibold text-foreground">{msg.title}</h2>
          <p className="text-sm text-muted-foreground mt-2">{msg.desc}</p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { name: 'Professional', price: '$249/mo', features: ['5 contracts', 'Unlimited queries', 'Review tables', 'Priority support'], highlighted: true },
          ].map(plan => (
            <div key={plan.name} className={`rounded-lg border p-4 ${plan.highlighted ? 'border-foreground bg-accent' : 'border-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{plan.name}</span>
                <span className="text-sm font-medium text-foreground">{plan.price}</span>
              </div>
              <ul className="space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Link href="/settings?tab=billing"
          className="block w-full py-3 rounded-lg text-center text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors">
          Upgrade to Pro
        </Link>
        <button onClick={onClose} className="block w-full mt-2 py-2 text-xs text-muted-foreground hover:text-foreground text-center transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  )
}
