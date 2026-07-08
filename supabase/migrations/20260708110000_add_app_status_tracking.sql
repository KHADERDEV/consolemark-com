alter table public.rent_requests
add column if not exists app_status text not null default 'draft';

alter table public.transfer_requests
add column if not exists app_status text;

alter table public.rent_requests
drop constraint if exists rent_requests_app_status_allowed;

alter table public.rent_requests
add constraint rent_requests_app_status_allowed check (
  app_status in (
    'live',
    'draft',
    'in_review',
    'rejected',
    'unpublished',
    'suspended_by_google'
  )
);

alter table public.transfer_requests
drop constraint if exists transfer_requests_app_status_allowed;

alter table public.transfer_requests
add constraint transfer_requests_app_status_allowed check (
  app_status is null or app_status in (
    'transfer_request_approved',
    'transfer_accepted_in_progress',
    'transferred_successfully'
  )
);
