-- Atlas Consulting — intake requests schema
-- Run this once in the Supabase SQL Editor.

create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  service     text not null,
  answers     jsonb not null default '{}'::jsonb,
  status      text not null default 'new'
                check (status in ('new', 'contacted', 'archived'))
);

-- Newest requests first in the admin table.
create index if not exists requests_created_at_idx
  on public.requests (created_at desc);

alter table public.requests enable row level security;

-- Anyone can submit the public intake form...
drop policy if exists "public can submit a request" on public.requests;
create policy "public can submit a request"
  on public.requests for insert
  to anon
  with check (true);

-- ...but only a signed-in admin can read or triage them.
drop policy if exists "admins can read requests" on public.requests;
create policy "admins can read requests"
  on public.requests for select
  to authenticated
  using (true);

drop policy if exists "admins can update requests" on public.requests;
create policy "admins can update requests"
  on public.requests for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admins can delete requests" on public.requests;
create policy "admins can delete requests"
  on public.requests for delete
  to authenticated
  using (true);
