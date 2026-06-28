/** Content for the 7 feature pages. Rendered by app/(marketing)/features/[slug]/page.tsx. */

export type VisualKey = 'ledger' | 'timeline' | 'coverage' | 'comparison' | 'aiCards' | 'claimCard'

export type FeatureSplit = {
  eyebrow?: string
  title: string
  body: string
  points: string[]
  visual: VisualKey
  reverse?: boolean
}

export type FeaturePage = {
  slug: string
  navTitle: string
  eyebrow: string
  h1: string
  lede: string
  splits: FeatureSplit[]
  cards?: { heading: string; intro?: string; items: { title: string; body: string }[] }
  faqs: { q: string; a: string }[]
}

export const FEATURE_PAGES: FeaturePage[] = [
  {
    slug: 'security-of-payment-compliance',
    navTitle: 'Security of Payment compliance',
    eyebrow: 'Security of Payment compliance',
    h1: 'Compliance built into every document.',
    lede:
      'Security of Payment legislation is strict and unforgiving. Astruct bakes the rules of the Act into how claims and schedules are made — the endorsement, the timeframes, the figures — so you are compliant by construction, not by chance.',
    splits: [
      {
        eyebrow: 'The right wording, every time',
        title: 'Statutory endorsement, applied automatically',
        body:
          'Most jurisdictions require (or strongly favour) a payment claim that identifies it as a claim under the Act. Astruct adds the correct endorsement for the jurisdiction of your contract — so a claim is unmistakably a payment claim, not just an invoice.',
        points: [
          'Jurisdiction-correct endorsement on every payment claim',
          'Reference date, claimed amount and supporting description in the right form',
          'No more invoices that fail to qualify as payment claims',
        ],
        visual: 'claimCard',
      },
      {
        eyebrow: 'The clock that matters',
        title: 'Statutory timeframes counted in business days',
        body:
          'A payment schedule is due within a set number of business days of a claim — and the count differs by state and skips public holidays. Astruct tracks the exact date the schedule is due, so the window is never missed by accident.',
        points: [
          'Business-day engine that knows each jurisdiction’s public holidays',
          '10 or 15 business-day schedule windows applied automatically',
          'Clear visibility of what is due, and when',
        ],
        visual: 'timeline',
        reverse: true,
      },
      {
        eyebrow: 'Figures you can defend',
        title: 'A ledger that computes the same way every time',
        body:
          'The amount claimed and the amount scheduled both flow from a deterministic ledger — original works, approved and unapproved variations, retention, and GST. The same inputs always produce the same figure, to the cent.',
        points: [
          'Deterministic A–K ledger across works, variations and retention',
          'GST handled correctly on the net claimed amount',
          'An auditable trail behind every number',
        ],
        visual: 'ledger',
      },
    ],
    faqs: [
      { q: 'Does Astruct make my claims legally compliant?', a: 'Astruct produces documents structured to the requirements of the security-of-payment legislation in your jurisdiction — the endorsement, the timeframes and the figures. It is a tool that helps you comply; it is not legal advice, and you should still check your contract and get advice where needed.' },
      { q: 'What happens if I miss a payment schedule deadline?', a: 'Under most Acts, failing to provide a payment schedule within the statutory window can make the respondent liable for the full claimed amount and open the door to adjudication or judgment. Astruct surfaces the deadline well before it arrives so it is not missed by accident.' },
      { q: 'Which Act applies to my contract?', a: 'Generally the Act of the state or territory where the construction work is carried out. Astruct applies the rules for the jurisdiction you set on the contract.' },
    ],
  },
  {
    slug: 'payment-claims',
    navTitle: 'Payment claims',
    eyebrow: 'Payment claims',
    h1: 'Compliant progress claims in minutes.',
    lede:
      'Build a payment claim that qualifies under the Act — the correct endorsement, a clear schedule of works, variations and retention — without wrestling a spreadsheet or risking the wrong wording.',
    splits: [
      {
        eyebrow: 'From schedule of values to claim',
        title: 'Claim against the works you actually did',
        body:
          'Set up the contract once with its schedule of values and retention terms. Each period, claim the percentage complete against each item — Astruct rolls it into a compliant payment claim with the maths done for you.',
        points: [
          'Claim by percentage complete or dollar value per item',
          'Approved and unapproved variations tracked separately',
          'Retention withheld and released handled automatically',
        ],
        visual: 'ledger',
      },
      {
        eyebrow: 'Unmistakably a payment claim',
        title: 'The endorsement and detail the Act expects',
        body:
          'A payment claim has to do more than ask for money. Astruct identifies the claim under the Act, ties it to a reference date, states the claimed amount and describes the work — the things that make it a claim, not just an invoice.',
        points: [
          'Jurisdiction-correct statutory endorsement',
          'Reference date and claimed amount stated clearly',
          'Professional PDF ready to serve',
        ],
        visual: 'claimCard',
        reverse: true,
      },
    ],
    cards: {
      heading: 'Everything a claim needs',
      items: [
        { title: 'Schedule of values', body: 'Claim progressively against each contract item, with prior claims carried forward.' },
        { title: 'Variations', body: 'Approved variations add to the claim; unapproved ones are tracked and claimable.' },
        { title: 'Retention', body: 'Retention withheld this period and released is computed into the net claimed amount.' },
        { title: 'GST', body: 'GST is applied to the net claimed amount so the total payable is correct.' },
        { title: 'Supporting statement', body: 'Attach the supporting statement and evidence where your contract or the Act requires it.' },
        { title: 'Serve & track', body: 'Generate the PDF, serve it, and know exactly when a schedule is due back.' },
      ],
    },
    faqs: [
      { q: 'What makes a document a valid payment claim?', a: 'Broadly, it must identify the construction work, state the claimed amount, and (in most jurisdictions) identify itself as a claim under the Act. Astruct includes these elements by default.' },
      { q: 'Can I claim for variations that haven’t been approved?', a: 'In many cases yes — the amount is claimed and then assessed. Astruct tracks approved and unapproved variations separately so both you and the assessor can see the position clearly.' },
      { q: 'How often can I make a payment claim?', a: 'Usually once per reference date under the contract or the Act. Astruct carries prior claims forward so each period builds on the last.' },
    ],
  },
  {
    slug: 'payment-schedules',
    navTitle: 'Payment schedules',
    eyebrow: 'Payment schedules',
    h1: 'Assess claims and respond on time.',
    lede:
      'Receive a payment claim, assess it line by line, and issue a payment schedule before the statutory deadline — with the scheduled amount and reasons set out the way the Act requires.',
    splits: [
      {
        eyebrow: 'Never miss the window',
        title: 'The deadline, tracked to the day',
        body:
          'The moment a claim is received, Astruct counts the business-day window for your jurisdiction and shows the date a schedule is due. Respond in time and you keep control of what gets paid.',
        points: [
          'Business-day countdown per jurisdiction, holidays excluded',
          'A clear queue of claims awaiting a schedule',
          'Issue before the deadline to avoid liability for the full claim',
        ],
        visual: 'timeline',
      },
      {
        eyebrow: 'Assess with reasons',
        title: 'Schedule the amount you’ll actually pay',
        body:
          'Certify each line in full, in part, or not at all, and record the reason. Astruct computes the scheduled amount and produces a payment schedule that states what you propose to pay and why.',
        points: [
          'Line-by-line certification with reasons for withholding',
          'Scheduled amount computed from your assessment',
          'A schedule that stands up if the matter goes to adjudication',
        ],
        visual: 'ledger',
        reverse: true,
      },
    ],
    faqs: [
      { q: 'How long do I have to give a payment schedule?', a: 'It depends on the jurisdiction — commonly 10 business days, and 15 in Queensland, South Australia and Western Australia — or earlier if your contract requires it. Astruct applies the right window for your contract.' },
      { q: 'What must a payment schedule contain?', a: 'It must identify the claim it responds to, state the amount the respondent proposes to pay (the scheduled amount), and — if that is less than claimed — explain why. Astruct captures all three.' },
      { q: 'What if I don’t respond in time?', a: 'In most jurisdictions the respondent becomes liable to pay the full claimed amount and the claimant may pursue judgment or adjudication. The deadline tracker exists to prevent exactly this.' },
    ],
  },
  {
    slug: 'variations',
    navTitle: 'Variations',
    eyebrow: 'Variations',
    h1: 'Keep every variation in the ledger.',
    lede:
      'Variations are where claims get messy. Astruct tracks each variation — claimed, approved, or in dispute — and flows it through the same deterministic ledger as the rest of the works.',
    splits: [
      {
        eyebrow: 'Approved vs unapproved',
        title: 'A clear position on every variation',
        body:
          'Approved variations add to the contract sum; unapproved ones are claimed and assessed. Astruct keeps the two separate so the numbers are never muddled and both sides can see exactly where each variation stands.',
        points: [
          'Approved variations roll into the contract total',
          'Unapproved variations claimed and tracked for assessment',
          'Every variation carried forward period to period',
        ],
        visual: 'ledger',
      },
      {
        eyebrow: 'Supported and defensible',
        title: 'Tie variations back to the contract',
        body:
          'Astruct’s AI can read your contract and flag a claimed variation that has no supporting direction — so disputes are caught before a claim goes out, not after.',
        points: [
          'AI checks variations against the contract for support',
          'Flag variations missing a signed direction',
          'Reduce the surface area for disputes and adjudication',
        ],
        visual: 'aiCards',
        reverse: true,
      },
    ],
    faqs: [
      { q: 'Can I claim a variation that wasn’t formally approved?', a: 'Often yes — it is claimed and then assessed by the respondent. Astruct tracks approved and unapproved variations separately so the assessment is transparent.' },
      { q: 'How does a variation affect the claimed amount?', a: 'Approved variations increase the approved total; unapproved variations are claimed on top and assessed. Both flow through the ledger into the net claimed amount.' },
    ],
  },
  {
    slug: 'delay-eot-notices',
    navTitle: 'NODs, EOTs & delay',
    eyebrow: 'NODs, EOTs & delay',
    h1: 'Notices and time claims, dated correctly.',
    lede:
      'Delay costs money and rights are lost on missed notices. Astruct helps you draft notices of delay and extension-of-time claims with the dates, references and detail your contract requires.',
    splits: [
      {
        eyebrow: 'Notice in time',
        title: 'Don’t lose a claim on a missed notice',
        body:
          'Most contracts require notice of a delay within a tight window, or the right to an extension is lost. Astruct helps you produce the notice promptly, with the contractual references and the delay clearly described.',
        points: [
          'Notices of delay with the contract references in place',
          'Extension-of-time claims tied to the cause and period of delay',
          'A clear record of what was sent and when',
        ],
        visual: 'claimCard',
      },
      {
        eyebrow: 'Checked before it goes',
        title: 'AI review for completeness',
        body:
          'Before a notice goes out, Astruct can check it for the elements your contract requires — so an EOT claim is not knocked back on a technicality.',
        points: [
          'Validity checks for notices and EOT claims',
          'Reads the contract for the relevant notice provisions',
          'Advisory only — you stay in control of what is sent',
        ],
        visual: 'aiCards',
        reverse: true,
      },
    ],
    faqs: [
      { q: 'Why do notices of delay matter so much?', a: 'Many contracts make timely notice a condition of an extension of time. Miss the notice window and you can lose the right to more time — and become exposed to liquidated damages. Prompt, correct notices protect that right.' },
      { q: 'Does Astruct lodge notices for me?', a: 'Astruct helps you draft and date notices correctly and keeps the record. Service is done by you in accordance with your contract.' },
    ],
  },
  {
    slug: 'security-retention',
    navTitle: 'Security & retention',
    eyebrow: 'Security & retention',
    h1: 'Retention and security, tracked to the cent.',
    lede:
      'Cash retention, bank guarantees and other security are easy to lose track of across a project. Astruct keeps a running position on what is withheld, what is released, and what is held as security.',
    splits: [
      {
        eyebrow: 'Withheld and released',
        title: 'A live retention position',
        body:
          'Each claim period, retention withheld and released flows through the ledger. Astruct keeps the running balance so the amount held is always clear — and released at the right milestones.',
        points: [
          'Retention withheld this period computed automatically',
          'Retention released tracked against milestones',
          'A running retention balance you can rely on',
        ],
        visual: 'ledger',
      },
      {
        eyebrow: 'Cash and guarantees',
        title: 'Security held, in one view',
        body:
          'Whether security is cash retention or a bank guarantee, Astruct records what is held and when it is due back — so nothing is forgotten at the end of a job.',
        points: [
          'Cash retention and bank guarantees recorded together',
          'Clear view of what is held and when it should be released',
          'Less risk of money or security left on the table',
        ],
        visual: 'claimCard',
        reverse: true,
      },
    ],
    faqs: [
      { q: 'How is retention treated in a payment claim?', a: 'Retention withheld reduces the amount payable this period, and retention released increases it. Astruct flows both through the ledger so the net claimed amount is correct.' },
      { q: 'Can Astruct track bank guarantees as well as cash retention?', a: 'Yes — security held as cash or as a guarantee is recorded so you can see the total position and when security is due to be returned.' },
    ],
  },
  {
    slug: 'artificial-intelligence',
    navTitle: 'Artificial intelligence',
    eyebrow: 'Artificial intelligence',
    h1: 'AI that checks validity — never the maths.',
    lede:
      'Astruct’s AI reads your contract and the Act, and checks a claim, schedule, variation or notice before it goes out. It flags problems and suggests fixes. It never changes a single figure.',
    splits: [
      {
        eyebrow: 'Validity, not arithmetic',
        title: 'Catch the problem before you serve',
        body:
          'A missing endorsement, a late response, a variation with no supporting direction — the AI flags these against your contract and the legislation, so issues are caught before a document goes out rather than at adjudication.',
        points: [
          'Validity checks for claims, schedules, variations, NODs and EOTs',
          'Reads the contract in your project library for context',
          'Plain-English findings you can act on',
        ],
        visual: 'aiCards',
      },
      {
        eyebrow: 'Deterministic by design',
        title: 'The figures stay exactly as computed',
        body:
          'The ledger is computed deterministically and the AI is strictly advisory. It can tell you something looks wrong — it cannot, and does not, alter the numbers. The judgement stays with you.',
        points: [
          'Figures are never changed by the AI',
          'Advice is separate from the deterministic ledger',
          'Auditable: the maths is always reproducible',
        ],
        visual: 'ledger',
        reverse: true,
      },
    ],
    faqs: [
      { q: 'Does the AI change my claim figures?', a: 'No. The ledger is deterministic and the AI is advisory only. It flags issues and suggests fixes but never alters a number.' },
      { q: 'What does the AI actually check?', a: 'It checks documents for validity against your contract and the relevant Act — the endorsement, timeframes, supporting directions for variations, and the elements a notice or schedule must contain.' },
      { q: 'Which model does Astruct use?', a: 'Astruct uses leading large language models for document understanding, with the deterministic figures kept entirely separate from anything the model produces.' },
    ],
  },
]

export const FEATURE_BY_SLUG = Object.fromEntries(FEATURE_PAGES.map((f) => [f.slug, f]))
