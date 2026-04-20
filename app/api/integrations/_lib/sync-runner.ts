/* eslint-disable @typescript-eslint/no-explicit-any */
// External platform APIs (Procore, Aconex, Asite, Hammertech, InEight) return
// dynamic shapes with many optional fields. We narrow at the call site rather
// than import full OpenAPI types.
import { createAdminClient } from '@/lib/supabase/admin'

// ─── Types ─────────────────────────────────────────────────────────────────
export interface CorrespondenceItem {
  external_id: string
  subject: string
  content?: string
  from_party: string
  category: 'Incoming' | 'Outgoing' | 'Neutral'
  date: string
  clause_tags?: string[]
  source_type?: string
}

export interface SyncSummary {
  synced: number
  new: number
  total: number
  obligations_created: number
  log_id?: string
}

export interface SyncContext {
  baseUrl: string
  cookieHeader: string | null
  internalSecret: string | null
  userId: string
}

export interface IntegrationRow {
  id: string
  user_id: string
  contract_id: string
  platform: string
  credentials: Record<string, string>
  config: Record<string, string>
  auto_create_obligations: boolean
  total_items_synced: number | null
}

// ─── Core sync ─────────────────────────────────────────────────────────────
export async function runSync(
  integration: IntegrationRow,
  ctx: SyncContext
): Promise<SyncSummary> {
  const admin = createAdminClient()

  const { data: logRow } = await admin
    .from('integration_sync_logs')
    .insert({ integration_id: integration.id, status: 'running' })
    .select('id')
    .single()
  const logId = logRow?.id

  let items: CorrespondenceItem[] = []
  let errorMessage: string | null = null

  try {
    items = await fetchPlatformCorrespondence(
      integration.platform,
      integration.credentials || {},
      integration.config || {}
    )
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'Unknown fetch error'
  }

  let synced = 0
  let newItems = 0
  let obligationsCreated = 0

  for (const item of items) {
    if (!item.external_id || !item.subject) continue

    const { data: existing } = await admin
      .from('correspondence')
      .select('id')
      .eq('contract_id', integration.contract_id)
      .eq('platform', integration.platform)
      .eq('external_id', item.external_id)
      .maybeSingle()

    if (existing) {
      synced++
      continue
    }

    const { data: inserted, error: insertError } = await admin
      .from('correspondence')
      .insert({
        contract_id: integration.contract_id,
        user_id: integration.user_id,
        subject: item.subject,
        content: item.content || '',
        from_party: item.from_party,
        category: item.category || 'Incoming',
        clause_tags: item.clause_tags || [],
        date_received: item.date,
        platform: integration.platform,
        external_id: item.external_id,
        synced_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertError || !inserted) continue
    synced++
    newItems++

    if (integration.auto_create_obligations) {
      const created = await callClassifier(ctx, {
        contract_id: integration.contract_id,
        source_type: 'integration_sync',
        source_id: inserted.id,
        text: item.content || item.subject,
        metadata: {
          platform: integration.platform,
          subject: item.subject,
          from: item.from_party,
          date: item.date,
          type: item.source_type || item.category,
        },
      })
      obligationsCreated += created
    }
  }

  const nowIso = new Date().toISOString()
  const status: 'success' | 'error' | 'partial' =
    errorMessage ? (synced > 0 ? 'partial' : 'error') : 'success'

  await admin
    .from('integrations')
    .update({
      last_synced_at: nowIso,
      last_sync_item_count: newItems,
      total_items_synced: (integration.total_items_synced || 0) + newItems,
      error_message: errorMessage,
      status: errorMessage && synced === 0 ? 'error' : 'connected',
    })
    .eq('id', integration.id)

  if (logId) {
    await admin
      .from('integration_sync_logs')
      .update({
        completed_at: nowIso,
        status,
        items_synced: synced,
        items_new: newItems,
        obligations_created: obligationsCreated,
        error_message: errorMessage,
      })
      .eq('id', logId)
  }

  return {
    synced,
    new: newItems,
    total: items.length,
    obligations_created: obligationsCreated,
    log_id: logId,
  }
}

// ─── Classifier bridge ─────────────────────────────────────────────────────
async function callClassifier(
  ctx: SyncContext,
  payload: {
    contract_id: string
    source_type: string
    source_id: string
    text: string
    metadata: Record<string, unknown>
  }
): Promise<number> {
  try {
    const res = await fetch(`${ctx.baseUrl}/api/classifier/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ctx.cookieHeader ? { cookie: ctx.cookieHeader } : {}),
        ...(ctx.internalSecret ? { 'x-internal-secret': ctx.internalSecret } : {}),
        'x-internal-user-id': ctx.userId,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return 0
    const data = await res.json().catch(() => ({}))
    return typeof data.obligations_created === 'number' ? data.obligations_created : 0
  } catch {
    return 0
  }
}

// ─── Platform dispatcher ───────────────────────────────────────────────────
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

// ─── Procore ───────────────────────────────────────────────────────────────
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

// Procore pagination: page/per_page with Link header for rel="next"
async function procoreGetAll<T = unknown>(
  url: string,
  token: string,
  companyId?: string
): Promise<T[]> {
  const results: T[] = []
  const perPage = 100
  let page = 1
  const maxPages = 20

  while (page <= maxPages) {
    const u = new URL(url)
    u.searchParams.set('per_page', String(perPage))
    u.searchParams.set('page', String(page))
    const headers: Record<string, string> = { Authorization: `Bearer ${token}` }
    if (companyId) headers['Procore-Company-Id'] = companyId

    const res = await fetch(u.toString(), { headers })
    if (!res.ok) break
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) break
    results.push(...data)
    if (data.length < perPage) break
    const link = res.headers.get('link') || res.headers.get('Link') || ''
    if (link && !link.includes('rel="next"')) break
    page++
  }
  return results
}

async function fetchProcoreCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const token = await getProcoreToken(credentials)
  const companyId = config.company_id
  const projectId = config.project_id
  if (!companyId || !projectId) return []

  const items: CorrespondenceItem[] = []
  const base = 'https://api.procore.com'
  const tasks: Array<Promise<void>> = []

  // RFIs
  tasks.push((async () => {
    try {
      const rfis = await procoreGetAll<Record<string, unknown>>(
        `${base}/rest/v1.0/projects/${projectId}/rfis?company_id=${companyId}`,
        token, companyId,
      )
      for (const rfi of rfis) {
        const r = rfi as Record<string, any>
        items.push({
          external_id: `procore-rfi-${r.id}`,
          subject: `RFI #${r.number ?? r.id}: ${r.subject || 'Untitled'}`,
          content: r.description || r.question || '',
          from_party: r.created_by?.name || r.assignee?.name || 'Unknown',
          category: 'Incoming',
          date: r.created_at || r.date_initiated || new Date().toISOString(),
          source_type: 'rfi',
        })
      }
    } catch (e) { console.warn('[procore] rfis failed', e) }
  })())

  // Submittals
  tasks.push((async () => {
    try {
      const subs = await procoreGetAll<Record<string, unknown>>(
        `${base}/rest/v1.0/projects/${projectId}/submittals?company_id=${companyId}`,
        token, companyId,
      )
      for (const s of subs) {
        const sub = s as Record<string, any>
        items.push({
          external_id: `procore-submittal-${sub.id}`,
          subject: `Submittal #${sub.number ?? sub.id}: ${sub.title || 'Untitled'}`,
          content: sub.description || '',
          from_party: sub.submitted_by?.name || sub.responsible_contractor?.name || 'Unknown',
          category: 'Incoming',
          date: sub.created_at || new Date().toISOString(),
          source_type: 'submittal',
        })
      }
    } catch (e) { console.warn('[procore] submittals failed', e) }
  })())

  // Correspondence (Procore correspondence tool)
  tasks.push((async () => {
    try {
      const corr = await procoreGetAll<Record<string, unknown>>(
        `${base}/rest/v1.0/projects/${projectId}/correspondence?company_id=${companyId}`,
        token, companyId,
      )
      for (const c of corr) {
        const co = c as Record<string, any>
        items.push({
          external_id: `procore-corr-${co.id}`,
          subject: `${co.correspondence_type_name || 'Correspondence'} #${co.number ?? co.id}: ${co.title || co.subject || 'Untitled'}`,
          content: co.description || co.body || '',
          from_party: co.created_by?.name || co.from?.name || 'Unknown',
          category: 'Incoming',
          date: co.created_at || co.date || new Date().toISOString(),
          source_type: 'correspondence',
        })
      }
    } catch (e) { console.warn('[procore] correspondence failed', e) }
  })())

  // Daily Logs
  tasks.push((async () => {
    try {
      const logs = await procoreGetAll<Record<string, unknown>>(
        `${base}/rest/v1.0/projects/${projectId}/daily_logs?company_id=${companyId}`,
        token, companyId,
      )
      for (const l of logs) {
        const log = l as Record<string, any>
        items.push({
          external_id: `procore-dailylog-${log.id || log.date}`,
          subject: `Daily Log — ${log.date || log.log_date || 'Entry'}`,
          content: log.notes || log.comments || log.description || '',
          from_party: log.created_by?.name || log.user?.name || 'Site Team',
          category: 'Neutral',
          date: log.date || log.created_at || new Date().toISOString(),
          source_type: 'daily_log',
        })
      }
    } catch (e) { console.warn('[procore] daily_logs failed', e) }
  })())

  // Meetings
  tasks.push((async () => {
    try {
      const meetings = await procoreGetAll<Record<string, unknown>>(
        `${base}/rest/v1.0/projects/${projectId}/meetings?company_id=${companyId}`,
        token, companyId,
      )
      for (const m of meetings) {
        const mt = m as Record<string, any>
        items.push({
          external_id: `procore-meeting-${mt.id}`,
          subject: `Meeting: ${mt.title || mt.name || 'Untitled'}`,
          content: mt.description || mt.agenda || mt.minutes || '',
          from_party: mt.created_by?.name || mt.organizer?.name || 'Project Team',
          category: 'Neutral',
          date: mt.created_at || mt.start_date || mt.meeting_date || new Date().toISOString(),
          source_type: 'meeting',
        })
      }
    } catch (e) { console.warn('[procore] meetings failed', e) }
  })())

  // Directions / Instructions
  tasks.push((async () => {
    try {
      const instr = await procoreGetAll<Record<string, unknown>>(
        `${base}/rest/v1.0/projects/${projectId}/instructions?company_id=${companyId}`,
        token, companyId,
      )
      for (const i of instr) {
        const ins = i as Record<string, any>
        items.push({
          external_id: `procore-instruction-${ins.id}`,
          subject: `Direction #${ins.number ?? ins.id}: ${ins.title || ins.subject || 'Untitled'}`,
          content: ins.description || ins.body || '',
          from_party: ins.created_by?.name || ins.from?.name || 'Principal',
          category: 'Incoming',
          date: ins.created_at || ins.date || new Date().toISOString(),
          source_type: 'direction',
        })
      }
    } catch (e) { console.warn('[procore] instructions failed', e) }
  })())

  // Transmittals
  tasks.push((async () => {
    try {
      const trans = await procoreGetAll<Record<string, unknown>>(
        `${base}/rest/v1.0/projects/${projectId}/transmittals?company_id=${companyId}`,
        token, companyId,
      )
      for (const t of trans) {
        const tr = t as Record<string, any>
        items.push({
          external_id: `procore-transmittal-${tr.id}`,
          subject: `Transmittal #${tr.number ?? tr.id}: ${tr.title || tr.subject || 'Untitled'}`,
          content: tr.description || tr.body || '',
          from_party: tr.sent_by?.name || tr.created_by?.name || 'Unknown',
          category: 'Incoming',
          date: tr.sent_at || tr.created_at || new Date().toISOString(),
          source_type: 'transmittal',
        })
      }
    } catch (e) { console.warn('[procore] transmittals failed', e) }
  })())

  await Promise.all(tasks)
  return items
}

