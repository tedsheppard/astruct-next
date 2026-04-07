/**
 * Seed polished demo data for video recording.
 * Creates "Riverside Towers — Mixed Use Development" with full RAG pipeline.
 * Run with: npx tsx scripts/seed-demo.ts
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── Document texts ────────────────────────────────────────────────────────────

const GENERAL_CONDITIONS_TEXT = `
GENERAL CONDITIONS OF CONTRACT AS4000-2025
RIVERSIDE TOWERS — MIXED USE DEVELOPMENT

CLAUSE 13 — VARIATIONS

13.1 The Superintendent may direct the Contractor in writing to vary the work under the Contract. A variation may involve any one or more of the following:
(a) an increase or decrease in the quantity of any item of work under the Contract;
(b) a change to the character or quality of any material, fitting, or work;
(c) a change in the levels, lines, positions, or dimensions of any part of the Works;
(d) the execution of additional work not originally contemplated by the Contract;
(e) the demolition, removal, or disposal of work, materials, or fittings no longer required.

13.2 The Contractor shall not vary the work under the Contract unless directed by the Superintendent in accordance with this Clause. Any variation carried out without a prior written direction shall not entitle the Contractor to additional payment or an extension of time.

13.3 Upon receiving a direction to vary the work, the Contractor shall, within 14 days, submit to the Superintendent a detailed variation quotation including:
(a) a full description of the varied work and methodology;
(b) an itemised breakdown of all direct and indirect costs, including labour, materials, plant, subcontractor charges, and margin;
(c) the estimated time required to carry out the variation and its impact on the construction programme;
(d) the effect, if any, on the Contract Sum and the Date for Practical Completion;
(e) any impact on existing approvals, certifications, or compliance requirements.

13.4 If the parties cannot agree on the valuation of a variation within 14 days of the Contractor's quotation, the variation shall be valued by the Superintendent on the following basis:
(a) where the variation is of a similar character and executed under similar conditions to work priced in the Contract, at the rates and prices in the Contract;
(b) where the variation is not of a similar character or not executed under similar conditions, at rates and prices that are fair and reasonable having regard to the nature, extent, and complexity of the variation;
(c) where neither paragraph (a) nor (b) applies, on a cost-plus basis with a margin not exceeding the percentage stated in the Annexure.

13.5 A direction to vary the work shall not invalidate the Contract, and the Contractor shall carry out the variation promptly notwithstanding that the valuation has not been agreed or determined. The Contractor's obligation to comply with a variation direction is not conditional upon agreement as to price.

CLAUSE 25 — DISPUTES

25.1 If a dispute or difference arises between the parties in connection with the Contract (Dispute), either party may give the other party and the Superintendent written notice of the Dispute (Notice of Dispute), setting out in reasonable detail:
(a) the nature and circumstances of the Dispute;
(b) the provision of the Contract to which the Dispute relates;
(c) the relief or remedy sought by the notifying party.

25.2 Within 14 days of the Notice of Dispute, senior representatives of each party with authority to settle the Dispute shall confer at least once to attempt in good faith to resolve the Dispute by negotiation. If the Dispute is not resolved within 28 days of the Notice of Dispute, either party may invoke the dispute resolution procedures in Clause 42.

25.3 Despite the existence of a Dispute, each party shall continue to perform its obligations under the Contract. The Contractor shall continue to carry out the work in accordance with the Contract and any directions of the Superintendent, and the Principal shall continue to make payments in accordance with Clause 37, in each case without prejudice to the parties' respective rights and entitlements.

25.4 Neither party shall be entitled to suspend or slow the progress of the Works by reason of a Dispute unless expressly permitted by the Contract or by law. Any costs incurred by a party in connection with a Dispute shall be borne by that party unless otherwise determined in the dispute resolution proceedings.

25.5 Nothing in this Clause prevents a party from seeking urgent interlocutory or injunctive relief from a court of competent jurisdiction at any time.

CLAUSE 33 — DELAY

33.1 If the Contractor is or will be delayed in reaching Practical Completion by a cause beyond the reasonable control of the Contractor (a Qualifying Cause of Delay), the Contractor shall give the Superintendent written notice of the delay within 28 days of the Contractor first becoming aware of the cause of delay. The notice shall include:
(a) the Qualifying Cause of Delay relied upon, with sufficient particulars to enable the Superintendent to assess the claim;
(b) the estimated period of delay to Practical Completion and the basis of the estimate;
(c) the measures the Contractor proposes to take to avoid or minimise the delay.

33.2 Qualifying Causes of Delay include:
(a) an act, default, or omission of the Principal, the Superintendent, or their consultants, employees, or agents;
(b) a variation directed under Clause 13;
(c) latent conditions as defined in the Contract;
(d) inclement weather which, having regard to the climatic data for the site locality, could not reasonably have been anticipated by a competent and experienced contractor;
(e) industrial action beyond the Contractor's control affecting the whole or a significant part of the building and construction industry;
(f) delays caused by civil authorities, utility service providers, or regulatory bodies;
(g) any other cause stated in the Annexure as a Qualifying Cause of Delay;
(h) a force majeure event including pandemic, epidemic, or government-imposed restrictions.

33.3 If the Contractor fails to give the notice required by Clause 33.1 within the 28-day time limit, the Contractor is not entitled to an extension of time unless the Contractor can demonstrate that the failure to give timely notice has not prejudiced the Principal's ability to mitigate the effects of the delay or take reasonable steps to minimise loss.

33.4 The Superintendent shall, within 28 days of receiving the Contractor's delay notice and all reasonably requested supporting information, assess the delay and advise the parties of the Superintendent's assessment. The Superintendent must act as an independent certifier in making this assessment.

CLAUSE 34 — EXTENSION OF TIME

34.1 If the Superintendent is satisfied that the Contractor has been delayed in reaching Practical Completion by a Qualifying Cause of Delay, and the Contractor has given notice in accordance with Clause 33, the Superintendent shall grant to the Contractor an extension of time for Practical Completion that the Superintendent considers the Contractor is fairly entitled to.

34.2 In assessing any extension of time, the Superintendent shall have regard to:
(a) the extent to which the Qualifying Cause of Delay has actually delayed or will delay Practical Completion, assessed on a net basis taking into account the Contractor's actual progress at the time of the delay event;
(b) any concurrent delays not caused by a Qualifying Cause of Delay;
(c) any failure by the Contractor to take reasonable steps to mitigate or avoid the delay;
(d) the latest approved construction programme.

34.3 The Superintendent may at any time and from time to time, including after the Date for Practical Completion has passed, grant an extension of time, whether or not the Contractor has made a claim. The Superintendent shall not reduce an extension of time previously granted.

34.4 If the Superintendent grants an extension of time after the Principal has deducted liquidated damages, the Principal shall forthwith repay to the Contractor any liquidated damages which were not due having regard to the extension. Any such repayment shall include interest at the rate stated in the Annexure from the date of deduction to the date of repayment.

34.5 Notwithstanding any other provision of the Contract, the Contractor shall use reasonable endeavours to avoid or minimise any delay to Practical Completion and shall take all steps reasonably available to proceed with the work expeditiously.

CLAUSE 37 — PAYMENT

37.1 The Contractor shall submit progress claims to the Superintendent at the times stated in the Annexure or, if no times are stated, at the end of each calendar month. Each progress claim shall be in writing and shall set out:
(a) the value of work carried out under the Contract since the last progress claim, calculated by reference to the schedule of rates, bill of quantities, or other pricing mechanism in the Contract;
(b) the value of unfixed materials and goods delivered to the site or stored off-site with the Principal's prior written consent;
(c) any amounts claimed for variations that have been valued or agreed;
(d) any other amounts claimed under the Contract, including claims for additional costs, disruption, prolongation, or acceleration costs, with supporting particulars.

37.2 Within 15 business days of receiving a progress claim that complies with this Clause, the Superintendent shall assess the claim and issue a progress certificate stating the amount the Superintendent has assessed as due and payable to the Contractor. The progress certificate shall identify:
(a) the amount of the claim;
(b) the amount assessed as due;
(c) the reasons for any difference between the amount claimed and the amount assessed, with sufficient detail to enable the Contractor to understand the basis of the assessment.

37.3 The Principal shall pay to the Contractor the amount stated in the progress certificate within the time stated in the Annexure from the date of the progress certificate. If no time is stated, payment shall be made within 15 business days.

37.4 The issue of a progress certificate and the making of any payment shall not constitute approval of the work or evidence that the work has been carried out in accordance with the Contract. The Superintendent's certification and the Principal's payment are made on account only and are subject to final adjustment.

37.5 The Contractor's entitlement to payment under the Building Industry Fairness (Security of Payment) Act 2017 (Qld) or equivalent state legislation (Security of Payment Legislation) is not affected by this Clause. Payment claims under Security of Payment Legislation must comply with the requirements of the applicable Act and are separate from claims under this Contract.

CLAUSE 42 — DISPUTE RESOLUTION

42.1 If a Dispute is not resolved by negotiation under Clause 25.2 within 28 days of the Notice of Dispute, either party may by written notice to the other refer the Dispute to mediation. The mediation shall be conducted:
(a) by a mediator agreed by the parties or, failing agreement within 7 days of the referral notice, a mediator appointed by the Resolution Institute or the Australian Disputes Centre;
(b) in accordance with the mediation rules of the Resolution Institute current at the date of the referral;
(c) at a location agreed by the parties or, failing agreement, in Brisbane, Queensland.

42.2 The parties shall participate in the mediation in good faith and shall each be represented by a person with authority to settle the Dispute. The costs of the mediator shall be borne equally by the parties, but each party shall bear its own costs of and incidental to the mediation, including legal representation.

42.3 If the Dispute is not resolved by mediation within 42 days of the referral to mediation (or such longer period as the parties may agree in writing), either party may by written notice to the other refer the Dispute to arbitration. The arbitration shall be conducted:
(a) by a single arbitrator agreed by the parties or, failing agreement within 14 days of the referral, an arbitrator appointed by the Resolution Institute;
(b) in accordance with the arbitration rules of the Resolution Institute current at the date of the referral;
(c) in Brisbane, Queensland, unless the parties agree otherwise;
(d) in accordance with the Commercial Arbitration Act 2013 (Qld).

42.4 The arbitrator's award shall be final and binding on the parties, subject only to any right of appeal under the Commercial Arbitration Act 2013 (Qld). The parties agree that the arbitrator shall have the power to award costs and to make interim awards and orders.

42.5 Nothing in this Clause prevents a party from commencing court proceedings relating to a Dispute if the other party fails to participate in mediation or arbitration in good faith, or if urgent relief is required that cannot practically be obtained through mediation or arbitration.
`

const SPECIAL_CONDITIONS_TEXT = `
SPECIAL CONDITIONS OF CONTRACT
RIVERSIDE TOWERS — MIXED USE DEVELOPMENT
CONTRACT REF: RDG-2026-001

These Special Conditions amend and supplement the General Conditions of Contract AS4000-2025 for the Riverside Towers Mixed Use Development project. In the event of any inconsistency between the General Conditions and these Special Conditions, the Special Conditions shall prevail.

1. AMENDED TIME BAR — CLAUSE 33

1.1 Clause 33.1 of the General Conditions is amended by deleting "28 days" and substituting "21 days". The Contractor must provide written notice of any delay to the Superintendent within 21 days of the Contractor first becoming aware of the cause of delay.

1.2 Clause 33.3 of the General Conditions is deleted and replaced with: "If the Contractor fails to give the notice required by Clause 33.1 within the 21-day time limit, the Contractor shall forfeit any entitlement to an extension of time in respect of the relevant delay event, unless the Contractor can demonstrate that the failure to give timely notice did not cause the Principal any prejudice whatsoever."

1.3 Notwithstanding any other provision of the Contract, the Contractor acknowledges that strict compliance with the notice requirements under Clause 33 is a condition precedent to any entitlement to an extension of time or delay costs.

2. LIQUIDATED DAMAGES

2.1 The rate of liquidated damages payable under Clause 36 of the General Conditions shall be $12,500.00 (twelve thousand five hundred dollars) per calendar day for every day after the Date for Practical Completion (as adjusted) to and including the Date of Practical Completion.

2.2 The maximum aggregate amount of liquidated damages that the Principal may deduct or recover under the Contract shall be capped at 10% of the Contract Sum, being $2,450,000.00.

2.3 For the avoidance of doubt, the parties agree that the rate of liquidated damages stated in Special Condition 2.1 is a genuine pre-estimate of the loss and damage the Principal will likely suffer as a result of the Contractor's failure to achieve Practical Completion by the Date for Practical Completion. This rate has been calculated having regard to the Principal's financing costs, loss of rental income, and additional consultancy fees associated with late completion.

3. RETENTION

3.1 Retention shall be deducted from each progress payment at the rate of 5% of the value of work carried out until the total retention held reaches 5% of the Contract Sum (being $1,225,000.00).

3.2 Upon the issue of the Certificate of Practical Completion, the Principal shall release 50% of the retention money held (being $612,500.00), subject to the Contractor providing all required close-out documentation including as-built drawings, operation and maintenance manuals, and warranty certificates.

3.3 The balance of the retention money shall be released upon the expiry of the Defects Liability Period, provided that the Contractor has rectified all notified defects to the satisfaction of the Superintendent.

3.4 The Principal shall hold retention money on trust for the Contractor in a separate bank account with an authorised deposit-taking institution. Interest accrued on the retention money shall be for the benefit of the Contractor.

4. PROGRESS CLAIMS — SUPPLEMENTARY REQUIREMENTS

4.1 In addition to the requirements of Clause 37 of the General Conditions, each progress claim submitted by the Contractor must include:
(a) a statutory declaration from the Contractor confirming that all subcontractors and suppliers have been paid amounts due under previous progress certificates;
(b) a detailed programme update showing actual progress against the approved construction programme;
(c) a forecast of the cash flow for the remainder of the project;
(d) evidence of current insurance policies as required by the Contract.

4.2 The Superintendent may withhold certification of any progress claim that does not comply with the requirements of this Special Condition 4, until the Contractor provides the required documentation.

5. VARIATION VALUATION — MARGIN

5.1 For the purposes of Clause 13.4(c) of the General Conditions, the margin applicable to cost-plus variations shall not exceed 15% on the Contractor's direct costs for work carried out by the Contractor's own forces, and 5% on the cost of work carried out by subcontractors.

6. DEFECTS LIABILITY PERIOD

6.1 The Defects Liability Period shall be 24 months from the Date of Practical Completion.

6.2 For structural waterproofing work, the Defects Liability Period shall be extended to 10 years from the Date of Practical Completion, during which period the Contractor shall remain liable for any defects in waterproofing that become apparent.
`

const VARIATION_DIRECTION_TEXT = `
VARIATION DIRECTION VD-007
BASEMENT WATERPROOFING UPGRADE

Date: 4 March 2026
Contract: Riverside Towers — Mixed Use Development
Reference: RDG-2026-001
From: Marshall & Associates (Superintendent)
To: Apex Construction Pty Ltd (Contractor)

Dear Sir/Madam,

RE: VARIATION DIRECTION — ADDITIONAL BASEMENT WATERPROOFING WORK
Clause 13.3, General Conditions AS4000-2025

Pursuant to Clause 13.1 of the General Conditions of Contract AS4000-2025, I hereby direct you to carry out the following variation to the Works:

1. SCOPE OF VARIED WORK

1.1 The Contractor is directed to upgrade the basement waterproofing system across all three basement levels (B1, B2, and B3) of Riverside Towers from the originally specified Type B waterproofing membrane system to a composite waterproofing system comprising:
(a) a primary crystalline waterproofing admixture applied to all concrete pours for basement slabs, walls, and columns;
(b) a secondary externally applied sheet membrane (minimum 2.0mm HDPE) to all below-ground external walls;
(c) additional drainage cells and associated drainage infrastructure along the full perimeter of the basement excavation;
(d) injection grouting provisions at all construction joints, penetrations, and day joints.

1.2 This direction is issued following the discovery of a higher-than-anticipated groundwater table during excavation of the B3 level, as documented in the geotechnical investigation report dated 20 February 2026 prepared by Soil Dynamics Pty Ltd (Report Ref: SD-RT-2026-018).

2. PROGRAMME IMPACT

2.1 The Contractor is requested to advise the Superintendent of any impact this variation may have on the Date for Practical Completion, in accordance with Clause 13.3(d) of the General Conditions.

2.2 Preliminary assessment suggests the additional waterproofing work may extend the basement construction programme by approximately 4 to 6 weeks, though the Contractor is invited to provide its own assessment.

3. VARIATION QUOTATION

3.1 In accordance with Clause 13.3 of the General Conditions, the Contractor shall submit a detailed variation quotation within 14 days of this direction, addressing all matters set out in Clause 13.3(a) through (e).

3.2 Pending agreement on the variation valuation, the Contractor is directed to proceed with the varied work immediately to avoid further delay to the construction programme. This direction is made pursuant to Clause 13.5 of the General Conditions.

4. DOCUMENTS

The following documents are enclosed for the Contractor's reference:
(a) Geotechnical Investigation Report SD-RT-2026-018 (Soil Dynamics Pty Ltd)
(b) Revised Structural Drawings SK-B-101 Rev C through SK-B-112 Rev C
(c) Waterproofing Specification Addendum WP-ADD-001
(d) Manufacturer's product data sheets for approved crystalline admixture system

Please acknowledge receipt of this direction within 2 business days.

Yours faithfully,

James Marshall
Director
Marshall & Associates
Superintendent under the Contract
`

const PROGRESS_CLAIM_TEXT = `
PROGRESS CLAIM #6
RIVERSIDE TOWERS — MIXED USE DEVELOPMENT

Claim Period: 1 March 2026 to 31 March 2026
Contract Reference: RDG-2026-001
Date of Submission: 31 March 2026
From: Apex Construction Pty Ltd (Contractor)
To: Marshall & Associates (Superintendent)

1. CLAIM SUMMARY

This Progress Claim is submitted in accordance with Clause 37.1 of the General Conditions of Contract AS4000-2025 and Special Condition 4.

Contract Sum:                          $24,500,000.00
Previously Certified (Claims 1-5):    $6,840,000.00
Work Executed This Period:             $1,425,000.00
Unfixed Materials on Site:               $187,500.00
Approved Variations to Date:             $312,000.00
Total Claimed to Date:                 $8,764,500.00
Less Retention (5%):                     $438,225.00
Net Amount Claimed to Date:            $8,326,275.00
Less Previously Paid:                  $6,498,000.00
Amount Due This Claim:                 $1,828,275.00

2. WORK COMPLETED THIS PERIOD

2.1 Basement Structure (B1-B3):
- Completion of B3 slab pour (Zone 2 and Zone 3) — $385,000.00
- B2 level columns and shear walls — $220,000.00
- B1 level formwork and reinforcement (50% complete) — $175,000.00

2.2 Ground Floor Structure:
- Ground floor transfer slab formwork (commenced) — $95,000.00
- Crane base and mast section 2 installation — $65,000.00

2.3 Waterproofing (Variation VD-007):
- Procurement of crystalline admixture system — $112,000.00
- HDPE membrane installation B3 level (60% complete) — $148,000.00
- Perimeter drainage cells B3 level — $87,000.00

2.4 Services:
- Electrical rough-in basement levels — $68,000.00
- Hydraulic services B3 level — $42,000.00
- Fire services basement risers — $28,000.00

3. UNFIXED MATERIALS ON SITE

Reinforcement steel (Grade N500, various sizes):     $95,000.00
Formwork materials (Doka system components):          $52,500.00
HDPE membrane rolls (remaining from VD-007 order):    $40,000.00
Total:                                               $187,500.00

4. VARIATIONS

4.1 Approved Variations:
VD-003: Additional piling — rock encountered          $145,000.00 (approved)
VD-005: Modified fire stair layout                     $67,000.00 (approved)
VD-007: Basement waterproofing upgrade                $347,000.00 (claim, pending valuation)
Subtotal approved/claimed:                            $559,000.00
Less: previously claimed                              $247,000.00
Variations this period:                               $312,000.00

5. PROGRAMME UPDATE

5.1 The project is currently tracking 2 weeks behind the approved baseline programme, primarily due to:
(a) Additional excavation time required for unexpected rock at B3 level (VD-003);
(b) Commencement of varied waterproofing work (VD-007);
(c) Delayed delivery of structural steel elements for the transfer slab (supplier delay).

5.2 The Contractor intends to submit a formal extension of time claim in respect of items (a), (b), and (c) within the notice period prescribed by Clause 33 (as amended by Special Condition 1).

6. STATUTORY DECLARATION

I, David Chen, being the Construction Director of Apex Construction Pty Ltd, do solemnly and sincerely declare that all subcontractors and suppliers have been paid all amounts due and payable under previous progress certificates issued under this Contract, in accordance with Special Condition 4.1(a).

Signed: David Chen
Position: Construction Director
Date: 31 March 2026
ABN: 98 765 432 100
`

// ─── Main seed function ────────────────────────────────────────────────────────

async function main() {
  console.log('=== Seeding demo data: Riverside Towers ===\n')

  // ── Get logged-in user from profiles table ──
  const { data: profiles } = await supabase.from('profiles').select('id, email').limit(1).single()

  if (!profiles) {
    console.error('No user profile found in the database.')
    process.exit(1)
  }

  const userId = profiles.id
  console.log('Using user:', profiles.email, userId)

  // ── Rename the old RAG Test Contract ──
  const { data: oldContract } = await supabase
    .from('contracts')
    .select('id')
    .eq('user_id', userId)
    .eq('name', 'RAG Test Contract - Riverstone Infrastructure')
    .limit(1)

  if (oldContract && oldContract.length > 0) {
    const { error: renameError } = await supabase
      .from('contracts')
      .update({
        name: 'Riverstone Infrastructure — Subcontract 7216-SUB-090',
        reference_number: '7216-SUB-090',
      })
      .eq('id', oldContract[0].id)

    if (renameError) {
      console.error('Failed to rename old contract:', renameError)
    } else {
      console.log('Renamed old RAG Test Contract → Riverstone Infrastructure — Subcontract 7216-SUB-090')
    }
  }

  // ── Update user profile ──
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      name: 'Ted Sheppard',
      company_name: 'Apex Construction Pty Ltd',
      company_abn: '98 765 432 100',
      company_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
    })
    .eq('id', userId)

  if (profileError) {
    console.error('Failed to update profile:', profileError)
  } else {
    console.log('Updated user profile')
  }

  // ── Clean up existing demo contract if present ──
  const { data: existing } = await supabase
    .from('contracts')
    .select('id')
    .eq('user_id', userId)
    .eq('reference_number', 'RDG-2026-001')
    .limit(1)

  if (existing && existing.length > 0) {
    console.log('Existing demo contract found — deleting...')
    // Delete dependents in order
    for (const contract of existing) {
      await supabase.from('document_chunks').delete().eq('contract_id', contract.id)
      await supabase.from('obligations').delete().eq('contract_id', contract.id)

      // Delete chat messages via sessions
      const { data: sessions } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('contract_id', contract.id)
      if (sessions) {
        for (const s of sessions) {
          await supabase.from('chat_messages').delete().eq('session_id', s.id)
        }
      }
      await supabase.from('chat_sessions').delete().eq('contract_id', contract.id)
      await supabase.from('documents').delete().eq('contract_id', contract.id)
      await supabase.from('contracts').delete().eq('id', contract.id)
    }
    console.log('Cleaned up old demo data')
  }

  // ── Create contract ──
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      user_id: userId,
      name: 'Riverside Towers — Mixed Use Development',
      reference_number: 'RDG-2026-001',
      contract_form: 'AS4000-2025',
      party1_role: 'Principal',
      party1_name: 'Riverside Development Group Pty Ltd',
      party1_address: 'Level 12, 100 Eagle Street, Brisbane QLD 4000',
      party2_role: 'Contractor',
      party2_name: 'Apex Construction Pty Ltd',
      party2_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
      administrator_role: 'Superintendent',
      administrator_name: 'Marshall & Associates',
      administrator_address: 'Suite 8, 55 Elizabeth Street, Brisbane QLD 4000',
      user_is_party: 'party2',
      date_of_contract: '2026-03-01',
      date_practical_completion: '2027-12-15',
      defects_liability_period: '24 months',
      contract_sum: 24500000,
      status: 'active',
    })
    .select('id')
    .single()

  if (contractError || !contract) {
    console.error('Failed to create contract:', contractError)
    process.exit(1)
  }

  console.log('Created contract:', contract.id)

  // ── Create documents & chunk/embed ──
  const documents = [
    {
      filename: 'AS4000-2025 General Conditions — Riverside Towers.pdf',
      category: '01_contract' as const,
      summary: 'General Conditions of Contract AS4000-2025 covering variations (Clause 13), disputes (Clause 25), delay (Clause 33), extension of time (Clause 34), payment (Clause 37), and dispute resolution (Clause 42)',
      text: GENERAL_CONDITIONS_TEXT,
    },
    {
      filename: 'Special Conditions — Riverside Towers.pdf',
      category: '01_contract' as const,
      summary: 'Special Conditions amending AS4000-2025 including 21-day time bars, LAD rate of $12,500/day, 5% retention, 24-month defects liability, and variation margin caps',
      text: SPECIAL_CONDITIONS_TEXT,
    },
    {
      filename: 'Variation Direction VD-007 — Basement Waterproofing Upgrade.pdf',
      category: '07_variations' as const,
      summary: 'Superintendent direction for upgraded basement waterproofing across B1-B3 levels due to higher-than-anticipated groundwater table, issued under Clause 13.3',
      text: VARIATION_DIRECTION_TEXT,
    },
    {
      filename: 'Progress Claim #6 — March 2026.pdf',
      category: '10_payment_claims' as const,
      summary: 'Monthly progress claim for March 2026 totalling $1,828,275.00 including basement structure, waterproofing variation work, and programme update',
      text: PROGRESS_CLAIM_TEXT,
    },
  ]

  const { chunkText, extractClauseNumbers, detectSectionHeading } = await import('../lib/chunking')

  for (const doc of documents) {
    console.log(`\nProcessing: ${doc.filename}`)

    // Insert document
    const { data: dbDoc, error: docError } = await supabase
      .from('documents')
      .insert({
        contract_id: contract.id,
        user_id: userId,
        filename: doc.filename,
        file_type: 'application/pdf',
        file_size: doc.text.length,
        category: doc.category,
        ai_summary: doc.summary,
        extracted_text: doc.text,
        processed: true,
      })
      .select('id')
      .single()

    if (docError || !dbDoc) {
      console.error(`  Failed to create document: ${docError?.message}`)
      continue
    }
    console.log(`  Created document: ${dbDoc.id}`)

    // Chunk
    const chunks = chunkText(doc.text)
    console.log(`  Chunked into ${chunks.length} chunks`)

    // Embed in batches
    const allEmbeddings: number[][] = []
    const batchSize = 20
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: batch,
        dimensions: 1536,
      })
      allEmbeddings.push(...response.data.map(d => d.embedding))
      console.log(`  Embedded ${Math.min(i + batchSize, chunks.length)}/${chunks.length}`)
    }

    // Insert chunks
    const chunkRows = chunks.map((content, index) => ({
      document_id: dbDoc.id,
      contract_id: contract.id,
      chunk_index: index,
      content,
      embedding: JSON.stringify(allEmbeddings[index]),
      section_heading: detectSectionHeading(content),
      clause_numbers: extractClauseNumbers(content),
      metadata: {
        filename: doc.filename,
        chunk_of: chunks.length,
      },
    }))

    const { error: chunkError } = await supabase
      .from('document_chunks')
      .insert(chunkRows)

    if (chunkError) {
      console.error(`  Chunk insert error: ${chunkError.message}`)
    } else {
      console.log(`  Inserted ${chunks.length} chunks with embeddings`)
    }
  }

  // ── Create obligations ──
  const today = new Date()

  const obligations = [
    {
      contract_id: contract.id,
      user_id: userId,
      description: 'EOT Notice due — Variation VD-007 delay impact',
      clause_reference: 'Clause 33.1 / Special Condition 1.1',
      due_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      notice_type: 'extension_of_time',
      completed: false,
      source: 'manual',
    },
    {
      contract_id: contract.id,
      user_id: userId,
      description: 'Progress Claim #7 submission deadline',
      clause_reference: 'Clause 37.1',
      due_date: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      notice_type: 'payment_claim',
      completed: false,
      source: 'manual',
    },
    {
      contract_id: contract.id,
      user_id: userId,
      description: 'Respond to Superintendent\'s direction RE: facade panels',
      clause_reference: 'Clause 13.3',
      due_date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'overdue',
      notice_type: 'variation',
      completed: false,
      source: 'manual',
    },
  ]

  const { error: obligationsError } = await supabase
    .from('obligations')
    .insert(obligations)

  if (obligationsError) {
    console.error('Failed to create obligations:', obligationsError)
  } else {
    console.log('\nCreated 3 obligations (amber / green / red)')
  }

  // ── Create chat session with pre-loaded exchanges ──
  const { data: session, error: sessionError } = await supabase
    .from('chat_sessions')
    .insert({
      contract_id: contract.id,
      user_id: userId,
      title: 'EOT entitlements for VD-007 waterproofing variation',
    })
    .select('id')
    .single()

  if (sessionError || !session) {
    console.error('Failed to create chat session:', sessionError)
  } else {
    const messages = [
      {
        session_id: session.id,
        role: 'user',
        content: 'What are our time bar obligations for claiming an extension of time in relation to the waterproofing variation VD-007?',
        created_at: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        session_id: session.id,
        role: 'assistant',
        content: `Under the Contract, you have a **21-day time bar** for notifying delay claims — this is shorter than the standard 28-day period in the General Conditions because **Special Condition 1.1** amends Clause 33.1.

**Key requirements for your EOT notice:**

1. **Notice deadline:** You must give the Superintendent written notice within **21 days** of first becoming aware of the delay caused by VD-007 (Special Condition 1.1, amending Clause 33.1).

2. **Notice contents** (Clause 33.1): Your notice must include:
   - The Qualifying Cause of Delay relied upon — here, a variation directed under Clause 13 (see Clause 33.2(b))
   - The estimated period of delay to Practical Completion
   - The measures you propose to minimise the delay

3. **Strict compliance required:** Special Condition 1.3 makes compliance with the notice requirements a **condition precedent** to any EOT entitlement. If you miss the 21-day window, you forfeit the entitlement unless you can demonstrate the Principal suffered **no prejudice whatsoever** (Special Condition 1.2).

**Recommended action:** Given VD-007 was issued on 4 March 2026, and the Superintendent's preliminary assessment suggests a 4–6 week programme impact, you should lodge your EOT notice no later than **25 March 2026** to preserve your entitlement.

The variation direction itself notes an estimated 4–6 week impact on the basement programme, which provides helpful supporting evidence for your claim.`,
        sources: JSON.stringify([
          {
            type: 'document',
            document_name: 'Special Conditions — Riverside Towers.pdf',
            section_heading: 'AMENDED TIME BAR — CLAUSE 33',
            excerpt: 'Clause 33.1 is amended by deleting "28 days" and substituting "21 days"',
            clause_references: ['33.1', '33.3'],
          },
          {
            type: 'document',
            document_name: 'AS4000-2025 General Conditions — Riverside Towers.pdf',
            section_heading: 'CLAUSE 33 — DELAY',
            excerpt: 'The Contractor shall give the Superintendent written notice of the delay within 28 days',
            clause_references: ['33.1', '33.2'],
          },
          {
            type: 'document',
            document_name: 'Variation Direction VD-007 — Basement Waterproofing Upgrade.pdf',
            section_heading: 'PROGRAMME IMPACT',
            excerpt: 'Preliminary assessment suggests the additional waterproofing work may extend the basement construction programme by approximately 4 to 6 weeks',
            clause_references: ['13.3'],
          },
        ]),
        created_at: new Date(today.getTime() - 2 * 60 * 60 * 1000 + 15000).toISOString(),
      },
      {
        session_id: session.id,
        role: 'user',
        content: 'What happens to liquidated damages if we get the EOT approved?',
        created_at: new Date(today.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        session_id: session.id,
        role: 'assistant',
        content: `If your extension of time is approved, there are important **liquidated damages protections** in your favour:

**Repayment obligation (Clause 34.4):**
If the Superintendent grants an EOT after the Principal has already deducted liquidated damages, the Principal must **forthwith repay** any LDs that were not actually due in light of the extension. This repayment must include **interest** at the rate stated in the Annexure, calculated from the date of deduction to the date of repayment.

**The LD rate and cap (Special Condition 2):**
- The LD rate is **$12,500 per calendar day** (Special Condition 2.1)
- LDs are capped at **10% of the Contract Sum**, being **$2,450,000** (Special Condition 2.2)

**Practical implications for VD-007:**
If the waterproofing variation causes a 4–6 week delay and you secure a corresponding EOT:
- At $12,500/day, a 6-week (42-day) delay would represent **$525,000** in LDs that would be avoided
- Any LDs already deducted for that period would need to be repaid with interest

**Important note:** The Superintendent has the power under Clause 34.3 to grant an EOT at any time, including **after the Date for Practical Completion has passed**. The Superintendent also cannot reduce a previously granted extension. These provisions give you ongoing protection even if the EOT assessment takes time.`,
        sources: JSON.stringify([
          {
            type: 'document',
            document_name: 'AS4000-2025 General Conditions — Riverside Towers.pdf',
            section_heading: 'CLAUSE 34 — EXTENSION OF TIME',
            excerpt: 'If the Superintendent grants an extension of time after the Principal has deducted liquidated damages, the Principal shall forthwith repay',
            clause_references: ['34.3', '34.4'],
          },
          {
            type: 'document',
            document_name: 'Special Conditions — Riverside Towers.pdf',
            section_heading: 'LIQUIDATED DAMAGES',
            excerpt: 'The rate of liquidated damages shall be $12,500.00 per calendar day',
            clause_references: ['36'],
          },
        ]),
        created_at: new Date(today.getTime() - 1 * 60 * 60 * 1000 + 15000).toISOString(),
      },
    ]

    const { error: messagesError } = await supabase
      .from('chat_messages')
      .insert(messages)

    if (messagesError) {
      console.error('Failed to create chat messages:', messagesError)
    } else {
      console.log('Created chat session with 2 exchanges (4 messages)')
    }
  }

  // ── Verify search works ──
  console.log('\n=== Verifying hybrid search ===')
  const testEmb = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: 'extension of time notice requirements',
    dimensions: 1536,
  })

  const { data: searchResults, error: searchError } = await supabase.rpc('hybrid_search_chunks', {
    query_embedding: testEmb.data[0].embedding,
    query_text: 'extension of time notice clause 33 34',
    match_threshold: 0.3,
    match_count: 5,
    filter_contract_id: contract.id,
    filter_document_ids: null,
  })

  if (searchError) {
    console.error('Search error:', searchError)
  } else {
    console.log(`Search returned ${searchResults?.length || 0} results`)
    for (const r of (searchResults || []).slice(0, 3)) {
      console.log(`  Score: ${r.combined_score?.toFixed(3)} | Heading: ${r.section_heading || 'none'} | Preview: ${r.content?.slice(0, 80)}...`)
    }
  }

  console.log('\n=== DEMO SEED COMPLETE ===')
  console.log(`Contract ID: ${contract.id}`)
  console.log('Contract: Riverside Towers — Mixed Use Development')
  console.log('Documents: 4 (chunked & embedded)')
  console.log('Obligations: 3 (amber / green / red)')
  console.log('Chat session: 1 (2 exchanges pre-loaded)')
  console.log('Profile: Apex Construction Pty Ltd')
}

main().catch(console.error)
