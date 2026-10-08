// Astruct is priced per project, per month, in Australian dollars excluding GST,
// with unlimited users. The bands are graduated: each project is charged at the
// rate of the band it falls in, so the 8th project costs the 6–15 rate while the
// first still costs AU$199. One source for the pricing page, the calculator, the
// FAQ and the structured data, so the figures never drift.

export type Tier = { from: number; to: number | null; price: number; label: string }

export const TIERS: Tier[] = [
  { from: 1, to: 1, price: 199, label: 'First project' },
  { from: 2, to: 5, price: 179, label: 'Projects 2–5' },
  { from: 6, to: 15, price: 159, label: 'Projects 6–15' },
  { from: 16, to: 30, price: 139, label: 'Projects 16–30' },
  { from: 31, to: null, price: 119, label: 'Projects 31 and over' },
]

export type Line = { tier: Tier; count: number; subtotal: number }

/** The monthly bill for n projects, band by band. */
export function quote(n: number): { lines: Line[]; total: number; average: number } {
  const projects = Math.max(0, Math.floor(n))
  const lines: Line[] = []
  for (const tier of TIERS) {
    const top = tier.to ?? Infinity
    const count = Math.max(0, Math.min(projects, top) - tier.from + 1)
    if (count > 0) lines.push({ tier, count, subtotal: count * tier.price })
  }
  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  return { lines, total, average: projects ? total / projects : 0 }
}

// Formatted by hand so the server and the browser print the same string.
export function aud(n: number): string {
  const fixed = Number.isInteger(n) ? String(n) : n.toFixed(2)
  const [whole, cents] = fixed.split('.')
  return `AU$${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${cents ? `.${cents}` : ''}`
}

// The worked example used in copy: 8 projects = 199 + 4 × 179 + 3 × 159.
export const EXAMPLE_PROJECTS = 8
export const EXAMPLE_TOTAL = quote(EXAMPLE_PROJECTS).total // 1,392
