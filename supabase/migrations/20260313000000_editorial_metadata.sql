-- Migration: Add editorial metadata to works table
BEGIN;

ALTER TABLE public.works
  ADD COLUMN IF NOT EXISTS subtitle text,
  ADD COLUMN IF NOT EXISTS client text,
  ADD COLUMN IF NOT EXISTS vehicle text,
  ADD COLUMN IF NOT EXISTS available_for_print boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS available_for_license boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- The 'tags' and 'year' columns might already exist in some form or were planned in WorkRecord type.
-- We ensure they exist here with consistent naming and types.
ALTER TABLE public.works
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS year integer;

COMMIT;
