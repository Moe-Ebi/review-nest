create table if not exists public.widget_settings (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null unique references public.locations(id) on delete cascade,
  layout text not null default 'grid' check (layout in ('carousel','grid','list','badge')),
  accent_color text not null default '#3b82f6',
  background_color text not null default '#ffffff',
  text_color text not null default '#111827',
  number_of_reviews integer not null default 10,
  min_star_rating integer not null default 4 check (min_star_rating between 1 and 5),
  show_agency_branding boolean not null default true,
  agency_name text not null default 'ReviewNest',
  agency_url text not null default 'https://reviewnest.com',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.widget_settings enable row level security;
create policy "service role only" on public.widget_settings using (false);
