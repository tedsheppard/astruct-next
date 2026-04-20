import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const VALID_PLATFORMS = ['procore', 'aconex', 'asite', 'hammertech', 'ineight'] as const
type Platform = typeof VALID_PLATFORMS[number]

// GET - list user's integrations (optionally filtered by contract_id)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const contractId = request.nextUrl.searchParams.get('contract_id')

    let query = supabase
      .from('integrations')
      .select('id, platform, status, config, contract_id, sync_frequency_hours, auto_create_obligations, last_synced_at, last_sync_item_count, total_items_synced, error_message, created_at')
      .eq('user_id', user.id)

    if (contractId) query = query.eq('contract_id', contractId)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return Response.json({ integrations: data || [] })
  } catch (error) {
    console.error('Integrations fetch error:', error)
    return Response.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }
}

// POST - create or update an integration
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const {
      platform,
      contract_id,
      credentials,
      config,
      sync_frequency_hours,
      auto_create_obligations,
    }: {
      platform: Platform
      contract_id?: string | null
      credentials?: Record<string, string>
      config?: Record<string, string>
      sync_frequency_hours?: number
      auto_create_obligations?: boolean
    } = body

    if (!platform) {
      return Response.json({ error: 'platform is required' }, { status: 400 })
    }
    if (!VALID_PLATFORMS.includes(platform)) {
      return Response.json({ error: 'Invalid platform' }, { status: 400 })
    }

    // Verify contract ownership if contract_id provided
    if (contract_id) {
      const { data: contract } = await supabase
        .from('contracts')
        .select('id')
        .eq('id', contract_id)
        .eq('user_id', user.id)
        .maybeSingle()
      if (!contract) {
        return Response.json({ error: 'Contract not found' }, { status: 404 })
      }
    }

    const admin = createAdminClient()

    const testResult = await testPlatformConnection(platform, credentials || {})

    const baseData = {
      user_id: user.id,
      contract_id: contract_id || null,
      platform,
      status: testResult.success ? 'connected' : 'error',
      credentials: credentials || {},
      config: config || {},
      sync_frequency_hours: typeof sync_frequency_hours === 'number' ? sync_frequency_hours : 6,
      auto_create_obligations: typeof auto_create_obligations === 'boolean' ? auto_create_obligations : true,
      error_message: testResult.success ? null : testResult.error,
      updated_at: new Date().toISOString(),
    }

    // Manual upsert — the partial unique indexes make conflict targets awkward for .upsert()
    let existingId: string | undefined
    if (contract_id) {
      const { data: existing } = await admin
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('contract_id', contract_id)
        .eq('platform', platform)
        .maybeSingle()
      existingId = existing?.id
    } else {
      const { data: existing } = await admin
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .is('contract_id', null)
        .eq('platform', platform)
        .maybeSingle()
      existingId = existing?.id
    }

    let integration
    if (existingId) {
      const { data, error } = await admin
        .from('integrations')
        .update(baseData)
        .eq('id', existingId)
        .select('id, platform, status, config, contract_id, sync_frequency_hours, auto_create_obligations, last_synced_at, last_sync_item_count, total_items_synced, error_message')
        .single()
      if (error) throw error
      integration = data
    } else {
      const { data, error } = await admin
        .from('integrations')
        .insert(baseData)
        .select('id, platform, status, config, contract_id, sync_frequency_hours, auto_create_obligations, last_synced_at, last_sync_item_count, total_items_synced, error_message')
        .single()
      if (error) throw error
      integration = data
    }

    return Response.json({ integration, test_result: testResult })
  } catch (error) {
    console.error('Integration save error:', error)
    return Response.json({ error: 'Failed to save integration' }, { status: 500 })
  }
}

// DELETE - remove an integration (by id, or legacy platform+contract_id)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, platform, contract_id } = body as {
      id?: string
      platform?: Platform
      contract_id?: string | null
    }

    let query = supabase.from('integrations').delete().eq('user_id', user.id)
    if (id) {
      query = query.eq('id', id)
    } else if (platform) {
      query = query.eq('platform', platform)
      if (contract_id) query = query.eq('contract_id', contract_id)
      else query = query.is('contract_id', null)
    } else {
      return Response.json({ error: 'id or platform is required' }, { status: 400 })
    }

    const { error } = await query
    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    console.error('Integration delete error:', error)
    return Response.json({ error: 'Failed to delete integration' }, { status: 500 })
  }
}

