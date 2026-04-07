import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

// GET - list user's integrations
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('integrations')
      .select('id, platform, status, config, last_synced_at, error_message, created_at')
      .eq('user_id', user.id)

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

    const { platform, credentials, config } = await request.json()

    if (!platform) {
      return Response.json({ error: 'platform is required' }, { status: 400 })
    }

    const validPlatforms = ['procore', 'aconex', 'asite', 'hammertech', 'ineight']
    if (!validPlatforms.includes(platform)) {
      return Response.json({ error: 'Invalid platform' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Validate credentials by testing connection
    const testResult = await testPlatformConnection(platform, credentials)

    const integrationData = {
      user_id: user.id,
      platform,
      status: testResult.success ? 'connected' : 'error',
      credentials: credentials || {},
      config: config || {},
      error_message: testResult.success ? null : testResult.error,
      updated_at: new Date().toISOString(),
    }

    // Upsert (insert or update if exists)
    const { data, error } = await admin
      .from('integrations')
      .upsert(integrationData, { onConflict: 'user_id,platform' })
      .select('id, platform, status, config, last_synced_at, error_message')
      .single()

    if (error) throw error

    return Response.json({
      integration: data,
      test_result: testResult,
    })
  } catch (error) {
    console.error('Integration save error:', error)
    return Response.json({ error: 'Failed to save integration' }, { status: 500 })
  }
}

// DELETE - remove an integration
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { platform } = await request.json()

    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('user_id', user.id)
      .eq('platform', platform)

    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    console.error('Integration delete error:', error)
    return Response.json({ error: 'Failed to delete integration' }, { status: 500 })
  }
}

// Test platform connection with provided credentials
async function testPlatformConnection(
  platform: string,
  credentials: Record<string, string>
): Promise<{ success: boolean; error?: string; info?: string }> {
  try {
    switch (platform) {
      case 'procore': {
        // Procore uses OAuth2 - test with access token
        if (!credentials.client_id || !credentials.client_secret) {
          return { success: false, error: 'Client ID and Client Secret are required' }
        }
        // Try to get an access token using client credentials
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
        // Test API access
        const testRes = await fetch('https://api.procore.com/rest/v1.0/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        if (!testRes.ok) {
          return { success: false, error: 'Could not verify Procore API access' }
        }
        return { success: true, info: 'Connected to Procore successfully' }
      }

      case 'aconex': {
        // Aconex uses OAuth2 via Oracle Lobby
        if (!credentials.client_id || !credentials.client_secret) {
          return { success: false, error: 'OAuth Client ID and Client Secret are required' }
        }
        // Test token endpoint with client credentials
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
        // Test API access
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
        // Asite uses session-based auth with email/password
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
        // Check response for session ID
        const asiteBody = await asiteRes.text()
        if (!asiteBody.includes('Sessionid')) {
          return { success: false, error: 'Asite login failed — no session returned.' }
        }
        return { success: true, info: 'Connected to Asite successfully' }
      }

      case 'hammertech': {
        // Hammertech Integration API uses Bearer token auth
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
        // InEight uses Subscription Key + Tenant Prefix
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
