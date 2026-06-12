-- Add role, status, name to team_allowlist
alter table public.team_allowlist
  add column if not exists name text,
  add column if not exists role text not null default 'client' check (role in ('admin','client')),
  add column if not exists status text not null default 'approved' check (status in ('pending','approved','denied'));

-- Mark existing rows as admin + approved (these were manually added in Phase 2)
update public.team_allowlist set role = 'admin', status = 'approved' where role = 'client';

-- New signups default to pending
alter table public.team_allowlist
  alter column status set default 'pending';

-- Track which client owns a location (null = admin-owned, visible to all admins)
alter table public.locations
  add column if not exists owner_email text;
