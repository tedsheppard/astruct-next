// Arcline Façades' letterhead and the Delay Notice ARC-KS2-L-041, as the
// demo pack has them (astruct/launch/demo/expected-notices and story.md).
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

function Foot({ page }: { page: number }) {
  return (
    <div className="lt-foot">
      <span>{ARC.name} · ABN {ARC.abn}</span>
      <span>ARC-KS2-L-041 · Page {page} of 2</span>
    </div>
  )
}

/**
 * The Delay Notice, block by block. `upto` is how many blocks are showing
 * (blocks run across both pages in reading order), so the letter can compose
 * itself; pass a large number for the finished letter.
 */
export function DelayNoticePages({ upto = 99 }: { upto?: number }) {
  let i = 0
  const b = () => {
    const n = i++
    return `lt-b${n < upto ? ' is-in' : ''}`
  }
  return (
    <>
      <div className="lt-page">
        <div className={b()}><Letterhead /></div>
        <div className={`lt-meta ${b()}`}>
          <div className="lt-to">
            <span>Rebecca Lindqvist</span>
            <span>Main Contractor’s Representative</span>
            <span>Harrow &amp; Vale Constructions Pty Ltd</span>
            <span>Level 7, 212 Tarrant Lane</span>
            <span>Brisbane City QLD 4000</span>
          </div>
          <dl className="lt-refs">
            <dt>Our ref</dt><dd>ARC-KS2-L-041</dd>
            <dt>Subcontract</dt><dd>HV2291-SC-014</dd>
            <dt>Date</dt><dd>29 September 2026</dd>
          </dl>
        </div>
        <p className={`lt-by ${b()}`}>By email: rebecca.lindqvist@harrowvale.example; contracts@harrowvale.example</p>
        <p className={b()}>Dear Rebecca</p>
        <p className={`lt-subj ${b()}`}>
          Kestrel Street Mixed-Use, Stage 2: Subcontract HV2291-SC-014 (Façade Package)<br />
          Delay Notice under Special Condition SC 7.1: tower crane TC1 and late access to the Level 6 slab edge
        </p>
        <ol className="lt-ol">
          <li className={b()}>
            <b>Notice.</b> Arcline Façades Pty Ltd (<b>Arcline</b>) gives notice under Special Condition SC 7.1, which
            replaces clause 17.2, of the Qualifying Causes of Delay below. Each has delayed, or is likely to delay,
            Arcline in reaching Practical Completion by the Date for Practical Completion, Friday 11 December 2026.
          </li>
          <li className={b()}>
            <b>Qualifying Causes of Delay.</b>
            <span className="lt-sub">(a) Tower crane TC1 was out of service from the morning of Tuesday 22 September 2026 until it returned to service on Monday 28 September 2026. Arcline’s allocated façade hook time on 23, 24 and 25 September 2026 was cancelled (SC 11(b); clause 17.4(b)).</span>
            <span className="lt-sub">(b) The Level 6 slab edge, due to Arcline on Wednesday 23 September 2026 under Programme Rev 8, was not made available. Its handover was revised to Wednesday 30 September 2026 (your email of 23 September, 11.15 am) and then to Tuesday 6 October 2026 (your email of 28 September, 1.20 pm) (SC 12(a) and (b); clause 17.4(b)).</span>
          </li>
          <li className={b()}>
            <b>Date Arcline became aware.</b> Wednesday 23 September 2026: of the TC1 outage from Mr Pellow’s email at
            6.52 am, and of the late Level 6 access from the site inspection at 7.30 am and your email at 11.15 am.
          </li>
          <li className={b()}>
            <b>Effect on the critical path.</b> The curtain wall units are top-hung, so the Level 5 units cannot be
            installed until the Level 6 brackets are installed, surveyed and proof-tested. Programme Rev 8 shows the
            Level 5 unit start on 1 October 2026, with no float in the façade sequence. Access on 6 October 2026 means
            Level 6 brackets from 6 to 9 October, proof-testing on 12 October and the Level 5 unit start no earlier than
            Tuesday 13 October 2026. Every later level follows on the same path to Practical Completion.
          </li>
        </ol>
        <Foot page={1} />
      </div>
      <div className="lt-page">
        <div className={`lt-cont ${b()}`}>Harrow &amp; Vale Constructions Pty Ltd · 29 September 2026 · ARC-KS2-L-041</div>
        <ol className="lt-ol" start={5}>
          <li className={b()}>
            <b>Estimate of delay.</b> Arcline’s preliminary estimate is a delay to Practical Completion of not less than
            12 days (7 Business Days). The late access delay is continuing. The estimate excludes any delay from Site
            Instruction SI-014, which is the subject of Arcline’s separate notice ARC-KS2-L-042.
          </li>
          <li className={b()}>
            <b>Extension of time.</b> Arcline will claim an extension of time of not less than 12 days. It will give its
            EOT Claim under Special Condition SC 7.2 by Thursday 15 October 2026 and, while the delay continues, update
            it every 10 Business Days as SC 7.2(d) requires.
          </li>
          <li className={b()}>
            <b>Delay costs and reservation of rights.</b> Arcline reserves its entitlement to delay costs under clause
            17.7 and Special Condition SC 10 for the late Level 6 access. For TC1, Arcline notes Special Condition
            SC 11(c) and asks you to provide the crane’s maintenance and inspection records for the three months before
            22 September 2026. Arcline reserves all its other rights under the Subcontract.
          </li>
        </ol>
        <div className={`lt-sign ${b()}`}>
          <p>Yours faithfully</p>
          <svg className="lt-sig" viewBox="0 0 160 44" aria-hidden="true"><path d="M4 30c10-18 18-24 22-20s-8 22-2 22 14-26 20-24-4 20 2 20 10-12 16-12 2 10 8 10 12-8 20-8 10 6 18 4 16-6 24-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <b>Maya Brennan</b>
          <span>Commercial Manager</span>
          <span>for and on behalf of {ARC.name}</span>
        </div>
        <p className={`lt-cc ${b()}`}>
          cc Craig Pellow, Site Manager, Harrow &amp; Vale · Priya Raman, Contracts Administrator, Harrow &amp; Vale ·
          Luke Farrant, Project Manager, Arcline
        </p>
        <Foot page={2} />
      </div>
    </>
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

/** The subcontract's cover, as an amended Australian Standard subcontract's cover is laid out. */
export function ContractCover() {
  return (
    <div className="ct-page ct-cover">
      <div className="ct-tr">
        <span>Subcontract No. HV2291-SC-014</span>
        <span>Amended from AS 4903-2000</span>
        <span>Execution version · 19 January 2026</span>
      </div>
      <div className="ct-works">
        <b>Kestrel Street Mixed-Use, Stage 2</b>
        <span>Façade Package: unitised curtain wall and aluminium cladding</span>
        <span>118 Kestrel Street, Fortitude Valley QLD 4006</span>
      </div>
      <div className="ct-parties">
        <div><b>Harrow &amp; Vale Constructions Pty Ltd</b><span>ABN 69 117 079 060</span><em>Main Contractor</em></div>
        <div><b>Arcline Façades Pty Ltd</b><span>ABN 16 359 830 862</span><em>Subcontractor</em></div>
      </div>
      <div className="ct-title">
        <b>Subcontract conditions</b>
        <span>General Conditions of Subcontract HV-SC 2024, with Annexures Part A to D</span>
      </div>
    </div>
  )
}

/** Page 22 of the subcontract: Special Condition SC 9, with (b) highlighted when `hit`. */
export function ContractPage22({ hit }: { hit: boolean }) {
  return (
    <div className="ct-page ct-body">
      <div className="ct-run"><span>Subcontract No. HV2291-SC-014</span><span>Annexure Part B: Special Conditions</span></div>
      <div className="ct-cl ct-cont"><span /><p>If the Subcontractor fails to do so, the Subcontractor is not entitled to any adjustment to the Subcontract Sum or other Claim arising from the Direction, and the Direction is taken not to be a Variation.</p></div>
      <div className="ct-cl"><span>SC 8.5</span><p><b>Response.</b> Within 10 Business Days after receiving the Variation Particulars, the Main Contractor’s Representative must notify the Subcontractor whether it accepts that the Direction is a Variation.</p></div>
      <div className="ct-h"><span>SC 9</span><b>Time bars generally</b></div>
      <div className="ct-sub"><span>(a)</span><p>The parties acknowledge that the times for giving notices and Claims in Special Conditions SC 7 and SC 8 are reasonable, having regard to the nature of the Subcontract Works and the Subcontractor’s knowledge of its own work.</p></div>
      <div className="ct-sub"><span>(b)</span><p><mark className={hit ? 'ct-hit is-on' : 'ct-hit'}>A statement in a Direction, site instruction, meeting minute or other document that a Direction involves “no change to the Subcontract Sum”, “no cost” or “no time” does not relieve the Subcontractor of the requirement to give a Variation Notice or Delay Notice</mark> if the Subcontractor considers that the Direction involves a Variation or a Qualifying Cause of Delay.</p></div>
      <div className="ct-sub"><span>(c)</span><p>Correspondence that foreshadows a possible Claim, or records that a matter is “under review”, is not a Variation Notice or Delay Notice unless it satisfies the requirements of SC 7 or SC 8 (as applicable) and is given in accordance with clause 7 as amended.</p></div>
      <div className="ct-h"><span>SC 10</span><b>Delay costs</b></div>
      <div className="ct-cl ct-cont"><span /><p>Clause 17.7 is amended by adding at the end: “Delay costs are payable only for Qualifying Causes of Delay referred to in clause 17.4(b) or (c)…</p></div>
      <div className="ct-foot">22</div>
    </div>
  )
}
