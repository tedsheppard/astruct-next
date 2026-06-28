import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const seedDir = path.join(rootDir, 'seeds', 'riverside-towers-suite')
const biblePath = path.join(seedDir, 'project-bible.json')
const registerPath = path.join(seedDir, 'document-register.csv')
const eventsPath = path.join(seedDir, 'event-ledger.csv')
const summaryPath = path.join(seedDir, 'register-summary.json')

const fmtDate = (year, month, day) =>
  `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const monthLabel = (year, month) =>
  new Date(Date.UTC(year, month - 1, 1)).toLocaleString('en-AU', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

const csvEscape = (value) => {
  const raw = value == null ? '' : String(value)
  if (raw.includes('"') || raw.includes(',') || raw.includes('\n')) {
    return `"${raw.replace(/"/g, '""')}"`
  }
  return raw
}

function createRow(docNo, filename, category, date, phase, owner, counterparty, summary, eventCode, estimatedPages) {
  return {
    doc_no: docNo,
    filename,
    category,
    date,
    phase,
    owner,
    counterparty,
    summary,
    event_code: eventCode,
    file_type: 'application/pdf',
    estimated_pages: estimatedPages,
  }
}

function toCsv(rows) {
  const headers = Object.keys(rows[0] || {})
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','))
  }
  return `${lines.join('\n')}\n`
}

function buildTenderDocs(project) {
  const principal = project.contract.principal
  const contractor = project.contract.contractor
  return [
    createRow('02-001', 'Request for Tender - Part 1 Conditions and Overview.pdf', '02_tender', '2025-05-12', 'Tender', principal, 'Market', 'Tender conditions, key dates, submission rules, and overview for Riverside Towers head contract.', 'EV-01', 24),
    createRow('02-002', 'Request for Tender - Part 2 Scope and Project Brief.pdf', '02_tender', '2025-05-12', 'Tender', principal, 'Market', 'Project brief describing mixed-use tower scope, separable portions, and delivery constraints.', 'EV-01', 48),
    createRow('02-003', 'Tender Form and Declaration.pdf', '02_tender', '2025-05-12', 'Tender', principal, 'Market', 'Tender form, declarations, and compliance statements required from each tenderer.', 'EV-01', 8),
    createRow('02-004', 'Schedule of Contract Documents.pdf', '02_tender', '2025-05-12', 'Tender', principal, 'Market', 'Schedule identifying drawings, specifications, schedules, and other tender documents forming part of the contract.', 'EV-01', 10),
    createRow('02-005', 'Scope of Contract - Head Contractor Works.pdf', '02_tender', '2025-05-12', 'Tender', principal, 'Market', 'Short-form scope of contract setting out physical and functional extent of the head contractor works.', 'EV-01', 14),
    createRow('02-006', 'Tender Addendum 01 - Façade Fire Compliance Clarifications.pdf', '02_tender', '2025-06-03', 'Tender', principal, 'Market', 'Clarifies façade combustibility requirements, testing expectations, and tender qualification treatment.', 'EV-01', 12),
    createRow('02-007', 'Tender Addendum 02 - Basement Services Coordination.pdf', '02_tender', '2025-06-19', 'Tender', principal, 'Market', 'Issues revised basement coordination notes and updated authority interfaces.', 'EV-01', 11),
    createRow('02-008', `${contractor} - Tender Submission Volume 1 Executive and Methodology.pdf`, '02_tender', '2025-07-18', 'Tender', contractor, principal, 'Tender executive summary, methodology, preliminaries, and resource plan submitted by Apex Construction.', 'EV-01', 58),
    createRow('02-009', `${contractor} - Tender Submission Volume 2 Programme and Staging.pdf`, '02_tender', '2025-07-18', 'Tender', contractor, principal, 'Tender programme, staging narrative, tower crane strategy, and shutdown assumptions.', 'EV-01', 44),
    createRow('02-010', `${contractor} - Tender Submission Volume 3 Price Schedule.pdf`, '02_tender', '2025-07-18', 'Tender', contractor, principal, 'Detailed tender pricing broken down by trade package, preliminaries, contingency, and provisional sums.', 'EV-01', 30),
    createRow('02-011', `${contractor} - Tender Qualifications and Non-Conformances.pdf`, '02_tender', '2025-07-18', 'Tender', contractor, principal, 'Apex list of tender qualifications, exclusions, programme assumptions, and proposed departures.', 'EV-01', 18),
    createRow('02-012', 'Tender Clarification Register - Round 1 to 24.pdf', '02_tender', '2025-08-01', 'Tender', principal, contractor, 'Compiled tender clarification questions and responses exchanged during evaluation and negotiation.', 'EV-01', 32),
    createRow('02-013', 'Post-Tender Interview Minutes - Apex Construction.pdf', '02_tender', '2025-08-06', 'Tender', principal, contractor, 'Minutes of post-tender interview covering methodology, preliminaries, and risk allocation.', 'EV-01', 9),
    createRow('02-014', 'Letter of Intent - Early Procurement and Design Finalisation.pdf', '02_tender', '2025-08-18', 'Tender', principal, contractor, 'Letter authorising early procurement and limited mobilisation ahead of contract execution.', 'EV-01', 7),
    createRow('02-015', 'Tender Recommendation and Award Approval.pdf', '02_tender', '2025-08-22', 'Tender', principal, 'Internal / Board', 'Recommendation to appoint Apex Construction as preferred tenderer for the project.', 'EV-01', 16),
  ]
}

