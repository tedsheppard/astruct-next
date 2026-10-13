// The project brain, as geometry. Everything here is computed once, on the
// server, from fixed numbers, so the hero renders the same complete frame on
// every request and before any script runs. The drawing is a brain in side
// profile, facing left: frontal lobe, the top, the temporal lobe under the
// lateral fissure, the occipital lobe, the cerebellum and the stem. Folds are
// worked into the outline and across the surface, with a mesh of nodes over
// them. Sources are wired into the front; what needs action comes out the back.

export const W = 1200
export const H = 540

export type Pt = { x: number; y: number }
export type Node = Pt & { r: number; hub: boolean; d: number }

const r1 = (n: number) => Math.round(n * 10) / 10

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

// ── The brain, in its own units (front to the left, y down) ──────────────
// About 464 wide and 400 tall including the stem; placed and scaled below.

/** The cerebrum's outline before the folds are worked in. */
const CEREBRUM: [number, number][] = [
  [2, 158], [6, 118], [22, 78], [52, 44], [96, 18], [150, 4], [212, -2], [272, 2], [330, 16],
  [382, 42], [424, 80], [452, 126], [462, 172], [454, 212], [430, 240], [392, 254], [350, 258],
  [312, 268], [270, 286], [218, 300], [168, 302], [130, 292], [104, 272], [96, 248], [106, 228],
  [84, 224], [52, 220], [24, 206], [8, 184],
]

/** The major sulci, drawn as open curves. */
const SULCI: [number, number][][] = [
  // Lateral (Sylvian) fissure, from the notch up and back, with its rising end
  [[106, 228], [140, 216], [182, 204], [226, 194], [262, 180], [286, 160], [294, 140]],
  // Superior temporal sulcus
  [[128, 266], [170, 254], [214, 246], [262, 236], [306, 222], [336, 204]],
  // Inferior temporal sulcus
  [[168, 290], [214, 280], [262, 268], [300, 256]],
  // Central sulcus
  [[236, 2], [228, 34], [242, 62], [226, 96], [236, 126], [220, 158], [224, 184]],
  // Precentral sulcus
  [[184, 6], [178, 40], [192, 70], [174, 104], [182, 136], [168, 170]],
  // Postcentral sulcus
  [[286, 10], [280, 44], [294, 76], [280, 108], [290, 136]],
  // Superior frontal sulcus
  [[36, 96], [74, 80], [110, 76], [146, 64], [170, 60]],
  // Inferior frontal sulcus
  [[22, 150], [60, 136], [98, 140], [134, 122], [166, 128]],
  // Intraparietal sulcus
  [[292, 100], [326, 92], [360, 104], [396, 100], [424, 112]],
  // Parieto-occipital sulcus
  [[402, 56], [410, 96], [426, 134], [446, 166]],
  // Lunate and occipital sulci
  [[360, 168], [392, 186], [424, 208]],
  [[330, 144], [356, 132], [384, 140]],
  // Orbital frontal
  [[44, 196], [78, 196], [104, 206]],
  // Short gyral folds on the frontal and parietal surfaces
  [[60, 56], [84, 46], [104, 52]],
  [[110, 34], [130, 26], [146, 36]],
  [[318, 36], [340, 50], [366, 50]],
  [[66, 112], [92, 104], [116, 112]],
  [[250, 112], [262, 140], [256, 160]],
]

const CEREBELLUM = { cx: 382, cy: 296, rx: 74, ry: 46, rot: -8 }

/** The stem: under the brain, between the temporal lobe and the cerebellum. */
const STEM: [number, number][] = [
  [282, 262], [286, 292], [296, 322], [308, 350], [318, 374], [348, 376], [352, 350], [352, 318], [356, 286], [362, 260],
]

// ── Helpers ──────────────────────────────────────────────────────────────

function catmull(pts: Pt[], closed: boolean, per = 10): Pt[] {
  const n = pts.length
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  const out: Pt[] = []
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      })
    }
  }
  if (!closed) out.push(pts[n - 1])
  return out
}

