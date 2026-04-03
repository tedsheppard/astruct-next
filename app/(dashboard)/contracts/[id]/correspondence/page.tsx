'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Mail, ExternalLink } from 'lucide-react'

const PLATFORMS = [
  { name: 'Procore', description: 'Construction project management', status: 'not_setup' as const },
  { name: 'Aconex (Oracle)', description: 'Document management & collaboration', status: 'not_setup' as const },
  { name: 'Asite', description: 'Cloud platform for construction', status: 'not_setup' as const },
  { name: 'Hammertech', description: 'Safety and compliance management', status: 'not_setup' as const },
  { name: 'InEight', description: 'Capital project management software', status: 'not_setup' as const },
]

const STATUS_DOT = {
  connected: 'bg-emerald-500',
  disconnected: 'bg-red-500',
  not_setup: 'bg-muted-foreground/30',
}

const STATUS_LABEL = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  not_setup: 'Not set up',
}

export default function CorrespondencePage() {
  const params = useParams()
  const contractId = params.id as string

  return (
    <div className="p-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
      <div className="max-w-5xl mx-auto">
        {/* Platforms table */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Connected Platforms</h2>
          <div className="border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center px-5 py-2.5 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
              <div className="flex-1">Platform</div>
              <div className="w-32 text-center">Status</div>
              <div className="w-24 text-right">Action</div>
            </div>
            {/* Rows */}
            {PLATFORMS.map((platform, i) => (
              <div key={platform.name} className={`flex items-center px-5 py-3.5 ${i < PLATFORMS.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/20 transition-colors`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{platform.name}</p>
                  <p className="text-xs text-muted-foreground">{platform.description}</p>
                </div>
                <div className="w-32 flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${STATUS_DOT[platform.status]}`} />
                  <span className="text-xs text-muted-foreground">{STATUS_LABEL[platform.status]}</span>
                </div>
                <div className="w-24 text-right">
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border hover:border-foreground/20">
                    Set up
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Connect your project management platform to automatically sync correspondence into Astruct for AI-powered analysis.</p>
        </div>

        {/* Synced correspondence list */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Synced Correspondence</h2>
          <div className="text-center py-16">
            <Mail className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground mb-1">No correspondence synced yet</p>
            <p className="text-xs text-muted-foreground/60">Connect a platform above to start syncing project correspondence.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
