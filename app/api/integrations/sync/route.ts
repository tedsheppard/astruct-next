import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runSync, type SyncContext } from '@/app/api/integrations/_lib/sync-runner'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

// POST - sync a single integration (by integration_id, or platform + contract_id)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const { platform, contract_id, integration_id } = body as {
      platform?: string
      contract_id?: string
      integration_id?: string
    }

    const admin = createAdminClient()

    let query = admin.from('integrations').select('*').eq('user_id', user.id)
    if (integration_id) {
      query = query.eq('id', integration_id)
    } else {
      if (!platform || !contract_id) {
        return Response.json(
          { error: 'integration_id OR (platform + contract_id) is required' },
          { status: 400 }
        )
      }
      query = query.eq('platform', platform).eq('contract_id', contract_id)
    }

    const { data: integration, error: intError } = await query.maybeSingle()
    if (intError || !integration) {
      return Response.json({ error: 'Integration not found' }, { status: 404 })
    }
    if (integration.status !== 'connected') {
      return Response.json({ error: 'Integration is not connected' }, { status: 400 })
    }
    if (!integration.contract_id) {
      return Response.json({ error: 'Integration has no contract assigned' }, { status: 400 })
    }

    const ctx: SyncContext = {
      baseUrl: request.nextUrl.origin,
      cookieHeader: request.headers.get('cookie'),
      internalSecret: process.env.CRON_SECRET || null,
      userId: user.id,
    }

    const summary = await runSync(integration, ctx)
    return Response.json(summary)
  } catch (error) {
    console.error('Sync error:', error)
    return Response.json({ error: 'Sync failed' }, { status: 500 })
  }
}
