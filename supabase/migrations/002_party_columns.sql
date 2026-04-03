-- Add flexible party role columns to contracts
alter table public.contracts add column if not exists party1_role text default 'Principal';
alter table public.contracts add column if not exists party1_name text;
alter table public.contracts add column if not exists party1_address text;
alter table public.contracts add column if not exists party2_role text default 'Contractor';
alter table public.contracts add column if not exists party2_name text;
alter table public.contracts add column if not exists party2_address text;
alter table public.contracts add column if not exists user_is_party text default 'party2';
alter table public.contracts add column if not exists administrator_role text;
alter table public.contracts add column if not exists administrator_name text;
alter table public.contracts add column if not exists administrator_address text;