function buildDrawingDocs() {
  const drawings = [
    ['A-001', 'Drawing Register - Architectural Set Rev D', '2025-09-02', 'Architectural register covering all issued-for-construction plans, sections, and details.', 'EV-01', 6],
    ['A-100', 'Architectural Site Plan Rev D', '2025-09-02', 'Site plan showing setbacks, site access, hoarding, and adjacent interface conditions.', 'EV-01', 2],
    ['A-101', 'Ground Floor Plan Rev D', '2025-09-02', 'Ground floor lobby, retail tenancy, back-of-house, and loading dock arrangement.', 'EV-01', 3],
    ['A-102', 'Level 1 Podium Plan Rev D', '2025-09-02', 'Podium plan with amenities, transfer structure interfaces, and external terraces.', 'EV-01', 3],
    ['A-103', 'Typical Residential Floor Plan Levels 2-14 Rev D', '2025-09-02', 'Typical residential layout, apartment mix, risers, and service cupboards.', 'EV-01', 3],
    ['A-104', 'Level 15 Plant and Roof Plan Rev C', '2025-09-02', 'Roof plan showing plant, BMU provisions, screening, and access walkways.', 'EV-01', 2],
    ['A-201', 'Basement B1 Plan Rev D', '2025-09-05', 'Basement level B1 plan including car parking, services rooms, and access routes.', 'EV-03', 3],
    ['A-202', 'Basement B2 Plan Rev D', '2025-09-05', 'Basement level B2 plan including car parking, storage, and hydraulic coordination.', 'EV-03', 3],
    ['A-203', 'Basement B3 Plan Rev D', '2025-09-05', 'Basement level B3 plan including pump room, tanks, and geotechnical interfaces.', 'EV-03', 3],
    ['A-301', 'North and East Elevations Rev D', '2025-09-10', 'Primary façade elevations with material tags, slab edges, and balustrade types.', 'EV-01', 3],
    ['A-302', 'South and West Elevations Rev D', '2025-09-10', 'Secondary façade elevations including laneway edge and services screens.', 'EV-01', 3],
    ['A-401', 'Building Sections 1 and 2 Rev D', '2025-09-10', 'Longitudinal and transverse sections through tower, podium, and basement.', 'EV-01', 3],
    ['A-501', 'Lobby and Retail Reflected Ceiling Plan Rev C', '2025-10-04', 'Lobby and retail reflected ceiling plan coordinating feature lighting and services.', 'EV-03', 2],
    ['A-601', 'Façade Typical Details Rev C', '2025-10-04', 'Façade junctions, balustrade details, sill flashings, and slab edge interfaces.', 'EV-07', 5],
    ['S-001', 'Structural Drawing Register Rev C', '2025-09-03', 'Structural register for foundations, basement, vertical structure, and roof.', 'EV-01', 5],
    ['S-100', 'Foundation and Piling Plan Rev C', '2025-09-03', 'Piling layout and foundation plan for tower, podium, and transfer elements.', 'EV-02', 3],
    ['S-110', 'Pile Schedule and Notes Rev C', '2025-09-03', 'Pile diameters, founding assumptions, and testing requirements.', 'EV-02', 4],
    ['S-201', 'Basement Retention and Slab Setout Rev C', '2025-10-20', 'Basement slab setout and retention system interface details.', 'EV-02', 3],
    ['S-202', 'Basement Wall Reinforcement Rev C', '2025-10-20', 'Basement retaining wall reinforcement and construction-joint schedule.', 'EV-06', 4],
    ['S-301', 'Transfer Slab Layout Rev C', '2025-11-11', 'Transfer slab plan coordinating retail spans and tower load paths.', 'EV-03', 3],
    ['S-401', 'Typical Residential Framing Rev B', '2025-12-08', 'Typical residential level framing, slab penetrations, and edge thickening.', 'EV-03', 3],
    ['S-501', 'Sketch SK-B-101 Rev C - Waterproofing Upgrade', '2026-03-04', 'Basement structural sketch issued with waterproofing upgrade direction.', 'EV-08', 2],
    ['S-502', 'Sketch SK-B-102 Rev C - Drainage Cell Interface', '2026-03-04', 'Structural sketch coordinating drainage cells and wall build-up at basement perimeter.', 'EV-08', 2],
    ['H-001', 'Hydraulic Services Register Rev B', '2025-09-06', 'Hydraulic drawing register for below-ground, wet areas, and fire service layouts.', 'EV-01', 4],
    ['H-101', 'Hydraulic Basement Services Layout Rev B', '2025-09-06', 'Pump-out, trade waste, stormwater, and fire service layout for basements.', 'EV-03', 3],
    ['H-201', 'Ground Floor Hydraulic Layout Rev B', '2025-09-06', 'Ground floor hydraulic layout including retail trade waste and amenities.', 'EV-03', 3],
    ['H-301', 'Stormwater and Detention Schematic Rev C', '2025-12-02', 'Detention, OSD, and stormwater discharge schematic with authority hold points.', 'EV-03', 3],
    ['M-001', 'Mechanical Services Register Rev B', '2025-09-06', 'Mechanical drawing register for risers, plant, and smoke-control systems.', 'EV-01', 4],
    ['M-101', 'Mechanical Plantroom Layout Rev B', '2025-09-06', 'Plantroom layout for chillers, pumps, ventilation, and service clearances.', 'EV-03', 3],
    ['M-201', 'Typical Apartment Mechanical Layout Rev B', '2025-10-15', 'Typical apartment ventilation and condensate layout coordinated with structure.', 'EV-03', 3],
    ['E-001', 'Electrical Services Register Rev B', '2025-09-06', 'Electrical register including lighting, power, communications, and authority interfaces.', 'EV-01', 4],
    ['E-101', 'Main Switchboard and Substation Single Line Diagram Rev B', '2025-09-06', 'Main switchboard and substation single line diagram issued for authority review.', 'EV-09', 3],
    ['E-201', 'Electrical Basement Distribution Layout Rev B', '2025-10-12', 'Electrical distribution boards, risers, and cable tray coordination in basement.', 'EV-09', 3],
    ['E-301', 'Security and Access Control Layout Rev A', '2025-11-01', 'Security, CCTV, and access control layout for entries and plant areas.', 'EV-03', 3],
    ['FP-101', 'Fire Services Basement Sprinkler Layout Rev B', '2025-10-15', 'Basement sprinkler, hydrant, and hose reel coordination drawing.', 'EV-03', 3],
    ['LS-101', 'Landscape and Public Realm Plan Rev A', '2025-11-21', 'Public realm, planting, paving, and kerb-interface drawing for podium frontage.', 'EV-05', 2],
  ]

  return drawings.map(([code, name, date, summary, eventCode, pages], index) =>
    createRow(`03-${String(index + 1).padStart(3, '0')}`, `${code} - ${name}.pdf`, '03_drawings', date, 'Design / IFC', 'Consultant Team', 'Project Team', summary, eventCode, pages)
  )
}

