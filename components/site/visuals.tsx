import { cn } from '@/lib/utils'
import { JURISDICTIONS } from '@/lib/site/brand'

/* ── SOPA ledger A–K diagram ───────────────────────────────────────────────
   Mirrors the deterministic ledger the product computes (lib/pa/claim-financials).
   Used on the home + payment-claims + features pages. */
const LEDGER: { k: string; label: string; val: string; accent?: boolean; sub?: boolean }[] = [
  { k: 'A', label: 'Original contract works', val: '$248,500.00' },
  { k: 'B', label: 'Approved variations', val: '$31,200.00' },
  { k: 'C', label: 'Total approved (A + B)', val: '$279,700.00', sub: true },
  { k: 'D', label: 'Unapproved variations claimed', val: '$18,000.00' },
  { k: 'F', label: 'Less retention withheld', val: '−$14,885.00' },
  { k: 'H', label: 'Net claimed this period', val: '$293,992.00', sub: true },
  { k: 'I', label: 'GST (10%)', val: '$29,399.20' },
  { k: 'J', label: 'Total payable (incl. GST)', val: '$323,391.20', accent: true },
]

export function LedgerDiagram({ className }: { className?: string }) {
  return (
    <div className={cn('site-card overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-[var(--site-line)] px-5 py-3.5">
        <span className="font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--site-muted)]">
          Payment claim ledger
        </span>
        <span className="site-pill site-pill-tint h-6 text-[11px]">Deterministic</span>
      </div>
      <div className="divide-y divide-[var(--site-line)]">
        {LEDGER.map((r) => (
          <div
            key={r.k}
            className={cn(
              'flex items-center gap-3 px-5 py-2.5',
              r.accent && 'bg-[var(--site-brand-tint)]',
              r.sub && !r.accent && 'bg-[var(--site-paper)]',
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 flex-none items-center justify-center rounded-md font-mono text-[12px] font-semibold',
                r.accent ? 'bg-[var(--site-brand)] text-white' : 'bg-white text-[var(--site-muted)] ring-1 ring-[var(--site-line)]',
              )}
            >
              {r.k}
            </span>
            <span className={cn('flex-1 text-[13.5px]', r.accent ? 'font-semibold text-[var(--site-brand-700)]' : 'text-[var(--site-body)]')}>
              {r.label}
            </span>
            <span className={cn('font-mono text-[13.5px] tabular-nums', r.accent ? 'font-bold text-[var(--site-brand-700)]' : 'text-[var(--site-text)]')}>
              {r.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Statutory deadline timeline ───────────────────────────────────────────
   Business-day window from claim → payment schedule. Days from
   lib/pa/deadlines.ts (10 or 15 by jurisdiction). */
export function DeadlineTimeline({ days = 10, className }: { days?: number; className?: string }) {
  const steps = [
    { t: 'Day 0', label: 'Payment claim served', tone: 'brand' as const },
    { t: `${days} business days`, label: 'Payment schedule due', tone: 'amber' as const },
    { t: 'After that', label: 'Adjudication available', tone: 'ink' as const },
  ]
  return (
    <div className={cn('site-card p-6', className)}>
      <div className="relative flex justify-between">
        <div className="absolute left-5 right-5 top-[11px] h-px bg-[var(--site-line-2)]" />
        {steps.map((s) => (
          <div key={s.label} className="relative z-10 flex w-1/3 flex-col items-center text-center">
            <span
              className={cn(
                'h-[22px] w-[22px] rounded-full ring-4 ring-white',
                s.tone === 'brand' && 'bg-[var(--site-brand)]',
                s.tone === 'amber' && 'bg-[var(--site-amber)]',
                s.tone === 'ink' && 'bg-[var(--site-ink)]',
              )}
            />
            <span className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--site-muted)]">{s.t}</span>
            <span className="mt-1 text-[13px] font-medium leading-tight text-[var(--site-text)]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Jurisdiction coverage grid ────────────────────────────────────────────*/
export function StateCoverage({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4', className)}>
      {JURISDICTIONS.map((j) => (
        <div key={j.code} className="site-card site-card-hover p-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-[18px] font-bold text-[var(--site-text)]">{j.abbr}</span>
            <span className="font-mono text-[11px] text-[var(--site-muted)]">{j.scheduleDays} bd</span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-[var(--site-muted)]">{j.state}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Comparison table ──────────────────────────────────────────────────────*/
type Row = { label: string; astruct: boolean; payapps: boolean | 'partial'; manual: boolean }
const COMPARE: Row[] = [
  { label: 'Two-sided claim & assess workflow', astruct: true, payapps: true, manual: false },
  { label: 'Statutory endorsement on every claim', astruct: true, payapps: 'partial', manual: false },
  { label: 'Business-day deadline engine (per state)', astruct: true, payapps: false, manual: false },
  { label: 'Deterministic A–K ledger maths', astruct: true, payapps: 'partial', manual: false },
  { label: 'Variations, retention & security tracked', astruct: true, payapps: 'partial', manual: false },
  { label: 'NODs, EOTs & delay notices', astruct: true, payapps: false, manual: false },
  { label: 'AI validity check against your contract', astruct: true, payapps: false, manual: false },
  { label: 'Built for all 8 Australian jurisdictions', astruct: true, payapps: 'partial', manual: false },
]

function Cell({ v }: { v: boolean | 'partial' }) {
  if (v === 'partial')
    return <span className="font-mono text-[12px] text-[var(--site-muted)]">Partial</span>
  return v ? (
    <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(18,160,106,.14)' }}>
      <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.2 2.2L9.5 3.8" stroke="#12a06a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  ) : (
    <span className="mx-auto block h-px w-3 bg-[var(--site-line-2)]" />
  )
}

export function ComparisonTable({ className }: { className?: string }) {
  return (
    <div className={cn('site-card overflow-hidden', className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--site-line)] bg-[var(--site-paper)]">
            <th className="px-5 py-4 text-[13px] font-medium text-[var(--site-muted)]">Capability</th>
            <th className="px-3 py-4 text-center text-[13px] font-bold text-[var(--site-brand-700)]">Astruct</th>
            <th className="px-3 py-4 text-center text-[13px] font-medium text-[var(--site-muted)]">Legacy tools</th>
            <th className="px-3 py-4 text-center text-[13px] font-medium text-[var(--site-muted)]">Email & Excel</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--site-line)]">
          {COMPARE.map((r) => (
            <tr key={r.label}>
              <td className="px-5 py-3.5 text-[14px] text-[var(--site-text)]">{r.label}</td>
              <td className="bg-[var(--site-brand-tint)] px-3 py-3.5 text-center"><Cell v={r.astruct} /></td>
              <td className="px-3 py-3.5 text-center"><Cell v={r.payapps} /></td>
              <td className="px-3 py-3.5 text-center"><Cell v={r.manual} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── FAQ (with JSON-LD) ────────────────────────────────────────────────────*/
export function FAQ({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
  return (
    <div className={cn('divide-y divide-[var(--site-line)]', className)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {items.map((i) => (
        <details key={i.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-[var(--site-text)]">
            {i.q}
            <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[var(--site-line)] text-[var(--site-muted)] transition-transform group-open:rotate-45">
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--site-body)]">{i.a}</p>
        </details>
      ))}
    </div>
  )
}

/* ── Claim card visual (reused on feature pages) ───────────────────────────*/
export function ClaimCardVisual({ className }: { className?: string }) {
  return (
    <div className={cn('site-card overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-[var(--site-line)] bg-[var(--site-paper)] px-5 py-3">
        <span className="font-display text-[14px] font-bold text-[var(--site-text)]">Payment Claim #07</span>
        <span className="site-pill h-6 text-[11px]" style={{ borderColor: 'rgba(18,160,106,.3)', color: 'var(--site-green)' }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--site-green)]" /> Compliant
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="rounded-lg border border-[var(--site-line)] bg-white px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--site-muted)]">Statutory endorsement</p>
          <p className="mt-1 text-[12.5px] italic leading-snug text-[var(--site-body)]">
            “This is a payment claim made under the Building and Construction Industry Security of Payment Act 1999 (NSW).”
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'Net claimed', v: '$293,992' },
            { k: 'GST', v: '$29,399' },
            { k: 'Payable', v: '$323,391' },
          ].map((s, i) => (
            <div key={s.k} className={cn('rounded-lg px-3 py-2.5', i === 2 ? 'bg-[var(--site-brand)] text-white' : 'bg-[var(--site-paper)]')}>
              <p className={cn('font-mono text-[10px] uppercase tracking-wide', i === 2 ? 'text-white/70' : 'text-[var(--site-muted)]')}>{s.k}</p>
              <p className={cn('mt-0.5 font-display text-[15px] font-bold tabular-nums', i === 2 ? 'text-white' : 'text-[var(--site-text)]')}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── AI validity-check cards visual ────────────────────────────────────────*/
export function AiCardsVisual({ className }: { className?: string }) {
  const rows = [
    { t: 'Endorsement present', s: 'Matches the NSW Act wording', ok: true },
    { t: 'Within the statutory window', s: 'Schedule due in 10 business days', ok: true },
    { t: 'Variation 12 needs support', s: 'No signed direction found in the contract', ok: false },
  ]
  return (
    <div className={cn('space-y-3', className)}>
      {rows.map((c) => (
        <div key={c.t} className="flex items-start gap-4 rounded-2xl border border-[var(--site-line)] bg-white p-4">
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg"
            style={{ background: c.ok ? 'rgba(18,160,106,.14)' : 'rgba(245,165,36,.16)' }}
          >
            {c.ok ? (
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.2 2.2L9.5 3.8" stroke="#12a06a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4.5v4M8 11h.01" stroke="#d68910" strokeWidth="1.8" strokeLinecap="round" /></svg>
            )}
          </span>
          <div>
            <p className="text-[15px] font-semibold text-[var(--site-text)]">{c.t}</p>
            <p className="text-[13px] text-[var(--site-muted)]">{c.s}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Not-legal-advice disclaimer ───────────────────────────────────────────*/
export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn('rounded-xl border border-[var(--site-line)] bg-[var(--site-paper)] px-5 py-4 text-[13px] leading-relaxed text-[var(--site-muted)]', className)}>
      <strong className="font-semibold text-[var(--site-body)]">General information only.</strong> This page summarises how
      security-of-payment legislation works in general terms. It is not legal advice and may not reflect the latest
      amendments. Always check the legislation and your contract, and get advice for your specific situation.
    </p>
  )
}
