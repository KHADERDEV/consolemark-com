create table if not exists public.rent_consoles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country_code text not null,
  creation_year integer not null,
  availability_status text not null default 'available_for_rent',
  draft_access_available boolean not null default false,
  transfer_apps_available boolean not null default false,
  live_price numeric(10, 2) not null default 0,
  weekly_price numeric(10, 2) not null default 0,
  transfer_apps_price numeric(10, 2),
  owner_name text not null,
  console_url text not null,
  image_url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rent_consoles_country_code_format check (
    country_code = upper(country_code)
    and length(country_code) between 2 and 3
  ),
  constraint rent_consoles_creation_year_range check (
    creation_year between 2008 and 2100
  ),
  constraint rent_consoles_availability_status_allowed check (
    availability_status in (
      'available_for_rent',
      'not_available_for_rent',
      'fully_rented'
    )
  ),
  constraint rent_consoles_prices_non_negative check (
    live_price >= 0
    and weekly_price >= 0
    and (transfer_apps_price is null or transfer_apps_price >= 0)
  )
);

drop trigger if exists rent_consoles_touch_updated_at on public.rent_consoles;
create trigger rent_consoles_touch_updated_at
before update on public.rent_consoles
for each row
execute function public.admin_touch_updated_at();

create index if not exists rent_consoles_public_listing_idx
on public.rent_consoles (is_published, sort_order, created_at desc);

alter table public.rent_consoles enable row level security;

revoke all on public.rent_consoles from anon, authenticated;

insert into public.rent_consoles (
  name,
  country_code,
  creation_year,
  availability_status,
  draft_access_available,
  transfer_apps_available,
  live_price,
  weekly_price,
  transfer_apps_price,
  owner_name,
  console_url,
  image_url,
  sort_order,
  is_published
)
values (
  'testing',
  'US',
  2026,
  'available_for_rent',
  true,
  true,
  40.00,
  40.00,
  60.00,
  'Console Mark',
  'https://play.google.com/store/apps/dev?id=8228837381578415347',
  'https://res.cloudinary.com/destej60y/image/upload/v1783282724/edcac0a1-9a74-4107-821d-755169b5f27e.png',
  10,
  true
)
on conflict do nothing;
