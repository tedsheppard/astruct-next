import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const suiteDir = path.join(rootDir, 'seeds', 'riverside-towers-suite')
const docsDir = path.join(suiteDir, 'docs')
const biblePath = path.join(suiteDir, 'project-bible.json')
const registerPath = path.join(suiteDir, 'document-register.csv')
const manifestPath = path.join(suiteDir, 'documents-manifest.json')

const CATEGORY_LABELS = {
  '01_contract': 'Contract',
  '02_tender': 'Tender',
  '03_drawings': 'Drawings',
  '04_specifications': 'Specifications',
  '05_project_letters': 'Project Letters',
  '06_rfi': 'RFIs',
  '07_variations': 'Variations',
  '08_nod': 'Notices of Delay',
  '09_eot': 'EOT Claims',
  '10_payment_claims': 'Payment Claims',
  '11_payment_schedules': 'Payment Schedules',
  '12_third_party_invoices': 'Third-Party Invoices',
  '13_other': 'Other',
}

const EVENT_DETAILS = {
  'EV-01': {
    short: 'Tender clarification and award',
    cause: 'Tender-stage clarifications, façade combustibility qualifications, and post-tender negotiation',
    affectedAreas: ['façade performance', 'programme assumptions', 'scope interfaces', 'early procurement'],
    clauseRefs: ['13', '14', '17', '25', '37'],
    days: 0,
    value: 0,
  },
  'EV-02': {
    short: 'Additional piling',
    cause: 'Revised geotechnical interpretation requiring test piles and additional core piling',
    affectedAreas: ['piling', 'foundation design', 'excavation sequencing'],
    clauseRefs: ['12', '13', '32', '33', '34', '37'],
    days: 8,
    value: 428500,
  },
  'EV-03': {
    short: 'Basement coordination issues',
    cause: 'Coordination discrepancies between architectural, hydraulic, civil, and structural documents',
    affectedAreas: ['stormwater detention', 'services penetrations', 'loading dock', 'fire services'],
    clauseRefs: ['8', '13', '27', '32', '37'],
    days: 4,
    value: 163200,
  },
  'EV-04': {
    short: 'January inclement weather',
    cause: 'Abnormal January storm activity affecting safe access and excavation productivity',
    affectedAreas: ['excavation', 'basement slabs', 'haul roads'],
    clauseRefs: ['33', '34', '37'],
    days: 11,
    value: 0,
  },
  'EV-05': {
    short: 'Laneway B access restriction',
    cause: 'Restricted site access and revised traffic-management controls imposed by adjacent owner activity',
    affectedAreas: ['traffic control', 'deliveries', 'public interface', 'concrete pours'],
    clauseRefs: ['13', '15', '33', '34', '37'],
    days: 9,
    value: 214700,
  },
  'EV-06': {
    short: 'Groundwater and basalt latent conditions',
    cause: 'Unexpected groundwater ingress and basalt encounter at B3 excavation',
    affectedAreas: ['excavation', 'temporary works', 'dewatering', 'programme critical path'],
    clauseRefs: ['12', '25', '27', '33', '34', '37'],
    days: 18,
    value: 689400,
  },
  'EV-07': {
    short: 'Façade specification change',
    cause: 'Directed change from original FR panel build-up to A2-compliant façade system',
    affectedAreas: ['façade panels', 'support rails', 'shop drawings', 'lead times'],
    clauseRefs: ['13', '17', '33', '34', '37'],
    days: 28,
    value: 842600,
  },
  'EV-08': {
    short: 'Basement waterproofing upgrade',
    cause: 'Directed upgrade to composite waterproofing and perimeter drainage following groundwater findings',
    affectedAreas: ['basement walls', 'membranes', 'drainage cells', 'joint treatment'],
    clauseRefs: ['13', '16', '33', '34', '37'],
    days: 16,
    value: 973800,
  },
  'EV-09': {
    short: 'Electrical authority and riser clashes',
    cause: 'Substation approval hold points and unresolved electrical riser conflicts with transfer structure',
    affectedAreas: ['substation', 'electrical risers', 'beam penetrations', 'authority submissions'],
    clauseRefs: ['13', '17', '33', '34', '37'],
    days: 12,
    value: 336900,
  },
  'EV-10': {
    short: 'Lift procurement and acoustic redesign',
    cause: 'Extended lift manufacturing lead times and principal-requested acoustic upgrades at retail interface',
    affectedAreas: ['lifts', 'acoustic separation', 'fitout sequencing', 'commissioning'],
    clauseRefs: ['13', '17', '25', '33', '34', '37'],
    days: 15,
    value: 457300,
  },
}

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]
    const next = text[i + 1]
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"'
        i += 1
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cell += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(cell)
      cell = ''
    } else if (ch === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (ch !== '\r') {
      cell += ch
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }
  const headers = rows.shift() || []
  return rows.filter((r) => r.length).map((r) => {
    const out = {}
    headers.forEach((header, index) => {
      out[header] = r[index] ?? ''
    })
    return out
  })
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function money(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value)
}

