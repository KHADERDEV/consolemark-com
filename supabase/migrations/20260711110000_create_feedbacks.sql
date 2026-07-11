create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text,
  email text,
  feedback_type text not null default 'general',
  page_url text,
  message text not null,
  user_agent text,
  status text not null default 'new',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feedbacks_type_allowed check (
    feedback_type in ('general', 'bug', 'idea', 'marketplace', 'payment', 'account', 'other')
  ),
  constraint feedbacks_status_allowed check (
    status in ('new', 'reviewed', 'archived')
  ),
  constraint feedbacks_message_length check (
    length(btrim(message)) between 10 and 5000
  ),
  constraint feedbacks_email_format check (
    email is null
    or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
);

drop trigger if exists feedbacks_touch_updated_at on public.feedbacks;
create trigger feedbacks_touch_updated_at
before update on public.feedbacks
for each row
execute function public.admin_touch_updated_at();

create index if not exists feedbacks_created_at_idx
on public.feedbacks (created_at desc);

create index if not exists feedbacks_status_created_at_idx
on public.feedbacks (status, created_at desc);

alter table public.feedbacks enable row level security;

revoke all on public.feedbacks from anon, authenticated;