function buildSpecificationDocs() {
  const specs = [
    ['Volume 0 - Specification Index and Conventions', '2025-08-26', 'Specification index, conventions, abbreviations, and document control rules.', 'EV-01', 18],
    ['Volume 1 - Preliminaries and General Requirements', '2025-08-26', 'Preliminaries, site establishment, temporary works, quality, and management requirements.', 'EV-01', 84],
    ['Volume 2 - Demolition, Earthworks, and Retention', '2025-08-26', 'Demolition, excavation, shoring, dewatering, and retention system requirements.', 'EV-02', 52],
    ['Volume 3 - Piling and Foundations', '2025-08-26', 'Bored piling, footing preparation, testing, and foundation tolerances.', 'EV-02', 46],
    ['Volume 4 - Structural Concrete and Reinforcement', '2025-08-26', 'Concrete mixes, reinforcement, formwork, and post-tensioning requirements.', 'EV-02', 72],
    ['Volume 5 - Structural Steel and Metalwork', '2025-08-26', 'Structural steel, embeds, metalwork, and corrosion protection.', 'EV-03', 34],
    ['Volume 6 - Waterproofing', '2025-08-26', 'Roofing and below-ground waterproofing systems, warranties, and testing.', 'EV-08', 40],
    ['Volume 7 - Façade and Glazing', '2025-08-26', 'Façade panels, glazing, balustrades, and combustibility compliance requirements.', 'EV-07', 58],
    ['Volume 8 - Internal Partitions, Linings, and Joinery', '2025-08-26', 'Internal wall systems, linings, apartment joinery, and common-area finishes.', 'EV-03', 64],
    ['Volume 9 - Floor, Wall, and Ceiling Finishes', '2025-08-26', 'Flooring, tiling, painting, acoustic finishes, and ceiling systems.', 'EV-10', 44],
    ['Volume 10 - Doors, Hardware, and Access Control', '2025-08-26', 'Doorsets, hardware schedules, master keying, and access control coordination.', 'EV-03', 28],
    ['Volume 11 - Hydraulic Services', '2025-08-26', 'Plumbing, drainage, stormwater, fire service, and testing requirements.', 'EV-03', 56],
    ['Volume 12 - Mechanical Services', '2025-08-26', 'HVAC, ventilation, smoke-control, and BMS integration requirements.', 'EV-03', 61],
    ['Volume 13 - Electrical Services', '2025-08-26', 'Electrical power, lighting, communications, and authority interface requirements.', 'EV-09', 59],
    ['Volume 14 - Lifts and Vertical Transportation', '2025-08-26', 'Lift supply, installation, commissioning, and maintenance obligations.', 'EV-10', 24],
    ['Volume 15 - External Works and Landscaping', '2025-08-26', 'Paving, planting, drainage, street-interface, and public-realm requirements.', 'EV-05', 31],
    ['Addendum 01 - Waterproofing Specification Revision', '2026-03-04', 'Addendum revising below-ground waterproofing requirements after groundwater findings.', 'EV-08', 16],
    ['Addendum 02 - Façade Combustibility Compliance Revision', '2026-02-03', 'Addendum updating façade panel performance requirements to A2-compliant system.', 'EV-07', 14],
  ]

  return specs.map(([name, date, summary, eventCode, pages], index) =>
    createRow(`04-${String(index + 1).padStart(3, '0')}`, `${name}.pdf`, '04_specifications', date, 'Tender / IFC', 'Consultant Team', 'Project Team', summary, eventCode, pages)
  )
}