// ─── Aconex ────────────────────────────────────────────────────────────────
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
  for (const m of (data.items || data || [])) {
    const mail = m as Record<string, any>
    items.push({
      external_id: `aconex-mail-${mail.id || mail.mailId}`,
      subject: mail.subject || 'No subject',
      content: mail.body || mail.content || '',
      from_party: mail.from || mail.sender?.name || 'Unknown',
      category: mail.mail_box === 'sentbox' ? 'Outgoing' : 'Incoming',
      date: mail.sentDate || mail.date || new Date().toISOString(),
      source_type: 'mail',
    })
  }
  return items
}

// ─── Asite ─────────────────────────────────────────────────────────────────
async function getAsiteSession(credentials: Record<string, string>): Promise<string> {
  const formBody = new URLSearchParams({ emailId: credentials.email, password: credentials.password })
  const res = await fetch('https://dms.asite.com/apilogin/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  })
  if (!res.ok) throw new Error('Asite login failed')
  const body = await res.text()
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

  const formTypesRes = await fetch(
    `https://dms.asite.com/api/formtypes?workspaceId=${workspaceId}`,
    { headers: { Cookie: `ASessionID="${sessionId}"` } }
  )
  if (!formTypesRes.ok) return []

  const formTypesBody = await formTypesRes.text()
  const items: CorrespondenceItem[] = []
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
        source_type: 'form',
      })
    }
  }
  return items
}

