alter table public.rent_requests
drop constraint if exists rent_requests_gmail_only;

alter table public.rent_requests
drop constraint if exists rent_requests_email_valid;

alter table public.rent_requests
add constraint rent_requests_email_valid check (
  gmail ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
);
