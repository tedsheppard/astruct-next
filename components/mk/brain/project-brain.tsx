// The hero's project brain. A server component: the whole frame, every
// source, the brain and the four things it lights up, is in the HTML, so the
// first paint is the finished picture. CSS then sends signals along the wires
// and lights each item in turn; with reduced motion it simply stays still.
import { BRAIN, COL_Y, H, OUTPUTS, OUT_H, OUT_W, OUT_X, SOURCES, SRC_H, SRC_W, W, outY, srcY, type Source } from './geometry'

const ln = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function Glyph({ icon }: { icon: Source['icon'] }) {
  switch (icon) {
    case 'contract':
      return <g {...ln}><path d="M5 2.5h6.2L15 6.3V17.5H5z" /><path d="M11 2.5v4h4" /><path d="M7.8 10h4.4M7.8 13h4.4" /></g>
    case 'mail':
      return <g {...ln}><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="m3.2 5.6 6.8 5 6.8-5" /></g>
    case 'si':
      return <g {...ln}><path d="M4 16.5V4.2c0-.7.5-1.2 1.2-1.2h9.6c.7 0 1.2.5 1.2 1.2v12.3l-2.4-1.5-2.4 1.5-1.2-.8-1.2.8-2.4-1.5z" /><path d="M7.5 7.5h5M7.5 10.5h3.4" /></g>
    case 'programme':
      return <g {...ln}><path d="M3 4.5h6M6 8.5h8M9 12.5h8" strokeWidth="2.2" /><path d="M3 16.5h14" opacity=".5" /></g>
    case 'rfi':
      return <g {...ln}><path d="M3.5 4.8c0-.8.6-1.3 1.3-1.3h10.4c.7 0 1.3.5 1.3 1.3v7.4c0 .7-.6 1.3-1.3 1.3H9.5L6 16.5v-3H4.8c-.7 0-1.3-.6-1.3-1.3z" /><path d="M8.6 7.1a1.5 1.5 0 1 1 2 1.4c-.4.2-.6.5-.6.9" /><circle cx="10" cy="11" r=".4" fill="currentColor" /></g>
    case 'drawing':
      return <g {...ln}><rect x="2.5" y="3.5" width="15" height="13" rx="1.5" /><path d="M2.5 12.5h4.5v4M11 3.5v5h6.5M7 8.5h4" /></g>
    case 'outlook':
      return (
        <g>
          <rect x="7" y="3.4" width="10.6" height="13.2" rx="1.7" fill="#28A8EA" />
          <path d="M7 8.6 12.3 11.7 17.6 8.6" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="1.1" strokeLinejoin="round" />
          <rect x="2.4" y="5.9" width="8.4" height="8.4" rx="1.7" fill="#0A64C8" />
          <ellipse cx="6.6" cy="10.1" rx="1.85" ry="2.2" fill="none" stroke="#fff" strokeWidth="1.35" />
        </g>
      )
  }
}

