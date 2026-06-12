create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  google_review_id text not null unique,
  reviewer_name text,
  reviewer_photo_url text,
  star_rating integer not null check (star_rating between 1 and 5),
  review_text text,
  review_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
create policy "service role only" on public.reviews using (false);

-- Index for fast per-location queries sorted by rating then date
create index if not exists reviews_location_rating_date
  on public.reviews(location_id, star_rating desc, review_date desc);

-- Track last sync time on locations
alter table public.locations
  add column if not exists last_synced_at timestamptz,
  add column if not exists review_count integer default 0;
