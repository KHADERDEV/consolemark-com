do $$
begin
  if exists (
    select 1
    from cron.job
    where jobname = 'cleanup-admin-audit-events-48h'
  ) then
    perform cron.unschedule('cleanup-admin-audit-events-48h');
  end if;
end;
$$;

select cron.schedule(
  'cleanup-admin-audit-events-48h',
  '15 3 */2 * *',
  $$
    delete from public.admin_audit_events
    where created_at < now() - interval '90 days';
  $$
);