// Test platform connection with provided credentials
async function testPlatformConnection(
  platform: Platform,
  credentials: Record<string, string>
): Promise<{ success: boolean; error?: string; info?: string }> {
  try {
    switch (platform) {
      case 'procore': {
        if (!credentials.client_id || !credentials.client_secret) {
          return { success: false, error: 'Client ID and Client Secret are required' }
        }
        const tokenRes = await fetch('https://login.procore.com/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: credentials.client_id,
            client_secret: credentials.client_secret,
          }),
        })
        if (!tokenRes.ok) {
          const err = await tokenRes.text()
          return { success: false, error: `Procore auth failed: ${err}` }
        }
        const tokenData = await tokenRes.json()
        const testRes = await fetch('https://api.procore.com/rest/v1.0/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        if (!testRes.ok) return { success: false, error: 'Could not verify Procore API access' }
        return { success: true, info: 'Connected to Procore successfully' }
      }

      case 'aconex': {
        if (!credentials.client_id || !credentials.client_secret) {
          return { success: false, error: 'OAuth Client ID and Client Secret are required' }
        }
        const lobbyUrl = credentials.environment === 'ea'
          ? 'https://constructionandengineering-ea.oraclecloud.com'
          : 'https://constructionandengineering.oraclecloud.com'
        const aconexTokenRes = await fetch(`${lobbyUrl}/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${credentials.client_id}:${credentials.client_secret}`).toString('base64')}`,
          },
          body: new URLSearchParams({ grant_type: 'client_credentials' }),
        })
        if (!aconexTokenRes.ok) {
          return { success: false, error: 'Aconex OAuth failed. Check your Client ID, Client Secret, and environment.' }
        }
        const aconexToken = await aconexTokenRes.json()
        const aconexTestRes = await fetch('https://api.aconex.com/api/projects', {
          headers: { Authorization: `Bearer ${aconexToken.access_token}` },
        })
        if (!aconexTestRes.ok) {
          return { success: false, error: 'Aconex API access failed. Your OAuth credentials may lack project permissions.' }
        }
        return { success: true, info: 'Connected to Aconex successfully' }
      }

      case 'asite': {
        if (!credentials.email || !credentials.password) {
          return { success: false, error: 'Email and Password are required' }
        }
        const formBody = new URLSearchParams({ emailId: credentials.email, password: credentials.password })
        const asiteRes = await fetch('https://dms.asite.com/apilogin/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody,
        })
        if (!asiteRes.ok) {
          return { success: false, error: 'Asite login failed. Check your email and password.' }
        }
        const asiteBody = await asiteRes.text()
        if (!asiteBody.includes('Sessionid')) {
          return { success: false, error: 'Asite login failed — no session returned.' }
        }
        return { success: true, info: 'Connected to Asite successfully' }
      }

      case 'hammertech': {
        if (!credentials.api_token) {
          return { success: false, error: 'API Bearer Token is required' }
        }
        const htBaseUrl = credentials.base_url || 'https://api.hammertechglobal.com'
        const htRes = await fetch(`${htBaseUrl}/api/v1/projects`, {
          headers: { Authorization: `Bearer ${credentials.api_token}` },
        })
        if (!htRes.ok) {
          return { success: false, error: 'Hammertech API access failed. Check your Bearer Token.' }
        }
        return { success: true, info: 'Connected to Hammertech successfully' }
      }

      case 'ineight': {
        if (!credentials.subscription_key) {
          return { success: false, error: 'Subscription Key (Ocp-Apim-Subscription-Key) is required' }
        }
        if (!credentials.tenant_prefix) {
          return { success: false, error: 'Tenant Prefix is required (your subdomain from *.hds.ineight.com)' }
        }
        const ie8BaseUrl = credentials.environment === 'sandbox'
          ? 'https://developer-sbx.ineight.com'
          : 'https://developer.ineight.com'
        const ie8Res = await fetch(`${ie8BaseUrl}/api/v1/projects`, {
          headers: {
            'Ocp-Apim-Subscription-Key': credentials.subscription_key,
            'X-IN8-TENANT-PREFIX': credentials.tenant_prefix,
          },
        })
        if (!ie8Res.ok) {
          return { success: false, error: 'InEight API access failed. Check your Subscription Key and Tenant Prefix.' }
        }
        return { success: true, info: 'Connected to InEight successfully' }
      }

      default:
        return { success: false, error: 'Unknown platform' }
    }
  } catch (err) {
    return { success: false, error: `Connection test failed: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}
