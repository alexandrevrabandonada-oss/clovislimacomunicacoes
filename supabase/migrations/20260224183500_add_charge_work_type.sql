do $$
begin
  begin
    alter type public.work_type add value if not exists 'charge';
  exception
    when duplicate_object then
      null;
  end;
end $$;
