-- Idea board persistence.
--
-- Single-user by design: this dashboard has no auth, so the table is scoped
-- by an `owner` string rather than by auth.uid(). Row level security is on
-- with an explicit permissive policy, because leaving RLS off entirely would
-- expose the table through the public anon key with no statement of intent.
--
-- If this ever becomes multi-user, replace the policy below with one keyed on
-- auth.uid() and add a foreign key to auth.users.

create table if not exists public.ideas (
  id          uuid primary key default gen_random_uuid(),
  owner       text        not null default 'duke-fred',
  title       text        not null check (length(trim(title)) between 1 and 200),
  note        text,
  stage       text        not null default 'Spark'
                check (stage in ('Spark', 'Exploring', 'Committed')),
  position    integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- The board is always read in owner + display order.
create index if not exists ideas_owner_position_idx
  on public.ideas (owner, position, created_at desc);

alter table public.ideas enable row level security;

drop policy if exists "ideas are publicly readable and writable" on public.ideas;
create policy "ideas are publicly readable and writable"
  on public.ideas
  for all
  using (true)
  with check (true);

-- Keep updated_at honest without relying on the client to send it.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ideas_touch_updated_at on public.ideas;
create trigger ideas_touch_updated_at
  before update on public.ideas
  for each row
  execute function public.touch_updated_at();
