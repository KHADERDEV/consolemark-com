create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_type text not null,
  request_code text not null,
  payment_type text not null,
  due_date date not null,
  status text not null default 'unpaid',
  amount numeric(10, 2),
  note text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_request_type_allowed check (
    request_type in ('rent', 'transfer')
  ),
  constraint payments_payment_type_allowed check (
    payment_type in ('live', 'weekly', 'transfer')
  ),
  constraint payments_status_allowed check (
    status in ('paid', 'unpaid')
  )
);

drop trigger if exists payments_touch_updated_at on public.payments;
create trigger payments_touch_updated_at
before update on public.payments
for each row
execute function public.admin_touch_updated_at();

create index if not exists payments_user_request_idx
on public.payments (user_id, request_code, due_date desc);

create index if not exists payments_admin_filter_idx
on public.payments (request_type, payment_type, status, due_date desc);

alter table public.payments enable row level security;

drop policy if exists "Users can read own payments" on public.payments;
create policy "Users can read own payments"
on public.payments
for select
to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.payments from anon;
