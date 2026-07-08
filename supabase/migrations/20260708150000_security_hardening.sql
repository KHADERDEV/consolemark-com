-- Security hardening for public schema tables.
-- The application performs writes through server-side routes using the service role.
-- Browser clients should only be able to read the minimum data needed directly.

delete from public.admin_sessions
where admin_user_id in (
  select id from public.admin_users where lower(email) <> 'khader@consolemark.com'
);

delete from public.admin_audit_events
where admin_user_id in (
  select id from public.admin_users where lower(email) <> 'khader@consolemark.com'
);

delete from public.admin_users
where lower(email) <> 'khader@consolemark.com';

alter table public.admin_users
drop constraint if exists admin_users_single_email;

alter table public.admin_users
add constraint admin_users_single_email
check (lower(email) = 'khader@consolemark.com');

create unique index if not exists admin_users_only_one_row_idx
on public.admin_users ((true));

alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;
alter table public.admin_audit_events enable row level security;
alter table public.rent_consoles enable row level security;
alter table public.user_profiles enable row level security;
alter table public.rent_requests enable row level security;
alter table public.transfer_requests enable row level security;
alter table public.payments enable row level security;
alter table public.crypto_wallets enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.admin_sessions from anon, authenticated;
revoke all on public.admin_audit_events from anon, authenticated;
revoke all on public.rent_consoles from anon, authenticated;
revoke all on public.rent_requests from anon, authenticated;
revoke all on public.transfer_requests from anon, authenticated;
revoke all on public.payments from anon, authenticated;
revoke all on public.crypto_wallets from anon, authenticated;

revoke all on public.user_profiles from anon;
revoke all on public.user_profiles from authenticated;
grant select on public.user_profiles to authenticated;

grant select on public.crypto_wallets to anon, authenticated;

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own basic profile"
on public.user_profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check (
  (select auth.uid()) = id
  and is_trusted = (select existing.is_trusted from public.user_profiles existing where existing.id = (select auth.uid()))
  and is_blocked = (select existing.is_blocked from public.user_profiles existing where existing.id = (select auth.uid()))
);

drop policy if exists "Users can create own rent requests" on public.rent_requests;
create policy "Users can create own rent requests"
on public.rent_requests
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and not exists (
    select 1
    from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.is_blocked = true
  )
);

drop policy if exists "Users can create own transfer requests" on public.transfer_requests;
create policy "Users can create own transfer requests"
on public.transfer_requests
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and not exists (
    select 1
    from public.user_profiles profile
    where profile.id = (select auth.uid())
      and profile.is_blocked = true
  )
);
