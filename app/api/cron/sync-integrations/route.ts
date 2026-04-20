import { type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runSync } from '@/app/api/integrations/_lib/sync-runner'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * GET /api/cron/sync-integrations
 *
 * Runs every 6 hours (configured in vercel.json). Iterates over connected
 * integrations that are due for sync (based on last_synced_at + sync_frequency_hours)
 * and triggers runSync for each. Skips integrations currently in error state —
 * user must manually retry those.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || ''
  const secretHeader = request.headers.get('x-cron-secret') || ''
  const expected = process.env.CRON_SECRET

  const okAuth = !!expected && (
    authHeader === `Bearer ${expected}` || secretHeader === expected
  )
  if (!okAuth) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  const { data: integrations, error } = await admin
    .from('integrations')
    .select('*')
    .eq('status', 'connected')
    .not('contract_id', 'is', null)

  if (error) {
    console.error('[cron] integrations fetch error', error)
    return Response.json({ error: 'Failed to list integrations' }, { status: 500 })
  }

  const now = Date.now()
  const due = (integrations || []).filter((i) => {
    const freqHours = i.sync_frequency_hours || 6
    if (!i.last_synced_at) return true
    const last = new Date(i.last_synced_at).getTime()
    return now - last >= freqHours * 60 * 60 * 1000
  })

  const origin = request.nextUrl.origin
  const results: Array<Record<string, unknown>> = []

  for (const integration of due) {
    try {
      const summary = await runSync(integration, {
        baseUrl: origin,
        cookieHeader: null,
        internalSecret: expected || null,
        userId: integration.user_id,
      })
      results.push({ integration_id: integration.id, platform: integration.platform, ...summary })
    } catch (e) {
      console.error('[cron] sync failed', integration.id, e)
      results.push({
        integration_id: integration.id,
        platform: integration.platform,
        error: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  }

  return Response.json({
    checked: integrations?.length || 0,
    synced: results.length,
    results,
  })
}
