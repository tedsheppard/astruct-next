/**
 * Full demo environment seed — multiple contracts + 80+ documents.
 * Run with: npx tsx scripts/seed-full-demo.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('=== Seeding full demo environment ===\n')

  // ── Get user ──
  const { data: profile } = await supabase.from('profiles').select('id, email').limit(1).single()
  if (!profile) { console.error('No profile found.'); process.exit(1) }
  const userId = profile.id
  console.log('Using user:', profile.email, userId)

  // ── Update profile ──
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({
      name: 'John Doe',
      company_name: 'Apex Construction Pty Ltd',
      company_abn: '98 765 432 100',
      company_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
    })
    .eq('id', userId)
  if (profileErr) console.error('Profile update error:', profileErr)
  else console.log('Updated profile → John Doe / Apex Construction')

  // ── PART 1: Additional Contracts ──
  const newContracts = [
    {
      name: 'Hanlon Street — Civil & Drainage Works',
      reference_number: 'HS-2025-003',
      contract_form: 'AS4000-2025',
      contract_sum: 6200000,
      party1_role: 'Principal', party1_name: 'Brisbane City Council', party1_address: 'Level 6, 266 George Street, Brisbane QLD 4000',
      party2_role: 'Contractor', party2_name: 'Apex Construction Pty Ltd', party2_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
      administrator_role: 'Superintendent', administrator_name: 'GHD Advisory', administrator_address: 'Level 9, 145 Ann Street, Brisbane QLD 4000',
      date_of_contract: '2025-06-15', date_practical_completion: '2026-02-28',
    },
    {
      name: 'Westfield Chermside — Level 3 Fitout',
      reference_number: 'WC-2026-012',
      contract_form: 'AS4902',
      contract_sum: 18750000,
      party1_role: 'Principal', party1_name: 'Scentre Group Ltd', party1_address: 'Level 30, 85 Castlereagh Street, Sydney NSW 2000',
      party2_role: 'Contractor', party2_name: 'Apex Construction Pty Ltd', party2_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
      administrator_role: 'Superintendent', administrator_name: 'WT Partnership', administrator_address: 'Level 11, 301 Coronation Drive, Milton QLD 4064',
      date_of_contract: '2026-01-10', date_practical_completion: '2026-09-30',
    },
    {
      name: 'Brisbane Metro South — Station Precinct B',
      reference_number: 'BMS-2025-007',
      contract_form: 'AS4000-2025',
      contract_sum: 42000000,
      party1_role: 'Principal', party1_name: 'Cross River Rail Delivery Authority', party1_address: 'Level 4, 123 Albert Street, Brisbane QLD 4000',
      party2_role: 'Contractor', party2_name: 'Apex Construction Pty Ltd', party2_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
      administrator_role: 'Superintendent', administrator_name: 'Turner & Townsend', administrator_address: 'Level 16, 175 Eagle Street, Brisbane QLD 4000',
      date_of_contract: '2025-03-01', date_practical_completion: '2027-06-15',
    },
    {
      name: 'The Milton Residences — Tower B Structure',
      reference_number: 'MR-2025-018',
      contract_form: 'AS4000-1997',
      contract_sum: 31400000,
      party1_role: 'Principal', party1_name: 'Mirvac QLD Pty Ltd', party1_address: 'Level 28, 400 George Street, Brisbane QLD 4000',
      party2_role: 'Contractor', party2_name: 'Apex Construction Pty Ltd', party2_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
      administrator_role: 'Superintendent', administrator_name: 'RPS Group', administrator_address: 'Level 7, 41 Bishop Street, Kelvin Grove QLD 4059',
      date_of_contract: '2025-04-20', date_practical_completion: '2026-12-01',
    },
    {
      name: 'Toowong Village — Underground Carpark',
      reference_number: 'TV-2026-004',
      contract_form: 'AS2124',
      contract_sum: 8900000,
      party1_role: 'Principal', party1_name: 'Dexus Property Group', party1_address: 'Level 25, 264 George Street, Sydney NSW 2000',
      party2_role: 'Contractor', party2_name: 'Apex Construction Pty Ltd', party2_address: 'Level 4, 200 Creek Street, Brisbane QLD 4000',
      administrator_role: 'Superintendent', administrator_name: 'Arcadis', administrator_address: 'Level 5, 55 Sherwood Road, Toowong QLD 4066',
      date_of_contract: '2026-02-05', date_practical_completion: '2026-11-20',
    },
  ]

  for (const c of newContracts) {
    // Delete if exists
    const { data: existing } = await supabase
      .from('contracts')
      .select('id')
      .eq('user_id', userId)
      .eq('reference_number', c.reference_number)
      .limit(1)

    if (existing && existing.length > 0) {
      await supabase.from('contracts').delete().eq('id', existing[0].id)
      console.log(`  Deleted existing ${c.reference_number}`)
    }

    const { error } = await supabase
      .from('contracts')
      .insert({
        user_id: userId,
        user_is_party: 'party2',
        status: 'active',
        defects_liability_period: '12 months',
        ...c,
      })

    if (error) console.error(`  Failed to create ${c.name}:`, error.message)
    else console.log(`  Created contract: ${c.name}`)
  }

  // ── PART 2: 80+ Documents for Riverside Towers ──

  // Find the Riverside Towers contract
  const { data: rtContract } = await supabase
    .from('contracts')
    .select('id')
    .eq('user_id', userId)
    .eq('reference_number', 'RDG-2026-001')
    .limit(1)
    .single()

  if (!rtContract) {
    console.error('Riverside Towers contract (RDG-2026-001) not found! Run seed-demo.ts first.')
    process.exit(1)
  }

  const contractId = rtContract.id
  console.log(`\nRiverside Towers contract: ${contractId}`)

  // Get existing document filenames to skip
  const { data: existingDocs } = await supabase
    .from('documents')
    .select('filename')
    .eq('contract_id', contractId)

  const existingFilenames = new Set((existingDocs || []).map(d => d.filename))
  console.log(`Existing documents: ${existingFilenames.size} (will skip these)`)

  // Helper to convert "1.8MB" / "420KB" to bytes
  function parseSize(s: string): number {
    const match = s.match(/([\d.]+)\s*(MB|KB)/i)
    if (!match) return 500000
    const val = parseFloat(match[1])
    return match[2].toUpperCase() === 'MB' ? Math.round(val * 1024 * 1024) : Math.round(val * 1024)
  }

  type DocEntry = { filename: string; category: string; summary: string; size: string; date: string }

  const documents: DocEntry[] = [
    // 01. Contract
    { filename: 'Formal Instrument of Agreement — Riverside Towers.pdf', category: '01_contract', summary: 'Executed FIA between Riverside Development Group and Apex Construction dated 1 March 2026', size: '1.8MB', date: '2025-10-01' },
    { filename: 'Annexure Part A — Contract Particulars.pdf', category: '01_contract', summary: 'Contract particulars including key dates, retention percentage, LAD rates, and insurance requirements', size: '420KB', date: '2025-10-01' },
    { filename: 'Annexure Part B — Special Conditions.pdf', category: '01_contract', summary: 'Project-specific amendments to AS4000-2025 General Conditions', size: '680KB', date: '2025-10-01' },
    { filename: 'Parent Company Guarantee — Apex Holdings.pdf', category: '01_contract', summary: 'Parent company guarantee from Apex Holdings Pty Ltd in favour of Riverside Development Group', size: '340KB', date: '2025-10-05' },
    { filename: 'Bank Guarantee — Performance Security.pdf', category: '01_contract', summary: 'Westpac bank guarantee for 5% performance security ($1,225,000)', size: '180KB', date: '2025-10-08' },
    { filename: 'Insurance Certificate — Contract Works.pdf', category: '01_contract', summary: 'Zurich contract works insurance certificate of currency — policy period 1 Oct 2025 to 31 Mar 2028', size: '290KB', date: '2025-10-10' },
    { filename: 'Insurance Certificate — Public Liability.pdf', category: '01_contract', summary: 'QBE public liability $20M certificate of currency — Apex Construction Pty Ltd', size: '260KB', date: '2025-10-10' },

    // 02. Tender
    { filename: 'Apex Construction — Tender Submission.pdf', category: '02_tender', summary: 'Original tender submission including methodology, programme, and pricing schedule for Riverside Towers', size: '12.4MB', date: '2025-08-15' },
    { filename: 'Tender Clarifications — RFT-2025-044.pdf', category: '02_tender', summary: 'Responses to 23 tender clarification questions from Riverside Development Group', size: '1.1MB', date: '2025-08-28' },
    { filename: 'Tender Programme — Rev A.pdf', category: '02_tender', summary: 'Preliminary construction programme showing 21-month delivery timeline', size: '2.8MB', date: '2025-08-15' },
    { filename: 'Tender Price Schedule — Detailed.pdf', category: '02_tender', summary: 'Detailed pricing breakdown by trade package and building level', size: '890KB', date: '2025-08-15' },
    { filename: 'Tender Non-Conformances Register.pdf', category: '02_tender', summary: 'Schedule of non-conformances and qualifications to tender documents', size: '340KB', date: '2025-08-15' },

    // 03. Drawings
    { filename: 'A-100 — Ground Floor Plan Rev C.pdf', category: '03_drawings', summary: 'Architectural ground floor plan showing retail tenancy and lobby layout', size: '4.2MB', date: '2025-11-12' },
    { filename: 'A-101 — Level 1-5 Typical Floor Plan Rev B.pdf', category: '03_drawings', summary: 'Typical residential floor plan levels 1-5 showing apartment configurations', size: '3.9MB', date: '2025-11-12' },
    { filename: 'A-102 — Level 6 Rooftop Plan Rev A.pdf', category: '03_drawings', summary: 'Rooftop terrace and plant room layout including communal BBQ area', size: '3.1MB', date: '2025-11-12' },
    { filename: 'A-201 — Basement B1-B3 Sections Rev B.pdf', category: '03_drawings', summary: 'Basement level cross sections showing carpark layout and services coordination', size: '3.8MB', date: '2025-11-12' },
    { filename: 'A-301 — Building Elevations — North & East Rev B.pdf', category: '03_drawings', summary: 'Facade elevations showing panel layout, materials, and setback detail', size: '5.2MB', date: '2025-11-20' },
    { filename: 'A-302 — Building Elevations — South & West Rev B.pdf', category: '03_drawings', summary: 'Facade elevations showing entry canopy, screening, and balustrade detail', size: '4.8MB', date: '2025-11-20' },
    { filename: 'S-100 — Foundation Plan Rev C.pdf', category: '03_drawings', summary: 'Structural foundation plan — bored piers and pile caps layout', size: '4.5MB', date: '2025-11-20' },
    { filename: 'S-201 — Basement Structure Sections Rev B.pdf', category: '03_drawings', summary: 'Basement retaining wall and slab structural sections with reinforcement schedules', size: '3.6MB', date: '2025-11-20' },
    { filename: 'S-301 — Structural Foundation Details Rev A.pdf', category: '03_drawings', summary: 'Foundation and piling structural details, rebar schedules, and pile cap geometry', size: '5.1MB', date: '2025-11-20' },
    { filename: 'H-101 — Hydraulic Services Layout B1-B3 Rev A.pdf', category: '03_drawings', summary: 'Basement hydraulic services coordination drawing including pump-out system', size: '2.9MB', date: '2025-12-05' },
    { filename: 'M-100 — Mechanical Services Riser Diagram Rev A.pdf', category: '03_drawings', summary: 'HVAC riser diagram and plant room layout showing chiller and AHU locations', size: '3.4MB', date: '2025-12-05' },
    { filename: 'E-100 — Electrical Distribution Board Schedule Rev A.pdf', category: '03_drawings', summary: 'Main switchboard and distribution board single line diagram', size: '2.7MB', date: '2025-12-05' },

    // 04. Specifications
    { filename: 'Specification Volume 1 — General Requirements.pdf', category: '04_specifications', summary: 'General project requirements, quality management, environmental management, and site establishment', size: '6.4MB', date: '2025-10-01' },
    { filename: 'Specification Volume 2 — Structure & Civil.pdf', category: '04_specifications', summary: 'Structural concrete, reinforcement, structural steel, and civil works specifications', size: '4.8MB', date: '2025-10-01' },
    { filename: 'Specification Volume 3 — Architectural Finishes.pdf', category: '04_specifications', summary: 'Internal and external architectural finishes, joinery, tiling, and painting', size: '3.2MB', date: '2025-10-01' },
    { filename: 'Specification Volume 4 — Mechanical Services.pdf', category: '04_specifications', summary: 'HVAC, ventilation, smoke control, and mechanical fire services specifications', size: '4.1MB', date: '2025-10-01' },
    { filename: 'Specification Volume 5 — Hydraulic Services.pdf', category: '04_specifications', summary: 'Plumbing, drainage, stormwater, and fire sprinkler system specifications', size: '3.5MB', date: '2025-10-01' },
    { filename: 'Specification Volume 6 — Electrical Services.pdf', category: '04_specifications', summary: 'Electrical power, lighting, communications, security, and access control specifications', size: '3.8MB', date: '2025-10-01' },

    // 05. Project Letters
    { filename: '251018 — Marshall to Apex — Commence Works Direction.pdf', category: '05_project_letters', summary: "Superintendent's direction to commence works on site effective 20 October 2025", size: '220KB', date: '2025-10-18' },
    { filename: '251105 — Apex to Marshall — Programme Submission Rev A.pdf', category: '05_project_letters', summary: 'Submission of detailed construction programme Rev A for Superintendent review and approval', size: '1.8MB', date: '2025-11-05' },
    { filename: '251120 — Marshall to Apex — Programme Comments.pdf', category: '05_project_letters', summary: "Superintendent's comments on submitted programme requesting revised sequencing for basement works", size: '340KB', date: '2025-11-20' },
    { filename: '260103 — Apex to RDG — Christmas Shutdown Confirmation.pdf', category: '05_project_letters', summary: 'Confirmation of site shutdown period 23 December 2025 to 5 January 2026', size: '180KB', date: '2026-01-03' },
    { filename: '260115 — Apex to RDG — Site Access Delay Notice.pdf', category: '05_project_letters', summary: 'Notice of delayed site access to Zone B affecting programme by approximately 2 weeks', size: '380KB', date: '2026-01-15' },
    { filename: '260128 — Marshall to Apex — Response Site Access.pdf', category: '05_project_letters', summary: "Superintendent's response acknowledging site access delay and requesting mitigation measures", size: '290KB', date: '2026-01-28' },
    { filename: '260203 — Marshall to Apex — Direction Facade Panels.pdf', category: '05_project_letters', summary: 'Superintendent direction to change facade panel specification from Vitrabond to Alucobond A2 fire-rated composite', size: '290KB', date: '2026-02-03' },
    { filename: '260218 — Apex to Marshall — Latent Conditions Notice.pdf', category: '05_project_letters', summary: 'Formal notice of latent condition — unexpected basalt rock encountered at basement level B3 during excavation', size: '520KB', date: '2026-02-18' },
    { filename: '260225 — Marshall to Apex — Latent Conditions Response.pdf', category: '05_project_letters', summary: 'Superintendent response to latent conditions notice requesting additional geotechnical investigation by Soil Dynamics', size: '380KB', date: '2026-02-25' },
    { filename: '260312 — RDG to Apex — Response to EOT Claim 002.pdf', category: '05_project_letters', summary: "Principal's response rejecting EOT Claim 002 for latent conditions — disputes classification as latent condition", size: '440KB', date: '2026-03-12' },
    { filename: '260318 — Apex to Marshall — Defective Formwork Notice.pdf', category: '05_project_letters', summary: 'Notice of defective formwork panels supplied by Peri Formwork subcontractor — requesting replacement', size: '360KB', date: '2026-03-18' },
    { filename: '260402 — Marshall to Apex — Direction Waterproofing.pdf', category: '05_project_letters', summary: 'Superintendent direction for upgraded waterproofing system to basement levels B1-B3 per geotechnical advice', size: '310KB', date: '2026-04-02' },

    // 06. RFIs
    { filename: 'RFI-001 — Basement Waterproofing Methodology.pdf', category: '06_rfi', summary: 'Query on specified waterproofing system compatibility with existing concrete substrate at basement levels', size: '280KB', date: '2025-11-08' },
    { filename: 'RFI-002 — Structural Steel Connection Details.pdf', category: '06_rfi', summary: 'Clarification required on Level 3 steel beam to column moment connections at gridline F — detail appears to conflict with architectural setback', size: '310KB', date: '2025-11-22' },
    { filename: 'RFI-003 — Fire Rating Shaft Walls.pdf', category: '06_rfi', summary: 'Query on fire rating requirements for services shafts penetrating the Level 1 transfer slab — FRL-120/120/120 vs FRL-90/90/90', size: '250KB', date: '2025-12-10' },
    { filename: 'RFI-004 — Facade Panel Fixing System.pdf', category: '06_rfi', summary: 'Proposed alternative proprietary fixing system for Alucobond A2 facade composite panels — structural adequacy query', size: '340KB', date: '2026-01-14' },
    { filename: 'RFI-005 — Stormwater Detention Tank Size.pdf', category: '06_rfi', summary: 'Clarification on stormwater detention tank capacity discrepancy between hydraulic drawing H-301 and civil drawing C-105', size: '290KB', date: '2026-02-02' },
    { filename: 'RFI-006 — Electrical Riser Clash with Structure.pdf', category: '06_rfi', summary: 'Electrical riser route clashes with 900mm deep structural beam at Level 2 — riser relocation or beam penetration required', size: '420KB', date: '2026-02-18' },
    { filename: 'RFI-007 — Lobby Ceiling Height Discrepancy.pdf', category: '06_rfi', summary: 'Discrepancy between architectural section A-201 (3.6m) and specification clause 4.12 (3.2m) for ground floor lobby ceiling height', size: '280KB', date: '2026-03-05' },
    { filename: 'RFI-008 — Loading Dock Access Width.pdf', category: '06_rfi', summary: 'Loading dock vehicle access width of 3.2m appears insufficient for 8.8m waste collection vehicles per BCA Part D1', size: '350KB', date: '2026-03-20' },

    // 07. Variations
    { filename: 'Variation Direction VD-001 — Additional Piling.pdf', category: '07_variations', summary: 'Superintendent direction for 6 additional bored piers at B3 level due to revised geotechnical advice from Soil Dynamics', size: '380KB', date: '2025-11-15' },
    { filename: 'Variation Direction VD-002 — Upgraded Fire System.pdf', category: '07_variations', summary: 'Superintendent direction to upgrade fire detection from conventional to fully addressable system throughout all levels', size: '290KB', date: '2025-12-08' },
    { filename: 'Variation Direction VD-003 — Facade Panel Change.pdf', category: '07_variations', summary: 'Superintendent direction to change facade panels from Vitrabond FR to Alucobond A2 fire-rated composite — compliance with amended NCC 2025', size: '420KB', date: '2026-02-03' },
    { filename: 'Variation Claim VC-001 — Additional Piling.pdf', category: '07_variations', summary: "Contractor's variation claim for 6 additional bored piers including mobilisation, drilling, and concrete — claimed amount $87,400", size: '680KB', date: '2025-12-10' },
    { filename: 'Variation Claim VC-002 — Upgraded Fire System.pdf', category: '07_variations', summary: "Contractor's variation claim for addressable fire detection upgrade including MCP, detectors, and BMS integration — claimed amount $142,600", size: '720KB', date: '2026-01-05' },

    // 08. Notices of Delay
    { filename: 'NOD-001 — Inclement Weather Jan 2026.pdf', category: '08_nod', summary: 'Notice of delay due to 12 working days of inclement weather in January 2026 exceeding BOM historical averages for Brisbane', size: '290KB', date: '2026-02-02' },
    { filename: 'NOD-002 — Site Access Delay Zone B.pdf', category: '08_nod', summary: "Notice of delay caused by restricted access to Zone B due to adjacent development hoarding — principal's risk event under Clause 33.2(a)", size: '310KB', date: '2026-02-20' },
    { filename: 'NOD-003 — Latent Conditions B3.pdf', category: '08_nod', summary: 'Notice of delay caused by unexpected basalt rock at B3 requiring revised excavation methodology and additional rock-breaking equipment', size: '380KB', date: '2026-02-22' },
    { filename: 'NOD-004 — Facade Panel Supply Delay.pdf', category: '08_nod', summary: 'Notice of delay due to 14-week lead time for revised Alucobond A2 facade panels following specification change directed by Superintendent', size: '340KB', date: '2026-02-28' },

    // 09. EOT Claims
    { filename: 'EOT-001 — Inclement Weather Claim.pdf', category: '09_eot', summary: 'Extension of time claim for 12 working days weather delay with BOM rainfall records and site diary entries attached', size: '1.4MB', date: '2026-02-15' },
    { filename: 'EOT-002 — Latent Conditions Claim.pdf', category: '09_eot', summary: 'Extension of time claim for 18 working days delay due to basalt rock at B3 — includes geotechnical report and revised excavation programme', size: '1.8MB', date: '2026-03-05' },
    { filename: 'EOT-003 — Facade Panel Delay Claim.pdf', category: '09_eot', summary: "Extension of time claim for 8 weeks delay due to facade panel specification change — principal's risk event under Clause 33.2(a) and 33.2(b)", size: '1.2MB', date: '2026-03-15' },

    // 10. Payment Claims
    { filename: 'Progress Claim #1 — October 2025.pdf', category: '10_payment_claims', summary: 'Monthly progress claim #1 totalling $892,450.00 including site establishment, temporary fencing, and early excavation works', size: '1.2MB', date: '2025-10-25' },
    { filename: 'Progress Claim #2 — November 2025.pdf', category: '10_payment_claims', summary: 'Monthly progress claim #2 totalling $1,245,800.00 including bulk excavation and shoring installation', size: '1.4MB', date: '2025-11-25' },
    { filename: 'Progress Claim #3 — December 2025.pdf', category: '10_payment_claims', summary: 'Monthly progress claim #3 totalling $1,567,200.00 including piling, pile caps, and basement B3 slab preparation', size: '1.3MB', date: '2025-12-23' },
    { filename: 'Progress Claim #4 — January 2026.pdf', category: '10_payment_claims', summary: 'Monthly progress claim #4 totalling $1,432,600.00 including B3 slab pour, B2 formwork, and initial waterproofing', size: '1.5MB', date: '2026-01-26' },
    { filename: 'Progress Claim #5 — February 2026.pdf', category: '10_payment_claims', summary: 'Monthly progress claim #5 totalling $1,689,350.00 including B2 slab, B1 walls, and ground floor structure commencement', size: '1.4MB', date: '2026-02-25' },
    { filename: 'Progress Claim #7 — April 2026.pdf', category: '10_payment_claims', summary: 'Monthly progress claim #7 totalling $2,105,800.00 including Level 1-2 structure, facade panel installation commenced, and VD-007 waterproofing', size: '1.6MB', date: '2026-04-07' },

    // 11. Payment Schedules
    { filename: 'Payment Certificate #1 — October 2025.pdf', category: '11_payment_schedules', summary: "Superintendent's payment certificate #1 certifying $871,200.00 — minor deduction for incomplete safety documentation", size: '380KB', date: '2025-11-08' },
    { filename: 'Payment Certificate #2 — November 2025.pdf', category: '11_payment_schedules', summary: "Superintendent's payment certificate #2 certifying $1,198,500.00 — full claim less 5% retention", size: '410KB', date: '2025-12-09' },
    { filename: 'Payment Certificate #3 — December 2025.pdf', category: '11_payment_schedules', summary: "Superintendent's payment certificate #3 certifying $1,523,800.00 — full claim less retention", size: '390KB', date: '2026-01-08' },
    { filename: 'Payment Certificate #4 — January 2026.pdf', category: '11_payment_schedules', summary: "Superintendent's payment certificate #4 certifying $1,380,400.00 — $52,200 deducted for disputed waterproofing methodology", size: '420KB', date: '2026-02-09' },
    { filename: 'Payment Certificate #5 — February 2026.pdf', category: '11_payment_schedules', summary: "Superintendent's payment certificate #5 certifying $1,645,000.00 — $44,350 disputed relating to EOT-002 prolongation costs", size: '400KB', date: '2026-03-11' },
    { filename: 'Payment Certificate #6 — March 2026.pdf', category: '11_payment_schedules', summary: "Superintendent's payment certificate #6 certifying $1,790,275.00 — $38,000 additional retention held pending VD-007 completion", size: '430KB', date: '2026-04-07' },

    // 12. Third-Party Invoices
    { filename: 'INV-0145 — Geotechnical Investigation Pty Ltd.pdf', category: '12_third_party_invoices', summary: 'Invoice from Soil Dynamics for additional geotechnical investigation at B3 level — bore holes BH-15 to BH-18 — $18,400', size: '290KB', date: '2026-03-01' },
    { filename: 'INV-0146 — Survey Solutions — Monthly Set Out.pdf', category: '12_third_party_invoices', summary: 'Invoice from Survey Solutions for monthly survey and set out services — March 2026 — $8,750', size: '220KB', date: '2026-03-31' },
    { filename: 'INV-0147 — Independent Testing Lab.pdf', category: '12_third_party_invoices', summary: 'Invoice from National Testing Laboratory for concrete cylinder testing and 28-day compressive strength reports — $4,200', size: '180KB', date: '2026-04-02' },
    { filename: 'INV-0148 — Traffic Management Plan — Zone B.pdf', category: '12_third_party_invoices', summary: 'Invoice from TMP Solutions for traffic management services during Zone B access works — $12,600', size: '310KB', date: '2026-04-05' },

    // 13. Other
    { filename: 'Construction Programme — Rev D (Current).pdf', category: '13_other', summary: 'Current approved construction programme revision D incorporating EOT-001 weather delay and revised basement sequence', size: '3.2MB', date: '2026-03-20' },
    { filename: 'Site Meeting Minutes #14 — 28 Mar 2026.pdf', category: '13_other', summary: 'Fortnightly site meeting minutes #14 covering progress update, safety incidents, RFI status, and commercial matters', size: '480KB', date: '2026-03-28' },
    { filename: 'Monthly Photo Report — March 2026.pdf', category: '13_other', summary: 'Construction progress photos with annotations showing basement structure, waterproofing, and ground floor formwork — March 2026', size: '8.5MB', date: '2026-03-31' },
  ]

  // Filter out docs that already exist
  const newDocs = documents.filter(d => !existingFilenames.has(d.filename))
  console.log(`Inserting ${newDocs.length} new documents (skipping ${documents.length - newDocs.length} existing)...`)

  // Insert in batches to avoid payload limits
  const batchSize = 20
  let insertedCount = 0
  for (let i = 0; i < newDocs.length; i += batchSize) {
    const batch = newDocs.slice(i, i + batchSize).map(d => ({
      contract_id: contractId,
      user_id: userId,
      filename: d.filename,
      file_type: 'application/pdf',
      file_size: parseSize(d.size),
      category: d.category,
      ai_summary: d.summary,
      extracted_text: null,
      processed: true,
      uploaded_at: new Date(d.date + 'T09:00:00+10:00').toISOString(),
    }))

    const { error } = await supabase.from('documents').insert(batch)
    if (error) {
      console.error(`  Batch insert error (${i}-${i + batch.length}):`, error.message)
    } else {
      insertedCount += batch.length
      console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} documents`)
    }
  }

  console.log(`Total new documents inserted: ${insertedCount}`)

  // ── PART 3: Verify ──
  console.log('\n=== VERIFICATION ===\n')

  // Count contracts
  const { data: allContracts } = await supabase
    .from('contracts')
    .select('name, reference_number')
    .eq('user_id', userId)
    .order('name')

  console.log(`Contracts: ${allContracts?.length || 0}`)
  for (const c of allContracts || []) {
    console.log(`  ${c.reference_number} — ${c.name}`)
  }

  // Count documents by category for Riverside Towers
  const { data: allDocs } = await supabase
    .from('documents')
    .select('category')
    .eq('contract_id', contractId)

  const categoryCounts: Record<string, number> = {}
  for (const d of allDocs || []) {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1
  }

  console.log(`\nRiverside Towers documents: ${allDocs?.length || 0} total`)
  const categoryLabels: Record<string, string> = {
    '01_contract': '01. Contract', '02_tender': '02. Tender', '03_drawings': '03. Drawings',
    '04_specifications': '04. Specifications', '05_project_letters': '05. Project Letters',
    '06_rfi': '06. RFIs', '07_variations': '07. Variations', '08_nod': '08. Notices of Delay',
    '09_eot': '09. EOT Claims', '10_payment_claims': '10. Payment Claims',
    '11_payment_schedules': '11. Payment Schedules', '12_third_party_invoices': '12. Third-Party Invoices',
    '13_other': '13. Other',
  }
  for (const [cat, count] of Object.entries(categoryCounts).sort()) {
    console.log(`  ${categoryLabels[cat] || cat}: ${count}`)
  }

  // Count chunks (existing embedded docs)
  const { data: chunks } = await supabase
    .from('document_chunks')
    .select('id', { count: 'exact' })
    .eq('contract_id', contractId)
  console.log(`\nEmbedded chunks (existing): ${chunks?.length || 0}`)

  // Profile
  const { data: finalProfile } = await supabase
    .from('profiles')
    .select('name, company_name, company_abn, company_address')
    .eq('id', userId)
    .single()
  console.log(`\nProfile: ${finalProfile?.name} / ${finalProfile?.company_name}`)
  console.log(`  ABN: ${finalProfile?.company_abn}`)
  console.log(`  Address: ${finalProfile?.company_address}`)

  console.log('\n=== FULL DEMO SEED COMPLETE ===')
}

main().catch(console.error)
