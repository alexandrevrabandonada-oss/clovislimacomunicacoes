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
      <section id="hero">
        <Hero works={works} />
      </section>
      <div id="works" className="sr-only" aria-hidden="true" />
      <section id="trabalhos" className="mt-16">
        <Gallery />
      </section>
      <div id="services" className="sr-only" aria-hidden="true" />
      <section id="servicos" className="mt-16">
        <Services />
      </section>
      <div id="about" className="sr-only" aria-hidden="true" />
      <section id="sobre" className="mt-16 space-y-16">
        <Timeline />
        <Clients />
      </section>
      <div id="contact" className="sr-only" aria-hidden="true" />
      <section id="contato" className="mt-16">
        <ContactForm />
      </section>
      <Footer />
    </>
  )
}
