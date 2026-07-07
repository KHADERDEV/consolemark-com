alter table public.rent_consoles
add column if not exists console_type text not null default 'personal';

alter table public.rent_consoles
drop constraint if exists rent_consoles_console_type_allowed;

alter table public.rent_consoles
add constraint rent_consoles_console_type_allowed
check (console_type in ('personal', 'organization'));
