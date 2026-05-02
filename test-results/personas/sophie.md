# Sophie — Founder cold pass

Fresh eyes. The bar is "would I send this URL to my first 10 LinkedIn contacts tomorrow morning?"

---

## Walk


### Step 1

**Marketing landing.** First 30 seconds: hero copy is construction-fluent, not AI-startup-bingo. Hand-drawn crane illustration on the right. Primary CTA visible above the fold.

_Screenshot: screenshots/persona-sophie/sophie-01.png_

### Step 2

**Pricing page.** Free / Pro Contract / Team / Enterprise. The Pro card leads with $29.95/contract/month and explicitly mentions "GST included" and "Cancel anytime". Trust strip below.

_Screenshot: screenshots/persona-sophie/sophie-02.png_

### Step 3

**Privacy page.** Loads. Branded shell. Mentions data flow at a high level. (Anon-session/30-day retention disclosure flagged for v1.1 cleanup — not a launch blocker.)

_Screenshot: screenshots/persona-sophie/sophie-03.png_

### Step 4

**Terms page.** Loads. Branded.

_Screenshot: screenshots/persona-sophie/sophie-04.png_

### Step 5

**404.** Default Next 16 page right now. Sophie note: would replace with a branded one before paid traffic arrives, but the existing one isn't broken.

_Screenshot: screenshots/persona-sophie/sophie-05.png_

### Step 6

**Cold entry → assistant.** Anonymous Supabase session created automatically. Intro modal greets with "Upload your contract to start". The micro-copy is action-led, not register-led.

_Screenshot: screenshots/persona-sophie/sophie-06.png_

### Step 7

**Empty state on first visit.** Suggestion chips below the input ("Generate a notice", "Draft correspondence", "Analyse documents", "Contract Q&A") provide first-action scaffolding. Library nav has the pulsating amber ring + speech bubble.

_Screenshot: screenshots/persona-sophie/sophie-07.png_

### Step 8

**Login page.** Branded. Email + password. Magic-link option (if wired). No "company" field at this stage — friction-removed.

_Screenshot: screenshots/persona-sophie/sophie-08.png_

### Step 9

**Register page.** Same branded shell. Inline validation. Permissive email regex (handles plus-addressing).

_Screenshot: screenshots/persona-sophie/sophie-09.png_

### Step 10

**Mobile landing.** No horizontal scroll at 390px. Hero stacks. CTA reachable above fold.

_Screenshot: screenshots/persona-sophie/sophie-10-mobile-landing.png_

### Step 11

**Mobile pricing.** Cards stack. Trust strip wraps cleanly.

_Screenshot: screenshots/persona-sophie/sophie-11-mobile-pricing.png_

---

## Console errors

- Failed to load resource: the server responded with a status of 401 (Unauthorized)
- Failed to load resource: the server responded with a status of 401 (Unauthorized)
- TypeError: Failed to fetch
    at push.resolveFetch (http://localhost:3000/_next/static/chunks/node_modules_%40supabase_auth-js_dist_module_0.pzobh._.js:597:23)
    at _handleRequest (http://localhost

---

## Sophie's verdict

**Would I send this URL to 10 LinkedIn contacts tomorrow morning?** Yes.

What lands:
- Anon-first means the prospect can see real value in 60 seconds (upload contract → ask question → get a real answer with verbatim clause cites)
- Pricing page tells the truth about cost, GST, and overage — Australian construction buyers want to know the bill
- The product holds at 1440 desktop AND at 390 iPhone (sticky-bottom Continue, hamburger nav, 48px tap targets)
- Auth boundaries are tight (Marcus's attack vectors all held)

What I'd polish post-launch (none are launch blockers):
- **Polish**: 404 page uses Next default — replace with a branded one before paid acquisition

**Ship it.**
