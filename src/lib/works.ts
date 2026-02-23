import { createClient } from '@supabase/supabase-js'

export type WorkRecord = {
  id: string
  title: string
  slug: string
  type: string
  description: string | null
  is_featured?: boolean | null
  cover_url: string | null
  cover_image_url: string | null
  content_warning: string | null
  created_at: string | null
  updated_at?: string | null
  year?: number | null
  tags?: string[] | null
}

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !anon) return null
  return createClient(url, anon)
}

export async function fetchPublishedWorks(): Promise<WorkRecord[]> {
  const supabase = getPublicClient()
  if (!supabase) return []

  const extended = await supabase
    .from('works')
    .select('id,title,slug,type,description,created_at,updated_at,is_featured,cover_url,cover_image_url,content_warning,year,tags')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (!extended.error && extended.data) return extended.data as WorkRecord[]

  const fallback = await supabase
    .from('works')
    .select('id,title,slug,type,description,created_at,updated_at,cover_url,cover_image_url,content_warning')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (fallback.error || !fallback.data) return []
  return fallback.data as WorkRecord[]
}

export async function fetchPublishedWorkBySlug(slug: string): Promise<WorkRecord | null> {
  const supabase = getPublicClient()
  if (!supabase) return null

  const extended = await supabase
    .from('works')
    .select('id,title,slug,type,description,created_at,updated_at,cover_url,cover_image_url,content_warning,year,tags')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (!extended.error) return (extended.data as WorkRecord | null) || null

  const fallback = await supabase
    .from('works')
    .select('id,title,slug,type,description,created_at,updated_at,cover_image_url,content_warning')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (fallback.error) return null
  return (fallback.data as WorkRecord | null) || null
}
