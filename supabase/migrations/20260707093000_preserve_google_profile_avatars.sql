create or replace function public.handle_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (
    id,
    email,
    display_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.user_profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.user_profiles.avatar_url);

  return new;
end;
$$;

update public.user_profiles profile
set avatar_url = coalesce(
  profile.avatar_url,
  auth_user.raw_user_meta_data ->> 'avatar_url',
  auth_user.raw_user_meta_data ->> 'picture',
  identity.identity_data ->> 'avatar_url',
  identity.identity_data ->> 'picture'
)
from auth.users auth_user
left join lateral (
  select identity_data
  from auth.identities
  where user_id = auth_user.id
    and provider = 'google'
  order by created_at desc
  limit 1
) identity on true
where profile.id = auth_user.id
  and profile.avatar_url is null
  and coalesce(
    auth_user.raw_user_meta_data ->> 'avatar_url',
    auth_user.raw_user_meta_data ->> 'picture',
    identity.identity_data ->> 'avatar_url',
    identity.identity_data ->> 'picture'
  ) is not null;