// ─── Hammertech ────────────────────────────────────────────────────────────
async function fetchHammertechCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const projectId = config.project_id
  if (!projectId) return []
  const baseUrl = credentials.base_url || 'https://api.hammertechglobal.com'
  const items: CorrespondenceItem[] = []

  const inspRes = await fetch(
    `${baseUrl}/api/v1/projects/${projectId}/inspections`,
    { headers: { Authorization: `Bearer ${credentials.api_token}` } }
  )
  if (inspRes.ok) {
    const inspData = await inspRes.json()
    for (const i of (inspData.items || inspData || [])) {
      const insp = i as Record<string, any>
      items.push({
        external_id: `hammertech-insp-${insp.id}`,
        subject: `Inspection: ${insp.title || insp.type || 'Unnamed'}`,
        content: insp.description || insp.notes || '',
        from_party: insp.inspector || insp.createdBy || 'Site Team',
        category: 'Incoming',
        date: insp.date || insp.createdDate || new Date().toISOString(),
        source_type: 'inspection',
      })
    }
  }

  const issueRes = await fetch(
    `${baseUrl}/api/v1/projects/${projectId}/issues`,
    { headers: { Authorization: `Bearer ${credentials.api_token}` } }
  )
  if (issueRes.ok) {
    const issueData = await issueRes.json()
    for (const i of (issueData.items || issueData || [])) {
      const issue = i as Record<string, any>
      items.push({
        external_id: `hammertech-issue-${issue.id}`,
        subject: `Issue: ${issue.title || issue.category || 'Unnamed'}`,
        content: issue.description || '',
        from_party: issue.raisedBy || issue.createdBy || 'Site Team',
        category: 'Incoming',
        date: issue.date || issue.createdDate || new Date().toISOString(),
        source_type: 'issue',
      })
    }
  }
  return items
}

// ─── InEight ───────────────────────────────────────────────────────────────
async function fetchInEightCorrespondence(
  credentials: Record<string, string>,
  config: Record<string, string>
): Promise<CorrespondenceItem[]> {
  const projectId = config.project_id
  if (!projectId) return []
  const baseUrl = credentials.environment === 'sandbox'
    ? 'https://developer-sbx.ineight.com'
    : 'https://developer.ineight.com'

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
  for (const p of (data.value || data.items || data || [])) {
    const plan = p as Record<string, any>
    items.push({
      external_id: `ineight-plan-${plan.id || plan.dailyPlanId}`,
      subject: `Daily Plan: ${plan.name || plan.date || 'Unnamed'}`,
      content: plan.notes || plan.description || '',
      from_party: plan.createdBy || plan.superintendent || 'Project Team',
      category: 'Incoming',
      date: plan.date || plan.createdDate || new Date().toISOString(),
      source_type: 'daily_plan',
    })
  }
  return items
}
