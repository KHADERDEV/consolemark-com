alter table public.user_profiles
  add column if not exists draft_access_email text;

alter table public.user_profiles
  drop constraint if exists user_profiles_draft_access_email_format;

alter table public.user_profiles
  add constraint user_profiles_draft_access_email_format
  check (
    draft_access_email is null
    or draft_access_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  );