function dateDisplay(value) {
  const d = new Date(`${value}T00:00:00Z`)
  return d.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function paragraph(...lines) {
  return `${lines.join(' ')}\n`
}

function joinSections(sections) {
  return `${sections.filter(Boolean).join('\n\n')}\n`
}

function commonHeader(project, row) {
  return joinSections([
    `# ${row.filename.replace(/\.pdf$/i, '')}`,
    `Project: ${project.project_name}`,
    `Project Reference: ${project.project_reference}`,
    `Document No: ${row.doc_no}`,
    `Category: ${CATEGORY_LABELS[row.category] || row.category}`,
    `Date: ${dateDisplay(row.date)}`,
    `Owner: ${row.owner}`,
    `Counterparty: ${row.counterparty}`,
    `Phase: ${row.phase}`,
    `Event Code: ${row.event_code}`,
    `Summary: ${row.summary}`,
  ])
}

function clauseTable(detail) {
  return [
    '| Topic | Position |',
    '| --- | --- |',
    `| Event driver | ${detail.cause} |`,
    `| Affected areas | ${detail.affectedAreas.join(', ')} |`,
    `| Clauses usually engaged | ${detail.clauseRefs.map((c) => `Clause ${c}`).join(', ')} |`,
    `| Typical time effect | ${detail.days} days |`,
    `| Typical commercial exposure | ${money(detail.value)} |`,
  ].join('\n')
}

function projectFactSheet(project) {
  return [
    `Principal: ${project.contract.principal}`,
    `Contractor: ${project.contract.contractor}`,
    `Superintendent: ${project.contract.superintendent}`,
    `Site: ${project.location.site_address}`,
    `Contract Sum: ${money(project.contract.contract_sum_aud)}`,
    `Date of Contract: ${dateDisplay(project.contract.date_of_contract)}`,
    `Date for Site Possession: ${dateDisplay(project.contract.date_for_site_possession)}`,
    `Date for Practical Completion: ${dateDisplay(project.contract.date_for_practical_completion)}`,
    `Defects Liability Period: ${project.contract.defects_liability_period}`,
    `Liquidated Damages: ${money(project.contract.liquidated_damages_per_day_aud)} per day`,
  ].join('\n')
}

function buildContractBundle(project, row) {
  const clauseTopics = [
    'Interpretation and priority of documents',
    'Nature of contract and scope',
    'Security, retention, and guarantees',
    'Superintendent roles, powers, and independence',
    'Service of notices and document control',
    'Latent conditions and site information',
    'Quality obligations and hold points',
    'Programme submission and updates',
    'Practical completion and separable portions',
    'Variations and valuation',
    'Delays, notices, and extensions of time',
    'Progress claims and certification',
    'Set-off, retention, and release mechanics',
    'Defects liability and warranties',
    'Insurance and indemnities',
    'Disputes, expert conferencing, and arbitration',
  ]

  const toc = [
    '## Indicative Contents',
    '1. Formal Instrument of Agreement',
    '2. Recitals and operative provisions',
    '3. Annexure Part A / Contract Particulars',
    '4. Annexure Part B / Special Conditions',
    '5. General Conditions of Contract',
    '6. Principal\'s Project Requirements',
    '7. Contractor\'s tender return and clarifications',
    '8. Schedules, rates, provisional sums, and programme appendices',
    '9. Insurance, security, and statutory declarations',
    '10. Document control and execution pages',
  ].join('\n')

  const annexureRows = [
    ['Item 1', 'Principal', project.contract.principal],
    ['Item 2', 'Contractor', project.contract.contractor],
    ['Item 3', 'Superintendent', project.contract.superintendent],
    ['Item 4', 'Site', project.location.site_address],
    ['Item 5', 'Contract Form', project.contract.contract_form],
    ['Item 6', 'Contract Sum', money(project.contract.contract_sum_aud)],
    ['Item 7', 'Date of Contract', dateDisplay(project.contract.date_of_contract)],
    ['Item 8', 'Site Possession', dateDisplay(project.contract.date_for_site_possession)],
    ['Item 9', 'Date for Practical Completion', dateDisplay(project.contract.date_for_practical_completion)],
    ['Item 10', 'Security', `${project.contract.security_percent}%`],
    ['Item 11', 'Retention', `${project.contract.retention_percent}% capped at security ceiling`],
    ['Item 12', 'Liquidated Damages', `${money(project.contract.liquidated_damages_per_day_aud)} per day`],
    ['Item 13', 'Defects Liability Period', project.contract.defects_liability_period],
    ['Item 14', 'Separable Portions', project.project_profile.separable_portions.join('; ')],
  ]
  const annexureTable = [
    '| Item | Particular | Entry |',
    '| --- | --- | --- |',
    ...annexureRows.map(([a, b, c]) => `| ${a} | ${b} | ${c} |`),
  ].join('\n')

  const generalClauses = clauseTopics
    .map((topic, index) => {
      const number = index + 1
      return joinSections([
        `### Clause ${number} - ${topic}`,
        paragraph(
          `The parties agree that Clause ${number} is to be read consistently with the allocation of risk, obligations, and certification pathways contemplated by ${project.contract.contract_form}.`,
          `For this project, the clause is administered in the context of a dense urban site, a three-level basement, staged authority interfaces, and multiple separable portions.`
        ),
        paragraph(
          'Without limiting the broader contractual framework, the Contractor is required to maintain detailed records, preserve the critical path programme, promptly identify adverse impacts, and provide commercially usable substantiation whenever a claim, qualification, or reservation of rights is advanced.'
        ),
        paragraph(
          'The Principal and Superintendent must act consistently with the agreed document hierarchy, the approved issue register, and the project controls framework so that directions, clarifications, and assessments can be traced back to a stable documentary record.'
        ),
      ])
    })
    .join('\n\n')

  const specialConditions = [
    ['SC1', 'Time bars', 'Delay notices are required within 21 days of awareness, with strict documentary particulars and mitigation detail.'],
    ['SC2', 'Liquidated damages', `Liquidated damages are fixed at ${money(project.contract.liquidated_damages_per_day_aud)} per day.`],
    ['SC3', 'Retention and security', 'Retention is deducted at 5% until the agreed cap is reached, with release at practical completion and after DLP expiry.'],
    ['SC4', 'Progress claims', 'Each progress claim must include statutory declarations, updated programme data, and supporting trade package detail.'],
    ['SC5', 'Variations', 'Cost-plus margins are capped and quotations must address time, approvals, methodology, and downstream trade impacts.'],
    ['SC6', 'Waterproofing warranty', 'Below-ground waterproofing carries enhanced warranty, QA, and testing obligations due to the groundwater risk profile.'],
    ['SC7', 'Document control', 'Only formally issued directions, sketches, and revisions may alter scope or quality requirements.'],
    ['SC8', 'Authority interfaces', 'The Contractor remains responsible for coordination but is entitled to claim where authority delay qualifies under the contract.'],
  ]
  const scTable = [
    '| Clause | Heading | Project position |',
    '| --- | --- | --- |',
    ...specialConditions.map(([a, b, c]) => `| ${a} | ${b} | ${c} |`),
  ].join('\n')

  const principalRequirements = [
    'Urban interface management and uninterrupted public circulation around the site perimeter.',
    'Basement water ingress risk management, including inspection test plans and mock-up approvals.',
    'Façade combustibility compliance with A2 panel build-up and traceable product evidence.',
    'Authority coordination with electrical utility, water authority, fire authority, and transport stakeholders.',
    'Detailed programme and cash flow reporting linked to separable portions and procurement milestones.',
    'Defect-free handover strategy for retail shell and core, residential common areas, and all life-safety systems.',
  ]

  const scheduleNarrative = [
    `The bundled head contract is treated as a single consolidated PDF for Astruct ingestion even though, in administration terms, it incorporates the FIA, annexures, general conditions, project requirements, schedules, tender return documents, and post-tender clarifications.`,
    `The suite assumes a nominal compiled size of ${row.estimated_pages} pages. The extracted text below is a structured source version intended to preserve the commercial logic, chronology, and clause architecture that the assistant should reason over.`,
    `In practice, the most litigated and advisory-heavy parts of the contract bundle are the special conditions, document priority clauses, latent condition risk treatment, variation valuation provisions, time bar language, and progress certification framework.`,
  ].join(' ')

  return joinSections([
    commonHeader(project, row),
    projectFactSheet(project),
    toc,
    '## Formal Instrument of Agreement',
    paragraph(
      `This Formal Instrument of Agreement records that ${project.contract.principal} engages ${project.contract.contractor} to carry out and complete the works known as ${project.project_name} at ${project.location.site_address}.`,
      `The Contractor accepts the engagement and agrees to perform the works for the Contract Sum of ${money(project.contract.contract_sum_aud)} subject to adjustments permitted by the contract.`
    ),
    paragraph(
      `The parties acknowledge that the contract documents comprise this FIA, the annexures, the special conditions, the general conditions, the project requirements, the schedules, the accepted tender return, the clarification register, and every drawing and specification listed in the schedule of contract documents as revised from time to time in accordance with the contract.`
    ),
    '## Recitals',
    paragraph(
      `The Principal is procuring a ${project.project_profile.asset_class} comprising ${project.project_profile.building_storeys} storeys above ground, ${project.project_profile.basement_levels} basement levels, ${project.project_profile.apartments} apartments, and ${project.project_profile.retail_tenancies} retail tenancies with a total gross floor area of approximately ${project.project_profile.gross_floor_area_sqm} square metres.`
    ),
    paragraph(
      'The Contractor entered the tender process on the basis of the issued project documents, undertook its own investigations, submitted qualifications that were subsequently addressed in post-tender negotiation, and accepted that the final contract would be administered as a design-complete traditional head contract with tightly controlled superintendent directions and rigorous reporting obligations.'
    ),
    '## Annexure Part A - Contract Particulars',
    annexureTable,
    '## Annexure Part B - Special Conditions Matrix',
    scTable,
    '## General Conditions Overview',
    generalClauses,
    '## Principal\'s Project Requirements',
    principalRequirements.map((line, index) => `${index + 1}. ${line}`).join('\n'),
    '## Schedule of Trade Packages',
    project.key_trade_packages.map((line, index) => `${index + 1}. ${line}`).join('\n'),
    '## Project Control and Commercial Framework',
    paragraph(scheduleNarrative),
    clauseTable(EVENT_DETAILS['EV-01']),
    '## Tender Return Incorporated into Contract',
    paragraph(
      'The accepted tender return incorporates the contractor methodology, programme assumptions, resource plan, qualifications resolved during negotiation, priced trade package breakdown, key personnel commitments, and the clarified procurement strategy for long-lead façade, lift, and authority-interface elements.'
    ),
    paragraph(
      'The post-tender clarifications record that the Contractor was required to remove any assumption inconsistent with A2 façade compliance, to commit to a monthly reporting format acceptable to the Superintendent, and to recognise that document control and design issue status would be central to both valuation and EOT assessments.'
    ),
    '## Risk and Event Summary',
    Object.entries(EVENT_DETAILS)
      .map(([code, detail]) =>
        joinSections([
          `### ${code} - ${detail.short}`,
          paragraph(
            `Event driver: ${detail.cause}. Affected areas include ${detail.affectedAreas.join(', ')}. Claims and assessments arising out of this event normally engage ${detail.clauseRefs.map((c) => `Clause ${c}`).join(', ')}.`
          ),
        ])
      )
      .join('\n\n'),
    '## Execution',
    paragraph(
      `Executed as an agreement on ${dateDisplay(project.contract.date_of_contract)} by authorised signatories for ${project.contract.principal} and ${project.contract.contractor}, with ${project.contract.superintendent} identified as Superintendent under the contract.`
    ),
  ])
}

function buildTenderDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const docType = row.filename.toLowerCase()
  let body = ''

  if (docType.includes('part 1 conditions')) {
    body = joinSections([
      '## Purpose',
      paragraph(
        'This part of the request for tender sets out the procurement rules, submission requirements, tender timetable, departure protocol, confidentiality requirements, and evaluation framework for the Riverside Towers head contract.'
      ),
      '## Tender Conditions',
      paragraph(
        'Tenderers must lodge a conforming tender, identify departures explicitly, and ensure all qualifications are set out in one consolidated schedule. Any oral advice is non-binding unless confirmed by formal addendum. Tenderers are deemed to have reviewed the site, the contract form, and the schedule of documents.'
      ),
      '## Evaluation Methodology',
      paragraph(
        'Tenders will be evaluated on commercial competitiveness, programme robustness, methodology, urban-interface controls, key personnel, façade and basement risk responses, and capacity to deliver the works in a tightly constrained live environment.'
      ),
      clauseTable(detail),
    ])
  } else if (docType.includes('scope and project brief')) {
    body = joinSections([
      '## Project Brief',
      paragraph(
        `The project comprises a ${project.project_profile.asset_class} on a constrained urban site with public streets to multiple edges and a laneway interface requiring staged logistics management throughout substructure and structure delivery.`
      ),
      '## Scope Summary',
      project.project_profile.separable_portions.map((line, index) => `${index + 1}. ${line}`).join('\n'),
      '## Key Constraints',
      paragraph(
        'The successful head contractor must manage groundwater risk, live public interfaces, authority coordination, long-lead procurement packages, and tight programme interfaces between basement completion, façade close-out, and staged fitout readiness.'
      ),
    ])
  } else if (docType.includes('tender form')) {
    body = joinSections([
      '## Tenderer Declarations',
      paragraph(
        'The tenderer declares that it has examined the request for tender documents, priced the scope as clarified by addenda, nominated all departures, and committed to the staffing and programme assumptions stated in its return.'
      ),
      paragraph(
        `The tenderer further confirms that its offer remains open for acceptance and that, if accepted, the tenderer will execute the ${project.contract.contract_form} head contract without further qualification except as expressly recorded in the agreed clarification register.`
      ),
    ])
  } else if (docType.includes('schedule of contract documents')) {
    body = joinSections([
      '## Incorporated Documents',
      paragraph(
        'The contract documents include the FIA, annexures, general conditions, special conditions, project brief, pricing schedules, specification volumes, issued-for-tender drawings, addenda, accepted tender return, and post-tender clarifications.'
      ),
      paragraph(
        'Documents issued for information only are not contract documents unless expressly elevated by addendum or later formal direction. Revision control is critical because multiple authority and consultant interfaces are expected during the basement and services phases.'
      ),
    ])
  } else if (docType.includes('scope of contract')) {
    body = joinSections([
      '## Scope of Contract',
      paragraph(
        'The Contractor must supply all labour, materials, plant, temporary works, supervision, management systems, and coordination necessary to complete the works described in the contract documents and achieve practical completion, except to the extent that the contract expressly states otherwise.'
      ),
      paragraph(
        'The scope includes design coordination necessary to execute the issued design, shop drawings, authority interfaces, procurement of long-lead items, testing and commissioning, close-out documentation, and defect rectification through the defects liability period.'
      ),
    ])
  } else if (docType.includes('addendum')) {
    body = joinSections([
      '## Addendum Purpose',
      paragraph(
        `This addendum was issued to clarify or revise tender-stage information associated with ${detail.short.toLowerCase()}. Tenderers are required to incorporate the change into their methodology, price, and programme.`
      ),
      '## Tenderer Action Required',
      paragraph(
        'Tenderers must acknowledge the addendum, identify any residual qualifications, update affected schedules, and ensure that all subcontract and supplier assumptions reflect the revised technical position.'
      ),
    ])
  } else if (docType.includes('submission volume 1')) {
    body = joinSections([
      '## Executive Summary',
      paragraph(
        `${project.contract.contractor} presents a delivery methodology centred on deep preconstruction planning, early trade engagement, rigorous urban logistics, and proactive management of basement and façade risk packages.`
      ),
      '## Delivery Philosophy',
      paragraph(
        'The tender return emphasises one-team coordination, weekly look-ahead planning, authority issue tracking, and disciplined change management to avoid unmanaged scope growth. The Contractor identifies piling, basement waterproofing, façade procurement, lift lead time, and public-interface traffic management as principal project risks.'
      ),
      '## Proposed Key Personnel',
      paragraph(
        'The tender nominates a project director, project manager, construction manager, services manager, commercial manager, and planning lead, each with recent high-rise mixed-use delivery experience in dense Brisbane sites.'
      ),
    ])
  } else if (docType.includes('submission volume 2')) {
    body = joinSections([
      '## Programme and Staging',
      paragraph(
        'The tender programme sequences mobilisation, demolition and excavation, piling, substructure, superstructure, façade close-in, services rough-in, fitout, commissioning, and staged handover to align with the target practical completion date.'
      ),
      paragraph(
        'Key programme assumptions include uninterrupted access through Laneway B, timely authority review of substation documentation, dry-season productivity during bulk excavation, and achievement of façade shop drawing signoff before long-lead manufacture release.'
      ),
    ])
  } else if (docType.includes('volume 3 price schedule')) {
    body = joinSections([
      '## Price Build-Up',
      paragraph(
        'The price schedule breaks the contract sum into preliminaries, site management, trade packages, provisional sums, contingency allowances, authority charges, and close-out obligations. Each trade package is priced to align with the documented scope and the tender methodology.'
      ),
      paragraph(
        'Risk allowances have been concentrated in piling, excavation support, façade procurement, lift procurement, and authority interface management because those packages carry the most volatile time and cost drivers.'
      ),
    ])
  } else if (docType.includes('qualifications')) {
    body = joinSections([
      '## Qualifications and Departures',
      paragraph(
        'The tenderer identifies qualifications relating to final authority approvals, latent conditions beyond tender information, availability of nominated façade suppliers, and any change to combustibility or compliance requirements after tender close.'
      ),
      paragraph(
        'All qualifications are expressed to prompt commercial discussion rather than to avoid core delivery risk, but the tenderer reserves its contractual rights where later directions materially change scope, sequence, compliance obligations, or procurement assumptions.'
      ),
    ])
  } else if (docType.includes('clarification register')) {
    body = joinSections([
      '## Clarification Register',
      paragraph(
        'This register consolidates all written questions and answers exchanged during tender evaluation, including discussions about façade compliance, piling assumptions, programme float, trade packaging, and early procurement strategy.'
      ),
      paragraph(
        'Each clarification is indexed so it can be traced into either the final contract bundle, a superseding addendum, or a residual tender qualification. The commercial intent is to eliminate ambiguity at award and reduce arguments about what was priced.'
      ),
    ])
  } else if (docType.includes('post-tender interview')) {
    body = joinSections([
      '## Interview Focus',
      paragraph(
        'The post-tender interview focused on programme realism, façade compliance readiness, urban logistics, authority interfaces, and the tenderer\'s approach to change management and monthly claim substantiation.'
      ),
      paragraph(
        'The Principal sought confirmation that the Contractor understood the likely basement water risk, accepted the superintendent certification framework, and would provide transparent programme updates supported by a logic-linked schedule throughout the works.'
      ),
    ])
  } else if (docType.includes('letter of intent')) {
    body = joinSections([
      '## Limited Early Authority',
      paragraph(
        'The letter of intent authorises only early procurement, mobilisation planning, consultant workshops, and other specifically listed pre-award activities. It does not alter the final risk allocation contemplated by the forthcoming head contract.'
      ),
      paragraph(
        'The Contractor is required to keep discrete records for all work undertaken under the letter of intent so those amounts can be transparently folded into the head contract sum and subsequent progress certification.'
      ),
    ])
  } else if (docType.includes('award approval')) {
    body = joinSections([
      '## Recommendation',
      paragraph(
        `The evaluation team recommends appointment of ${project.contract.contractor} on the basis of competitive price, credible high-rise delivery methodology, transparent clarification process, and willingness to contract on the Principal's preferred commercial framework.`
      ),
      paragraph(
        'The recommendation notes that basement water risk, façade compliance, and authority interfaces remain live issues, but considers those risks better managed through disciplined administration under the selected tenderer than under alternative offers.'
      ),
    ])
  }

  return joinSections([commonHeader(project, row), projectFactSheet(project), body, clauseTable(detail)])
}

function buildDrawingDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const drawingCode = row.filename.split(' - ')[0]
  const isRegister = /register/i.test(row.filename)
  return joinSections([
    commonHeader(project, row),
    `## Drawing Reference`,
    paragraph(
      `${drawingCode} is issued as a project drawing within the Riverside Towers documentation set. The drawing is administered as part of the formal revision trail and is to be read with the drawing register, specification volumes, sketches, and any superseding superintendent directions.`
    ),
    isRegister
      ? paragraph(
          'This register records issue status, revision identifiers, purpose of issue, and supersession notes. The Superintendent relies on the register to determine whether a trade proceeded on the correct revision and whether a later revision gives rise to either a clarification only or a genuine change in scope.'
        )
      : paragraph(
          `The drawing addresses ${detail.affectedAreas.join(', ')} and is expected to be read in conjunction with adjacent consultant documents so that interfaces, penetrations, levels, tolerances, and authority constraints are coordinated before work proceeds.`
        ),
    '## Key Notes',
    paragraph(
      '1. Dimensions are not to be scaled. 2. The Contractor must confirm levels, setouts, and service interfaces on site. 3. Any discrepancy between disciplines must be raised by RFI before fabrication or installation. 4. Revision clouds and transmittal notes are part of the controlled project record.'
    ),
    '## Administration Notes',
    paragraph(
      `This drawing sits within the event context "${detail.short}" and typically engages ${detail.clauseRefs.map((c) => `Clause ${c}`).join(', ')} where the revision or its interpretation affects cost, time, sequence, or certification.`
    ),
    paragraph(
      'For Astruct mock-data purposes, this extracted source preserves the drawing title block logic, issue narrative, and project-control notes rather than attempting to reproduce the underlying CAD geometry.'
    ),
    clauseTable(detail),
  ])
}

function buildSpecificationDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const heading = row.filename.replace(/\.pdf$/i, '')
  const sections = [
    ['General', 'Defines the scope of the worksection, applicable references, coordination duties, and document precedence.'],
    ['Products', 'Sets out material standards, supplier approval requirements, traceability obligations, and evidence of compliance.'],
    ['Execution', 'Defines workmanship, sequencing, tolerances, inspections, test plans, and hold points.'],
    ['Submissions', 'Requires shop drawings, samples, test certificates, warranties, and as-built records.'],
    ['Quality and acceptance', 'Specifies witness points, acceptance criteria, defect rectification expectations, and close-out requirements.'],
  ]

  return joinSections([
    commonHeader(project, row),
    `## Worksection Overview`,
    paragraph(
      `${heading} forms part of the technical specification package for ${project.project_name}. It is intended to read as a disciplined NATSPEC-style worksection adapted to the commercial and site-specific conditions of this project.`
    ),
    paragraph(
      `The worksection is particularly sensitive to ${detail.short.toLowerCase()} because it influences ${detail.affectedAreas.join(', ')} and therefore must be interpreted consistently with the contract bundle, relevant drawings, and later superintendent directions.`
    ),
    ...sections.map(([title, desc], index) =>
      joinSections([
        `### ${index + 1}. ${title}`,
        paragraph(desc),
        paragraph(
          'The Contractor must not substitute materials, alter sequence, or depart from the documented quality path without prior approval. Where a proposed alternative may affect code compliance, warranty, design life, or authority approval, the Contractor must provide a full technical submission and risk statement.'
        ),
      ])
    ),
    '## Project-Specific Requirements',
    paragraph(
      'Project-specific requirements include dense urban logistics, limited laydown space, coordination of public interfaces, enhanced waterproofing assurance below ground, façade combustibility controls, staged authority approvals, and a close documentary link between specification compliance and monthly certification.'
    ),
    clauseTable(detail),
  ])
}

function buildLetterDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const subject = row.filename.split(' - ').slice(2).join(' - ').replace(/\.pdf$/i, '')
  return joinSections([
    commonHeader(project, row),
    `## Subject`,
    paragraph(subject),
    '## Background',
    paragraph(
      `This correspondence is issued in the context of ${detail.short.toLowerCase()}. The immediate issue arises because ${detail.cause.toLowerCase()}, which affects ${detail.affectedAreas.join(', ')} and requires a clear written record of position, direction, or reservation of rights.`
    ),
    '## Contractual Position',
    paragraph(
      `The issuing party records that the matter engages ${detail.clauseRefs.map((c) => `Clause ${c}`).join(', ')} of the head contract. The correspondence is intended to preserve the documentary chain between site events, programme impacts, directions, valuation positions, and any later claim or certification outcome.`
    ),
    '## Required Action',
    paragraph(
      'The receiving party is requested to acknowledge the correspondence, confirm any immediate actions, and respond on the substance of the issue within the timeframe stated in the body of the project letter. Where the matter has programme effect, the receiving party is expected to identify mitigation measures and state whether the event is alleged to affect the critical path.'
    ),
    '## Administrative Notes',
    paragraph(
      'Letters in this suite deliberately read like real contract administration correspondence: they are formal, pointed, and careful about preserving rights without overstating the ultimate entitlement position. That tone is intentional because it is how commercial teams typically write when matters may later be reviewed by claims consultants or lawyers.'
    ),
    clauseTable(detail),
  ])
}

function buildRfiDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const title = row.filename.replace(/\.pdf$/i, '')
  return joinSections([
    commonHeader(project, row),
    '## RFI Form',
    paragraph(`Reference: ${title}`),
    paragraph(`Raised by: ${project.contract.contractor}`),
    paragraph(`Response required from: ${project.contract.superintendent} / relevant consultant`),
    '## Query Background',
    paragraph(
      `The RFI arises from ${detail.cause.toLowerCase()}. The affected work fronts include ${detail.affectedAreas.join(', ')}. The Contractor considers that the currently issued documents do not fully resolve the point or contain a discrepancy that should be clarified before the affected work proceeds.`
    ),
    '## Contractor Question',
    paragraph(
      'The Contractor requests written confirmation of the intended design and document hierarchy, together with any revised detail, note, or drawing reference required to enable procurement, fabrication, or site execution to proceed without abortive work.'
    ),
    '## Programme and Cost Note',
    paragraph(
      `If a response is not received in time, the matter may affect the critical path by approximately ${detail.days || 3} days and could require resequencing, temporary measures, or variation pricing depending on the final response.`
    ),
    '## Attachments Usually Referenced',
    paragraph(
      'Typical attachments include marked-up drawings, photographs, excerpts from the specification, programme snippets, and a short note identifying the precise discrepancy or unresolved interface.'
    ),
    clauseTable(detail),
  ])
}

function buildVariationDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const isClaim = /variation claim/i.test(row.filename)
  return joinSections([
    commonHeader(project, row),
    isClaim ? '## Variation Claim' : '## Variation Direction',
    paragraph(
      isClaim
        ? `This document sets out the Contractor's valuation position arising from ${detail.short.toLowerCase()}. It identifies the changed work, the contractual basis for valuation, the effect on time, and the cost build-up submitted for assessment.`
        : `This document records the Superintendent's formal direction to proceed with changed work arising from ${detail.short.toLowerCase()}. It identifies the revised scope, references the controlling documents, and requires the Contractor to proceed notwithstanding that final valuation may remain outstanding.`
    ),
    '## Scope',
    paragraph(
      `The changed work affects ${detail.affectedAreas.join(', ')}. The document should be read with the associated sketches, RFIs, specifications, and correspondence that collectively define the change and its downstream impacts.`
    ),
    '## Commercial Position',
    paragraph(
      isClaim
        ? `The Contractor contends that the event gives rise to a variation with an estimated value of ${money(detail.value)} and an assessed programme impact of ${detail.days} days before mitigation. The valuation addresses direct cost, subcontractor inputs, preliminaries, and permitted margin.`
        : 'The Superintendent requires the Contractor to isolate the direct scope, submit a detailed quotation with rates, identify programme impacts, and maintain contemporaneous records so the assessment can be completed against the contract framework.'
    ),
    '## Time and Mitigation',
    paragraph(
      'The document records whether the changed work is alleged to affect the critical path, identifies proposed mitigation steps, and distinguishes between immediate proceed-on-direction obligations and any later claim for time or money.'
    ),
    clauseTable(detail),
  ])
}

function buildNodDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  return joinSections([
    commonHeader(project, row),
    '## Notice of Delay',
    paragraph(
      `The Contractor gives this notice under the delay provisions of the head contract. The delay event is described as ${detail.cause.toLowerCase()}.`
    ),
    '## Delay Event',
    paragraph(
      `Affected work fronts: ${detail.affectedAreas.join(', ')}. The Contractor's preliminary assessment is that the event may delay practical completion by up to ${detail.days} days unless mitigation is accepted or the direction causing the issue is altered.`
    ),
    '## Mitigation Measures',
    paragraph(
      'Mitigation measures typically include resequencing, weekend shifts, temporary access adjustments, parallel consultant review, partial procurement release, and targeted acceleration of unaffected work fronts. The notice records those measures without conceding that all delay can or should be absorbed by the Contractor.'
    ),
    '## Reservation of Rights',
    paragraph(
      'This notice preserves the Contractor\'s rights to seek an extension of time, delay costs where available, and any valuation consequences linked to variations, latent conditions, or principal-risk events.'
    ),
    clauseTable(detail),
  ])
}

function buildEotDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  return joinSections([
    commonHeader(project, row),
    '## Extension of Time Claim',
    paragraph(
      `This claim is made under the extension of time regime of the head contract in respect of ${detail.short.toLowerCase()}. The Contractor contends that the event qualifies under the contract and delayed the critical path by ${detail.days} days after allowance for mitigation and concurrency.`
    ),
    '## Chronology',
    paragraph(
      'The claim relies on the notice chain, meeting records, issued directions, drawings, and programme updates. It distinguishes the trigger event, the point of awareness, mitigation steps, the actual effect on critical activities, and the reasons why float or resequencing could not absorb the entire impact.'
    ),
    '## Entitlement Position',
    paragraph(
      `The Contractor says that ${detail.cause.toLowerCase()} was beyond its reasonable control or otherwise falls within the defined qualifying causes of delay. The claim therefore seeks an extension of ${detail.days} days and, where the contract permits, associated prolongation consequences to be considered separately through the valuation process.`
    ),
    '## Programme Analysis',
    paragraph(
      'The programme analysis uses the latest approved programme, identifies the affected activities, states the logical relationship to successor activities, and addresses whether any alleged concurrency is real, dominant, or merely notional.'
    ),
    '## Supporting Records',
    paragraph(
      'Supporting records typically include site diaries, weather data, photographs, transmittals, authority correspondence, consultant responses, meeting minutes, procurement correspondence, and marked-up programme extracts.'
    ),
    clauseTable(detail),
  ])
}

