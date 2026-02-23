import React from 'react'
import { createClient } from '@supabase/supabase-js'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import Services from '../components/Services'
import Timeline from '../components/Timeline'
import Clients from '../components/Clients'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

type Work = {
  id: string
  title: string
  slug: string
  type: string
  is_featured?: boolean | null
  cover_url: string | null
  cover_image_url: string | null
  content_warning: string | null
}

async function fetchWorks(): Promise<Work[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !anon) return []
  const supabase = createClient(url, anon)
  const featuredQuery = await supabase
    .from('works')
    .select('id,title,slug,type,is_featured,cover_url,cover_image_url,content_warning')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (!featuredQuery.error && featuredQuery.data) {
    return featuredQuery.data as Work[]
  }

  const fallbackQuery = await supabase
    .from('works')
    .select('id,title,slug,type,cover_url,cover_image_url,content_warning')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (fallbackQuery.error || !fallbackQuery.data) return []
  return fallbackQuery.data as Work[]
}

export default async function Page() {
  const works = await fetchWorks()

  return (
    <>
      <section id="hero"><Hero works={works} /></section>
      <section id="works" className="mt-16"><Gallery works={works} /></section>
      <section id="services" className="mt-16"><Services /></section>
      <section id="about" className="mt-16"><Timeline /></section>
      <section id="clients" className="mt-16"><Clients /></section>
      <section id="contact" className="mt-16"><ContactForm /></section>
      <Footer />
    </>
  )
}