function buildLetterDocs(project) {
  const superintendent = project.contract.superintendent
  const contractor = project.contract.contractor
  const principal = project.contract.principal
  const docs = [
    ['05-001', '250818 - Principal to Contractor - Letter of Intent Confirmation.pdf', '2025-08-18', 'Tender / Award', principal, contractor, 'Confirms early procurement authority and mobilisation limits pending contract execution.', 'EV-01', 3],
    ['05-002', '250901 - Superintendent to Contractor - Commence Design Coordination Workshops.pdf', '2025-09-01', 'Mobilisation', superintendent, contractor, 'Directions for weekly coordination workshops and document issue protocol.', 'EV-01', 2],
    ['05-003', '250915 - Principal to Contractor - Site Possession Notice.pdf', '2025-09-15', 'Mobilisation', principal, contractor, 'Grants possession of site subject to access conditions and protection requirements.', 'EV-01', 3],
    ['05-004', '250930 - Contractor to Superintendent - Baseline Programme Submission Rev A.pdf', '2025-09-30', 'Mobilisation', contractor, superintendent, 'Submission of baseline programme and critical path narrative for review.', 'EV-01', 6],
    ['05-005', '251007 - Superintendent to Contractor - Programme Review Comments Rev A.pdf', '2025-10-07', 'Mobilisation', superintendent, contractor, 'Programme review comments requiring logic revisions and authority milestone clarity.', 'EV-01', 4],
    ['05-006', '251031 - Contractor to Principal - Monthly Executive Report October 2025.pdf', '2025-10-31', 'Construction', contractor, principal, 'Monthly executive report covering mobilisation, excavation progress, safety, and commercial issues.', 'EV-02', 8],
    ['05-007', '251114 - Superintendent to Contractor - Direction to Price Additional Piling.pdf', '2025-11-14', 'Construction', superintendent, contractor, 'Requests detailed pricing and programme impacts arising from revised piling interpretation.', 'EV-02', 3],
    ['05-008', '251128 - Contractor to Superintendent - Response on Additional Piling Methodology.pdf', '2025-11-28', 'Construction', contractor, superintendent, 'Sets out revised piling methodology, productivity assumptions, and trade impacts.', 'EV-02', 5],
    ['05-009', '251215 - Contractor to Superintendent - Stormwater Coordination Concerns.pdf', '2025-12-15', 'Construction', contractor, superintendent, 'Raises coordination concerns between hydraulic and civil documents for detention and discharge.', 'EV-03', 4],
    ['05-010', '251223 - Principal to Contractor - Christmas Shutdown Protocol.pdf', '2025-12-23', 'Construction', principal, contractor, 'Confirms shutdown rules, security, protection, and emergency contact arrangements.', 'EV-03', 3],
    ['05-011', '260112 - Contractor to Superintendent - Inclement Weather Impacts Notice Cover.pdf', '2026-01-12', 'Construction', contractor, superintendent, 'Covering letter enclosing preliminary weather impacts and site diary extracts.', 'EV-04', 3],
    ['05-012', '260119 - Contractor to Principal - Laneway B Access Restriction Escalation.pdf', '2026-01-19', 'Construction', contractor, principal, 'Escalates access restriction caused by adjacent owner and requests principal intervention.', 'EV-05', 4],
    ['05-013', '260126 - Principal to Contractor - Laneway B Stakeholder Coordination Update.pdf', '2026-01-26', 'Construction', principal, contractor, 'Provides stakeholder coordination update and interim traffic management expectations.', 'EV-05', 3],
    ['05-014', '260203 - Superintendent to Contractor - Façade Specification Change Direction Cover.pdf', '2026-02-03', 'Construction', superintendent, contractor, 'Covering letter issuing change to A2-compliant façade panel system.', 'EV-07', 3],
    ['05-015', '260218 - Contractor to Superintendent - Latent Conditions Notice Cover.pdf', '2026-02-18', 'Construction', contractor, superintendent, 'Formal covering letter notifying latent conditions and requesting urgent direction.', 'EV-06', 4],
    ['05-016', '260225 - Superintendent to Contractor - Geotechnical Investigation Requirement.pdf', '2026-02-25', 'Construction', superintendent, contractor, 'Requires additional investigation and temporary controls pending further design advice.', 'EV-06', 3],
    ['05-017', '260304 - Contractor to Superintendent - Revised Excavation Method Statement Cover.pdf', '2026-03-04', 'Construction', contractor, superintendent, 'Submits revised excavation and groundwater control method statement.', 'EV-06', 5],
    ['05-018', '260311 - Superintendent to Contractor - Waterproofing Upgrade Foreshadowed.pdf', '2026-03-11', 'Construction', superintendent, contractor, 'Foreshadows revised waterproofing requirements pending structural sketches.', 'EV-08', 3],
    ['05-019', '260318 - Contractor to Principal - Commercial Impact of Latent Conditions.pdf', '2026-03-18', 'Construction', contractor, principal, 'Summarises likely time and cost impact of latent conditions and reserve rights.', 'EV-06', 5],
    ['05-020', '260401 - Principal to Superintendent - Request for Consolidated Delay Assessment.pdf', '2026-04-01', 'Construction', principal, superintendent, 'Requests consolidated view of weather, access, and latent condition delays.', 'EV-06', 2],
    ['05-021', '260406 - Superintendent to Contractor - Direction to Proceed with Waterproofing Upgrade.pdf', '2026-04-06', 'Construction', superintendent, contractor, 'Confirms revised waterproofing scope and directs immediate implementation.', 'EV-08', 3],
    ['05-022', '260420 - Contractor to Superintendent - Energex Interface Risks Notice.pdf', '2026-04-20', 'Construction', contractor, superintendent, 'Raises emerging authority risk around substation review and riser coordination.', 'EV-09', 4],
    ['05-023', '260505 - Superintendent to Contractor - Riser Clash Resolution Workshop Minutes Cover.pdf', '2026-05-05', 'Construction', superintendent, contractor, 'Issues actions from workshop on electrical riser clashes and beam penetrations.', 'EV-09', 4],
    ['05-024', '260531 - Contractor to Principal - Monthly Executive Report May 2026.pdf', '2026-05-31', 'Construction', contractor, principal, 'Executive report on structure progress, delay claims, variations, and authority interfaces.', 'EV-09', 8],
    ['05-025', '260616 - Principal to Contractor - Retail Tenancy Acoustic Upgrade Request.pdf', '2026-06-16', 'Construction', principal, contractor, 'Requests acoustic enhancement to retail tenancy plant-room separation following tenant review.', 'EV-10', 3],
    ['05-026', '260623 - Contractor to Superintendent - Lift Procurement Lead Time Warning.pdf', '2026-06-23', 'Construction', contractor, superintendent, 'Warns of extended lift manufacturing lead time and preservation actions.', 'EV-10', 4],
    ['05-027', '260707 - Superintendent to Contractor - Request for Mitigation Options on Lifts.pdf', '2026-07-07', 'Construction', superintendent, contractor, 'Requests formal mitigation options for lift procurement delay and commissioning sequence.', 'EV-10', 3],
    ['05-028', '260729 - Contractor to Principal - Cost Forecast Update Rev C.pdf', '2026-07-29', 'Construction', contractor, principal, 'Updated forecast cost report reflecting approved variations and pending claims.', 'EV-10', 6],
    ['05-029', '260812 - Superintendent to Contractor - Close-Out Planning Workshop Invitation.pdf', '2026-08-12', 'Construction', superintendent, contractor, 'Invites project team to early close-out planning workshop and defects strategy session.', 'EV-10', 2],
    ['05-030', '260831 - Contractor to Principal - Monthly Executive Report August 2026.pdf', '2026-08-31', 'Construction', contractor, principal, 'Executive report on façade progress, services rough-in, and pending commercial items.', 'EV-10', 7],
    ['05-031', '260915 - Principal to Contractor - Retail Leasing Coordination Requirements.pdf', '2026-09-15', 'Construction', principal, contractor, 'Sets expectations for leasing inspections, make-good interfaces, and access control.', 'EV-10', 3],
    ['05-032', '261002 - Superintendent to Contractor - Updated Milestone Reporting Protocol.pdf', '2026-10-02', 'Construction', superintendent, contractor, 'Updates format for milestone reporting, float consumption, and recovery actions.', 'EV-10', 3],
  ]

  return docs.map(([docNo, filename, date, phase, owner, counterparty, summary, eventCode, pages]) =>
    createRow(docNo, filename, '05_project_letters', date, phase, owner, counterparty, summary, eventCode, pages)
  )
}

