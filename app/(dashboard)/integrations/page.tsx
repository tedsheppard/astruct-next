'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plug, Plus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import IntegrationCard, { type IntegrationCardData } from '@/components/integration-card'
import IntegrationConnectDialog from '@/components/integration-connect-dialog'

interface IntegrationRow {
  id: string
  platform: string
  contract_id: string | null
  status: 'connected' | 'disconnected' | 'error'
  last_synced_at: string | null
  last_sync_item_count: number | null
  total_items_synced: number | null
  sync_frequency_hours: number | null
  auto_create_obligations: boolean | null
  error_message: string | null
}

export default function IntegrationsPage() {
  const [items, setItems] = useState<IntegrationCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/integrations')
      if (!res.ok) {
        setItems([])
        return
      }
      const data = await res.json()
      const integrations: IntegrationRow[] = data.integrations || []

      const contractIds = Array.from(
        new Set(integrations.map((i) => i.contract_id).filter(Boolean) as string[])
      )
      const contractNames: Record<string, string> = {}
      if (contractIds.length > 0) {
        const supabase = createClient()
        const { data: contracts } = await supabase
          .from('contracts')
          .select('id, name')
          .in('id', contractIds)
        for (const c of contracts || []) contractNames[c.id] = c.name
      }

      setItems(
        integrations.map((i) => ({
          id: i.id,
          platform: i.platform,
          contract_id: i.contract_id,
          contract_name: i.contract_id ? contractNames[i.contract_id] || null : null,
          status: i.status,
          last_synced_at: i.last_synced_at,
          last_sync_item_count: i.last_sync_item_count,
          total_items_synced: i.total_items_synced,
          sync_frequency_hours: i.sync_frequency_hours || 6,
          auto_create_obligations: i.auto_create_obligations ?? true,
          error_message: i.error_message,
        }))
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Integrations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform connections feeding correspondence and time-bar obligations.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          Add integration
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <Plug className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground mb-1">No integrations configured yet</p>
          <p className="text-xs text-muted-foreground/70 mb-4">
            Connect Procore, Aconex, Asite, Hammertech, or InEight to auto-sync correspondence.
          </p>
          <Button onClick={() => setDialogOpen(true)} variant="outline" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add your first integration
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <IntegrationCard key={i.id} integration={i} onChanged={load} />
          ))}
        </div>
      )}

      <IntegrationConnectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConnected={load}
      />
    </div>
  )
}
