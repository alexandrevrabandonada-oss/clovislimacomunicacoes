import React from 'react'
import type { Metadata } from 'next'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import Services from '../components/Services'
import Timeline from '../components/Timeline'
import Clients from '../components/Clients'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import { fetchPublishedWorks } from '../lib/works'

export const metadata: Metadata = {
  alternates: {
    canonical: '/'
  }
}

export default async function Page() {
  const works = await fetchPublishedWorks()

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
