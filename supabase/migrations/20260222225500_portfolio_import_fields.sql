begin;

alter table public.works
  add column if not exists cover_url text,
  add column if not exists content_warning text,
  add column if not exists source_hash text;

update public.works
set cover_url = cover_image_url
where cover_url is null and cover_image_url is not null;

create index if not exists works_source_hash_idx on public.works (source_hash);

commit;
