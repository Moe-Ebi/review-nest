-- Team allowlist: only these emails can log in
create table if not exists public.team_allowlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Only the service role can read/write this table (no public access)
alter table public.team_allowlist enable row level security;

create policy "service role only" on public.team_allowlist
  using (false);
