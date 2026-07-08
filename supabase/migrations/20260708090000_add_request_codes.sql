create or replace function public.generate_request_code(request_prefix text)
returns text
language plpgsql
as $$
declare
  digits text;
begin
  digits := lpad(floor(random() * 1000000)::int::text, 6, '0');
  return request_prefix || '-' || digits;
end;
$$;

create or replace function public.set_rent_request_code()
returns trigger
language plpgsql
as $$
begin
  if new.request_code is null or new.request_code = '' then
    loop
      new.request_code := public.generate_request_code('RR');
      exit when not exists (
        select 1 from public.rent_requests
        where request_code = new.request_code
      );
    end loop;
  end if;

  return new;
end;
$$;

create or replace function public.set_transfer_request_code()
returns trigger
language plpgsql
as $$
begin
  if new.request_code is null or new.request_code = '' then
    loop
      new.request_code := public.generate_request_code('TR');
      exit when not exists (
        select 1 from public.transfer_requests
        where request_code = new.request_code
      );
    end loop;
  end if;

  return new;
end;
$$;

alter table public.rent_requests
add column if not exists request_code text;

alter table public.transfer_requests
add column if not exists request_code text;

with numbered as (
  select
    id,
    'RR-' || lpad(row_number() over (order by created_at, id)::text, 6, '0') as code
  from public.rent_requests
  where request_code is null
)
update public.rent_requests rent_request
set request_code = numbered.code
from numbered
where rent_request.id = numbered.id;

with numbered as (
  select
    id,
    'TR-' || lpad(row_number() over (order by created_at, id)::text, 6, '0') as code
  from public.transfer_requests
  where request_code is null
)
update public.transfer_requests transfer_request
set request_code = numbered.code
from numbered
where transfer_request.id = numbered.id;

alter table public.rent_requests
alter column request_code set not null;

alter table public.transfer_requests
alter column request_code set not null;

create unique index if not exists rent_requests_request_code_unique
on public.rent_requests (request_code);

create unique index if not exists transfer_requests_request_code_unique
on public.transfer_requests (request_code);

drop trigger if exists rent_requests_set_request_code on public.rent_requests;
create trigger rent_requests_set_request_code
before insert on public.rent_requests
for each row
execute function public.set_rent_request_code();

drop trigger if exists transfer_requests_set_request_code on public.transfer_requests;
create trigger transfer_requests_set_request_code
before insert on public.transfer_requests
for each row
execute function public.set_transfer_request_code();
