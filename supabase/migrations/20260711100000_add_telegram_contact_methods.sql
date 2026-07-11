alter table public.user_profiles
  add column if not exists telegram_username text,
  add column if not exists telegram_number text;

alter table public.rent_requests
  add column if not exists telegram_username text,
  add column if not exists telegram_number text;

alter table public.transfer_requests
  add column if not exists telegram_username text,
  add column if not exists telegram_number text;

alter table public.rent_requests
  alter column whatsapp_number drop not null;

alter table public.transfer_requests
  alter column whatsapp_number drop not null;

alter table public.rent_requests
  drop constraint if exists rent_requests_contact_method_required;

alter table public.rent_requests
  add constraint rent_requests_contact_method_required
  check (
    nullif(btrim(coalesce(whatsapp_number, '')), '') is not null
    or nullif(btrim(coalesce(telegram_username, '')), '') is not null
    or nullif(btrim(coalesce(telegram_number, '')), '') is not null
  );

alter table public.transfer_requests
  drop constraint if exists transfer_requests_contact_method_required;

alter table public.transfer_requests
  add constraint transfer_requests_contact_method_required
  check (
    nullif(btrim(coalesce(whatsapp_number, '')), '') is not null
    or nullif(btrim(coalesce(telegram_username, '')), '') is not null
    or nullif(btrim(coalesce(telegram_number, '')), '') is not null
  );
