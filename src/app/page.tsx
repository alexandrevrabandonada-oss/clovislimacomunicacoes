import React from 'react'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import Services from '../components/Services'
import Timeline from '../components/Timeline'
import Clients from '../components/Clients'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

export default function Page() {
  return (
    <>
      <section id="hero"><Hero /></section>
      <section id="works" className="mt-16"><Gallery /></section>
      <section id="services" className="mt-16"><Services /></section>
      <section id="about" className="mt-16"><Timeline /></section>
      <section id="clients" className="mt-16"><Clients /></section>
      <section id="contact" className="mt-16"><ContactForm /></section>
      <Footer />
    </>
  )
}
