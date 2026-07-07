alter table public.rent_consoles
add column if not exists show_price_cents boolean not null default true;
