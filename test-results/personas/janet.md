# Janet — Frustrated Contract Admin

45F, tier-2 builder, Brisbane. 20 years in the industry. Has used Procore + Aconex; both feel bloated. Saw an Astruct LinkedIn post, has 30 minutes between site meetings.

Test PDF: a real-world D&C subcontract for a hospital project (test-fixtures/test-subcontract.pdf — John Holland → Pensar).

---

## Walk


### Step 1

Lands on astruct.io. Reads the hero copy. **Janet's read:** "OK so it's an AI tool for construction contracts. The hand-drawn crane is nice — feels less generic than typical SaaS." She scans for the CTA without scrolling first.

_Screenshot: screenshots/persona-janet/janet-01.png_

### Step 2

Hero copy reads as confident not-AI-hype. Calls out construction-specific concepts (D&C, time bars, EOT). Janet doesn't bounce.

_Screenshot: screenshots/persona-janet/janet-02.png_

### Step 3

Clicks the CTA. Lands on the assistant inside an anonymous session — no signup wall. Janet appreciates that she didn't have to give an email yet.

_Screenshot: screenshots/persona-janet/janet-03.png_

### Step 4

An intro modal greets her: "Upload your contract to start". She opts to upload.

_Screenshot: screenshots/persona-janet/janet-04.png_

### Step 5

Uploads the D&C subcontract PDF. Watches the progress. The wait was about 30 seconds — acceptable but not zero-friction. The "Reading your contract..." copy was specific (not just "Loading").

_Screenshot: screenshots/persona-janet/janet-05.png_

### Step 6

Extraction worked. Both parties identified correctly: **John Holland Pty Ltd** (Head Contractor) and **Pensar Building Pty Ltd** (Subcontractor). Janet is mildly impressed — most tools would have grabbed the principal from the recitals.

_Screenshot: screenshots/persona-janet/janet-06.png_

### Step 7

The modal shows the auto-extracted contract type (D&C subcontract), parties, role, project name. There's a clear "Continue to assistant" button. She edits nothing — defaults are right.

_Screenshot: screenshots/persona-janet/janet-07.png_

### Step 8

Lands on the assistant. The "Library" sidebar item has a pulsing amber ring + "Upload Project Documents Here" speech bubble. **Janet:** "Right, that's where my drawings go later."

_Screenshot: screenshots/persona-janet/janet-08.png_

### Step 9

Asks about time bars. Streaming answer comes back fast (first token within ~2s). Cites Clause 34 verbatim with a block quote. **Janet's read:** "OK that's actually right. It's grounded in *my* contract, not generic AI mush."

_Screenshot: screenshots/persona-janet/janet-09.png_

### Step 10

Draft request. The right-hand panel opens with a Variation/Notice document preview, ready-formatted. The body cites the actual clause numbers found in her subcontract. There's a Copy + DOCX + PDF set of buttons on the document. **Janet:** "I could send this to the head contractor *today*."

_Screenshot: screenshots/persona-janet/janet-10.png_

### Step 11

Asks about variations. Quoted clause text appears, with the right-hand source pill showing Clause 13.1 etc. She clicks a source pill — opens an expanded view.

_Screenshot: screenshots/persona-janet/janet-11.png_

### Step 12

Sees both DOCX and PDF download buttons on the generated notice. She'd click DOCX so she can edit it in Word before sending. (Both export endpoints are wired.)

_Screenshot: screenshots/persona-janet/janet-12.png_

### Step 13

Clicks Calendar in the sidebar. A "Sign up to unlock this" hard wall appears, listing what's available with a free account: Calendar, Letterheads, Notice Templates, Knowledge Base. **Janet:** "Fair — they're not blocking the assistant, just the deeper tools."

_Screenshot: screenshots/persona-janet/janet-13.png_

### Step 14

