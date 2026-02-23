begin;

drop policy if exists "authenticated insert works" on public.works;
create policy "authenticated insert works"
  on public.works
  for insert
  to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated update works" on public.works;
create policy "authenticated update works"
  on public.works
  for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated delete works" on public.works;
create policy "authenticated delete works"
  on public.works
  for delete
  to authenticated
  using (auth.role() = 'authenticated');

commit;
