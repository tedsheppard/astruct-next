// Small inline icons for the marketing site. Line icons use currentColor; the
// connector glyphs are flat, in each product's own colours, drawn on a 24 grid.

type P = { className?: string }
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const IArrow = ({ className }: P) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" {...line} /></svg>
)
export const IChevron = ({ className }: P) => (
  <svg className={className} width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" {...line} strokeWidth={2} /></svg>
)
export const ICheck = ({ className }: P) => (
  <svg className={className} viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5 8.2 14 15.5 6.5" {...line} strokeWidth={1.9} /></svg>
)
export const IPlus = ({ className }: P) => (
  <svg className={className} viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" {...line} /></svg>
)
export const IPlay = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.4-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" fill="currentColor" /></svg>
)
export const IMenu = ({ className }: P) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7h13M3.5 13h13" {...line} /></svg>
)
export const IClose = ({ className }: P) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" {...line} /></svg>
)
export const IDoc = ({ className }: P) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.8h5.2L12.5 5v9.2H4z M9 1.8V5h3.5" {...line} strokeWidth={1.3} /></svg>
)
export const IMail = ({ className }: P) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1.6" {...line} strokeWidth={1.3} /><path d="m2.5 4.5 5.5 4 5.5-4" {...line} strokeWidth={1.3} /></svg>
)
export const ILock = ({ className }: P) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.6" {...line} strokeWidth={1.3} /><path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2" {...line} strokeWidth={1.3} /></svg>
)

// Sidebar glyphs for the drawn app window.
export const ISide = {
  chat: ({ className }: P) => <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M2.5 8h11" {...line} strokeWidth={1.4} /></svg>,
  search: ({ className }: P) => <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.3" {...line} strokeWidth={1.4} /><path d="m10.3 10.3 3.2 3.2" {...line} strokeWidth={1.4} /></svg>,
  library: ({ className }: P) => <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5v11M6.5 2.5v11M10 3l3 10.3" {...line} strokeWidth={1.4} /></svg>,
  draft: ({ className }: P) => <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><path d="M10.8 2.7a1.5 1.5 0 0 1 2.1 2.1L6 11.7l-3 .8.8-3z" {...line} strokeWidth={1.4} /></svg>,
  team: ({ className }: P) => <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><circle cx="6" cy="5.5" r="2.3" {...line} strokeWidth={1.4} /><path d="M1.8 13.2a4.3 4.3 0 0 1 8.4 0M10.8 3.4a2.3 2.3 0 0 1 0 4.3M12.2 9.4a4.3 4.3 0 0 1 2 3.8" {...line} strokeWidth={1.4} /></svg>,
  mail: IMail,
  computer: ({ className }: P) => <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3" width="12" height="8" rx="1.4" {...line} strokeWidth={1.4} /><path d="M6 13.5h4" {...line} strokeWidth={1.4} /></svg>,
  folder: ({ className }: P) => <svg className={className} viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4.3c0-.7.5-1.2 1.2-1.2h3l1.5 1.6h5.1c.7 0 1.2.5 1.2 1.2v6.2c0 .7-.5 1.2-1.2 1.2H3.2c-.7 0-1.2-.5-1.2-1.2z" {...line} strokeWidth={1.4} /></svg>,
}

// ── Connector glyphs (flat) ────────────────────────────────────────────────
export const GOutlook = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="8.5" y="4" width="12.5" height="16" rx="2" fill="#28A8EA" />
    <path d="M8.5 10.2 14.75 14 21 10.2" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.3" strokeLinejoin="round" />
    <rect x="3" y="7" width="10" height="10" rx="2" fill="#0A64C8" />
    <ellipse cx="8" cy="12" rx="2.2" ry="2.6" fill="none" stroke="#fff" strokeWidth="1.6" />
  </svg>
)
export const GSharePoint = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="13.5" cy="8.3" r="5.3" fill="#036C70" />
    <circle cx="17.3" cy="13.6" r="4.3" fill="#1A9BA1" />
    <circle cx="13.8" cy="18" r="3.4" fill="#37C6D0" />
    <rect x="3" y="7" width="10" height="10" rx="2" fill="#03787C" />
    <path d="M10 9.6c-.5-.5-1.2-.7-1.9-.7-1.1 0-1.9.6-1.9 1.4 0 1.9 3.8 1.2 3.8 3.1 0 .9-.9 1.5-2 1.5-.8 0-1.6-.3-2.1-.9" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
export const GOneDrive = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7.4 18.5a4 4 0 0 1-.6-7.95A5.6 5.6 0 0 1 17.4 9.2a3.9 3.9 0 0 1 .1 9.3Z" fill="#0A64C8" />
  </svg>
)
export const GGmail = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.5 8.2v10a2.3 2.3 0 0 0 2.3 2.3H8V11.6L2.5 8.2Z" fill="#4285F4" />
    <path d="M16 11.6v8.9h3.2a2.3 2.3 0 0 0 2.3-2.3v-10L16 11.6Z" fill="#34A853" />
    <path d="M16 11.6 21.5 8.2V6.6c0-2.1-2.4-3.3-4-2L16 5.6v6Z" fill="#FBBC04" />
    <path d="M8 11.6V5.6L6.5 4.5c-1.7-1.3-4 0-4 2.1v1.6l9.5 7 9.5-7V6.6c0-2.1-2.3-3.4-4-2.1L16 5.6v6l-4 3-4-3Z" fill="#EA4335" />
  </svg>
)
export const GUpload = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 15V5M8 8.5 12 4.5l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 13.5v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
export const GDrive = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.6 3.5h6.8l6.1 10.6h-6.8L8.6 3.5Z" fill="#FBBC04" />
    <path d="M2.5 14.1 5.9 20l6.1-10.6-3.4-5.9-6.1 10.6Z" fill="#0F9D58" />
    <path d="M5.9 20h12.2l3.4-5.9H9.3L5.9 20Z" fill="#4285F4" />
  </svg>
)
export const GDropbox = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 3 2 6.3l5 3.2 5-3.2L7 3Zm10 0-5 3.3 5 3.2 5-3.2L17 3ZM2 12.7l5 3.2 5-3.2-5-3.2-5 3.2Zm15-3.2-5 3.2 5 3.2 5-3.2-5-3.2ZM7 17l5 3.3 5-3.3-5-3.2L7 17Z" fill="#0061FF" />
  </svg>
)
export const GComputer = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 20h6M12 16.5V20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)
