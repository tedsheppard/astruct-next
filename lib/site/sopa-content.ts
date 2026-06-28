/**
 * Authoritative-but-general content for the state Security of Payment pages.
 * Statutory windows mirror lib/pa/deadlines.ts (the product's own engine).
 * All pages carry a "general information, not legal advice" disclaimer.
 */

export type StateContent = {
  code: 'qld' | 'nsw' | 'vic' | 'sa' | 'wa' | 'act' | 'nt' | 'tas'
  model: 'east' | 'west'
  scheduleDays?: number
  claimWindow?: string
  intro: string
  whoApplies: string
  endorsementNote: string
  notes: { title: string; body: string }[]
  adjudication: string
  faqs: { q: string; a: string }[]
}

const eastClaim = (months: string) =>
  `A payment claim is served on or from a reference date under the contract. It must identify the construction work (or related goods and services), state the claimed amount, and request payment. Generally a claim can be made up to ${months} after the work to which it relates was last carried out — or within the period your contract allows, if longer.`

export const SOPA_CONTENT: Record<string, StateContent> = {
  nsw: {
    code: 'nsw',
    model: 'east',
    scheduleDays: 10,
    claimWindow: '12 months',
    intro:
      'The Building and Construction Industry Security of Payment Act 1999 (NSW) was the first of Australia’s "East Coast" security-of-payment laws. It gives anyone who carries out construction work, or supplies related goods and services, a statutory right to progress payments — and a fast, low-cost adjudication process to recover them.',
    whoApplies:
      'The Act applies to most construction contracts for work carried out in New South Wales, whether written or oral. There are limited exclusions (for example, some contracts with resident owners of a home).',
    endorsementNote:
      'Since the 2014 reforms, a NSW payment claim no longer has to state that it is made under the Act. Many claimants still include the endorsement, and head contractors must serve a supporting statement declaring that subcontractors have been paid. Astruct includes the endorsement and supports the supporting statement.',
    notes: [
      { title: 'Supporting statement', body: 'A head contractor serving a payment claim on a principal must include a supporting statement that subcontractors have been paid. Astruct prompts for and attaches it.' },
      { title: 'Time to pay', body: 'Unless the contract provides an earlier date, a progress payment to a head contractor is due 15 business days after a claim; to a subcontractor, 20 business days.' },
    ],
    adjudication:
      'If a respondent serves no payment schedule and does not pay, the claimed amount becomes a debt and the claimant can recover it or apply for adjudication. If a schedule is served but scheduled amount is short, the claimant can apply for adjudication, generally within 10 business days of receiving the schedule. An adjudicator is appointed through an authorised nominating authority and decides quickly.',
    faqs: [
      { q: 'Do I have to endorse a NSW payment claim?', a: 'No — since 2014 the endorsement is not required for a NSW payment claim, though many still include it. Head contractors must instead provide a supporting statement.' },
      { q: 'How long does the respondent have to provide a payment schedule?', a: 'Generally 10 business days after the claim is served, unless the contract requires a shorter period.' },
      { q: 'What if no payment schedule is given?', a: 'The respondent becomes liable to pay the full claimed amount, which the claimant can recover as a debt or pursue through adjudication.' },
    ],
  },
  vic: {
    code: 'vic',
    model: 'east',
    scheduleDays: 10,
    claimWindow: '3 months',
    intro:
      'The Building and Construction Industry Security of Payment Act 2002 (Vic) gives a statutory right to progress payments for construction work carried out in Victoria, backed by rapid adjudication. Victoria’s Act has some features of its own — notably the treatment of "excluded amounts".',
    whoApplies:
      'The Act applies to most construction contracts for work carried out in Victoria. Some domestic building contracts with a resident owner are excluded.',
    endorsementNote:
      'A Victorian payment claim must state that it is made under the Act. Astruct applies the correct endorsement automatically.',
    notes: [
      { title: 'Excluded amounts', body: 'Victoria limits certain amounts that can be claimed and adjudicated — including some variations and certain claims for damages or latent conditions. These "excluded amounts" cannot form part of the adjudicated amount. Astruct helps you keep claimable amounts and excluded amounts distinct.' },
      { title: 'Reference dates', body: 'Claims are tied to reference dates under the contract, with a fallback to the end of each named month if the contract is silent.' },
    ],
    adjudication:
      'Where a payment schedule is not provided or the scheduled amount is disputed, the claimant can apply for adjudication. Victoria’s excluded-amounts regime means an adjudicator must disregard excluded amounts when valuing the claim.',
    faqs: [
      { q: 'What are "excluded amounts" in Victoria?', a: 'They are amounts the Act says cannot be claimed or adjudicated under it — including certain variations and claims such as damages or latent conditions. They must be left out of the adjudicated amount.' },
      { q: 'Must a Victorian claim be endorsed?', a: 'Yes. A Victorian payment claim must state that it is made under the Building and Construction Industry Security of Payment Act 2002 (Vic).' },
      { q: 'How long is the payment schedule window?', a: 'Generally 10 business days after the claim, unless the contract requires a shorter period.' },
    ],
  },
  qld: {
    code: 'qld',
    model: 'east',
    scheduleDays: 15,
    claimWindow: '6 months',
    intro:
      'In Queensland, security of payment sits within the Building Industry Fairness (Security of Payment) Act 2017 (Qld) — the "BIF Act". It combines progress-payment rights, adjudication, and protections like the project trust account framework into a single statute administered by the QBCC.',
    whoApplies:
      'The BIF Act applies to most construction contracts for building work carried out in Queensland. Some contracts (for example certain work for resident owners) are excluded.',
    endorsementNote:
      'Under the BIF Act a payment claim does not have to state that it is made under the Act — it need only identify the work, state the amount, and request payment. Astruct still records the statutory basis clearly so the claim is unambiguous.',
    notes: [
      { title: '15 business days', body: 'A respondent must give a payment schedule within the period stated in the contract, or 15 business days after the claim — whichever is earlier.' },
      { title: 'Project & retention trusts', body: 'The BIF Act’s trust account framework protects retention and progress payments down the chain. Astruct keeps your retention position clear alongside your claims.' },
    ],
    adjudication:
      'If no payment schedule is given and the amount is not paid, the claimant can recover the amount as a debt or apply for adjudication through the QBCC. Strict timeframes apply to schedules, applications and responses.',
    faqs: [
      { q: 'Do I need to endorse a Queensland payment claim?', a: 'No. Under the BIF Act a payment claim does not need to state that it is made under the Act — it must identify the work, state the claimed amount and request payment.' },
      { q: 'How long does a respondent have to give a payment schedule?', a: 'The earlier of the period in the contract or 15 business days after the payment claim is given.' },
      { q: 'Who administers adjudication in Queensland?', a: 'The Queensland Building and Construction Commission (QBCC) administers the adjudication registry under the BIF Act.' },
    ],
  },
  sa: {
    code: 'sa',
    model: 'east',
    scheduleDays: 15,
    claimWindow: '6 months',
    intro:
      'The Building and Construction Industry Security of Payment Act 2009 (SA) follows the East Coast model, giving a statutory right to progress payments for construction work in South Australia and a rapid adjudication process to recover them.',
    whoApplies:
      'The Act applies to most construction contracts for work carried out in South Australia, with limited exclusions such as some contracts with resident owners.',
    endorsementNote:
      'A South Australian payment claim must state that it is made under the Act. Astruct applies the correct endorsement automatically.',
    notes: [
      { title: '15 business days', body: 'A respondent generally has 15 business days to provide a payment schedule, unless the contract requires a shorter period.' },
      { title: 'Reference dates', body: 'Claims are made on reference dates under the contract, with a monthly fallback where the contract is silent.' },
    ],
    adjudication:
      'If a payment schedule is not provided or the scheduled amount is short, the claimant can pursue the debt or apply for adjudication. An adjudicator is appointed through an authorised nominating authority.',
    faqs: [
      { q: 'How long is the South Australian payment schedule window?', a: 'Generally 15 business days after the claim, unless the contract provides a shorter period.' },
      { q: 'Must a South Australian claim be endorsed?', a: 'Yes — it must state that it is made under the Building and Construction Industry Security of Payment Act 2009 (SA).' },
    ],
  },
  wa: {
    code: 'wa',
    model: 'east',
    scheduleDays: 15,
    claimWindow: '6 months',
    intro:
      'Western Australia moved to the East Coast model with the Building and Construction Industry (Security of Payment) Act 2021 (WA), which replaced the old Construction Contracts Act 2004. It introduced statutory payment claims and schedules, adjudication, a retention trust scheme and a ban on unfair time bars — phased in across the industry from 2022.',
    whoApplies:
      'The 2021 Act applies to construction contracts for work in Western Australia, with the regime phased in by contract value and date. Older contracts may still fall under the Construction Contracts Act 2004.',
    endorsementNote:
      'A WA payment claim under the 2021 Act must state that it is made under the Act. Astruct applies the correct endorsement automatically.',
    notes: [
      { title: '15 business days', body: 'A respondent generally has 15 business days to provide a payment schedule under the 2021 Act, unless the contract requires a shorter period.' },
      { title: 'Retention trust & time bars', body: 'The 2021 Act introduced a retention money trust scheme and prohibits certain "unfair" time-bar clauses. Astruct keeps retention visible and helps you claim within time.' },
    ],
    adjudication:
      'The 2021 Act provides adjudication of payment disputes with set timeframes for applications and responses, replacing the older Construction Contracts Act process for new contracts.',
    faqs: [
      { q: 'Which WA Act applies to my contract?', a: 'New contracts generally fall under the Building and Construction Industry (Security of Payment) Act 2021 (WA), phased in from 2022. Older contracts may still be governed by the Construction Contracts Act 2004.' },
      { q: 'How long is the WA payment schedule window?', a: 'Generally 15 business days under the 2021 Act, unless the contract requires a shorter period.' },
    ],
  },
  act: {
    code: 'act',
    model: 'east',
    scheduleDays: 10,
    claimWindow: '12 months',
    intro:
      'The Building and Construction Industry (Security of Payment) Act 2009 (ACT) closely follows the NSW model, giving a statutory right to progress payments for construction work in the Australian Capital Territory and a rapid adjudication process.',
    whoApplies:
      'The Act applies to most construction contracts for work carried out in the ACT, with limited exclusions.',
    endorsementNote:
      'An ACT payment claim must state that it is made under the Act. Astruct applies the correct endorsement automatically.',
    notes: [
      { title: '10 business days', body: 'A respondent generally has 10 business days to provide a payment schedule, unless the contract requires a shorter period.' },
      { title: 'NSW-aligned', body: 'The ACT Act mirrors much of the NSW regime, so the claim, schedule and adjudication steps will be familiar to anyone working across the border.' },
    ],
    adjudication:
      'Where no payment schedule is given or the scheduled amount is disputed, the claimant can recover the debt or apply for adjudication through an authorised nominating authority.',
    faqs: [
      { q: 'How long is the ACT payment schedule window?', a: 'Generally 10 business days after the claim, unless the contract requires a shorter period.' },
      { q: 'Is the ACT Act similar to NSW?', a: 'Yes — the ACT Act closely follows the NSW model for claims, schedules and adjudication.' },
    ],
  },
  tas: {
    code: 'tas',
    model: 'east',
    scheduleDays: 10,
    claimWindow: '12 months',
    intro:
      'The Building and Construction Industry Security of Payment Act 2009 (Tas) gives a statutory right to progress payments for construction work in Tasmania, with adjudication available to resolve payment disputes quickly.',
    whoApplies:
      'The Act applies to most construction contracts for work carried out in Tasmania, with limited exclusions such as some contracts with resident owners.',
    endorsementNote:
      'A Tasmanian payment claim must state that it is made under the Act. Astruct applies the correct endorsement automatically.',
    notes: [
      { title: 'Payment schedule window', body: 'A respondent generally responds within 10 business days, or the period stated in the contract. Always check the period your contract sets.' },
      { title: 'Reference dates', body: 'Claims are tied to reference dates under the contract, with a fallback where the contract is silent.' },
    ],
    adjudication:
      'If a payment schedule is not provided or the scheduled amount is short, the claimant can pursue the debt or apply for adjudication.',
    faqs: [
      { q: 'Does a Tasmanian claim need an endorsement?', a: 'Yes — it must state that it is made under the Building and Construction Industry Security of Payment Act 2009 (Tas).' },
      { q: 'How long is the payment schedule window in Tasmania?', a: 'Generally 10 business days, or the period your contract sets if shorter. Check your contract.' },
    ],
  },
  nt: {
    code: 'nt',
    model: 'west',
    claimWindow: undefined,
    intro:
      'The Northern Territory uses a different model. The Construction Contracts (Security of Payments) Act 2004 (NT) follows the "West Coast" approach: rather than a payment-claim-and-schedule regime, it implies fair payment terms into construction contracts and lets a party take a "payment dispute" to rapid adjudication.',
    whoApplies:
      'The Act applies to construction contracts for work carried out in the Northern Territory. Where a contract is silent on matters like progress claims, valuation or time for payment, the Act implies provisions to fill the gap.',
    endorsementNote:
      'Because the NT uses the Construction Contracts model, there is no mandatory "made under the Act" endorsement in the same way as the East Coast states. The focus is on the contract’s payment terms (or the implied terms) and the right to adjudicate a payment dispute.',
    notes: [
      { title: 'Implied provisions', body: 'If your contract does not deal with progress claims, valuation, or the time for payment, the Act implies terms so you are not left without a payment mechanism.' },
      { title: 'Payment disputes', body: 'When a payment is not made (or a claim is rejected), a "payment dispute" arises, and either party can apply for adjudication within the period set by the Act.' },
    ],
    adjudication:
      'A party with a payment dispute applies for adjudication, the other side responds, and an appointed adjudicator determines the dispute within a short statutory timeframe. The determination is binding on an interim basis and can be enforced.',
    faqs: [
      { q: 'Why is the Northern Territory different?', a: 'The NT (like Western Australia before 2022) uses the "West Coast" Construction Contracts model. Instead of a payment-claim-and-schedule process, it implies fair payment terms into contracts and provides adjudication of payment disputes.' },
      { q: 'Do I serve a payment schedule in the NT?', a: 'Not in the East Coast sense. The NT regime centres on the contract’s payment terms (or implied terms) and the right to adjudicate a payment dispute, rather than a mandatory payment schedule within a set number of business days.' },
    ],
  },
}
