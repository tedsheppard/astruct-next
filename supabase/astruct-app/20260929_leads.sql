-- Website lead capture (private-pilot applications and contact requests).
-- Applied to the astruct-app Supabase project (xoczeotjvvtayjwtzwiz, Sydney) on
-- 29 Sep 2026. The old marketing project (tduhspikvumgonsaxabh) is paused.
-- The website writes with the project's public anon key: RLS allows an insert
-- of a pilot/contact lead and nothing else (no select, update or delete), so
-- only the service role (the team) can read the rows.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('pilot','contact','demo')),
  name text,
  email text not null,
  company text,
  role text,
  company_size text,
  projects text,
  contract_forms text,
  mail_platform text,
  admin_consent text,
  pain text,
  jurisdiction text,
  message text,
  preferred_times text,
  source text,
  user_agent text,
  meta jsonb not null default '{}'::jsonb,
  constraint leads_email_len check (char_length(email) between 3 and 254),
  constraint leads_text_len check (
    coalesce(char_length(name),0) <= 200 and coalesce(char_length(company),0) <= 200 and
    coalesce(char_length(role),0) <= 200 and coalesce(char_length(company_size),0) <= 100 and
    coalesce(char_length(projects),0) <= 1000 and coalesce(char_length(contract_forms),0) <= 1000 and
    coalesce(char_length(mail_platform),0) <= 200 and coalesce(char_length(admin_consent),0) <= 200 and
    coalesce(char_length(pain),0) <= 4000 and coalesce(char_length(message),0) <= 4000 and
    coalesce(char_length(jurisdiction),0) <= 100 and coalesce(char_length(source),0) <= 100 and
    coalesce(char_length(user_agent),0) <= 400 and coalesce(char_length(preferred_times),0) <= 400 and
    pg_column_size(meta) <= 4000
  )
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
alter table public.leads enable row level security;
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (type in ('pilot','contact'));
revoke select, update, delete, truncate on public.leads from anon, authenticated;
grant insert on public.leads to anon, authenticated;
notify pgrst, 'reload schema';
