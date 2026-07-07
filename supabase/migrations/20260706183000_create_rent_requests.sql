alter table public.user_profiles
add column if not exists whatsapp_number text;

create table if not exists public.rent_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rent_console_id uuid not null references public.rent_consoles(id) on delete restrict,
  app_name text not null,
  package_name text not null,
  submission_type text not null,
  pricing_type text not null,
  gmail text not null,
  whatsapp_number text not null,
  status text not null default 'requested',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rent_requests_app_name_length check (
    length(trim(app_name)) between 1 and 30
  ),
  constraint rent_requests_submission_type_allowed check (
    submission_type in ('app', 'game')
  ),
  constraint rent_requests_pricing_type_allowed check (
    pricing_type in ('free', 'paid')
  ),
  constraint rent_requests_gmail_only check (
    lower(gmail) like '%@gmail.com'
  ),
  constraint rent_requests_status_allowed check (
    status in ('requested', 'approved', 'rejected', 'cancelled')
  )
);

alter table public.rent_requests
drop constraint if exists rent_requests_user_profiles_fk;

alter table public.rent_requests
add constraint rent_requests_user_profiles_fk
foreign key (user_id) references public.user_profiles(id) on delete cascade;

create unique index if not exists rent_requests_user_app_package_unique
on public.rent_requests (
  user_id,
  lower(trim(app_name)),
  lower(trim(package_name))
);

drop trigger if exists rent_requests_touch_updated_at on public.rent_requests;
create trigger rent_requests_touch_updated_at
before update on public.rent_requests
for each row
execute function public.admin_touch_updated_at();

create index if not exists rent_requests_status_created_idx
on public.rent_requests (status, created_at desc);

create index if not exists rent_requests_user_created_idx
on public.rent_requests (user_id, created_at desc);

alter table public.rent_requests enable row level security;

drop policy if exists "Users can read own rent requests" on public.rent_requests;
create policy "Users can read own rent requests"
on public.rent_requests
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own rent requests" on public.rent_requests;
create policy "Users can create own rent requests"
on public.rent_requests
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can cancel own requested rent requests" on public.rent_requests;
create policy "Users can cancel own requested rent requests"
on public.rent_requests
for update
to authenticated
using ((select auth.uid()) = user_id and status = 'requested')
with check ((select auth.uid()) = user_id and status = 'cancelled');

revoke all on public.rent_requests from anon;