function buildRfiDocs() {
  const topics = [
    ['RFI-001', 'Basement Waterproofing Interface at Retention Piles', '2025-10-09', 'Clarification sought on continuity of membrane behind capping beam and retention piles.', 'EV-02'],
    ['RFI-002', 'Piling Founding Levels and Test Pile Criteria', '2025-10-15', 'Requests confirmation of founding assumptions and additional test pile acceptance criteria.', 'EV-02'],
    ['RFI-003', 'Ground Floor Retail Slab Setdown Discrepancy', '2025-10-28', 'Discrepancy between architectural floor finish zones and structural slab setdowns.', 'EV-03'],
    ['RFI-004', 'Stormwater Detention Volume Mismatch', '2025-11-06', 'Mismatch between hydraulic detention schedule and civil discharge calculations.', 'EV-03'],
    ['RFI-005', 'Fire Pump Room Access Clearance', '2025-11-14', 'Clarification required on access and maintenance clearances in fire pump room.', 'EV-03'],
    ['RFI-006', 'Transfer Slab Penetration Coordination', '2025-11-26', 'Requests coordinated positions for major services penetrations through transfer slab.', 'EV-03'],
    ['RFI-007', 'Residential Bathroom Acoustic Build-Up', '2025-12-03', 'Clarifies required acoustic build-up and ceiling interface in wet areas.', 'EV-03'],
    ['RFI-008', 'Façade Panel Combustibility Evidence', '2025-12-10', 'Requests consultant confirmation of acceptable evidence for façade panel combustibility compliance.', 'EV-07'],
    ['RFI-009', 'Loading Dock Swept Path and Clearance', '2025-12-17', 'Requests confirmation of waste truck swept path and dock clearance allowances.', 'EV-03'],
    ['RFI-010', 'Laneway B Traffic Controller Staging', '2026-01-18', 'Clarifies traffic-control staging while adjacent owner restricts one side of laneway access.', 'EV-05'],
    ['RFI-011', 'Rain Event Protection to Excavation Batters', '2026-01-22', 'Requests confirmation of acceptable temporary protection after repeated storm events.', 'EV-04'],
    ['RFI-012', 'Groundwater Ingress Management Thresholds', '2026-02-19', 'Requests design team criteria for groundwater inflow requiring redesign or changed methodology.', 'EV-06'],
    ['RFI-013', 'Basalt Encounter and Revised Excavation Line', '2026-02-21', 'Seeks urgent clarification on excavation line adjustments caused by basalt outcrop.', 'EV-06'],
    ['RFI-014', 'A2 Façade Panel Support Rail Geometry', '2026-02-27', 'Clarifies support-rail geometry after change to A2-compliant façade panel system.', 'EV-07'],
    ['RFI-015', 'Basement Waterproofing Composite Detail', '2026-03-06', 'Requests consultant-issued detail for membrane termination and drainage-cell buildup.', 'EV-08'],
    ['RFI-016', 'Podium Planter Box Overflow Strategy', '2026-03-18', 'Clarifies overflow and waterproofing interfaces for podium planter boxes.', 'EV-08'],
    ['RFI-017', 'Electrical Riser Clash at Grid F7', '2026-04-22', 'Riser clashes with transfer beam depth and requires agreed reroute or structural opening.', 'EV-09'],
    ['RFI-018', 'Substation Metering Room Ventilation', '2026-05-02', 'Requests authority and mechanical signoff for metering room ventilation arrangement.', 'EV-09'],
    ['RFI-019', 'Retail Grease Arrestor Maintenance Access', '2026-05-14', 'Clarifies maintenance access and replacement strategy for grease arrestor assembly.', 'EV-09'],
    ['RFI-020', 'Lift Machine Room Heat Rejection Loads', '2026-06-20', 'Requests final lift supplier heat rejection data for plantroom and shaft ventilation.', 'EV-10'],
    ['RFI-021', 'Apartment Corridor Acoustic Ceiling Hangers', '2026-07-01', 'Clarifies acceptable hanger systems for corridor acoustic ceiling with services congestion.', 'EV-10'],
    ['RFI-022', 'Lobby Stone Finishes Alternative Availability', '2026-07-16', 'Seeks approval pathway for equivalent stone due to supplier availability constraints.', 'EV-10'],
    ['RFI-023', 'Balustrade Wind Load Test Evidence', '2026-08-05', 'Requests final wind load test evidence for custom balustrade system prior to installation.', 'EV-10'],
    ['RFI-024', 'Retail Signage Conduit Provision', '2026-08-26', 'Clarifies landlord base-building conduit provisions for future retail signage installations.', 'EV-10'],
  ]

  return topics.map(([code, title, date, summary, eventCode], index) =>
    createRow(`06-${String(index + 1).padStart(3, '0')}`, `${code} - ${title}.pdf`, '06_rfi', date, 'Construction', 'Contractor', 'Superintendent / Consultants', summary, eventCode, 3)
  )
}

