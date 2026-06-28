# Mock Suite Plan

This plan converts the existing Riverside Towers demo into a single-project, dispute-grade mock corpus for Astruct.

## Locked assumptions

- One head contract PDF only in `01_contract`: `Head Contract Bundle - Riverside Towers.pdf`.
- That bundled contract contains the FIA, annexures, special conditions, general conditions, scope schedules, and tender-return components.
- Target size for the bundled head contract is about 380 pages.
- Everything else in the suite is a separate project document tied to the same timeline, parties, and event ledger.
- The project stays on the existing flagship theme: `Riverside Towers - Mixed Use Development`.

## Why this structure

The current seed shape already points in the right direction:

- [scripts/seed-demo.ts](/Users/tedsheppard/Desktop/Projects/astruct/astruct-next/scripts/seed-demo.ts:1) seeds full-text contract/admin documents for the Riverside Towers demo.
- [scripts/seed-full-demo.ts](/Users/tedsheppard/Desktop/Projects/astruct/astruct-next/scripts/seed-full-demo.ts:121) already models a multi-document Riverside corpus, but mostly as metadata rows.
- [lib/document-categories.ts](/Users/tedsheppard/Desktop/Projects/astruct/astruct-next/lib/document-categories.ts:1) already has the category model needed for a 200+ project suite.
- [lib/sample-contract/index.ts](/Users/tedsheppard/Desktop/Projects/astruct/astruct-next/lib/sample-contract/index.ts:64) already has the chunk-and-embed path that should be reused once the corpus is text-backed.

## Source method

Do not copy a real live project pack and rename it.

Use public documents for structure, tone, numbering, and package conventions:

- government tender templates
- public schedules of contract documents
- public specification structures
- public drawing title conventions
- public contract annexure examples

Then generate a synthetic but internally consistent project universe around one fixed project bible.

## Deliverables now in repo

- [project-bible.json](/Users/tedsheppard/Desktop/Projects/astruct/astruct-next/seeds/riverside-towers-suite/project-bible.json)
- [generate-riverside-suite-register.mjs](/Users/tedsheppard/Desktop/Projects/astruct/astruct-next/scripts/generate-riverside-suite-register.mjs)
- generated document register and event ledger under `seeds/riverside-towers-suite/`

## Planned suite size

- `01_contract`: 1
- `02_tender`: 15
- `03_drawings`: 36
- `04_specifications`: 18
- `05_project_letters`: 32
- `06_rfi`: 24
- `07_variations`: 18
- `08_nod`: 12
- `09_eot`: 10
- `10_payment_claims`: 12
- `11_payment_schedules`: 12
- `12_third_party_invoices`: 12
- `13_other`: 18

Total target: 208 documents.

## Consistency rules

- Every document resolves back to one project bible.
- Every delay/variation/payment item ties to an event code.
- Dates are chronological and commercially plausible.
- RFIs lead to drawings, directions, variations, or delay events where appropriate.
- EOTs and payment schedules reflect earlier notices, directions, and claims.
- File naming follows a repeatable contract-admin convention rather than random examples.

## Next implementation step

Replace metadata-only demo inserts with text-backed seed assets for the top-value documents first:

1. bundled head contract PDF source text
2. tender submission volumes
3. specification volumes
4. core variation / delay / EOT / payment docs
5. support material such as meeting minutes, reports, and invoices
