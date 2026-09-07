# Astruct website: cloud development and marketing

## Project context

Public marketing website for Astruct, construction contract intelligence and notice administration. The separate astruct-app repository serves the application.

Website: https://astruct.io
Repository: tedsheppard/astruct-next
Vercel project: astruct-next

The owner wants to direct building, maintenance and marketing from a phone with the laptop switched off. Work must run in a cloud environment and use repository files and connected services, not a Desktop folder or local-only credentials.

## Cloud environment configuration

- Use this repository's root as the working directory.
- Select Node.js 22 LTS, version 22.13 or newer.
- Setup script: `bash scripts/codex-setup.sh` (also suitable for environment maintenance).
- Development server: `npm run dev -- --hostname 0.0.0.0`.
- Type check: `npx tsc --noEmit`.
- Tests: No unit-test script is currently defined; use focused checks for the changed behaviour.
- Production compilation: `npm run build`. Missing integration configuration or font downloads may prevent a build; report this separately from code errors.
- Supply task-specific environment variables through the cloud environment settings. Do not copy production secrets into repository files, instructions, logs or chat.
- A cloud environment must actually be created in ChatGPT/Codex and connected to this repository; these files alone do not create that account-level connection.

## Work from a phone

Open ChatGPT/Codex cloud in your phone browser, choose this project's cloud environment, and type or use keyboard dictation. Describe the outcome and whether you want a draft, preview or production release. Review the result and request follow-ups in the same cloud task.

Keep durable decisions in repository documentation. Record completed work, relevant checks and remaining blockers in task summaries. Do not assume another task has access to this conversation.

## Development and release workflow

Use a task branch and pull request for code changes. Keep unrelated local or concurrent work intact. Read existing instructions and relevant Next.js documentation before coding. Run checks appropriate to the change; do not execute scripts that seed production data or create payments just to test environment setup.

Vercel should be connected to the matching GitHub repository, with its existing production settings retained. A branch preview and merge-based deployment can then run without a laptop. Confirm the actual Git connection, production branch and domain mapping in Vercel before relying on this workflow. A local `.vercel/project.json` establishes a project link, not a working Git integration.

Production deployment, database changes, outbound messages and paid campaigns require authorization covering the concrete action. Carry out already-authorized work without repeated confirmation. Keep routine development isolated from real customer data and transactions.

## Marketing guidance

Use Australian English, clear wording and a practical professional tone. Match the current website's branding. Check current product behaviour and pricing in the application before writing claims; inherited README content may be outdated. Distinguish shipped features from plans and avoid invented testimonials, results or legal guarantees. Verify jurisdiction-specific legal claims against authoritative current sources.

Research, content drafts, SEO improvements and landing-page changes can be handled here. Publishing to social/email/ad platforms or reading private analytics needs the relevant account connection. Keep ad spend, recipients and publication scope within the user's instructions. These accounts have not been connected by adding this document.

## Environment variable names referenced by source

This inventory lists names only, not values or a requirement to enable every integration. Determine the subset needed for the task. Use separate development/test resources where available.

- `ANTHROPIC_API_KEY`
- `CRON_SECRET`
- `DEV_ACCESS_CODE`
- `LEADS_NOTIFY_TO`
- `NEXT_PUBLIC_ANON_FIRST_ENABLED`
- `NEXT_PUBLIC_APP_ORIGIN`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `RESEND_FROM_EMAIL`
- `RESEND_REPLY_TO`
- `STRIPE_PRICE_BASE`
- `STRIPE_PRICE_OVERAGE`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_VERIFY_SERVICE_SID`
- `VERCEL_URL`
