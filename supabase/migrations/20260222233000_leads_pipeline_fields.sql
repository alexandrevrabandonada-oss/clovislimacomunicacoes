begin;

alter table public.leads
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists referrer text,
  add column if not exists page_url text,
  add column if not exists user_agent text,
  add column if not exists status text not null default 'new',
  add column if not exists notes text;

update public.leads
set status = 'new'
where status is null;

do $$
declare
  policy_name text;
begin
  for policy_name in
    select p.policyname
    from pg_policies p
    where p.schemaname = 'public'
      and p.tablename = 'leads'
      and p.cmd = 'INSERT'
  loop
    execute format('drop policy if exists %I on public.leads', policy_name);
  end loop;
end $$;

revoke insert on table public.leads from anon, authenticated;
grant insert on table public.leads to service_role;

commit;
