-- ─── Billing schema ──────────────────────────────────────────────────────
-- subscriptions, usage_records, token_events, stripe_events
-- See /docs/decisions.md for the rationale behind each design choice.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_base_item_id text,         -- subscription_item id for the per-contract base
  stripe_overage_item_id text,      -- subscription_item id for the metered overage
  status text not null,             -- active, past_due, canceled, incomplete, trialing, etc.
  contract_quantity int not null default 1,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  overage_cap_cents int default 20000,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

create table if not exists public.usage_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete cascade,
  billing_period_start timestamptz not null,
  billing_period_end timestamptz not null,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  total_tokens bigint generated always as (input_tokens + output_tokens) stored,
  reported_to_stripe boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists usage_records_user_period_idx
  on public.usage_records(user_id, billing_period_start);
create index if not exists usage_records_unreported_idx
  on public.usage_records(reported_to_stripe) where reported_to_stripe = false;

create table if not exists public.token_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contract_id uuid references public.contracts(id) on delete set null,
  message_id uuid references public.chat_messages(id) on delete set null,
  input_tokens int not null,
  output_tokens int not null,
  model text not null,
  feature text not null,
  created_at timestamptz default now()
);
create index if not exists token_events_user_created_idx
  on public.token_events(user_id, created_at desc);
-- (No partial index on created_at — postgres requires IMMUTABLE predicate;
-- the (user_id, created_at desc) index above is sufficient for the queries
-- we run.)

-- Stripe webhook idempotency: every processed event_id is recorded so retries become no-ops.
create table if not exists public.stripe_events (
  id text primary key,             -- the evt_* id from Stripe
  type text not null,
  processed_at timestamptz default now(),
  payload jsonb
);

-- ─── RLS ────────────────────────────────────────────────────────────────
alter table public.subscriptions enable row level security;
alter table public.usage_records enable row level security;
alter table public.token_events enable row level security;
alter table public.stripe_events enable row level security;

drop policy if exists "subs read own" on public.subscriptions;
create policy "subs read own" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "usage read own" on public.usage_records;
create policy "usage read own" on public.usage_records
  for select using (auth.uid() = user_id);

drop policy if exists "tokens read own" on public.token_events;
create policy "tokens read own" on public.token_events
  for select using (auth.uid() = user_id);

-- stripe_events is service-role only. No policy = no rows for anon/authed.

-- ─── Helper: current included token allowance ──────────────────────────
-- 2,000,000 input + 500,000 output per contract per cycle.
-- Stored as a single combined budget for cap math: 2,500,000 tokens / contract.
create or replace function public.included_tokens_for_user(uid uuid)
returns bigint
language sql stable as $$
  select coalesce(
    (select contract_quantity::bigint * 2500000
     from public.subscriptions
     where user_id = uid and status = 'active'
     order by created_at desc
     limit 1),
    0
  );
$$;
