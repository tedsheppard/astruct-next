// The project brain, as geometry. Everything here is computed once, on the
// server, from a fixed seed, so the hero renders the same complete frame on
// every request and before any script runs. The drawing is a brain seen from
// above: two hemispheres, a mesh of nodes in each, the sources wired into the
// left and what needs action wired out of the right.

export const W = 1200
export const H = 600
const CX = 600
const CY = 292
const GAP = 6 // half the gap between the hemispheres
const HW = 92 // half the width of one hemisphere
const HH = 170 // half its height

export type Pt = { x: number; y: number }
export type Node = Pt & { r: number; hub: boolean; d: number }

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const r1 = (n: number) => Math.round(n * 10) / 10

/** One hemisphere's outline. side -1 is the left, 1 the right. */
function hemisphere(side: -1 | 1, k = 1, wobble = 1, phase = 0): Pt[] {
  const cx = CX + side * (GAP + HW)
  const pts: Pt[] = []
  const N = 220
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    // Lateral side (away from the midline) is rounder; the medial side is flat.
    const lateral = side * c > 0
    const p = lateral ? 2.15 : 4.2
    let x = Math.sign(c) * Math.pow(Math.abs(c), 2 / p)
    let y = Math.sign(s) * Math.pow(Math.abs(s), 2 / 2.25)
    // Narrower at the front (top), fuller at the back.
    x *= 1 + 0.1 * y
    // Gyri: bumps on the outer surface, fading out toward the midline.
    const outer = Math.max(0, side * c) ** 0.5 * 0.85 + Math.abs(s) ** 3 * 0.35
    const bump = wobble * outer * (0.03 * Math.sin(12 * a + phase) + 0.009 * Math.sin(25 * a + 1.3 + phase))
    x = x * (1 + bump)
    y = y * (1 + bump * 0.7)
    pts.push({ x: cx + x * HW * k, y: CY + y * HH * k })
  }
  return pts
}

function smoothPath(pts: Pt[], closed = true): string {
  // Catmull-Rom through the points, as cubic Béziers.
  const n = pts.length
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  let d = `M${r1(pts[0].x)} ${r1(pts[0].y)}`
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += `C${r1(c1.x)} ${r1(c1.y)} ${r1(c2.x)} ${r1(c2.y)} ${r1(p2.x)} ${r1(p2.y)}`
  }
  return closed ? d + 'Z' : d
}

function inside(poly: Pt[], p: Pt): boolean {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) c = !c
  }
  return c
}

/** The x where a horizontal line at y meets the outline, on the outer side. */
function edgeAt(poly: Pt[], y: number, side: -1 | 1): number {
  let best = side < 0 ? Infinity : -Infinity
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j]
    if ((a.y > y) !== (b.y > y)) {
      const x = a.x + ((y - a.y) / (b.y - a.y)) * (b.x - a.x)
      best = side < 0 ? Math.min(best, x) : Math.max(best, x)
    }
  }
  return best
}

function mesh(poly: Pt[], seed: number) {
  const rand = rng(seed)
  const inner = poly.map((p) => p) // sampling region
  const xs = inner.map((p) => p.x), ys = inner.map((p) => p.y)
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  const nodes: Node[] = []
  const MIN = 19
  for (let tries = 0; tries < 9000 && nodes.length < 92; tries++) {
    const p = { x: x0 + rand() * (x1 - x0), y: y0 + rand() * (y1 - y0) }
    if (!inside(inner, p)) continue
    // Keep clear of the outline.
    let clear = true
    for (const q of inner) if ((q.x - p.x) ** 2 + (q.y - p.y) ** 2 < 9 * 9) { clear = false; break }
    if (!clear) continue
    if (nodes.some((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < MIN * MIN)) continue
    const hub = rand() < 0.14
    nodes.push({ x: r1(p.x), y: r1(p.y), r: hub ? 3.1 : r1(1.5 + rand() * 0.9), hub, d: r1(rand() * 6) })
  }
  const edges: [Pt, Pt][] = []
  const seen = new Set<string>()
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .filter((o) => o.j !== i && o.d < 40 * 40)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
    for (const o of near) {
      const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([a, nodes[o.j]])
    }
  })
  return { nodes, edges }
}

export type Source = { label: string; meta: string; icon: 'contract' | 'mail' | 'si' | 'programme' | 'rfi' | 'drawing' | 'outlook' }
export type Output = { kind: string; title: string; meta: string; c: 'rose' | 'amber' | 'blue' | 'violet' }

// Demo project, fictional. Dates are counted from Monday 12 October 2026.
export const SOURCES: Source[] = [
  { label: 'Contract AS 4000', meta: 'Head contract · 186 pages', icon: 'contract' },
  { label: 'Correspondence', meta: '2,318 letters and emails', icon: 'mail' },
  { label: 'Site instructions', meta: 'SI-001 to SI-014', icon: 'si' },
  { label: 'Programme', meta: 'Rev 8 · critical path', icon: 'programme' },
  { label: 'RFIs', meta: 'RFI-001 to RFI-086', icon: 'rfi' },
  { label: 'Drawings', meta: '1,204 sheets', icon: 'drawing' },
  { label: 'Outlook', meta: '3 mailboxes connected', icon: 'outlook' },
]