function buildPaymentClaimDoc(project, row) {
  const claimNumber = Number(row.filename.match(/#(\d+)/)?.[1] || 0)
  const base = 1100000 + claimNumber * 165000
  const variationAllowance = 70000 + claimNumber * 28000
  const unfixed = 85000 + claimNumber * 17000
  const retention = (base + variationAllowance + unfixed) * 0.05
  const due = base + variationAllowance + unfixed - retention
  const detail = EVENT_DETAILS[row.event_code]
  return joinSections([
    commonHeader(project, row),
    '## Claim Summary',
    [
      '| Item | Amount |',
      '| --- | ---: |',
      `| Work executed this period | ${money(base)} |`,
      `| Variations this period | ${money(variationAllowance)} |`,
      `| Unfixed materials | ${money(unfixed)} |`,
      `| Less retention at 5% | ${money(retention)} |`,
      `| Amount due this claim | ${money(due)} |`,
    ].join('\n'),
    '## Work Completed This Period',
    paragraph(
      `The claim period covered work fronts associated with ${detail.affectedAreas.join(', ')}. The Contractor values the work by reference to measured quantities, schedule rates, agreed trade package values, and any variation status current at the date of claim.`
    ),
    '## Variations and Adjustments',
    paragraph(
      'The claim includes approved and pending variation components to the extent permitted by the contract and identifies any separately reserved amounts awaiting superintendent assessment.'
    ),
    '## Programme Position',
    paragraph(
      `At the date of this claim, the project continued to manage ${detail.short.toLowerCase()}. The Contractor's monthly reporting linked the claimed work value to the approved programme and separately identified any delay or resequencing concerns that might give rise to EOT or prolongation issues.`
    ),
    '## Statutory Declaration Position',
    paragraph(
      'The claim is accompanied by the required subcontractor payment declaration, updated programme, forecast cash flow, and supporting payment evidence for prior certified amounts.'
    ),
    clauseTable(detail),
  ])
}

function buildPaymentScheduleDoc(project, row) {
  const scheduleNumber = Number(row.filename.match(/#(\d+)/)?.[1] || 0)
  const assessed = 1050000 + scheduleNumber * 158000
  const withheld = 42000 + scheduleNumber * 8000
  const retention = (assessed + withheld) * 0.05
  const detail = EVENT_DETAILS[row.event_code]
  return joinSections([
    commonHeader(project, row),
    '## Superintendent Assessment',
    [
      '| Item | Amount |',
      '| --- | ---: |',
      `| Assessed value of work | ${money(assessed)} |`,
      `| Amount withheld or not certified | ${money(withheld)} |`,
      `| Retention | ${money(retention)} |`,
      `| Net certified amount | ${money(assessed - retention)} |`,
    ].join('\n'),
    '## Reasons for Difference',
    paragraph(
      'Any difference between the claim and the certified amount is explained by reference to incomplete substantiation, pending variation valuation, defects or hold points, disputed quantities, or timing of evidence required under the special conditions.'
    ),
    '## Superintendent Position',
    paragraph(
      `The Superintendent's assessment is informed by the current status of ${detail.short.toLowerCase()}, the available contemporaneous records, and the contract requirement that certification be both prompt and traceably reasoned.`
    ),
    '## Further Information',
    paragraph(
      'The Contractor is invited to provide any further substantiation it considers relevant to the next claim cycle or to any separate valuation, EOT, or dispute process.'
    ),
    clauseTable(detail),
  ])
}

function buildInvoiceDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const invoiceNumber = row.filename.split(' - ')[0]
  const subtotal = Math.max(4200, Math.round(detail.value * 0.08))
  const gst = subtotal * 0.1
  const total = subtotal + gst
  return joinSections([
    commonHeader(project, row),
    '## Invoice',
    `Supplier invoice reference: ${invoiceNumber}`,
    [
      '| Description | Amount |',
      '| --- | ---: |',
      `| Services or supply associated with ${detail.short.toLowerCase()} | ${money(subtotal)} |`,
      `| GST | ${money(gst)} |`,
      `| Total | ${money(total)} |`,
    ].join('\n'),
    '## Service Narrative',
    paragraph(
      `This invoice relates to goods or services required because of ${detail.cause.toLowerCase()}. The supporting records would usually include supplier timesheets, dockets, delivery notes, marked-up sketches, inspection attendance records, or professional advice notes.`
    ),
    paragraph(
      'Invoices in this mock suite are intended to support realistic downstream valuation and payment questions, including whether third-party cost was reasonably incurred, whether it is recoverable under the contract, and whether it aligns with the claimed event chronology.'
    ),
    clauseTable(detail),
  ])
}

function buildOtherDoc(project, row) {
  const detail = EVENT_DETAILS[row.event_code]
  const filename = row.filename.toLowerCase()
  let body = ''

  if (filename.includes('programme')) {
    body = joinSections([
      '## Programme Narrative',
      paragraph(
        'This revision of the construction programme records current progress, logic changes, outstanding authority milestones, and mitigation actions. It is the key schedule used by the Superintendent and commercial team when assessing delay notices, EOT claims, and the realism of monthly cash flow and handover forecasts.'
      ),
      paragraph(
        `The programme revision particularly addresses ${detail.short.toLowerCase()} and maps its effect on the critical path, near-critical activities, and trade access sequence.`
      ),
    ])
  } else if (filename.includes('meeting minutes')) {
    body = joinSections([
      '## Meeting Minutes Summary',
      paragraph(
        'This compilation records attendees, safety and quality matters, programme review, design and RFI status, variation and claim positions, authority interfaces, procurement milestones, and action owners. The minutes are intentionally commercial in tone because that is where many later disputes turn.'
      ),
      paragraph(
        `Within this compilation, ${detail.short.toLowerCase()} appears as a recurring live issue with linked actions, response deadlines, and reservations of rights.`
      ),
    ])
  } else if (filename.includes('quality management plan')) {
    body = joinSections([
      '## Quality Framework',
      paragraph(
        'The quality management plan defines ITPs, hold points, witness points, NCR escalation, document control, and close-out evidence requirements for all major trade packages and subcontract interfaces.'
      ),
      paragraph(
        'The plan gives enhanced focus to basement waterproofing, concrete quality, façade compliance, fire and life-safety testing, and authority witness requirements because those work fronts carry disproportionate latent defect and dispute risk.'
      ),
    ])
  } else if (filename.includes('environmental management plan')) {
    body = joinSections([
      '## Environmental Controls',
      paragraph(
        'The environmental management plan covers noise, dust, sediment, stormwater, waste, contaminated material handling, dewatering, and neighbour-interface obligations. The urban location means environmental controls directly affect the permitted working methodology and sequence.'
      ),
      paragraph(
        'Temporary controls must be documented, inspected, and adjusted to reflect weather events, excavation stages, and any authority or council conditions imposed during delivery.'
      ),
    ])
  } else if (filename.includes('traffic management plan')) {
    body = joinSections([
      '## Traffic Interface',
      paragraph(
        'The revised traffic management plan sets out lane occupation assumptions, deliveries, crane operations, pedestrian management, spotter locations, and emergency access arrangements. It is central to the Laneway B access event and must align with both council conditions and the actual sequence of pours and deliveries.'
      ),
    ])
  } else if (filename.includes('geotechnical investigation')) {
    body = joinSections([
      '## Report Summary',
      paragraph(
        'This supplementary geotechnical report records field observations, bore logs, groundwater measurements, basalt extent, and recommendations affecting excavation support, waterproofing, and programme sequencing.'
      ),
      paragraph(
        'The report is one of the key primary records for the latent conditions event because it anchors the factual cause of later directions, notices, and commercial claims.'
      ),
    ])
  } else if (filename.includes('mock-up')) {
    body = joinSections([
      '## Mock-Up and Inspection',
      paragraph(
        'This record documents the constructed waterproofing mock-up, test sequence, observed defects, rectification actions, consultant signoff path, and conditions attached to acceptance for broader rollout.'
      ),
    ])
  } else if (filename.includes('authority coordination')) {
    body = joinSections([
      '## Authority Tracker',
      paragraph(
        'The tracker records submission dates, comments, requested revisions, hold points, and closure responsibilities for all authority-facing elements, with particular focus on the electrical substation and utility interfaces.'
      ),
    ])
  } else if (filename.includes('photo report')) {
    body = joinSections([
      '## Photo Narrative',
      paragraph(
        'The photo report describes major work fronts, highlights quality or coordination issues, and records visual evidence supporting progress claims and delay narratives. Each image reference is linked to location, date, and work package.'
      ),
    ])
  } else if (filename.includes('defects and commissioning')) {
    body = joinSections([
      '## Readiness Tracker',
      paragraph(
        'This tracker identifies precommissioning prerequisites, outstanding defects, consultant witness points, training obligations, O&M submissions, and handover dependencies for each major system.'
      ),
    ])
  }

  return joinSections([commonHeader(project, row), body, clauseTable(detail)])
}

function buildDocument(project, row) {
  switch (row.category) {
    case '01_contract':
      return buildContractBundle(project, row)
    case '02_tender':
      return buildTenderDoc(project, row)
    case '03_drawings':
      return buildDrawingDoc(project, row)
    case '04_specifications':
      return buildSpecificationDoc(project, row)
    case '05_project_letters':
      return buildLetterDoc(project, row)
    case '06_rfi':
      return buildRfiDoc(project, row)
    case '07_variations':
      return buildVariationDoc(project, row)
    case '08_nod':
      return buildNodDoc(project, row)
    case '09_eot':
      return buildEotDoc(project, row)
    case '10_payment_claims':
      return buildPaymentClaimDoc(project, row)
    case '11_payment_schedules':
      return buildPaymentScheduleDoc(project, row)
    case '12_third_party_invoices':
      return buildInvoiceDoc(project, row)
    case '13_other':
      return buildOtherDoc(project, row)
    default:
      return joinSections([commonHeader(project, row), paragraph(row.summary)])
  }
}

async function main() {
  const project = JSON.parse(await fs.readFile(biblePath, 'utf8'))
  const register = parseCsv(await fs.readFile(registerPath, 'utf8'))
  await fs.mkdir(docsDir, { recursive: true })

  const manifest = []
  for (const row of register) {
    const sourceFilename = `${row.doc_no}__${slugify(row.filename.replace(/\.pdf$/i, ''))}.md`
    const sourcePath = path.join(docsDir, sourceFilename)
    const content = buildDocument(project, row)
    await fs.writeFile(sourcePath, content, 'utf8')
    manifest.push({
      ...row,
      source_file: path.relative(suiteDir, sourcePath),
      source_abs_path: sourcePath,
      extracted_text_chars: content.length,
    })
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
  console.log(`Generated ${manifest.length} source documents`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
