'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { IntegrationCardData } from '@/components/integration-card'

interface SyncLog {
  id: string
  started_at: string
  completed_at: string | null
  status: string
  items_synced: number
  items_new: number
  obligations_created: number
  error_message: string | null
}

function formatDateTime(d: string | null) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return d
  }
}

export default function IntegrationSyncStatus({
  integration,
  expanded,
}: {
  integration: IntegrationCardData
  expanded: boolean
}) {
  const [stats, setStats] = useState<{ items24h: number; obligations24h: number } | null>(null)
  const [logs, setLogs] = useState<SyncLog[] | null>(null)
  const [loadingLogs, setLoadingLogs] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      const supabase = createClient()
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('integration_sync_logs')
        .select('items_new, obligations_created')
        .eq('integration_id', integration.id)
        .gte('started_at', since)
      const items24h = (data || []).reduce((acc, r) => acc + (r.items_new || 0), 0)
      const obligations24h = (data || []).reduce((acc, r) => acc + (r.obligations_created || 0), 0)
      setStats({ items24h, obligations24h })
    } catch {
      setStats({ items24h: 0, obligations24h: 0 })
    }
  }, [integration.id])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadStats() }, [loadStats])

  useEffect(() => {
    if (!expanded) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingLogs(true)
    const supabase = createClient()
    supabase
      .from('integration_sync_logs')
      .select('id, started_at, completed_at, status, items_synced, items_new, obligations_created, error_message')
      .eq('integration_id', integration.id)
      .order('started_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (cancelled) return
        setLogs(data || [])
        setLoadingLogs(false)
      })
    return () => { cancelled = true }
  }, [expanded, integration.id])

  const nextSync = integration.last_synced_at
    ? new Date(
        new Date(integration.last_synced_at).getTime() +
          (integration.sync_frequency_hours || 6) * 60 * 60 * 1000
      ).toISOString()
    : null

  return (
    <div className="border-t border-border bg-muted/20 px-4 py-3 space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Last sync</p>
          <p className="text-foreground font-medium">
            {integration.last_synced_at ? formatDateTime(integration.last_synced_at) : 'Never'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Next sync</p>
          <p className="text-foreground font-medium">{nextSync ? formatDateTime(nextSync) : '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Items (24h)</p>
          <p className="text-foreground font-medium">{stats?.items24h ?? '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Obligations (24h)</p>
          <p className="text-foreground font-medium">{stats?.obligations24h ?? '—'}</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 rounded-lg border border-border bg-background overflow-hidden">
          <div className="px-3 py-2 text-[11px] font-medium text-muted-foreground border-b border-border">
            Last 10 syncs
          </div>
          {loadingLogs ? (
            <div className="p-4 flex justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : !logs || logs.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground">No sync history yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {logs.map((l) => (
                <li key={l.id} className="px-3 py-2 text-xs flex items-center gap-3">
                  <span
                    className={`inline-flex h-1.5 w-1.5 rounded-full shrink-0 ${
                      l.status === 'success'
                        ? 'bg-emerald-500'
                        : l.status === 'partial'
                        ? 'bg-amber-500'
                        : l.status === 'error'
                        ? 'bg-red-500'
                        : 'bg-muted-foreground/40'
                    }`}
                  />
                  <span className="text-muted-foreground shrink-0 w-40">
                    {formatDateTime(l.started_at)}
                  </span>
                  <span className="text-foreground shrink-0">
                    {l.items_new} new · {l.obligations_created} obligations
                  </span>
                  {l.error_message && (
                    <span className="text-red-500 truncate ml-2">{l.error_message}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