/** The brain itself: glow, stem, cerebellum, cerebrum, folds, mesh and nodes. */
function BrainBody({ id }: { id: string }) {
  const b = BRAIN
  return (
    <g className="pb-brain">
      <ellipse className="pb-core" cx={b.centre.x} cy={b.centre.y + 40} rx={b.box.w * 0.6} ry={b.box.h * 0.52} fill={`url(#${id}-core)`} />
      <path className="pb-solid" d={b.stem} />
      <path className="pb-lobe" d={b.stem} fill={`url(#${id}-fill)`} stroke={`url(#${id}-ink)`} />
      <path className="pb-solid" d={b.cerebellum} />
      <path className="pb-lobe" d={b.cerebellum} fill={`url(#${id}-fill)`} stroke={`url(#${id}-ink)`} />
      <clipPath id={`${id}-cb`}><path d={b.cerebellum} /></clipPath>
      <g className="pb-folia" stroke={`url(#${id}-ink)`} clipPath={`url(#${id}-cb)`}>
        {b.folia.map((d, i) => <path key={i} d={d} />)}
      </g>
      <path className="pb-solid" d={b.cerebrum} />
      <path className="pb-hemi" d={b.cerebrum} fill={`url(#${id}-fill)`} />
      {/* Folds and mesh are clipped to the outline, so nothing pokes past the rim. */}
      <clipPath id={`${id}-cr`}><path d={b.cerebrum} /></clipPath>
      <g clipPath={`url(#${id}-cr)`}>
        <g className="pb-sulci" stroke={`url(#${id}-ink)`}>
          {b.sulci.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g className="pb-folds" stroke={`url(#${id}-ink)`}>
          {b.folds.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g className="pb-edges" stroke={`url(#${id}-ink)`}>
          {b.edges.map(([p, q], i) => <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />)}
        </g>
      </g>
      <path className="pb-rim" d={b.cerebrum} stroke={`url(#${id}-ink)`} />
      <g className="pb-nodes" fill={`url(#${id}-ink)`}>
        {b.nodes.map((n, i) => (
          <circle key={i} className={n.hub ? 'pb-hub' : undefined} cx={n.x} cy={n.y} r={n.r} style={n.hub ? { ['--d' as string]: `${n.d}s` } : undefined} />
        ))}
      </g>
    </g>
  )
}

function Defs({ id }: { id: string }) {
  const b = BRAIN
  return (
    <defs>
      <linearGradient id={`${id}-ink`} gradientUnits="userSpaceOnUse" x1={b.box.x} y1="0" x2={b.box.x + b.box.w} y2="0">
        <stop offset="0" stopColor="var(--c-teal)" />
        <stop offset=".5" stopColor="var(--c-blue)" />
        <stop offset="1" stopColor="var(--c-violet)" />
      </linearGradient>
      <linearGradient id={`${id}-fill`} gradientUnits="userSpaceOnUse" x1={b.box.x} y1={b.box.y} x2={b.box.x + b.box.w} y2={b.box.y + b.box.h}>
        <stop offset="0" stopColor="var(--c-teal)" stopOpacity=".16" />
        <stop offset=".55" stopColor="var(--c-blue)" stopOpacity=".1" />
        <stop offset="1" stopColor="var(--c-violet)" stopOpacity=".16" />
      </linearGradient>
      <radialGradient id={`${id}-core`}>
        <stop offset="0" stopColor="var(--c-blue)" stopOpacity=".22" />
        <stop offset=".55" stopColor="var(--c-teal)" stopOpacity=".07" />
        <stop offset="1" stopColor="var(--c-teal)" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

const LABEL =
  'Astruct on a demo project, Kestrel Street, Stage 2, with fictional parties. It reads the subcontract HV2291-SC-014, the correspondence, site instructions, programme, RFIs, drawings and Outlook, and shows the claims and notices it read: an EOT claim, with the SC 7.2 period ending Thursday 15 October and 4 documents linked; a variation issue for SI-014 under SC 8.1, with the evidence linked; payment claim PC-10 with a reference date of 25 October under the BIF Act (Qld); and notice of delay ARC-KS2-L-041, sent on 29 September and filed to Notices.'

export function ProjectBrain() {
  const b = BRAIN
  const cx = b.box.x + b.box.w / 2
  return (
    <figure className="pb" role="img" aria-label={LABEL}>
      {/* Wide screens: one drawing, sources on the left, what it read on the right. */}
      <svg className="pb-wide" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <Defs id="pbw" />
        <text className="pb-col" x="2" y={COL_Y}>What it reads</text>
        <text className="pb-col" x={OUT_X + 2} y={COL_Y}>Claims and notices · Mon 12 Oct</text>
        <text className="pb-cap" x={cx} y={COL_Y} textAnchor="middle">Kestrel Street, Stage 2</text>
        <text className="pb-cap-sub" x={cx} y={COL_Y + 20} textAnchor="middle">4,812 documents read · demo project, fictional parties</text>

        <g className="pb-wires">
          {b.wiresIn.map((w, i) => (
            <g key={i}>
              <path className="pb-wire" d={w.d} />
              <path className="pb-sig" d={w.d} pathLength={100} style={{ ['--d' as string]: `${(i * 0.83) % 3.4}s`, ['--t' as string]: `${3.2 + (i % 3) * 0.35}s` }} />
              <circle className="pb-port" cx={w.end.x} cy={w.end.y} r="2.6" />
            </g>
          ))}
          {b.wiresOut.map((w, i) => (
            <g key={i} data-c={OUTPUTS[i].c}>
              <path className="pb-wire pb-wire-out" d={w.d} />
              <path className="pb-sig pb-sig-out" d={w.d} pathLength={100} style={{ ['--d' as string]: `${i * 2.5}s` }} />
              <circle className="pb-port pb-port-out" cx={w.start.x} cy={w.start.y} r="2.6" />
            </g>
          ))}
        </g>

        <BrainBody id="pbw" />

        {SOURCES.map((s, i) => (
          <g key={s.label} className="pb-src" transform={`translate(0 ${srcY(i)})`}>
            <rect className="pb-card" width={SRC_W} height={SRC_H} rx="14" />
            <rect className="pb-ic-bg" x="11" y="11" width="32" height="32" rx="9" />
            <g className="pb-ic" transform="translate(17 17)"><Glyph icon={s.icon} /></g>
            <text className="pb-src-t" x="55" y="24">{s.label}</text>
            <text className="pb-src-m" x="55" y="42">{s.meta}</text>
            <circle className="pb-dot" cx={SRC_W} cy={SRC_H / 2} r="3.5" />
          </g>
        ))}

        {OUTPUTS.map((o, i) => (
          <g key={o.kind} className="pb-out" data-c={o.c} transform={`translate(${OUT_X} ${outY(i)})`} style={{ ['--d' as string]: `${i * 2.5}s` }}>
            <rect className="pb-ring" x="-4" y="-4" width={OUT_W + 8} height={OUT_H + 8} rx="20" />
            <rect className="pb-card" width={OUT_W} height={OUT_H} rx="16" />
            <rect className="pb-bar" x="0" y="18" width="3.5" height={OUT_H - 36} rx="1.75" />
            <circle className="pb-kind-dot" cx="22" cy="27" r="4" />
            <text className="pb-kind" x="34" y="31.5">{o.kind}</text>
            <text className="pb-out-t" x="18" y="58">{o.title}</text>
            <text className="pb-out-m" x="18" y="79">{o.meta}</text>
            <circle className="pb-dot" cx="0" cy={OUT_H / 2} r="3.5" />
          </g>
        ))}
      </svg>

      {/* Phones and narrow windows: the same picture, stacked. */}
      <div className="pb-narrow" aria-hidden="true">
        <div className="pb-n-head"><b>Kestrel Street, Stage 2</b><span>4,812 documents read · demo project, fictional parties</span></div>
        <ul className="pb-n-src">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <svg viewBox="0 0 20 20" className="pb-n-ic"><Glyph icon={s.icon} /></svg>
              {s.label}
            </li>
          ))}
        </ul>
        <svg className="pb-n-brain" viewBox={`${b.box.x - 12} ${b.box.y - 8} ${b.box.w + 24} ${b.box.h + 16}`}>
          <Defs id="pbn" />
          <BrainBody id="pbn" />
        </svg>
        <p className="pb-n-col">Claims and notices · Mon 12 Oct</p>
        <ul className="pb-n-out">
          {OUTPUTS.map((o, i) => (
            <li key={o.kind} data-c={o.c} style={{ ['--d' as string]: `${i * 2.5}s` }}>
              <span className="pb-n-kind"><i />{o.kind}</span>
              <b>{o.title}</b>
              <span className="pb-n-meta">{o.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
