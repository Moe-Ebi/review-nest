alter table public.widget_settings
  add column if not exists theme text not null default 'light'
  check (theme in ('light','dark','auto'));
