export const DOCUMENT_CATEGORIES = [
  { value: '01_contract', label: '01. Contract', color: 'blue' },
  { value: '02_tender', label: '02. Tender', color: 'purple' },
  { value: '03_drawings', label: '03. Drawings', color: 'cyan' },
  { value: '04_specifications', label: '04. Specifications', color: 'teal' },
  { value: '05_project_letters', label: '05. Project Letters', color: 'indigo' },
  { value: '06_rfi', label: '06. RFIs', color: 'violet' },
  { value: '07_variations', label: '07. Variations', color: 'amber' },
  { value: '08_nod', label: '08. Notices of Delay', color: 'orange' },
  { value: '09_eot', label: '09. EOT Claims', color: 'rose' },
  { value: '10_payment_claims', label: '10. Payment Claims', color: 'emerald' },
  { value: '11_payment_schedules', label: '11. Payment Schedules', color: 'green' },
  { value: '12_third_party_invoices', label: '12. Third-Party Invoices', color: 'yellow' },
  { value: '13_other', label: '13. Other / Misc.', color: 'zinc' },
] as const

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]['value']

export const CATEGORY_VALUES = DOCUMENT_CATEGORIES.map((c) => c.value)

export function getCategoryLabel(value: string): string {
  return DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function getCategoryColor(value: string): string {
  return DOCUMENT_CATEGORIES.find((c) => c.value === value)?.color ?? 'zinc'
}

export const BADGE_COLORS: Record<string, string> = {
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  teal: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  violet: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  rose: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  green: 'bg-green-500/15 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  zinc: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20',
}
