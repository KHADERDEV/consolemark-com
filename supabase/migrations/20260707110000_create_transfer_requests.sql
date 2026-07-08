create table if not exists public.transfer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rent_console_id uuid not null references public.rent_consoles(id) on delete restrict,
  developer_account_id text not null,
  transaction_id text not null,
  app_names text[] not null default '{}',
  package_names text[] not null,
  whatsapp_number text not null,
  status text not null default 'requested',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfer_requests_developer_account_length check (
    length(trim(developer_account_id)) between 1 and 160
  ),
  constraint transfer_requests_transaction_id_length check (
    length(trim(transaction_id)) between 1 and 160
  ),
  constraint transfer_requests_package_names_not_empty check (
    cardinality(package_names) > 0
  ),
  constraint transfer_requests_status_allowed check (
    status in ('requested', 'approved', 'rejected', 'cancelled')
  )
);

alter table public.transfer_requests
drop constraint if exists transfer_requests_user_profiles_fk;

alter table public.transfer_requests
add constraint transfer_requests_user_profiles_fk
foreign key (user_id) references public.user_profiles(id) on delete cascade;

drop trigger if exists transfer_requests_touch_updated_at on public.transfer_requests;
create trigger transfer_requests_touch_updated_at
before update on public.transfer_requests
for each row
execute function public.admin_touch_updated_at();

create index if not exists transfer_requests_status_created_idx
on public.transfer_requests (status, created_at desc);

create index if not exists transfer_requests_user_created_idx
on public.transfer_requests (user_id, created_at desc);

create index if not exists transfer_requests_package_names_gin_idx
on public.transfer_requests using gin (package_names);

alter table public.transfer_requests enable row level security;

drop policy if exists "Users can read own transfer requests" on public.transfer_requests;
create policy "Users can read own transfer requests"
on public.transfer_requests
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own transfer requests" on public.transfer_requests;
create policy "Users can create own transfer requests"
on public.transfer_requests
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can cancel own requested transfer requests" on public.transfer_requests;
create policy "Users can cancel own requested transfer requests"
on public.transfer_requests
for update
to authenticated
using ((select auth.uid()) = user_id and status = 'requested')
with check ((select auth.uid()) = user_id and status = 'cancelled');

revoke all on public.transfer_requests from anon;
