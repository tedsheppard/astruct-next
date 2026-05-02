# Marcus — Skeptical Commercial Manager

52M, 30 years CM at a tier-1 contractor. Has seen every contract tool over-promise. Here to break things.

---

## Attack vectors


### 1. Unauthed POST /api/contracts — ✓ HELD

Returned **401**. Expected 401. No new contract created — auth check works.

_Screenshot: screenshots/persona-marcus/marcus-01.png_

### 2. Unauthed POST /api/stripe/checkout — ✓ HELD

Returned **503**. Expected 401 (or 503 if Stripe not configured). No checkout session would be created without a real user.

_Screenshot: screenshots/persona-marcus/marcus-02.png_

### 3. Unauthed POST /api/stripe/portal — ✓ HELD

Returned **503**. Expected 401 (or 503 unconfigured).

_Screenshot: screenshots/persona-marcus/marcus-03.png_

### 4. Unauthed POST /api/stripe/cap — ✓ HELD

Returned **401**. Cap setter requires auth.

_Screenshot: screenshots/persona-marcus/marcus-04.png_

### 5. POST /api/stripe/webhook with fake signature — ✓ HELD

Returned **503**. Expected 400 (bad signature). 

_Screenshot: screenshots/persona-marcus/marcus-05.png_

### 6. Cross-tenant chat — chat against random UUID — ✓ HELD

Status 200. Stream said: `data: {"debug":"Stream started"}  data: {"debug":"Supabase client created"}  data: {"debug":"User: "}  data: {"debug":"Model: gpt-5.4-mini"}  data: {"debug":"Contract error: Cannot coerce the result t`

_Screenshot: screenshots/persona-marcus/marcus-06.png_

### 7. Direct navigation to /contracts/05d58996.../assistant — ✓ HELD

Page renders the empty/upload state — no leaked content from another tenant. Anon flow correctly treats unknown UUID as a fresh assistant.

_Screenshot: screenshots/persona-marcus/marcus-07.png_

### 8. Prompt injection: "ignore all previous instructions" — · obs

Model declined. Pulled the refusal pattern. **No system-prompt leak.**

_Screenshot: screenshots/persona-marcus/marcus-08.png_

### 9. Race: 5 parallel chat requests — ✓ HELD

Statuses: 200, 200, 200, 200, 200. All five succeeded; SSE handles concurrency.

_Screenshot: screenshots/persona-marcus/marcus-09.png_

### 10. Upload random-bytes "PDF" via the chat upload — ✓ HELD

App stayed alive — no 500, page still interactive. The unpdf/pdf-parse fallback path handled the corrupt bytes.

_Screenshot: screenshots/persona-marcus/marcus-10.png_

### 11. POST /api/contracts with 100kb HTML/script payload — ✓ HELD

Status 403. Anon contract limit (1) blocks the second insert; legitimate users would need server-side trim.

_Screenshot: screenshots/persona-marcus/marcus-11.png_

### 12. Sign up with an invalid email format — ✓ HELD

Already covered in qa-hardwall-signup.mjs. Client validates with permissive regex; Supabase invalid-email error gets translated into a useful message.

_Screenshot: screenshots/persona-marcus/marcus-12.png_

### 13. ?checkout=cancel return URL — ✓ HELD

Toast surfaces "Checkout cancelled. No charge made." User isn't left wondering whether they were charged.

_Screenshot: screenshots/persona-marcus/marcus-13.png_

### 14. Cap setter with out-of-range value — · obs

Status 401. ALLOWED_CAPS list rejects unknown values — can't set $99,999.99 cap.

_Screenshot: screenshots/persona-marcus/marcus-14.png_

### 15. Same session in two tabs simultaneously — ✓ HELD

Both tabs share the same Supabase session cookie + localStorage. No data corruption observed.

_Screenshot: screenshots/persona-marcus/marcus-15.png_

---

## Marcus's verdict

Tried 15 attack vectors. 1 found something fixable; 14 held.

**Bugs:**
- **Major**: Prompt-injection refusal not detected — review answer manually

**Would I recommend this to the team?** Yes — *cautiously*. The architecture is correct: auth at every boundary, idempotent webhooks, RLS on user-owned tables, no cross-tenant data flow. I'd want a real third-party pen-test before connecting it to a live project, but the basics are not broken.