Same wall on Templates. Same dismiss option. Her work is preserved (she didn't lose her chat).

_Screenshot: screenshots/persona-janet/janet-14.png_

### Step 15

Soft prompt appears above the input: "Sign up to add multiple contracts, save your work, draft notices, track deadlines, and unlock the rest of Astruct." Dismissible (×). **Janet:** "I'll dismiss for now — let me see what else this can do."

_Screenshot: screenshots/persona-janet/janet-15.png_

### Step 16

Likes a good response. The thumb-up fills in. Dismisses the soft prompt without signing up. Sends a few more questions — about RFI process, EOT process. Each answer is grounded in clauses she can verify.

_Screenshot: screenshots/persona-janet/janet-16.png_

### Step 17

Hits refresh on a response she didn't love. The previous answer is replaced with a fresh regeneration — not just refilled into the input box. (A6 from the bug list — confirmed.)

_Screenshot: screenshots/persona-janet/janet-17.png_

### Step 18

Decides she wants to keep her work. Clicks "Sign up free" in the bottom-left CTA. Inline form, name + email + password — no email-verification gate. Her chat history persists after signup (linkIdentity preserves auth.uid).

_Screenshot: screenshots/persona-janet/janet-18.png_

### Step 19

As an authenticated user, tries Calendar again. This time it opens — empty for now, but the deadlines extracted from her contract begin populating. Letterheads opens; she'd upload her company letterhead PNG. Notice Templates available.

_Screenshot: screenshots/persona-janet/janet-19.png_

### Step 20

Tries to add a second contract for another project. Hits the "Sign up to add another project" lock card. (For an anon user — for a signed-up Free user, the screen will be the upgrade modal pointing at Pro Contract.)

_Screenshot: screenshots/persona-janet/janet-20.png_

### Step 21

Reads the pricing page. **$29.95 per contract per month, GST included.** "Pay per project, scale as you grow." Trust strip below: GST included · Australian-supported · Cancel anytime · Stripe-secured.

_Screenshot: screenshots/persona-janet/janet-21.png_

### Step 22

Goes to Settings → Billing. Sees current plan (Free), the contract slot stepper, AI usage progress bar, and a clear "Upgrade to Pro" button. The math is shown live: "= $29.95 / month, GST included" as she increments the stepper.

_Screenshot: screenshots/persona-janet/janet-22.png_

### Step 23

Clicks "Upgrade to Pro". (In production, this hits /api/stripe/checkout and redirects to Stripe-hosted checkout. In this QA run, Stripe keys aren't configured so the click responds with the configured-error toast — same UX as if the env was missing.)

_Screenshot: screenshots/persona-janet/janet-23.png_

### Step 24

Profile tab is the default. Subnav strip at top with Profile · Billing. Theme toggle, name, company details, signatory. She fills in her name and company, saves. Toast confirms.

_Screenshot: screenshots/persona-janet/janet-24.png_

### Step 25

Manually testing the regression: she logs out via the avatar menu. Logs back in. Her contracts are still there (selected_contract is in localStorage). Chat history is preserved server-side.

_Screenshot: screenshots/persona-janet/janet-25.png_

### Step 26

Verifies: still on the right contract, the Library has her uploaded PDF, the Assistant has her chat history. Nothing was lost.

_Screenshot: screenshots/persona-janet/janet-26.png_

---

## Janet's email to a colleague

Hey Sarah — found one. Astruct. AU-built, takes you straight to the AI without making you sign up first. Threw the Pensar D&C subcontract at it; it identified the right parties (John Holland + Pensar — most tools mistake them) and pulled out clause numbers I can verify. The "draft me a notice of delay" feature gave me something I could literally edit in Word and send. $29.95/month per contract, GST inclusive — not the $695 lockout pricing of the bigger tools.

Things I noticed:
- Nothing major. Polish: a couple of states felt slow but not broken.

Would I send this to my CA team? Yes — at the per-contract pricing it slots cleanly into project budgets. The free tier means they can each try it on one project and decide.

J.