function resample(pts: Pt[], step: number, closed = true): Pt[] {
  const out: Pt[] = [pts[0]]
  let carry = 0
  for (let i = 1; i < pts.length + (closed ? 1 : 0); i++) {
    const a = pts[i - 1], b = pts[i % pts.length]
    const len = Math.hypot(b.x - a.x, b.y - a.y)
    let d = step - carry
    while (d <= len) {
      const t = d / len
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
      d += step
    }
    carry = len - (d - step)
  }
  if (!closed) out.push(pts[pts.length - 1])
  return out
}

/** A smooth SVG path through points (Catmull-Rom as cubic Béziers). */
function smoothPath(pts: Pt[], closed = true): string {
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

/** The x where a horizontal line at y meets the outline, on one side. */
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

function distToPolyline(p: Pt, line: Pt[]): number {
  let best = Infinity
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1], b = line[i]
    const dx = b.x - a.x, dy = b.y - a.y
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)))
    best = Math.min(best, Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy)))
  }
  return best
}

// ── Build ────────────────────────────────────────────────────────────────

const K = 1.18 // scale from brain units to the scene
const BRAIN_W = 464 * K
const OX = (218 + 918 - BRAIN_W) / 2 // centred between the two columns
const OY = 72
const map = (p: Pt): Pt => ({ x: OX + p.x * K, y: OY + p.y * K })

