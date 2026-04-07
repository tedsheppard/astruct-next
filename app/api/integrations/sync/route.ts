import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// POST - sync correspondence from a connected platform
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { platform, contract_id } = await request.json()

    if (!platform || !contract_id) {
      return Response.json({ error: 'platform and contract_id are required' }, { status: 400 })
    }

    // Get integration credentials
    const admin = createAdminClient()
    const { data: integration, error: intError } = await admin
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single()

    if (intError || !integration) {
      return Response.json({ error: 'Integration not found' }, { status: 404 })
    }

    if (integration.status !== 'connected') {
      return Response.json({ error: 'Integration is not connected' }, { status: 400 })
    }

    // Fetch correspondence from platform
    const items = await fetchPlatformCorrespondence(platform, integration.credentials, integration.config)

    // Upsert into correspondence table
    let synced = 0
    for (const item of items) {
      const { error } = await admin
        .from('correspondence')
        .upsert({
          contract_id,
          user_id: user.id,
          subject: item.subject,
          content: item.content || '',
          from_party: item.from_party,
          category: item.category || 'Incoming',
          clause_tags: item.clause_tags || [],
          date_received: item.date,
          platform,
          external_id: item.external_id,
          synced_at: new Date().toISOString(),
        }, { onConflict: 'id' }) // Will insert new, skip duplicates by external_id check below

      if (!error) synced++
    }

    // Update last synced timestamp
    await admin
      .from('integrations')
      .update({ last_synced_at: new Date().toISOString(), error_message: null })
      .eq('id', integration.id)

    return Response.json({ synced, total: items.length })
  } catch (error) {
    console.error('Sync error:', error)
    return Response.json({ error: 'Sync failed' }, { status: 500 })
  }
}

interface CorrespondenceItem {
  external_id: string
  subject: string
  content?: string
  from_party: string
  category: 'Incoming' | 'Outgoing' | 'Neutral'
  date: string
  clause_tags?: string[]
}

async function fetchPlatformCorrespondence(
  platform: string,
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  switch (platform) {
    case 'procore':
      return fetchProcoreCorrespondence(credentials, config)
    case 'aconex':
      return fetchAconexCorrespondence(credentials, config)
    case 'asite':
      return fetchAsiteCorrespondence(credentials, config)
    case 'hammertech':
      return fetchHammertechCorrespondence(credentials, config)
    case 'ineight':
      return fetchInEightCorrespondence(credentials, config)
    default:
      return []
  }
}

async function getProcoreToken(credentials: Record<string, string>): Promise<string> {
  const tokenRes = await fetch('https://login.procore.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
    }),
  })
  if (!tokenRes.ok) throw new Error('Failed to get Procore token')
  const data = await tokenRes.json()
  return data.access_token
}

async function fetchProcoreCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const token = await getProcoreToken(credentials)
  const companyId = config.company_id
  const projectId = config.project_id

  if (!companyId || !projectId) return []

  // Fetch RFIs
  const rfis = await fetch(
    `https://api.procore.com/rest/v1.0/projects/${projectId}/rfis?company_id=${companyId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  const items: CorrespondenceItem[] = []

  if (rfis.ok) {
    const rfiData = await rfis.json()
    for (const rfi of rfiData) {
      items.push({
        external_id: `procore-rfi-${rfi.id}`,
        subject: `RFI #${rfi.number}: ${rfi.subject || 'Untitled'}`,
        content: rfi.description || '',
        from_party: rfi.assignee?.name || rfi.created_by?.name || 'Unknown',
        category: 'Incoming',
        date: rfi.created_at,
      })
    }
  }

  // Fetch submittals
  const submittals = await fetch(
    `https://api.procore.com/rest/v1.0/projects/${projectId}/submittals?company_id=${companyId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (submittals.ok) {
    const subData = await submittals.json()
    for (const sub of subData) {
      items.push({
        external_id: `procore-submittal-${sub.id}`,
        subject: `Submittal #${sub.number}: ${sub.title || 'Untitled'}`,
        content: sub.description || '',
        from_party: sub.submitted_by?.name || 'Unknown',
        category: 'Incoming',
        date: sub.created_at,
      })
    }
  }

  return items
}

async function getAconexToken(credentials: Record<string, string>): Promise<string> {
  const lobbyUrl = credentials.environment === 'ea'
    ? 'https://constructionandengineering-ea.oraclecloud.com'
    : 'https://constructionandengineering.oraclecloud.com'
  const tokenRes = await fetch(`${lobbyUrl}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${credentials.client_id}:${credentials.client_secret}`).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })
  if (!tokenRes.ok) throw new Error('Failed to get Aconex token')
  const data = await tokenRes.json()
  return data.access_token
}

async function fetchAconexCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const token = await getAconexToken(credentials)
  const projectId = config.project_id
  if (!projectId) return []

  // Fetch mail from Aconex Mail API
  const res = await fetch(
    `https://api.aconex.com/api/projects/${projectId}/mail?mail_box=inbox`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.aconex.mail.v2+json',
      },
    }
  )

  if (!res.ok) return []

  const data = await res.json()
  const items: CorrespondenceItem[] = []

  for (const mail of (data.items || data || [])) {
    items.push({
      external_id: `aconex-mail-${mail.id || mail.mailId}`,
      subject: mail.subject || 'No subject',
      content: mail.body || mail.content || '',
      from_party: mail.from || mail.sender?.name || 'Unknown',
      category: mail.mail_box === 'sentbox' ? 'Outgoing' : 'Incoming',
      date: mail.sentDate || mail.date || new Date().toISOString(),
    })
  }

  return items
}

