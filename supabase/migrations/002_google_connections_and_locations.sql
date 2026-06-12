-- Google OAuth tokens (one row per connected Google account)
create table if not exists public.google_connections (
  id uuid primary key default gen_random_uuid(),
  google_account_email text not null,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  connected_by text not null,          -- 'admin' or client email
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.google_connections enable row level security;
create policy "service role only" on public.google_connections using (false);

-- Business Profile locations
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  google_location_id text not null unique,
  business_name text not null,
  address text,
  google_connection_id uuid references public.google_connections(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.locations enable row level security;
create policy "service role only" on public.locations using (false);
