begin;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_status_check'
      and conrelid = 'public.leads'::regclass
  ) then
    alter table public.leads
      add constraint leads_status_check
      check (status in ('new', 'contacted', 'closed', 'spam')) not valid;
  end if;
end $$;

alter table public.leads validate constraint leads_status_check;

do $$
declare
  policy_name text;
begin
  for policy_name in
    select p.policyname
    from pg_policies p
    where p.schemaname = 'public'
      and p.tablename = 'leads'
      and p.cmd in ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
  loop
    execute format('drop policy if exists %I on public.leads', policy_name);
  end loop;
end $$;

revoke select, insert, update, delete on table public.leads from anon, authenticated;
grant select, insert, update, delete on table public.leads to service_role;

commit;