function buildBrain() {
  // Outline: smooth, then scalloped so every gyrus shows at the edge, with a
  // short fold running in from each cusp.
  const base = resample(catmull(CEREBRUM.map(([x, y]) => ({ x, y })), true, 12), 1.5)
  // Orientation, so the normal points out.
  let area = 0
  for (let i = 0; i < base.length; i++) {
    const a = base[i], b = base[(i + 1) % base.length]
    area += a.x * b.y - b.x * a.y
  }
  const sgn = area > 0 ? 1 : -1
  const rand = rng(11)
  const outline: Pt[] = []
  const cusps: { p: Pt; n: Pt; t: Pt }[] = []
  let phase = 0.35
  let lambda = 46
  for (let i = 0; i < base.length; i++) {
    const a = base[(i - 1 + base.length) % base.length], b = base[(i + 1) % base.length]
    const tx = b.x - a.x, ty = b.y - a.y
    const tl = Math.hypot(tx, ty) || 1
    const t = { x: tx / tl, y: ty / tl }
    const n = { x: (sgn * t.y), y: (-sgn * t.x) }
    const prev = Math.floor(phase)
    phase += 1.5 / lambda
    if (Math.floor(phase) !== prev) {
      lambda = 34 + rand() * 26
      cusps.push({ p: base[i], n, t })
    }
    // |sin| gives rounded gyri with sharp cusps between them.
    const bump = Math.abs(Math.sin(Math.PI * phase))
    const amp = 6.2
    const off = amp * (Math.pow(bump, 0.75) - 0.62)
    outline.push({ x: base[i].x + n.x * off, y: base[i].y + n.y * off })
  }

  const sulciPts = SULCI.map((s) => catmull(s.map(([x, y]) => ({ x, y })), false, 8))

  // A fold running in from each cusp, curling a little. Skipped where it would
  // run into a major sulcus or out of the cerebrum.
  const cuspFolds: Pt[][] = []
  for (const c of cusps) {
    const len = 12 + rand() * 20
    const bend = (rand() - 0.5) * 0.9
    const start = { x: c.p.x - c.n.x * 3.2, y: c.p.y - c.n.y * 3.2 }
    const pts: Pt[] = []
    for (let k = 0; k <= 6; k++) {
      const s = (k / 6) * len
      const curl = bend * s * s / len
      pts.push({ x: start.x - c.n.x * s + c.t.x * curl, y: start.y - c.n.y * s + c.t.y * curl })
    }
    const end = pts[pts.length - 1]
    if (sulciPts.some((l) => distToPolyline(end, l) < 7)) continue
    if (!inside(outline, end)) continue
    cuspFolds.push(pts)
  }

  // The mesh: nodes across the cerebrum, clear of the outline.
  const xs = outline.map((p) => p.x), ys = outline.map((p) => p.y)
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  const mr = rng(7)
  const nodes: Node[] = []
  for (let tries = 0; tries < 12000 && nodes.length < 96; tries++) {
    const p = { x: x0 + mr() * (x1 - x0), y: y0 + mr() * (y1 - y0) }
    if (!inside(outline, p)) continue
    if (outline.some((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < 11 * 11)) continue
    if (nodes.some((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < 25 * 25)) continue
    const hub = mr() < 0.16
    nodes.push({ x: p.x, y: p.y, r: hub ? 3.1 : 1.6 + mr() * 0.8, hub, d: r1(mr() * 6) })
  }
  const edges: [Pt, Pt][] = []
  const seen = new Set<string>()
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .filter((o) => o.j !== i && o.d < 46 * 46)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .forEach((o) => {
        const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`
        if (seen.has(key)) return
        seen.add(key)
        edges.push([a, nodes[o.j]])
      })
  })

  // Cerebellum: an ellipse with its folia, tucked under the occipital lobe.
  const cb = CEREBELLUM
  const rot = (cb.rot * Math.PI) / 180
  const ell = (a: number, k = 1): Pt => {
    const x = Math.cos(a) * cb.rx * k, y = Math.sin(a) * cb.ry * k
    return { x: cb.cx + x * Math.cos(rot) - y * Math.sin(rot), y: cb.cy + x * Math.sin(rot) + y * Math.cos(rot) }
  }
  const cbOutline: Pt[] = []
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2
    // A slightly scalloped rim, finer than the cerebrum's.
    const k = 1 + 0.025 * Math.abs(Math.sin(a * 9))
    cbOutline.push(ell(a, k))
  }
  // Folia: the bottom of the rim, repeated upward, clipped to the cerebellum.
  const folia: Pt[][] = []
  for (const dy of [11, 23, 36, 50]) {
    const arc: Pt[] = []
    for (let i = 0; i <= 30; i++) {
      const a = Math.PI * (i / 30)
      const p = ell(a, 1 + dy / 400)
      arc.push({ x: p.x, y: p.y - dy })
    }
    folia.push(arc)
  }

  const S = (pts: Pt[]) => pts.map(map)
  const outlineS = S(outline)
  return {
    outlinePts: outlineS,
    cerebrum: smoothPath(S(resample(outline, 3))),
    sulci: sulciPts.map((l) => smoothPath(S(resample(l, 6, false)), false)),
    folds: cuspFolds.map((l) => smoothPath(S(l), false)),
    cerebellum: smoothPath(S(cbOutline)),
    folia: folia.map((l) => smoothPath(S(l), false)),
    stem: smoothPath(S(catmull(STEM.map(([x, y]) => ({ x, y })), true, 6))),
    nodes: nodes.map((n) => ({ ...map(n), x: r1(map(n).x), y: r1(map(n).y), r: r1(n.r), hub: n.hub, d: n.d })),
    edges: edges.map(([a, b]) => [map(a), map(b)] as [Pt, Pt]),
    box: { x: OX, y: OY + -2 * K, w: BRAIN_W, h: 380 * K },
    centre: map({ x: 232, y: 150 }),
  }
}

export type Source = { label: string; meta: string; icon: 'contract' | 'mail' | 'si' | 'programme' | 'rfi' | 'drawing' | 'outlook' }
export type Output = { kind: string; title: string; meta: string; c: 'rose' | 'amber' | 'blue' | 'teal' | 'violet' }

// Demo project, fictional: Arcline Façades' subcontract with Harrow & Vale on
// Kestrel Street, Stage 2 (the same pack as every panel below the hero).
// "Today" is Monday 12 October 2026, Brisbane business days.
export const SOURCES: Source[] = [
  { label: 'Subcontract', meta: 'HV2291-SC-014 · 28 pages', icon: 'contract' },
  { label: 'Correspondence', meta: '2,318 letters and emails', icon: 'mail' },
  { label: 'Site instructions', meta: 'SI-001 to SI-014', icon: 'si' },
  { label: 'Programme', meta: 'Rev 8 · critical path', icon: 'programme' },
  { label: 'RFIs', meta: 'RFI-001 to RFI-086', icon: 'rfi' },
  { label: 'Drawings', meta: '1,204 sheets', icon: 'drawing' },
  { label: 'Outlook', meta: '3 mailboxes connected', icon: 'outlook' },
]

export const OUTPUTS: Output[] = [
  { kind: 'EOT claim', title: 'Due Thu 15 Oct, SC 7.2', meta: '3 days left · crane TC1, late L6 access', c: 'rose' },
  { kind: 'Variation particulars', title: 'SI-014 façade brackets', meta: 'Due Mon 19 Oct · SC 8.2', c: 'amber' },
  { kind: 'Payment claim', title: 'Reference date Sun 25 Oct', meta: 'Item 24 · BIF Act 2017 (Qld)', c: 'blue' },
  { kind: 'Delay notice', title: 'Given 29 Sep, on time', meta: 'SC 7.1 · ARC-KS2-L-041 · on file', c: 'teal' },
]

// Columns
export const SRC_W = 218
export const SRC_H = 54
const SRC_GAP = 12
export const OUT_X = 918
export const OUT_W = W - OUT_X
export const OUT_H = 96
const OUT_GAP = 16
export const COL_Y = 22

const srcBlock = SOURCES.length * SRC_H + (SOURCES.length - 1) * SRC_GAP
const outBlock = OUTPUTS.length * OUT_H + (OUTPUTS.length - 1) * OUT_GAP
const MID = OY + (376 * K) / 2 + 4
export const srcY = (i: number) => MID - srcBlock / 2 + i * (SRC_H + SRC_GAP)
export const outY = (i: number) => MID - outBlock / 2 + i * (OUT_H + OUT_GAP)

function build() {
  const b = buildBrain()
  const poly = b.outlinePts
  const ys = poly.map((p) => p.y)
  const top = Math.min(...ys), bottom = Math.max(...ys)

  // Wires in: each source to a point on the front of the brain.
  const wiresIn = SOURCES.map((_, i) => {
    const sy = srcY(i) + SRC_H / 2
    const ey = top + (bottom - top) * (0.2 + (i / (SOURCES.length - 1)) * 0.68)
    const ex = edgeAt(poly, ey, -1) + 2
    const sx = SRC_W
    const g = (ex - sx) * 0.55
    const d = `M${sx} ${r1(sy)}C${r1(sx + g)} ${r1(sy)} ${r1(ex - g)} ${r1(ey)} ${r1(ex)} ${r1(ey)}`
    return { d, end: { x: r1(ex), y: r1(ey) } }
  })
  // Wires out: the back of the brain to each thing that needs action.
  const wiresOut = OUTPUTS.map((_, i) => {
    const ty = outY(i) + OUT_H / 2
    const sy = top + (bottom - top) * (0.22 + (i / (OUTPUTS.length - 1)) * 0.5)
    const sx = edgeAt(poly, sy, 1) - 2
    const g = (OUT_X - sx) * 0.55
    const d = `M${r1(sx)} ${r1(sy)}C${r1(sx + g)} ${r1(sy)} ${r1(OUT_X - g)} ${r1(ty)} ${OUT_X} ${r1(ty)}`
    return { d, start: { x: r1(sx), y: r1(sy) } }
  })

  return { ...b, wiresIn, wiresOut }
}

export const BRAIN = build()