function buildVariationDocs() {
  const directions = [
    ['VD-001', 'Additional Test Piles and Verification Works', '2025-10-30', 'Direction for additional test piles and associated verification works.', 'EV-02'],
    ['VD-002', 'Additional Piling at Tower Core', '2025-11-14', 'Direction for extra piles following revised geotechnical interpretation.', 'EV-02'],
    ['VD-003', 'Laneway B Traffic Management Reconfiguration', '2026-01-27', 'Direction changing traffic-management and hoarding configuration at laneway interface.', 'EV-05'],
    ['VD-004', 'Façade Panel Specification Change to A2 System', '2026-02-03', 'Direction changing façade panels to A2-compliant system.', 'EV-07'],
    ['VD-005', 'Latent Conditions Excavation Support Measures', '2026-02-24', 'Direction for temporary support and revised excavation measures due to basalt and groundwater.', 'EV-06'],
    ['VD-006', 'Basement Waterproofing Composite Upgrade', '2026-03-04', 'Direction upgrading basement waterproofing and perimeter drainage build-up.', 'EV-08'],
    ['VD-007', 'Electrical Riser Reroute and Beam Penetrations', '2026-05-06', 'Direction implementing agreed electrical riser reroute and structural openings.', 'EV-09'],
    ['VD-008', 'Retail Acoustic Separation Upgrade', '2026-06-18', 'Direction for acoustic enhancements between retail plant and residential interface.', 'EV-10'],
    ['VD-009', 'Lift Procurement Acceleration Measures', '2026-07-14', 'Direction approving acceleration measures for lift procurement and installation sequence.', 'EV-10'],
  ]

  const claims = [
    ['VC-001', 'Variation Claim - Additional Test Piles and Verification Works', '2025-11-12', 'Contractor valuation for additional test piles, testing, and supervision.', 'EV-02'],
    ['VC-002', 'Variation Claim - Additional Piling at Tower Core', '2025-12-02', 'Pricing claim for extra piling quantities, mobilisation, and concrete overbreak.', 'EV-02'],
    ['VC-003', 'Variation Claim - Laneway B Traffic Management Reconfiguration', '2026-02-08', 'Pricing claim for revised traffic management, barriers, controllers, and resequencing.', 'EV-05'],
    ['VC-004', 'Variation Claim - Façade Panel Specification Change', '2026-02-19', 'Pricing claim for façade panel change including lead time, support rails, and redesign.', 'EV-07'],
    ['VC-005', 'Variation Claim - Latent Conditions Excavation Support Measures', '2026-03-03', 'Pricing claim for rock breaking, temporary support, and groundwater management.', 'EV-06'],
    ['VC-006', 'Variation Claim - Basement Waterproofing Composite Upgrade', '2026-03-18', 'Pricing claim for composite waterproofing system and perimeter drainage cells.', 'EV-08'],
    ['VC-007', 'Variation Claim - Electrical Riser Reroute and Beam Penetrations', '2026-05-20', 'Pricing claim for rerouted electrical services and associated builder works.', 'EV-09'],
    ['VC-008', 'Variation Claim - Retail Acoustic Separation Upgrade', '2026-06-29', 'Pricing claim for upgraded acoustic wall, ceiling, and services isolation measures.', 'EV-10'],
    ['VC-009', 'Variation Claim - Lift Procurement Acceleration Measures', '2026-07-29', 'Pricing claim for accelerated lift shop drawings, freight, and revised installation sequence.', 'EV-10'],
  ]

  const rows = []
  for (const [index, item] of directions.entries()) {
    const [code, title, date, summary, eventCode] = item
    rows.push(createRow(`07-${String(index + 1).padStart(3, '0')}`, `${code} - ${title}.pdf`, '07_variations', date, 'Construction', 'Superintendent', 'Contractor', summary, eventCode, 4))
  }
  for (const [index, item] of claims.entries()) {
    const [code, title, date, summary, eventCode] = item
    rows.push(createRow(`07-${String(index + 10).padStart(3, '0')}`, `${code} - ${title}.pdf`, '07_variations', date, 'Construction', 'Contractor', 'Superintendent', summary, eventCode, 7))
  }
  return rows
}

function buildNodDocs() {
  const docs = [
    ['NOD-001', 'Inclement Weather - November 2025', '2025-11-27', 'Delay notice for abnormal rainfall affecting excavation productivity and spoil haulage.', 'EV-02'],
    ['NOD-002', 'Inclement Weather - January 2026', '2026-01-12', 'Delay notice for repeated January storm events and unsafe excavation conditions.', 'EV-04'],
    ['NOD-003', 'Laneway B Restricted Access', '2026-01-19', 'Delay notice arising from restricted access and changed traffic management controls.', 'EV-05'],
    ['NOD-004', 'Groundwater Ingress at B3', '2026-02-19', 'Delay notice for groundwater ingress affecting excavation and waterproofing sequence.', 'EV-06'],
    ['NOD-005', 'Basalt Encounter at B3', '2026-02-21', 'Delay notice for basalt encounter requiring revised equipment and excavation methodology.', 'EV-06'],
    ['NOD-006', 'Façade Panel Specification Change', '2026-02-05', 'Delay notice for revised façade specification impacting procurement and shop drawing sequence.', 'EV-07'],
    ['NOD-007', 'Waterproofing Upgrade Direction', '2026-03-05', 'Delay notice for revised waterproofing scope affecting basement critical path activities.', 'EV-08'],
    ['NOD-008', 'Electrical Authority Review Hold', '2026-04-26', 'Delay notice for authority review hold affecting substation and electrical riser works.', 'EV-09'],
    ['NOD-009', 'Electrical Riser Structural Clash', '2026-05-04', 'Delay notice for unresolved electrical riser clash at transfer structure.', 'EV-09'],
    ['NOD-010', 'Retail Acoustic Upgrade', '2026-06-21', 'Delay notice for principal-requested acoustic upgrade affecting podium fitout sequence.', 'EV-10'],
    ['NOD-011', 'Lift Procurement Delay', '2026-06-24', 'Delay notice for extended lift manufacturing lead times and downstream commissioning impact.', 'EV-10'],
    ['NOD-012', 'Balustrade Certification Hold Point', '2026-08-08', 'Delay notice for certification hold point on custom balustrade wind-load evidence.', 'EV-10'],
  ]

  return docs.map(([code, title, date, summary, eventCode], index) =>
    createRow(`08-${String(index + 1).padStart(3, '0')}`, `${code} - ${title}.pdf`, '08_nod', date, 'Construction', 'Contractor', 'Superintendent', summary, eventCode, 4)
  )
}

