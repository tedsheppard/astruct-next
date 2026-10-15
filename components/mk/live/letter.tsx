// Arcline Façades' letterhead and the page every drafted letter sits on, as
// the demo pack has them (astruct/launch/demo/expected-notices and story.md).
// Arcline, Harrow & Vale and everyone named are fictional; the ABN
// 16 359 830 862 fails the ABN checksum, the phone number is in the pack's
// reserved range and the email domains end in .example.

export const ARC = {
  name: 'Arcline Façades Pty Ltd',
  abn: '16 359 830 862',
  street: '22 Ironbark Close',
  suburb: 'Northgate QLD 4013',
  phone: '07 5550 0860',
  web: 'arcline.example',
}

export function ArclineMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M7 31V22a13 13 0 0 1 26 0v9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 31v-8.5M20 31V10.5M25 31v-8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
      <path d="M3.5 35h33" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function ArclineWordmark() {
  return (
    <span className="lt-word">
      <b>ARCLINE</b>
      <span>FAÇADES</span>
    </span>
  )
}

/** The full letterhead band across the top of page 1. */
export function Letterhead() {
  return (
    <div className="lt-head">
      <div className="lt-brand"><ArclineMark className="lt-mark" /><ArclineWordmark /></div>
      <div className="lt-addr">
        <span>{ARC.street}</span>
        <span>{ARC.suburb}</span>
        <span>T {ARC.phone}</span>
        <span>{ARC.web}</span>
      </div>
    </div>
  )
}

export type LetterPara = { h: string; body: React.ReactNode }

/**
 * Page 1 of any Arcline letter to Harrow & Vale, laid out as the Delay
 * Notice is: letterhead, addressee and reference table, salutation, subject
 * bar, numbered paragraphs and (optionally) the signature block.
 */
export function LetterPage({ refNo, date, subject, paras, sign = true, className }: {
  refNo: string
  date: string
  subject: string[]
  paras: LetterPara[]
  sign?: boolean
  className?: string
}) {
  return (
    <div className={`lt-page${className ? ` ${className}` : ''}`}>
      <Letterhead />
      <div className="lt-meta">
        <div className="lt-to">
          <span>Rebecca Lindqvist</span>
          <span>Main Contractor’s Representative</span>
          <span>Harrow &amp; Vale Constructions Pty Ltd</span>
          <span>Level 7, 212 Tarrant Lane</span>
          <span>Brisbane City QLD 4000</span>
        </div>
        <dl className="lt-refs">
          <dt>Our ref</dt><dd>{refNo}</dd>
          <dt>Subcontract</dt><dd>HV2291-SC-014</dd>
          <dt>Date</dt><dd>{date}</dd>
        </dl>
      </div>
      <p className="lt-by">By email: rebecca.lindqvist@harrowvale.example; contracts@harrowvale.example</p>
      <p>Dear Rebecca</p>
      <p className="lt-subj">{subject.map((s, i) => <span key={i}>{s}{i < subject.length - 1 && <br />}</span>)}</p>
      <ol className="lt-ol">
        {paras.map((p) => <li key={p.h}><b>{p.h}</b> {p.body}</li>)}
      </ol>
      {sign && (
        <div className="lt-sign">
          <p>Yours faithfully</p>
          <svg className="lt-sig" viewBox="0 0 160 44" aria-hidden="true"><path d="M4 30c10-18 18-24 22-20s-8 22-2 22 14-26 20-24-4 20 2 20 10-12 16-12 2 10 8 10 12-8 20-8 10 6 18 4 16-6 24-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <b>Maya Brennan</b>
          <span>Commercial Manager</span>
          <span>for and on behalf of {ARC.name}</span>
        </div>
      )}
    </div>
  )
}
