-- Marketing site lead capture (Book a demo / Contact forms).
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('demo','contact')),
  name text not null,
  email text not null,
  company text,
  role text,
  jurisdiction text,
  message text,
  preferred_times text,
  source text,
  user_agent text
);
-- Writes happen only via the service-role key (server-side API). RLS on, no
-- public policies, so anon/auth clients cannot read or write leads.
alter table public.leads enable row level security;
