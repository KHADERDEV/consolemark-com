alter table public.user_profiles
add column if not exists is_trusted boolean not null default false,
add column if not exists is_blocked boolean not null default false;

create index if not exists user_profiles_is_trusted_idx
on public.user_profiles (is_trusted)
where is_trusted = true;

create index if not exists user_profiles_is_blocked_idx
on public.user_profiles (is_blocked)
where is_blocked = true;
