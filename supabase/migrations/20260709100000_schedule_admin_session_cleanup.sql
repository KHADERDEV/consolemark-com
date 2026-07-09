create extension if not exists pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

do $$
begin
  if exists (
    select 1
    from cron.job
    where jobname = 'cleanup-admin-sessions-48h'
  ) then
    perform cron.unschedule('cleanup-admin-sessions-48h');
  end if;
end;
$$;

select cron.schedule(
  'cleanup-admin-sessions-48h',
  '0 3 */2 * *',
  $$
    delete from public.admin_sessions
    where expires_at < now()
      or revoked_at is not null;
  $$
);
