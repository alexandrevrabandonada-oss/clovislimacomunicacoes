import React from 'react'
import type { Metadata } from 'next'
import Hero from '../components/Hero'
import ProofStrip from '../components/ProofStrip'
import Gallery from '../components/Gallery'
import Services from '../components/Services'
import PrintsTeaser from '../components/PrintsTeaser'
import FAQ from '../components/FAQ'
import Timeline from '../components/Timeline'
import Clients from '../components/Clients'
import QuickQuote from '../components/QuickQuote'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import SectionRail from '../components/SectionRail'
import MobileCTABar from '../components/MobileCTABar'
import { fetchPublishedWorks } from '../lib/works'

export const metadata: Metadata = {
  alternates: {
    canonical: '/'
  }
}

export default async function Page() {
  const works = await fetchPublishedWorks()

  return (
    <div className="pb-20 md:pb-0">
      <SectionRail />
      <MobileCTABar />
      <section id="hero">
        <Hero works={works} />
      </section>
      <ProofStrip />
      <div id="works" className="sr-only" aria-hidden="true" />
      <section id="trabalhos" className="mt-16">
        <Gallery />
      </section>
      <section id="prints-licenciamento" className="mt-16">
        <PrintsTeaser />
      </section>
      <div id="services" className="sr-only" aria-hidden="true" />
      <section id="servicos" className="mt-16">
        <Services />
      </section>
      <section id="faq" className="mt-16">
        <FAQ />
      </section>
      <div id="about" className="sr-only" aria-hidden="true" />
      <section id="sobre" className="mt-16 space-y-16">
        <Timeline />
        <Clients />
      </section>
      <div id="contact" className="sr-only" aria-hidden="true" />
      <section id="contato" className="mt-16 space-y-4">
        <QuickQuote />
        <ContactForm />
      </section>
      <Footer />
    </div>
  )
}
