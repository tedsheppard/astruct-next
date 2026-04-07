-- Platform integrations table
create table public.integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null, -- 'procore', 'aconex', 'asite', 'hammertech', 'ineight'
  status text default 'disconnected', -- 'connected', 'disconnected', 'error'
  credentials jsonb default '{}', -- encrypted tokens, refresh tokens, etc.
  config jsonb default '{}', -- platform-specific config (project mappings, sync settings)
  last_synced_at timestamptz,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, platform)
);

-- Synced correspondence from platforms
alter table public.correspondence add column if not exists platform text; -- which platform it came from
alter table public.correspondence add column if not exists external_id text; -- ID in the external system
alter table public.correspondence add column if not exists synced_at timestamptz;

-- RLS
alter table public.integrations enable row level security;
create policy "Users manage own integrations" on public.integrations for all using (auth.uid() = user_id);
