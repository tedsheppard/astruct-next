import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { isDevAuthorized } from '@/lib/dev-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Per-million-token AUD pricing for the models we currently surface in the
// picker. Used for rough cost estimates on the dashboard. These mirror the
// vendor pricing pages — keep loosely in sync.
const MODEL_PRICING_AUD: Record<string, { in: number; out: number }> = {
  'claude-haiku-4-5-20251001': { in: 1.5, out: 7.5 },
  'claude-sonnet-4-6': { in: 4.5, out: 22.5 },
  'claude-opus-4-6': { in: 7.5, out: 37.5 },
  'claude-opus-4-7': { in: 7.5, out: 37.5 },
  'gpt-5-nano': { in: 0.08, out: 0.6 },
  'gpt-5.4-nano': { in: 0.15, out: 1.2 },
  'gpt-5-mini': { in: 0.4, out: 3 },
  'gpt-5.4-mini': { in: 0.6, out: 4.5 },
  'gpt-5.4': { in: 3, out: 15 },
  'gpt-5.5': { in: 7.5, out: 45 },
}

function fmtNum(n: number): string {
  return new Intl.NumberFormat('en-AU').format(Math.round(n))
}
function fmtAud(cents: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(cents / 100)
}
function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h ago`
  return `${Math.floor(ms / 86_400_000)}d ago`
}

function tokenCostCents(model: string, inputTok: number, outputTok: number): number {
  const p = MODEL_PRICING_AUD[model]
  if (!p) return 0
  // pricing is AUD per million tokens; output is cents
  const aud = (inputTok / 1_000_000) * p.in + (outputTok / 1_000_000) * p.out
  return Math.round(aud * 100)
}

export default async function DevDashboard() {
  if (!(await isDevAuthorized())) redirect('/dev/login')

  const sb = createAdminClient()
  const now = Date.now()
  const dayAgo = new Date(now - 86_400_000).toISOString()
  const weekAgo = new Date(now - 7 * 86_400_000).toISOString()
  const monthAgo = new Date(now - 30 * 86_400_000).toISOString()

  // Pull everything in parallel.
  const [
    usersRes,
    profilesAll,
    profilesNewDay,
    profilesNewWeek,
    contractsAll,
    contractsNewDay,
    documentsAll,
    subsActive,
    tokenEvents,
    tokenEventsRecent,
    tokenEventsMonth,
    chatMessagesMonth,
    recentChats,
  ] = await Promise.all([
    sb.auth.admin.listUsers({ perPage: 1000 }),
    sb.from('profiles').select('id', { count: 'exact', head: true }),
    sb.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', dayAgo),
    sb.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', weekAgo),
    sb.from('contracts').select('id', { count: 'exact', head: true }),
    sb.from('contracts').select('id', { count: 'exact', head: true }).gte('created_at', dayAgo),
    sb.from('documents').select('id', { count: 'exact', head: true }),
    sb.from('subscriptions').select('user_id, contract_quantity, status, current_period_end').eq('status', 'active'),
    sb.from('token_events').select('input_tokens, output_tokens, model, feature, created_at, user_id, contract_id').gte('created_at', weekAgo),
    sb.from('token_events').select('id, input_tokens, output_tokens, model, feature, created_at, user_id, contract_id').order('created_at', { ascending: false }).limit(20),
    sb.from('token_events').select('input_tokens, output_tokens, model').gte('created_at', monthAgo),
    sb.from('chat_messages').select('id', { count: 'exact', head: true }).gte('created_at', monthAgo),
    sb.from('chat_sessions').select('id, contract_id, user_id, title, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  // Sign-up rollups
  const allUsers = usersRes.data?.users || []
  const anonCount = allUsers.filter(u => u.is_anonymous).length
  const realCount = allUsers.length - anonCount
  const signupsLast24h = allUsers.filter(u => new Date(u.created_at).getTime() > now - 86_400_000).length
  const signupsLast7d = allUsers.filter(u => new Date(u.created_at).getTime() > now - 7 * 86_400_000).length

  // Subscription rollups
  const activeSubs = subsActive.data || []
  const totalContractSlots = activeSubs.reduce((acc, s) => acc + (s.contract_quantity || 1), 0)
  const mrrCents = totalContractSlots * 2995

  // Token rollups (week)
  const eventsWeek = tokenEvents.data || []
  let tokensInWeek = 0, tokensOutWeek = 0, costCentsWeek = 0
  const byModel = new Map<string, { in: number; out: number; calls: number; cost: number }>()
  const byFeature = new Map<string, number>()
  for (const e of eventsWeek) {
    tokensInWeek += e.input_tokens || 0
    tokensOutWeek += e.output_tokens || 0
    const c = tokenCostCents(e.model, e.input_tokens || 0, e.output_tokens || 0)
    costCentsWeek += c
    const m = byModel.get(e.model) || { in: 0, out: 0, calls: 0, cost: 0 }
    m.in += e.input_tokens || 0; m.out += e.output_tokens || 0; m.calls += 1; m.cost += c
    byModel.set(e.model, m)
    byFeature.set(e.feature || 'unknown', (byFeature.get(e.feature || 'unknown') || 0) + 1)
  }

  // Token rollup (month) — for the "approx monthly burn" headline
  const eventsMonth = tokenEventsMonth.data || []
  let costCentsMonth = 0
  for (const e of eventsMonth) {
    costCentsMonth += tokenCostCents(e.model, e.input_tokens || 0, e.output_tokens || 0)
  }

  // Recent signups — most recent 15
  const recentSignups = [...allUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15)
  const profileMap = new Map<string, { name: string | null; email: string | null }>()
  if (recentSignups.length > 0) {
    const ids = recentSignups.map(u => u.id)
    const { data: profs } = await sb.from('profiles').select('id, name, email').in('id', ids)
    for (const p of (profs || [])) profileMap.set(p.id, { name: p.name, email: p.email })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-xl font-semibold">Astruct ops</h1>
            <p className="text-xs text-white/40 mt-0.5">Live data — refresh page to update.</p>
          </div>
          <a href="/dev/logout" className="text-xs text-white/40 hover:text-white">Sign out</a>
        </div>

        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total signups" value={fmtNum(allUsers.length)} sub={`${realCount} real · ${anonCount} anon`} />
          <Stat label="New (24h)" value={fmtNum(signupsLast24h)} sub={`${signupsLast7d} this week`} />
          <Stat label="Paid subs" value={fmtNum(activeSubs.length)} sub={`${totalContractSlots} slot${totalContractSlots === 1 ? '' : 's'}`} highlight />
          <Stat label="MRR (AUD)" value={fmtAud(mrrCents)} sub="Active subs × $29.95" highlight />
        </div>

        {/* Activity stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Contracts" value={fmtNum(contractsAll.count || 0)} sub={`+${contractsNewDay.count || 0} today`} />
          <Stat label="Documents" value={fmtNum(documentsAll.count || 0)} sub="Across all contracts" />
          <Stat label="Chat msgs (30d)" value={fmtNum(chatMessagesMonth.count || 0)} sub="User + assistant" />
          <Stat label="LLM cost (30d)" value={fmtAud(costCentsMonth)} sub={`${fmtAud(costCentsWeek)} this week`} />
        </div>

        {/* LLM by model */}
        <Section title="LLM activity by model — last 7 days">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/40 text-xs uppercase tracking-wider">
                <tr className="border-b border-white/10">
                  <th className="text-left font-normal py-2">Model</th>
                  <th className="text-right font-normal py-2">Calls</th>
                  <th className="text-right font-normal py-2">Input tok</th>
                  <th className="text-right font-normal py-2">Output tok</th>
                  <th className="text-right font-normal py-2">Cost (AUD)</th>
                </tr>
              </thead>
              <tbody>
                {[...byModel.entries()].sort((a, b) => b[1].cost - a[1].cost).map(([model, m]) => (
                  <tr key={model} className="border-b border-white/[0.06]">
                    <td className="py-2 font-mono text-xs">{model}</td>
                    <td className="py-2 text-right tabular-nums">{fmtNum(m.calls)}</td>
                    <td className="py-2 text-right tabular-nums text-white/60">{fmtNum(m.in)}</td>
                    <td className="py-2 text-right tabular-nums text-white/60">{fmtNum(m.out)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtAud(m.cost)}</td>
                  </tr>
                ))}
                {byModel.size === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-white/40 text-xs">No LLM activity in the last 7 days.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/15">
                  <td className="py-2 text-xs uppercase tracking-wider text-white/40">Total</td>
                  <td className="py-2 text-right tabular-nums font-medium">{fmtNum(eventsWeek.length)}</td>
                  <td className="py-2 text-right tabular-nums font-medium">{fmtNum(tokensInWeek)}</td>
                  <td className="py-2 text-right tabular-nums font-medium">{fmtNum(tokensOutWeek)}</td>
                  <td className="py-2 text-right tabular-nums font-medium">{fmtAud(costCentsWeek)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Section>

        {/* Recent signups */}
        <Section title="Recent signups">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/40 text-xs uppercase tracking-wider">
                <tr className="border-b border-white/10">
                  <th className="text-left font-normal py-2">Name</th>
                  <th className="text-left font-normal py-2">Email</th>
                  <th className="text-left font-normal py-2">Type</th>
                  <th className="text-left font-normal py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map(u => {
                  const p = profileMap.get(u.id)
                  return (
                    <tr key={u.id} className="border-b border-white/[0.06]">
                      <td className="py-2">{p?.name || <span className="text-white/30">—</span>}</td>
                      <td className="py-2 font-mono text-xs text-white/70">{p?.email || u.email || <span className="text-white/30">guest</span>}</td>
                      <td className="py-2">
                        {u.is_anonymous ? (
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-white/50">Anon</span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">Real</span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-white/50">{relTime(u.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Recent LLM calls */}
        <Section title="Recent LLM calls — last 20">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/40 text-xs uppercase tracking-wider">
                <tr className="border-b border-white/10">
                  <th className="text-left font-normal py-2">When</th>
                  <th className="text-left font-normal py-2">Model</th>
                  <th className="text-left font-normal py-2">Feature</th>
                  <th className="text-right font-normal py-2">In</th>
                  <th className="text-right font-normal py-2">Out</th>
                  <th className="text-right font-normal py-2">Cost</th>
                  <th className="text-left font-normal py-2 pl-4">User</th>
                </tr>
              </thead>
              <tbody>
                {(tokenEventsRecent.data || []).map(e => (
                  <tr key={e.id} className="border-b border-white/[0.06]">
                    <td className="py-2 text-xs text-white/50">{relTime(e.created_at)}</td>
                    <td className="py-2 font-mono text-xs">{e.model}</td>
                    <td className="py-2 text-xs">{e.feature}</td>
                    <td className="py-2 text-right tabular-nums text-white/60 text-xs">{fmtNum(e.input_tokens || 0)}</td>
                    <td className="py-2 text-right tabular-nums text-white/60 text-xs">{fmtNum(e.output_tokens || 0)}</td>
                    <td className="py-2 text-right tabular-nums text-xs">{fmtAud(tokenCostCents(e.model, e.input_tokens || 0, e.output_tokens || 0))}</td>
                    <td className="py-2 pl-4 font-mono text-[10px] text-white/40">{e.user_id?.slice(0, 8)}</td>
                  </tr>
                ))}
                {(tokenEventsRecent.data?.length || 0) === 0 && (
                  <tr><td colSpan={7} className="py-4 text-center text-white/40 text-xs">No calls yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Recent chats */}
        <Section title="Recent chat sessions">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/40 text-xs uppercase tracking-wider">
                <tr className="border-b border-white/10">
                  <th className="text-left font-normal py-2">Started</th>
                  <th className="text-left font-normal py-2">Title</th>
                  <th className="text-left font-normal py-2">User</th>
                </tr>
              </thead>
              <tbody>
                {(recentChats.data || []).map(s => (
                  <tr key={s.id} className="border-b border-white/[0.06]">
                    <td className="py-2 text-xs text-white/50">{relTime(s.created_at)}</td>
                    <td className="py-2 text-xs">{s.title || <span className="text-white/30">untitled</span>}</td>
                    <td className="py-2 font-mono text-[10px] text-white/40">{s.user_id?.slice(0, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <p className="text-[10px] text-white/30 pt-4">
          Cost estimates use approximate AUD-per-MTok pricing for each model
          and are not invoice-grade — they exist to flag runaway burn, not to
          reconcile against vendor bills.
        </p>
      </div>
    </div>
  )
}

function Stat({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border ${highlight ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-white/10 bg-white/[0.02]'} p-4`}>
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="text-2xl font-semibold tabular-nums mt-1">{value}</div>
      {sub && <div className="text-xs text-white/50 mt-0.5">{sub}</div>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-white/80">{title}</h2>
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">{children}</div>
    </section>
  )
}
