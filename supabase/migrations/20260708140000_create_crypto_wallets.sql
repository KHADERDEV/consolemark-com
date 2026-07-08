create table if not exists public.crypto_wallets (
  id uuid primary key default gen_random_uuid(),
  asset_name text not null,
  network_name text not null,
  wallet_address text not null,
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crypto_wallets_asset_name_length check (
    length(trim(asset_name)) between 1 and 80
  ),
  constraint crypto_wallets_network_name_length check (
    length(trim(network_name)) between 1 and 120
  ),
  constraint crypto_wallets_wallet_address_length check (
    length(trim(wallet_address)) between 8 and 240
  ),
  constraint crypto_wallets_image_url_length check (
    length(trim(image_url)) between 8 and 500
  )
);

drop trigger if exists crypto_wallets_touch_updated_at on public.crypto_wallets;
create trigger crypto_wallets_touch_updated_at
before update on public.crypto_wallets
for each row
execute function public.admin_touch_updated_at();

create index if not exists crypto_wallets_active_sort_idx
on public.crypto_wallets (is_active, sort_order, created_at);

alter table public.crypto_wallets enable row level security;

drop policy if exists "Anyone can read active crypto wallets" on public.crypto_wallets;
create policy "Anyone can read active crypto wallets"
on public.crypto_wallets
for select
to anon, authenticated
using (is_active = true);

insert into public.crypto_wallets (
  asset_name,
  network_name,
  wallet_address,
  image_url,
  sort_order,
  is_active
)
values (
  'USDT',
  'TRC20 (Tron)',
  'TX55bix9H5bcdTLne2BxhCgTzegmPp5vxc',
  'https://res.cloudinary.com/destej60y/image/upload/v1783533308/1aa4cc98-1975-49bb-9e10-aed708dddccf.png',
  10,
  true
)
on conflict do nothing;
