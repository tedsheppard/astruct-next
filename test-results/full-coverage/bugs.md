# Astruct — Bug list (Total Coverage QA Pass, 2026-05-02)

Sorted by severity. Each bug has: route + screenshot path + interaction + one-sentence description.

## Critical (blocks launch)

| # | Route | Interaction | Bug | Screenshot |
|---|---|---|---|---|
| C1 | `astruct.io/` | Page load | Hero + dark band + footer with massive empty whitespace in between — sections not rendering | `001_landing_pageload_initial.png`, `301_m-01_landing_top_mobile.png` |
| C2 | `astruct.io/privacy` | Page load | Body literally empty — only the title "Privacy Policy / Last updated: 1 April 2026" renders. Compliance + Stripe checkout blocker. | `005_privacy_pageload_initial.png` |
| C3 | `app.astruct.io/{any-bad-route}` | Page load | Falls through to "Starting your guest session..." instead of showing branded 404. Every bad URL creates an anon session and burns IP throttle. | `013_404-app_pageload_initial.png` |
| C4 | `astruct.io/about` | Footer click | Falls through to app, opens guest-session loader instead of showing About page | `004_about_pageload_initial.png` |
| C5 | `app.astruct.io/setup` | New user navigates to /settings/billing | Dashboard layout forces redirect back to /setup; blocks every new user from reaching billing. AND has 2 native macOS dropdowns ("Your role", "How did you hear about Astruct?") — regresses bug #1 from issues.docx | `204_ucb-04_billing_initial.png` |
| C6 | `app.astruct.io/forgot-password` | Page load | Doesn't exist — falls through to bootstrap loader. Users locked out of an account have no recovery path. | `010_forgot-password_pageload_initial.png` |

## Major

| # | Route | Interaction | Bug | Screenshot |
|---|---|---|---|---|
| M1 | `astruct.io/solutions` | Footer Solutions click | Returns 404. Same for /solutions/contractors, /solutions/developers-principals, /solutions/subcontractors, /solutions/contract-administrators (all linked from footer) | `003_solutions_pageload_initial.png` |
| M2 | `astruct.io/{stale-marketing-route}` | Click stale link | Falls through to app side, creates anon session, redirects to /contracts/new which renders the OLD manual contract form (Party 1 Role / Principal Name as free-text inputs) | `014_404-marketing_pageload_initial.png` |
| M3 | Any anon flow | Multiple stale-route navigations | IP rate limit hit during normal browsing because every fall-through creates a new anon session. "Too many guest sessions started recently." | `015_assistant-anon-cold_pageload_initial.png` |
| M4 | `app.astruct.io/login` | Page load / Forgot password recovery flow | No "Forgot password?" link visible — combined with C6 means users can't recover an account | `008_login_pageload_initial.png` |

## Minor / Polish

| # | Route | Bug | Screenshot |
|---|---|---|---|
| P1 | Intro modal | Inconsistent chevron styles between contract-type dropdown and contract-form dropdown | `104_uca-04_extractionDone_review.png` |
| P2 | Mobile assistant breadcrumb | Wraps across 3 lines on mobile and truncates leading word ("Regional" lost from "Regional Treatment Plant Capital Works Program") | `308_m-08_assistant_fresh_mobile.png` |
| P3 | Mobile drawer + library cue | Library cue speech bubble partially obscured by drawer's right edge when drawer is open | `309_m-09_hamburger_open_mobile.png` |
| P4 | `app.astruct.io/login` | No Magic Link or Google sign-in option | `008_login_pageload_initial.png` |

## Info / observations

- Pensar 14MB subcontract extraction took **98 seconds** on the live deploy. Acceptable but worth noting for first-impression UX (a "Reading clause N of M" progress indicator would help).
- AI quality on the live build is genuinely strong — verbatim clause quotes, contextual offers ("If you want, I can turn that into a deadline table"), grounded in the actual uploaded contract.
- Clause-personalised suggestion chips on mobile pulled real clause numbers (12.15, 13.1, 12.7, 25.1) from THIS subcontract — the clause-topics extractor is doing what it should.
- Zero console errors during the 6-minute Use Case A walk on live.
- Hamburger drawer + sticky-bottom modals + 48px tap targets all hold under live mobile pass.
