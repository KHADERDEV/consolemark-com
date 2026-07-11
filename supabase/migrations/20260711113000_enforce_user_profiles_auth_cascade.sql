delete from public.user_profiles profile
where not exists (
  select 1
  from auth.users auth_user
  where auth_user.id = profile.id
);

alter table public.user_profiles
  drop constraint if exists user_profiles_id_fkey;

alter table public.user_profiles
  add constraint user_profiles_id_fkey
  foreign key (id)
  references auth.users(id)
  on delete cascade;