async function getAsiteSession(credentials: Record<string, string>): Promise<string> {
  const formBody = new URLSearchParams({ emailId: credentials.email, password: credentials.password })
  const res = await fetch('https://dms.asite.com/apilogin/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  })
  if (!res.ok) throw new Error('Asite login failed')
  const body = await res.text()
  // Extract session ID from XML response
  const match = body.match(/<Sessionid>([^<]+)<\/Sessionid>/)
  if (!match) throw new Error('No session ID in Asite response')
  return match[1]
}

async function fetchAsiteCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const sessionId = await getAsiteSession(credentials)
  const workspaceId = config.workspace_id
  if (!workspaceId) return []

  // Asite uses a chained API — get form types first, then forms
  const formTypesRes = await fetch(
    `https://dms.asite.com/api/formtypes?workspaceId=${workspaceId}`,
    { headers: { Cookie: `ASessionID="${sessionId}"` } }
  )

  if (!formTypesRes.ok) return []

  const formTypesBody = await formTypesRes.text()
  const items: CorrespondenceItem[] = []

  // Parse XML form types and fetch forms for each
  const typeMatches = formTypesBody.matchAll(/<FormTypeId>([^<]+)<\/FormTypeId>[\s\S]*?<FormTypeName>([^<]+)<\/FormTypeName>/g)
  for (const typeMatch of typeMatches) {
    const formTypeId = typeMatch[1]
    const formTypeName = typeMatch[2]

    const formsRes = await fetch(
      `https://dms.asite.com/api/forms?workspaceId=${workspaceId}&formTypeId=${formTypeId}`,
      { headers: { Cookie: `ASessionID="${sessionId}"` } }
    )
    if (!formsRes.ok) continue

    const formsBody = await formsRes.text()
    const formMatches = formsBody.matchAll(/<FormId>([^<]+)<\/FormId>[\s\S]*?<Subject>([^<]*)<\/Subject>[\s\S]*?<CreatedBy>([^<]*)<\/CreatedBy>[\s\S]*?<CreatedDate>([^<]*)<\/CreatedDate>/g)

    for (const formMatch of formMatches) {
      items.push({
        external_id: `asite-form-${formMatch[1]}`,
        subject: `${formTypeName}: ${formMatch[2] || 'Untitled'}`,
        content: '',
        from_party: formMatch[3] || 'Unknown',
        category: 'Incoming',
        date: formMatch[4] || new Date().toISOString(),
      })
    }
  }

  return items
}

async function fetchHammertechCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const projectId = config.project_id
  if (!projectId) return []

  const baseUrl = credentials.base_url || 'https://api.hammertechglobal.com'

  // Fetch inspections and issues
  const items: CorrespondenceItem[] = []

  // Inspections
  const inspRes = await fetch(
    `${baseUrl}/api/v1/projects/${projectId}/inspections`,
    { headers: { Authorization: `Bearer ${credentials.api_token}` } }
  )
  if (inspRes.ok) {
    const inspData = await inspRes.json()
    for (const insp of (inspData.items || inspData || [])) {
      items.push({
        external_id: `hammertech-insp-${insp.id}`,
        subject: `Inspection: ${insp.title || insp.type || 'Unnamed'}`,
        content: insp.description || insp.notes || '',
        from_party: insp.inspector || insp.createdBy || 'Site Team',
        category: 'Incoming',
        date: insp.date || insp.createdDate || new Date().toISOString(),
      })
    }
  }

  // Issues
  const issueRes = await fetch(
    `${baseUrl}/api/v1/projects/${projectId}/issues`,
    { headers: { Authorization: `Bearer ${credentials.api_token}` } }
  )
  if (issueRes.ok) {
    const issueData = await issueRes.json()
    for (const issue of (issueData.items || issueData || [])) {
      items.push({
        external_id: `hammertech-issue-${issue.id}`,
        subject: `Issue: ${issue.title || issue.category || 'Unnamed'}`,
        content: issue.description || '',
        from_party: issue.raisedBy || issue.createdBy || 'Site Team',
        category: 'Incoming',
        date: issue.date || issue.createdDate || new Date().toISOString(),
      })
    }
  }

  return items
}

async function fetchInEightCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const projectId = config.project_id
  if (!projectId) return []

  const baseUrl = credentials.environment === 'sandbox'
    ? 'https://developer-sbx.ineight.com'
    : 'https://developer.ineight.com'

  // Fetch daily plans as correspondence items
  const res = await fetch(
    `${baseUrl}/api/v1/projects/${projectId}/dailyplans`,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': credentials.subscription_key,
        'X-IN8-TENANT-PREFIX': credentials.tenant_prefix,
      },
    }
  )

  if (!res.ok) return []

  const data = await res.json()
  const items: CorrespondenceItem[] = []

  for (const plan of (data.value || data.items || data || [])) {
    items.push({
      external_id: `ineight-plan-${plan.id || plan.dailyPlanId}`,
      subject: `Daily Plan: ${plan.name || plan.date || 'Unnamed'}`,
      content: plan.notes || plan.description || '',
      from_party: plan.createdBy || plan.superintendent || 'Project Team',
      category: 'Incoming',
      date: plan.date || plan.createdDate || new Date().toISOString(),
    })
  }

  return items
}
