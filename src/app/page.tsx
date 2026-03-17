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
import MicroCases from '../components/MicroCases'
import QuickQuote from '../components/QuickQuote'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import SectionRail from '../components/SectionRail'
import MobileCTABar from '../components/MobileCTABar'
import { fetchPublishedWorks } from '../lib/works'

const siteUrl = 'https://esboco.design' // URL sugerida para a nova marca
const defaultTitle = 'ESBOÇO criação & arte | Humor que comunica. Design que converte.'
const defaultDescription = 'Charges, ilustração editorial, design e desenvolvimento de sites/PWA. Branding, estratégia e arte autoral.'

export const metadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'ESBOÇO criação & arte' }]
  }
}

import SectionShell from '../components/SectionShell'

export default async function Page() {
  const works = await fetchPublishedWorks()

  return (
    <div className="pb-20 md:pb-0 isolate">
      <SectionRail />
      <MobileCTABar />
      
      {/* 1. Hero */}
      <section id="hero">
        <Hero works={works} />
      </section>

      {/* 2. Proof Strip */}
      <SectionShell noPadding className="mt-8 md:mt-12">
        <ProofStrip />
      </SectionShell>

      {/* 3. Trabalhos / Galeria */}
      <SectionShell id="trabalhos">
        <Gallery />
      </SectionShell>

      {/* 4. Prints & Licenciamento */}
      <SectionShell id="prints-licenciamento">
        <PrintsTeaser />
      </SectionShell>

      {/* 5. Serviços */}
      <SectionShell id="servicos">
        <Services />
      </SectionShell>

      {/* 6. FAQ */}
      <SectionShell id="faq">
        <FAQ />
      </SectionShell>

      {/* 7. Sobre / Timeline */}
      <SectionShell id="sobre">
        <Timeline />
      </SectionShell>

      {/* 8. Clientes */}
      <SectionShell id="clientes">
        <Clients />
      </SectionShell>

      {/* 9. Cases */}
      <SectionShell id="resultados">
        <MicroCases />
      </SectionShell>

      {/* 10. Orçamento Rápido & 11. Contato */}
      <SectionShell id="contato" className="">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-start">
          <div className="space-y-6">
            <QuickQuote />
            <div className="hidden lg:block p-6 bg-accent/5 rounded-[2rem] border border-accent/10">
              <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                &quot;Cada projeto na ESBOÇO começa com uma análise técnica da pauta. Nosso foco é garantir que o design sirva à estratégia de informação.&quot;
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </SectionShell>

      <Footer />
    </div>
  )
}
