-- Knowledge Base documents (firm-wide reference documents, not tied to a contract)
create table if not exists knowledge_base_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  filename text not null,
  file_path text,
  file_type text,
  file_size integer,
  category text not null default 'internal',
  ai_summary text,
  extracted_text text,
  processed boolean default false,
  uploaded_at timestamptz default now()
);

-- RLS
alter table knowledge_base_documents enable row level security;

create policy "Users can view own KB documents"
  on knowledge_base_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert own KB documents"
  on knowledge_base_documents for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own KB documents"
  on knowledge_base_documents for delete
  using (auth.uid() = user_id);