function buildEotDocs() {
  const docs = [
    ['EOT-001', 'Extension of Time Claim - November 2025 Weather', '2025-12-05', 'EOT claim for weather-affected excavation productivity and access during November 2025.', 'EV-02'],
    ['EOT-002', 'Extension of Time Claim - January 2026 Inclement Weather', '2026-02-04', 'EOT claim for abnormal January weather, supported by BOM data and site diaries.', 'EV-04'],
    ['EOT-003', 'Extension of Time Claim - Laneway B Restricted Access', '2026-02-15', 'EOT claim for access restrictions and revised traffic-management controls.', 'EV-05'],
    ['EOT-004', 'Extension of Time Claim - Groundwater and Basalt Latent Conditions', '2026-03-08', 'EOT claim for latent conditions, revised methodology, and critical path disruption.', 'EV-06'],
    ['EOT-005', 'Extension of Time Claim - Façade Panel Specification Change', '2026-03-16', 'EOT claim for revised façade panel specification and procurement lead-time effects.', 'EV-07'],
    ['EOT-006', 'Extension of Time Claim - Waterproofing Upgrade', '2026-03-28', 'EOT claim for basement waterproofing composite upgrade and resequencing.', 'EV-08'],
    ['EOT-007', 'Extension of Time Claim - Electrical Authority Review Hold', '2026-05-09', 'EOT claim for authority review hold on substation and associated electrical works.', 'EV-09'],
    ['EOT-008', 'Extension of Time Claim - Electrical Riser Clash', '2026-05-28', 'EOT claim for structural clash resolution and delayed services rough-in.', 'EV-09'],
    ['EOT-009', 'Extension of Time Claim - Retail Acoustic Upgrade', '2026-07-02', 'EOT claim for principal-requested retail acoustic upgrade works.', 'EV-10'],
    ['EOT-010', 'Extension of Time Claim - Lift Procurement Delay', '2026-07-18', 'EOT claim for extended lift manufacturing lead times and commissioning impacts.', 'EV-10'],
  ]

  return docs.map(([code, title, date, summary, eventCode], index) =>
    createRow(`09-${String(index + 1).padStart(3, '0')}`, `${code} - ${title}.pdf`, '09_eot', date, 'Construction', 'Contractor', 'Superintendent / Principal', summary, eventCode, 12)
  )
}

function buildPaymentDocs(project) {
  const claims = []
  const schedules = []
  const amounts = [1.18, 1.42, 1.67, 1.55, 1.71, 1.94, 2.06, 2.21, 2.34, 2.48, 2.63, 2.74]
  for (let i = 0; i < 12; i += 1) {
    const month = 9 + i
    const year = month > 12 ? 2026 : 2025
    const normalisedMonth = month > 12 ? month - 12 : month
    const claimDate = fmtDate(year, normalisedMonth, 25)
    const scheduleMonth = normalisedMonth === 12 ? 1 : normalisedMonth + 1
    const scheduleYear = normalisedMonth === 12 ? year + 1 : year
    const scheduleDate = fmtDate(scheduleYear, scheduleMonth, 10)
    const label = monthLabel(year, normalisedMonth)
    const claimed = (amounts[i] * 1000000).toFixed(2)
    const certified = ((amounts[i] * 0.965) * 1000000).toFixed(2)
    claims.push(
      createRow(
        `10-${String(i + 1).padStart(3, '0')}`,
        `Progress Claim #${i + 1} - ${label}.pdf`,
        '10_payment_claims',
        claimDate,
        'Construction',
        project.contract.contractor,
        project.contract.superintendent,
        `Monthly progress claim #${i + 1} valuing work completed in ${label} at AUD ${claimed}, inclusive of assessed variations and unfixed materials.`,
        i < 2 ? 'EV-02' : i < 5 ? 'EV-06' : i < 8 ? 'EV-08' : 'EV-10',
        14
      )
    )
    schedules.push(
      createRow(
        `11-${String(i + 1).padStart(3, '0')}`,
        `Payment Schedule #${i + 1} - ${label}.pdf`,
        '11_payment_schedules',
        scheduleDate,
        'Construction',
        project.contract.superintendent,
        project.contract.contractor,
        `Superintendent's payment schedule #${i + 1} certifying AUD ${certified} after retention and disputed-item adjustments.`,
        i < 2 ? 'EV-02' : i < 5 ? 'EV-06' : i < 8 ? 'EV-08' : 'EV-10',
        6
      )
    )
  }
  return { claims, schedules }
}

function buildInvoiceDocs() {
  const docs = [
    ['INV-0145', 'Geotechnical Investigation - Additional Boreholes', '2026-02-27', 'Invoice for additional geotechnical investigation and reporting at B3 basement.', 'EV-06'],
    ['INV-0146', 'Survey Setout - February 2026', '2026-02-29', 'Monthly survey setout and monitoring invoice for February 2026.', 'EV-06'],
    ['INV-0147', 'Independent Concrete Testing - March 2026', '2026-03-03', 'Invoice for concrete cylinder testing and reporting for basement pours.', 'EV-08'],
    ['INV-0148', 'Traffic Management Services - Laneway B', '2026-03-05', 'Invoice for revised traffic management and controllers at Laneway B.', 'EV-05'],
    ['INV-0149', 'Groundwater Dewatering Plant Hire', '2026-03-11', 'Invoice for temporary dewatering plant and pumps used during latent condition response.', 'EV-06'],
    ['INV-0150', 'Façade Engineering Advice - A2 System', '2026-03-19', 'Invoice for façade engineering review tied to A2-compliant panel redesign.', 'EV-07'],
    ['INV-0151', 'Waterproofing Supplier Technical Attendance', '2026-04-08', 'Invoice for manufacturer technical attendance and mock-up review.', 'EV-08'],
    ['INV-0152', 'Electrical Authority Application Fees', '2026-04-30', 'Invoice covering authority review fees and application administration.', 'EV-09'],
    ['INV-0153', 'Temporary Structural Works Design', '2026-05-12', 'Invoice for temporary works engineering associated with riser clash openings.', 'EV-09'],
    ['INV-0154', 'Acoustic Consultant Fee Proposal - Podium Upgrade', '2026-06-24', 'Invoice for acoustic consultant redesign services for retail interface upgrade.', 'EV-10'],
    ['INV-0155', 'Lift Supplier Reservation Payment', '2026-07-03', 'Invoice for lift supplier reservation payment and accelerated shop drawing release.', 'EV-10'],
    ['INV-0156', 'Balustrade Prototype Testing', '2026-08-09', 'Invoice for prototype balustrade testing and certification documentation.', 'EV-10'],
  ]

  return docs.map(([code, title, date, summary, eventCode], index) =>
    createRow(`12-${String(index + 1).padStart(3, '0')}`, `${code} - ${title}.pdf`, '12_third_party_invoices', date, 'Construction', 'Third Party', 'Contractor / Principal', summary, eventCode, 2)
  )
}