export const OUTPUTS: Output[] = [
  { kind: 'Notice of delay', title: 'Due Fri 16 Oct, cl 34.2', meta: 'Wet weather 9 to 12 Oct · draft ready', c: 'rose' },
  { kind: 'Variation', title: 'SI-014 facade brackets, $48,200', meta: 'Direction outside scope · cl 36.1', c: 'amber' },
  { kind: 'Payment claim', title: 'Due Wed 28 Oct, cl 37.1', meta: 'Reference date · BIF Act 2017 (Qld)', c: 'blue' },
  { kind: 'EOT claim', title: 'Window closes in 3 days', meta: 'cl 34.3 · crane outage of 17 Sep', c: 'violet' },
]

// Columns
export const SRC_W = 244
export const SRC_H = 56
const SRC_GAP = 14
export const OUT_X = 892
export const OUT_W = W - OUT_X
export const OUT_H = 98
const OUT_GAP = 18

export const srcY = (i: number) => (H - (SOURCES.length * SRC_H + (SOURCES.length - 1) * SRC_GAP)) / 2 + i * (SRC_H + SRC_GAP)
export const outY = (i: number) => (H - (OUTPUTS.length * OUT_H + (OUTPUTS.length - 1) * OUT_GAP)) / 2 + i * (OUT_H + OUT_GAP)

function build() {
  const left = hemisphere(-1)
  const right = hemisphere(1)
  const lm = mesh(left, 7)
  const rm = mesh(right, 19)

  // Folds: inner copies of the outline, wavier, drawn as open arcs.
  const folds: string[] = []
  for (const side of [-1, 1] as const) {
    ;[[0.8, 0.6, 0.1, 0.55], [0.62, 2.1, 0.55, 0.4], [0.44, 3.4, 0.2, 0.45], [0.26, 1.2, 0.65, 0.35]].forEach(([k, ph, a0, len]) => {
      const pts = hemisphere(side, k, 1.9, ph)
      const n = pts.length
      const start = Math.floor(a0 * n)
      const arc = Array.from({ length: Math.floor(len * n) }, (_, i) => pts[(start + i) % n])
      folds.push(smoothPath(arc.filter((_, i) => i % 2 === 0), false))
    })
  }

  // Bridges across the midline (the corpus callosum).
  const bridges: [Pt, Pt][] = []
  const lNear = lm.nodes.filter((n) => n.x > CX - GAP - 34).sort((a, b) => a.y - b.y)
  const rNear = rm.nodes.filter((n) => n.x < CX + GAP + 34).sort((a, b) => a.y - b.y)
  for (let i = 0; i < Math.min(lNear.length, rNear.length); i += 2) {
    if (Math.abs(lNear[i].y - rNear[i].y) < 40 && Math.abs(lNear[i].y - CY) < 120) bridges.push([lNear[i], rNear[i]])
  }

  // Wires in: each source to a point on the left hemisphere's outer edge.
  const wiresIn = SOURCES.map((_, i) => {
    const sy = srcY(i) + SRC_H / 2
    const ey = CY + (i - (SOURCES.length - 1) / 2) * 30
    const ex = edgeAt(left, ey, -1)
    const sx = SRC_W
    const g = (ex - sx) * 0.5
    const d = `M${sx} ${r1(sy)}C${r1(sx + g)} ${r1(sy)} ${r1(ex - g)} ${r1(ey)} ${r1(ex)} ${r1(ey)}`
    return { d, end: { x: r1(ex), y: r1(ey) } }
  })
  // Wires out: the right hemisphere to each thing that needs action.
  const wiresOut = OUTPUTS.map((_, i) => {
    const ty = outY(i) + OUT_H / 2
    const sy = CY + (i - (OUTPUTS.length - 1) / 2) * 48
    const sx = edgeAt(right, sy, 1)
    const g = (OUT_X - sx) * 0.5
    const d = `M${r1(sx)} ${r1(sy)}C${r1(sx + g)} ${r1(sy)} ${r1(OUT_X - g)} ${r1(ty)} ${OUT_X} ${r1(ty)}`
    return { d, start: { x: r1(sx), y: r1(sy) } }
  })

  return {
    left: smoothPath(left),
    right: smoothPath(right),
    folds,
    nodes: [...lm.nodes, ...rm.nodes],
    edges: [...lm.edges, ...rm.edges],
    bridges,
    wiresIn,
    wiresOut,
    box: { x: CX - GAP - 2 * HW, y: CY - HH, w: 4 * HW + 2 * GAP, h: 2 * HH },
    centre: { x: CX, y: CY },
  }
}

export const BRAIN = build()
