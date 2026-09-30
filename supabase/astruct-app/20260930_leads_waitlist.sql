-- Waitlist sign-ups (astruct.io/signup-waitlist) go in leads as type 'waitlist'. Applied 30 Sep 2026.
alter table public.leads drop constraint leads_type_check;
alter table public.leads add constraint leads_type_check check (type = any (array['pilot','contact','demo','waitlist']));
drop policy leads_public_insert on public.leads;
create policy leads_public_insert on public.leads for insert to anon, authenticated with check (type = any (array['pilot','contact','waitlist']));