function buildOtherDocs(project) {
  const docs = [
    ['13-001', 'Baseline Construction Programme Rev A.pdf', '2025-09-30', 'Baseline logic-linked programme for the entire project including key authority milestones.', 'EV-01', 18],
    ['13-002', 'Construction Programme Rev B.pdf', '2025-11-29', 'Updated programme incorporating additional piling and excavation productivity adjustments.', 'EV-02', 18],
    ['13-003', 'Construction Programme Rev C.pdf', '2026-01-31', 'Updated programme incorporating weather delay and Laneway B access restrictions.', 'EV-05', 18],
    ['13-004', 'Construction Programme Rev D.pdf', '2026-03-20', 'Updated programme incorporating latent conditions and waterproofing upgrade.', 'EV-08', 19],
    ['13-005', 'Construction Programme Rev E.pdf', '2026-05-31', 'Updated programme incorporating electrical authority review and riser coordination impacts.', 'EV-09', 19],
    ['13-006', 'Construction Programme Rev F.pdf', '2026-07-31', 'Updated programme incorporating lift procurement delay and acoustic redesign impacts.', 'EV-10', 19],
    ['13-007', 'Site Meeting Minutes #01 to #06 Compilation.pdf', '2025-12-20', 'Compilation of early fortnightly site meeting minutes covering mobilisation and substructure issues.', 'EV-03', 36],
    ['13-008', 'Site Meeting Minutes #07 to #12 Compilation.pdf', '2026-03-25', 'Compilation of site meeting minutes covering weather, access, latent conditions, and variations.', 'EV-08', 38],
    ['13-009', 'Site Meeting Minutes #13 to #18 Compilation.pdf', '2026-06-30', 'Compilation of site meeting minutes covering services coordination and authority interfaces.', 'EV-09', 40],
    ['13-010', 'Site Meeting Minutes #19 to #24 Compilation.pdf', '2026-09-30', 'Compilation of site meeting minutes covering fitout, lift, façade, and close-out planning matters.', 'EV-10', 42],
    ['13-011', 'Quality Management Plan.pdf', '2025-09-18', 'Project quality management plan, ITP framework, hold points, and records matrix.', 'EV-01', 34],
    ['13-012', 'Environmental Management Plan.pdf', '2025-09-18', 'Project environmental controls, monitoring, and incident-response requirements.', 'EV-01', 27],
    ['13-013', 'Traffic Management Plan Rev B.pdf', '2026-01-24', 'Revised traffic management plan for Laneway B and public interface controls.', 'EV-05', 24],
    ['13-014', 'Geotechnical Investigation Report SD-RT-2026-018.pdf', '2026-02-20', 'Supplementary geotechnical report documenting groundwater and basalt conditions at B3.', 'EV-06', 52],
    ['13-015', 'Waterproofing Mock-Up Inspection Report.pdf', '2026-03-29', 'Inspection and acceptance report for revised basement waterproofing mock-up.', 'EV-08', 12],
    ['13-016', 'Authority Coordination Tracker Rev C.pdf', '2026-05-10', 'Tracker of authority submissions, comments, hold points, and closure actions.', 'EV-09', 10],
    ['13-017', 'Monthly Photo Report - July 2026.pdf', '2026-07-31', 'Annotated photo report showing façade install, services rough-in, and podium fitout progress.', 'EV-10', 26],
    ['13-018', 'Defects and Commissioning Readiness Tracker Rev A.pdf', '2026-10-15', 'Readiness tracker for commissioning, defects management, and close-out deliverables.', 'EV-10', 14],
  ]

  return docs.map(([docNo, filename, date, summary, eventCode, pages]) =>
    createRow(docNo, filename, '13_other', date, 'Construction Support', project.contract.contractor, 'Project Team', summary, eventCode, pages)
  )
}

async function main() {
  const project = JSON.parse(await fs.readFile(biblePath, 'utf8'))
  const contractBundle = [
    createRow(
      '01-001',
      project.contract_bundle.filename,
      '01_contract',
      project.contract.date_of_contract,
      'Contract Award',
      project.contract.principal,
      project.contract.contractor,
      `Single bundled head contract PDF for ${project.project_name}, including FIA, Annexure Part A, Annexure Part B, the AS4000-2025 general conditions, scope schedules, and tender return components.`,
      'EV-01',
      project.contract_bundle.estimated_pages
    ),
  ]

  const tenderDocs = buildTenderDocs(project)
  const drawingDocs = buildDrawingDocs()
  const specificationDocs = buildSpecificationDocs()
  const letterDocs = buildLetterDocs(project)
  const rfiDocs = buildRfiDocs()
  const variationDocs = buildVariationDocs()
  const nodDocs = buildNodDocs()
  const eotDocs = buildEotDocs()
  const payment = buildPaymentDocs(project)
  const invoiceDocs = buildInvoiceDocs()
  const otherDocs = buildOtherDocs(project)

  const rows = [
    ...contractBundle,
    ...tenderDocs,
    ...drawingDocs,
    ...specificationDocs,
    ...letterDocs,
    ...rfiDocs,
    ...variationDocs,
    ...nodDocs,
    ...eotDocs,
    ...payment.claims,
    ...payment.schedules,
    ...invoiceDocs,
    ...otherDocs,
  ]

  const categoryCounts = rows.reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1
    return acc
  }, {})

  const eventRows = project.core_events.map((event) => ({
    event_code: event.event_code,
    title: event.title,
    window: event.window,
    linked_documents: rows.filter((row) => row.event_code === event.event_code).length,
  }))

  await fs.mkdir(seedDir, { recursive: true })
  await fs.writeFile(registerPath, toCsv(rows), 'utf8')
  await fs.writeFile(eventsPath, toCsv(eventRows), 'utf8')
  await fs.writeFile(
    summaryPath,
    JSON.stringify(
      {
        project_slug: project.project_slug,
        total_documents: rows.length,
        category_counts: categoryCounts,
        contract_bundle_pages: project.contract_bundle.estimated_pages,
      },
      null,
      2
    ),
    'utf8'
  )

  console.log(`Generated ${rows.length} mock-suite document rows`)
  console.log(JSON.stringify(categoryCounts, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
