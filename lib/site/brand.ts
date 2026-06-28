/**
 * Astruct marketing site — single source of truth for navigation, CTAs and
 * jurisdiction data. Imported by the new (marketing) header, footer, sitemap
 * and resource pages. Keep route strings in sync with proxy.ts marketingPaths.
 */
import { getAppCtaTarget } from '@/lib/anon-flag'

export const APP_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://app.astruct.io'
export const SITE_ORIGIN = 'https://astruct.io'

/** "Start free" / "Get started" — crosses to the app subdomain. */
export const startFreeHref = () => getAppCtaTarget()
/** "Log in" — app subdomain. */
export const loginHref = () => `${APP_ORIGIN}/login`
/** Primary in-site conversion. */
export const DEMO_HREF = '/book-a-demo'
export const CONTACT_HREF = '/contact'

export type NavLink = { title: string; href: string; desc?: string; tag?: string }
export type NavGroup = { label: string; href?: string; items?: NavLink[]; feature?: boolean }

export const FEATURES: NavLink[] = [
  { title: 'Security of Payment compliance', href: '/features/security-of-payment-compliance', desc: 'Every claim and schedule built to the Act — endorsements, timeframes, the lot.' },
  { title: 'Payment claims', href: '/features/payment-claims', desc: 'Generate compliant progress claims in minutes, with the right statutory wording.' },
  { title: 'Payment schedules', href: '/features/payment-schedules', desc: 'Assess and respond inside the statutory window. Never miss a deadline.' },
  { title: 'Variations', href: '/features/variations', desc: 'Track claimed, approved and disputed variations through the ledger.' },
  { title: 'NODs, EOTs & delay', href: '/features/delay-eot-notices', desc: 'Notices of delay and extension-of-time claims, drafted and dated correctly.' },
  { title: 'Security & retention', href: '/features/security-retention', desc: 'Retention withheld and released, bank guarantees, cash security — tracked.' },
  { title: 'Artificial intelligence', href: '/features/artificial-intelligence', desc: 'Validity checks that read your contract — without ever changing the maths.' },
]

export const AUDIENCES: NavLink[] = [
  { title: 'Main contractors', href: '/main-contractors', desc: 'Assess subcontractor claims, issue payment schedules, stay compliant at scale.' },
  { title: 'Subcontractors', href: '/subcontractors', desc: 'Make valid claims, respond to schedules, and get paid faster.' },
]

export type Jurisdiction = {
  code: 'qld' | 'nsw' | 'vic' | 'sa' | 'wa' | 'act' | 'nt' | 'tas'
  state: string
  abbr: string
  act: string
  /** Business days the respondent has to give a payment schedule (lib/pa/deadlines.ts). */
  scheduleDays: number
  /** Exact statutory endorsement (lib/pa/calc.ts SOPA_ENDORSEMENT). */
  endorsement: string
}

export const JURISDICTIONS: Jurisdiction[] = [
  { code: 'qld', state: 'Queensland', abbr: 'QLD', act: 'Building Industry Fairness (Security of Payment) Act 2017 (Qld)', scheduleDays: 15, endorsement: 'This is a Payment Claim made under the Building Industry Fairness (Security of Payment) Act 2017.' },
  { code: 'nsw', state: 'New South Wales', abbr: 'NSW', act: 'Building and Construction Industry Security of Payment Act 1999 (NSW)', scheduleDays: 10, endorsement: 'This is a payment claim made under the Building and Construction Industry Security of Payment Act 1999 (NSW).' },
  { code: 'vic', state: 'Victoria', abbr: 'VIC', act: 'Building and Construction Industry Security of Payment Act 2002 (Vic)', scheduleDays: 10, endorsement: 'This is a payment claim made under the Building and Construction Industry Security of Payment Act 2002 (Vic).' },
  { code: 'sa', state: 'South Australia', abbr: 'SA', act: 'Building and Construction Industry Security of Payment Act 2009 (SA)', scheduleDays: 15, endorsement: 'This is a payment claim made under the Building and Construction Industry Security of Payment Act 2009 (SA).' },
  { code: 'wa', state: 'Western Australia', abbr: 'WA', act: 'Building and Construction Industry (Security of Payment) Act 2021 (WA)', scheduleDays: 15, endorsement: 'This is a payment claim made under the Building and Construction Industry (Security of Payment) Act 2021 (WA).' },
  { code: 'act', state: 'Australian Capital Territory', abbr: 'ACT', act: 'Building and Construction Industry (Security of Payment) Act 2009 (ACT)', scheduleDays: 10, endorsement: 'This is a payment claim made under the Building and Construction Industry (Security of Payment) Act 2009 (ACT).' },
  { code: 'nt', state: 'Northern Territory', abbr: 'NT', act: 'Construction Contracts (Security of Payments) Act 2004 (NT)', scheduleDays: 10, endorsement: 'This is a payment claim made under the Construction Contracts (Security of Payments) Act 2004 (NT).' },
  { code: 'tas', state: 'Tasmania', abbr: 'TAS', act: 'Building and Construction Industry Security of Payment Act 2009 (Tas)', scheduleDays: 10, endorsement: 'This is a payment claim made under the Building and Construction Industry Security of Payment Act 2009 (Tas).' },
]

export const resourceHref = (code: string) => `/resources/security-of-payment/${code}`

export const NAV: NavGroup[] = [
  { label: "Who it's for", items: AUDIENCES },
  { label: 'Features', items: FEATURES, feature: true },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', items: JURISDICTIONS.map((j) => ({ title: `${j.abbr} — Security of Payment`, href: resourceHref(j.code), desc: j.act.replace(/ \(.*\)$/, '') })) },
  { label: 'About', href: '/about' },
]

export const FOOTER = {
  product: [
    { title: 'Security of Payment compliance', href: '/features/security-of-payment-compliance' },
    { title: 'Payment claims', href: '/features/payment-claims' },
    { title: 'Payment schedules', href: '/features/payment-schedules' },
    { title: 'Variations', href: '/features/variations' },
    { title: 'NODs, EOTs & delay', href: '/features/delay-eot-notices' },
    { title: 'Security & retention', href: '/features/security-retention' },
    { title: 'Artificial intelligence', href: '/features/artificial-intelligence' },
  ],
  who: [
    { title: 'Main contractors', href: '/main-contractors' },
    { title: 'Subcontractors', href: '/subcontractors' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Book a demo', href: '/book-a-demo' },
  ],
  resources: JURISDICTIONS.map((j) => ({ title: `${j.abbr} Security of Payment`, href: resourceHref(j.code) })),
  company: [
    { title: 'About', href: '/about' },
    { title: 'Support', href: '/support' },
    { title: 'Contact', href: '/contact' },
    { title: 'Terms of website', href: '/legal/terms' },
    { title: 'Privacy policy', href: '/legal/privacy' },
  ],
}
