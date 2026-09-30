import { createClient } from '@supabase/supabase-js'

/**
 * Website leads (private-pilot applications and contact requests) are stored in
 * the `leads` table of the astruct-app Supabase project (Sydney). The site writes
 * with that project's public anon key; row-level security allows inserting a
 * pilot or contact lead and nothing else, so the key cannot read anything back.
 * Schema: supabase/astruct-app/20260929_leads.sql.
 */
export type LeadRow = {
  type: 'pilot' | 'contact' | 'waitlist'
  email: string
  name?: string | null
  company?: string | null
  role?: string | null
  company_size?: string | null
  projects?: string | null
  contract_forms?: string | null
  mail_platform?: string | null
  admin_consent?: string | null
  pain?: string | null
  jurisdiction?: string | null
  message?: string | null
  source?: string | null
  user_agent?: string | null
  meta?: Record<string, unknown>
}

export function leadsConfigured() {
  return Boolean(process.env.LEADS_SUPABASE_URL && process.env.LEADS_SUPABASE_ANON_KEY)
}

export async function insertLead(row: LeadRow): Promise<{ ok: true } | { ok: false; code: string }> {
  const url = process.env.LEADS_SUPABASE_URL?.trim()
  const key = process.env.LEADS_SUPABASE_ANON_KEY?.trim()
  if (!url || !key) return { ok: false, code: 'not_configured' }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error } = await db.from('leads').insert(row)
  if (error) return { ok: false, code: error.code || 'insert_failed' }
  return { ok: true }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Trim a free-text value to a maximum length; empty becomes null. */
export function clip(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const t = v.replace(/\s+\n/g, '\n').trim()
  return t ? t.slice(0, max) : null
}
