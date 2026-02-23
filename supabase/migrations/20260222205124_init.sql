begin;

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'work_type'
      and n.nspname = 'public'
  ) then
    create type public.work_type as enum ('branding', 'social_media', 'website', 'video', 'other');
  end if;
end $$;

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  project_url text,
  type public.work_type not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_label text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_company text,
  quote text not null,
  avatar_url text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.works enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;

drop policy if exists "public can read works" on public.works;
create policy "public can read works"
  on public.works
  for select
  to public
  using (true);

drop policy if exists "public can read services" on public.services;
create policy "public can read services"
  on public.services
  for select
  to public
  using (true);

drop policy if exists "public can read testimonials" on public.testimonials;
create policy "public can read testimonials"
  on public.testimonials
  for select
  to public
  using (true);

do $$
begin
  begin
    insert into storage.buckets (id, name, public)
    values ('portfolio', 'portfolio', true)
    on conflict (id) do update set public = excluded.public;
  exception
    when undefined_table then
      raise notice 'storage.buckets not available; skipping storage bucket setup.';
      return;
  end;

  begin
    alter table storage.objects enable row level security;
  exception
    when insufficient_privilege then
      raise notice 'No privilege to alter storage.objects; continuing.';
  end;

  begin
    drop policy if exists "public read portfolio objects" on storage.objects;
    create policy "public read portfolio objects"
      on storage.objects
      for select
      to public
      using (bucket_id = 'portfolio');

    drop policy if exists "authenticated insert portfolio objects" on storage.objects;
    create policy "authenticated insert portfolio objects"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'portfolio'
        and auth.role() = 'authenticated'
      );

    drop policy if exists "authenticated update portfolio objects" on storage.objects;
    create policy "authenticated update portfolio objects"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'portfolio'
        and auth.role() = 'authenticated'
      )
      with check (
        bucket_id = 'portfolio'
        and auth.role() = 'authenticated'
      );

    drop policy if exists "authenticated delete portfolio objects" on storage.objects;
    create policy "authenticated delete portfolio objects"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'portfolio'
        and auth.role() = 'authenticated'
      );
  exception
    when insufficient_privilege then
      raise notice 'No privilege to manage storage.objects policies; continuing.';
  end;
end $$;

commit;