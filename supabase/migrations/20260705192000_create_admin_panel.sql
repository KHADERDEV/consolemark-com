create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  password_salt text not null,
  password_algorithm text not null default 'scrypt:N=32768,r=8,p=1,keylen=64',
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_single_email check (lower(email) = 'khader@consolemark.com')
);

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.admin_users(id) on delete cascade,
  token_hash text not null unique,
  user_agent text,
  ip_address inet,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_events (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.admin_users(id) on delete set null,
  event_type text not null,
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.admin_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_users_touch_updated_at on public.admin_users;
create trigger admin_users_touch_updated_at
before update on public.admin_users
for each row
execute function public.admin_touch_updated_at();

create or replace function public.admin_restrict_single_user()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.admin_users) >= 1 then
    raise exception 'Only one admin user is allowed';
  end if;

  return new;
end;
$$;

drop trigger if exists admin_users_restrict_single_user on public.admin_users;
create trigger admin_users_restrict_single_user
before insert on public.admin_users
for each row
when (new.email is not null)
execute function public.admin_restrict_single_user();

alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;
alter table public.admin_audit_events enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.admin_sessions from anon, authenticated;
revoke all on public.admin_audit_events from anon, authenticated;
