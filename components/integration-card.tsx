'use client'

import { useState } from 'react'
import { MoreHorizontal, RefreshCw, Trash2, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import IntegrationSyncStatus from '@/components/integration-sync-status'

export interface IntegrationCardData {
  id: string
  platform: string
  contract_id: string | null
  contract_name?: string | null
  status: 'connected' | 'disconnected' | 'error'
  last_synced_at: string | null
  last_sync_item_count: number | null
  total_items_synced: number | null
  sync_frequency_hours: number
  auto_create_obligations: boolean
  error_message: string | null
}

const PLATFORM_META: Record<string, { name: string; logo: string; description: string }> = {
  procore: { name: 'Procore', logo: '/logos/procore_logo.png', description: 'Construction project management' },
  aconex: { name: 'Aconex (Oracle)', logo: '/logos/aconex_logo.png', description: 'Document management & collaboration' },
  asite: { name: 'Asite', logo: '/logos/asite_logo.webp', description: 'Cloud platform for construction' },
  hammertech: { name: 'Hammertech', logo: '/logos/hammertech_logo.jpeg', description: 'Safety and compliance management' },
  ineight: { name: 'InEight', logo: '/logos/ineight_logo.png', description: 'Capital project management' },
}

export default function IntegrationCard({
  integration,
  onChanged,
}: {
  integration: IntegrationCardData
  onChanged?: () => void
}) {
  const [syncing, setSyncing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const meta = PLATFORM_META[integration.platform] || {
    name: integration.platform,
    logo: '',
    description: '',
  }
  const connected = integration.status === 'connected'
  const errored = integration.status === 'error'

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integration_id: integration.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Sync failed')
      } else {
        const msg = `${meta.name} sync complete: ${data.new ?? 0} new items, ${data.obligations_created ?? 0} obligations detected`
        toast.success(msg)
        onChanged?.()
      }
    } catch {
      toast.error('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm(`Disconnect ${meta.name}? This will not delete already-synced correspondence.`)) return
    try {
      const res = await fetch('/api/integrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: integration.id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Failed to disconnect')
        return
      }
      toast.success(`${meta.name} disconnected`)
      onChanged?.()
    } catch {
      toast.error('Failed to disconnect')
    } finally {
      setMenuOpen(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {meta.logo ? (
            <img src={meta.logo} alt={meta.name} className="h-8 w-8 object-contain" />
          ) : (
            <span className="text-sm font-semibold">{meta.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{meta.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {integration.contract_name || 'Unassigned contract'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-emerald-500' : errored ? 'bg-red-500' : 'bg-muted-foreground/30'
            }`}
          />
          <span
            className={`text-xs ${
              connected
                ? 'text-emerald-600 font-medium'
                : errored
                ? 'text-red-600 font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {connected ? 'Connected' : errored ? 'Error' : 'Disconnected'}
          </span>
          <button
            onClick={handleSync}
            disabled={syncing || !connected}
            className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border border-border hover:border-foreground/20 hover:bg-muted/40 disabled:opacity-50"
          >
            {syncing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            Sync now
          </button>
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger className="p-1 rounded-md hover:bg-muted/40 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button
                onClick={() => {
                  setExpanded((v) => !v)
                  setMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent inline-flex items-center gap-2"
              >
                <Eye className="h-3.5 w-3.5" />
                {expanded ? 'Hide log' : 'View log'}
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 inline-flex items-center gap-2"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Disconnect
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {errored && integration.error_message && (
        <div className="px-4 pb-3 -mt-1">
          <p className="text-xs text-red-600/90">{integration.error_message}</p>
        </div>
      )}

      <IntegrationSyncStatus integration={integration} expanded={expanded} />
    </div>
  )
}
