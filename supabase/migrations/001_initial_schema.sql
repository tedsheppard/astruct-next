-- Enable pgvector for embeddings
create extension if not exists vector;

-- Profiles (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  role text default 'user',
  company_name text,
  company_abn text,
  company_address text,
  company_phone text,
  company_logo_url text,
  signatory_name text,
  signatory_title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Contracts (no projects layer - contracts are top-level)
create table public.contracts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  reference_number text,
  contract_form text default 'bespoke',
  principal_name text,
  principal_address text,
  contractor_name text,
  contractor_address text,
  superintendent_name text,
  superintendent_address text,
  date_of_contract date,
  date_practical_completion date,
  defects_liability_period text,
  contract_sum numeric,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Documents (uploaded files)
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  filename text not null,
  file_path text,
  file_type text,
  file_size integer,
  category text default '13_other',
  ai_summary text,
  extracted_text text,
  processed boolean default false,
  uploaded_at timestamptz default now()
);

-- Document chunks (for RAG)
create table public.document_chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Obligations
create table public.obligations (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  description text not null,
  clause_reference text,
  due_date timestamptz not null,
  status text default 'pending',
  notice_type text,
  completed boolean default false,
  source text default 'manual',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Notices (generated documents)
create table public.notices (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  obligation_id uuid references public.obligations(id),
  notice_type text not null,
  title text not null,
  content text not null,
  clause_references text[] default '{}',
  document_path text,
  created_at timestamptz default now()
);

-- Chat sessions
create table public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Chat messages
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Correspondence (minimal for now)
create table public.correspondence (
  id uuid default gen_random_uuid() primary key,
  contract_id uuid references public.contracts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  content text,
  from_party text,
  category text default 'neutral',
  clause_tags text[] default '{}',
  date_received timestamptz default now(),
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.contracts enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.obligations enable row level security;
alter table public.notices enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.correspondence enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users manage own contracts" on public.contracts for all using (auth.uid() = user_id);
create policy "Users manage own documents" on public.documents for all using (auth.uid() = user_id);
create policy "Users manage own chunks" on public.document_chunks for all using (contract_id in (select id from public.contracts where user_id = auth.uid()));
create policy "Users manage own obligations" on public.obligations for all using (auth.uid() = user_id);
create policy "Users manage own notices" on public.notices for all using (auth.uid() = user_id);
create policy "Users manage own chat_sessions" on public.chat_sessions for all using (auth.uid() = user_id);
create policy "Users manage own chat_messages" on public.chat_messages for all using (session_id in (select id from public.chat_sessions where user_id = auth.uid()));
create policy "Users manage own correspondence" on public.correspondence for all using (auth.uid() = user_id);

-- Vector similarity search for RAG
create or replace function match_document_chunks(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_contract_id uuid
)
returns table (
  id uuid,
  document_id uuid,
  chunk_index integer,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.chunk_index,
    document_chunks.content,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where document_chunks.contract_id = filter_contract_id
    and 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
