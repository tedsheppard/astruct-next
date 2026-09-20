"use client";

import { useId, useState } from "react";

// The connected apps as the desk's dock draws them: each brand's mark in
// its own colours, cut in the desk's glass (a soft gradient through the
// colour, a hairline of light round each piece, a sheen across the top),
// so a Gmail tile sits on the dock the way the desk's own tiles do rather
// than as a flat sticker. 24-unit grid, drawn at the size the tile asks.
type P = { size?: number; className?: string };

// One glass piece: the shape filled with a gradient from a lighter tint to
// the colour, a light hairline, and its own defs keyed to the element.
function Piece({ d, colour, id }: { d: string; colour: string; id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor={colour} stopOpacity="0.92" />
          <stop offset="1" stopColor={colour} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" strokeLinejoin="round" />
    </>
  );
}

const Svg = ({ size, className, children }: P & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))" }}>{children}</svg>
);

function Gmail({ size = 21, className }: P) {
  const k = useId();
  // The M as Google's glass rendering of it: a blue post, a green post,
  // the yellow fold and the red chevron laid over them, each piece a
  // translucent slab with a lit edge, the red letting the posts show
  // through where it crosses them.
  return (
    <Svg size={size} className={className}>
      <defs>
        <linearGradient id={`${k}sheen`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.5" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.08" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      <Piece id={`${k}b`} colour="#4285f4" d="M2.5 8.2v10a2.3 2.3 0 0 0 2.3 2.3H8V11.6L2.5 8.2Z" />
      <Piece id={`${k}g`} colour="#34a853" d="M16 11.6v8.9h3.2a2.3 2.3 0 0 0 2.3-2.3v-10L16 11.6Z" />
      <Piece id={`${k}y`} colour="#fbbc04" d="M16 11.6 21.5 8.2V6.6c0-2.1-2.4-3.3-4-2L16 5.6v6Z" />
      <path d="M8 11.6V5.6L6.5 4.5c-1.7-1.3-4 0-4 2.1v1.6l9.5 7 9.5-7V6.6c0-2.1-2.3-3.4-4-2.1L16 5.6v6l-4 3-4-3Z" fill="#ea4335" fillOpacity="0.86" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M8 11.6V5.6L6.5 4.5c-1.7-1.3-4 0-4 2.1v1.6l9.5 7 9.5-7V6.6c0-2.1-2.3-3.4-4-2.1L16 5.6v6l-4 3-4-3Z" fill={`url(#${k}sheen)`} />
    </Svg>
  );
}
function Outlook({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}e`} colour="#28a8ea" d="M11 6.5h8.5A1.5 1.5 0 0 1 21 8v9.5a1.5 1.5 0 0 1-1.5 1.5H11v-3l5-3.2L11 9.6v-3.1Z" />
      <Piece id={`${k}o`} colour="#0364b8" d="M3 7.6A1.6 1.6 0 0 1 4.6 6h7.8A1.6 1.6 0 0 1 14 7.6v8.8a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 16.4V7.6Z" />
      <path d="M8.5 9.2c-1.5 0-2.4 1.2-2.4 2.8s.9 2.8 2.4 2.8 2.4-1.2 2.4-2.8-.9-2.8-2.4-2.8Zm0 1.3c.7 0 1.1.6 1.1 1.5s-.4 1.5-1.1 1.5-1.1-.6-1.1-1.5.4-1.5 1.1-1.5Z" fill="#fff" fillOpacity="0.95" />
    </Svg>
  );
}
function GoogleCalendar({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}w`} colour="#e8eaed" d="M7 7h10v10H7z" />
      <Piece id={`${k}b`} colour="#4285f4" d="M4.5 3h13A1.5 1.5 0 0 1 19 4.5V7H7v12H4.5A1.5 1.5 0 0 1 3 17.5v-13A1.5 1.5 0 0 1 4.5 3Z" />
      <Piece id={`${k}g`} colour="#34a853" d="M7 17h10v4H7z" />
      <Piece id={`${k}y`} colour="#fbbc04" d="M17 7h4v10h-4z" />
      <Piece id={`${k}r`} colour="#ea4335" d="M17 17h4l-4 4v-4Z" />
      <path d="M10.2 10.6c.3-.8 1-1.3 1.9-1.3 1.1 0 1.9.7 1.9 1.6 0 .6-.4 1.1-.9 1.3.7.2 1.1.8 1.1 1.5 0 1-.9 1.8-2.1 1.8-1 0-1.8-.5-2.1-1.4l1-.4c.2.5.6.8 1.1.8.6 0 1-.3 1-.8s-.4-.8-1.1-.8h-.5v-.9h.5c.6 0 .9-.3.9-.7s-.3-.7-.8-.7-.8.3-.9.7l-1-.7Z" fill="#1a73e8" />
    </Svg>
  );
}
function GoogleDrive({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}y`} colour="#fbbc04" d="M9 3.5h6l6 10.5H15L9 3.5Z" />
      <Piece id={`${k}g`} colour="#34a853" d="M9 3.5 3 14l3 5.5 6-10.5L9 3.5Z" />
      <Piece id={`${k}b`} colour="#4285f4" d="M3 14h18l-3 5.5H6L3 14Z" />
    </Svg>
  );
}
function OneDrive({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}c`} colour="#0a64c8" d="M7.5 18.5a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 9.3 3.8 3.8 0 0 1 17.5 18.5h-10Z" />
      <path d="M8.2 15.2a2 2 0 0 1 1.3-3.6 3.4 3.4 0 0 1 6.3-.6" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.9" strokeLinecap="round" />
    </Svg>
  );
}
function Slack({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}a`} colour="#36c5f0" d="M8.5 3a2 2 0 0 0 0 4h2V5a2 2 0 0 0-2-2ZM8.5 8.5h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 0-4Z" />
      <Piece id={`${k}b`} colour="#2eb67d" d="M21 8.5a2 2 0 0 0-4 0v2h2a2 2 0 0 0 2-2ZM15.5 8.5v-4a2 2 0 0 0-4 0v4a2 2 0 0 0 4 0Z" />
      <Piece id={`${k}c`} colour="#ecb22e" d="M15.5 21a2 2 0 0 0 0-4h-2v2a2 2 0 0 0 2 2ZM15.5 15.5h4a2 2 0 0 0 0-4h-4a2 2 0 0 0 0 4Z" />
      <Piece id={`${k}d`} colour="#e01e5a" d="M3 15.5a2 2 0 0 0 4 0v-2H5a2 2 0 0 0-2 2ZM8.5 15.5v4a2 2 0 0 0 4 0v-4a2 2 0 0 0-4 0Z" />
    </Svg>
  );
}
function Xero({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}c`} colour="#13b5ea" d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  );
}
function Procore({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}c`} colour="#f47e42" d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />
      <path d="M8.5 16.5v-9h3.7a2.6 2.6 0 0 1 0 5.2H10.3v3.8H8.5Zm1.8-5.4h1.8a1 1 0 0 0 0-2h-1.8v2Z" fill="#fff" />
    </Svg>
  );
}
function Aconex({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}c`} colour="#c74634" d="M4.5 3h15A1.5 1.5 0 0 1 21 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3Z" />
      <path d="M12 7l4.5 10h-2l-1-2.4h-3l-1 2.4h-2L12 7Zm0 3.4-1 2.6h2l-1-2.6Z" fill="#fff" />
    </Svg>
  );
}
function Myob({ size = 21, className }: P) {
  const k = useId();
  return (
    <Svg size={size} className={className}>
      <Piece id={`${k}c`} colour="#6100a5" d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />
      <path d="M7 15.5v-7h1.6l2.2 3.6 2.2-3.6h1.6v7h-1.5v-4.3l-2.3 3.6-2.3-3.6v4.3H7Z" fill="#fff" />
    </Svg>
  );
}

export const CONNECTOR_GLYPHS: Record<string, (p: P) => React.JSX.Element> = { gmail: Gmail, outlook: Outlook, gcal: GoogleCalendar, gdrive: GoogleDrive, onedrive: OneDrive, slack: Slack, xero: Xero, procore: Procore, aconex: Aconex, myob: Myob };

// A picture supplied for a connector (public/connectors/<id>.png) is used
// when one is there; the drawn glyph stands in until it loads or when it
// is missing.
export function ConnectorGlyph({ id, size = 21, className }: { id: string } & P) {
  const [pic, setPic] = useState<boolean>(true);
  const G = CONNECTOR_GLYPHS[id] || Slack;
  if (!pic) return <G size={size} className={className} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/marketing/connectors/${id}.png`} alt="" width={size} height={size} className={className} style={{ width: size, height: size, objectFit: "contain", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.18))" }} draggable={false} onError={() => setPic(false)} />;
}
