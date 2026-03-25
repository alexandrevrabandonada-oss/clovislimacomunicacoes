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
import DigitalShowcase from '../components/DigitalShowcase'

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
      <SectionShell noPadding className="mt-6 md:mt-8">
        <ProofStrip />
      </SectionShell>

      {/* 3. Repertório Editorial / Galeria */}
      <SectionShell id="trabalhos">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-1 bg-accent rounded-full" />
          <h2 className="text-3xl font-extrabold tracking-tight italic">Repertório Autoral & Editorial</h2>
        </div>
        <Gallery />
      </SectionShell>

      {/* 4. Soluções Digitais & Tecnologia */}
      <SectionShell id="digital" className="bg-slate-50/50 -mt-8 md:-mt-12">
        <DigitalShowcase />
      </SectionShell>

      {/* 5. Prints & Licenciamento Strategic */}
      <SectionShell id="prints-licenciamento" className="py-10 md:py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-1 bg-accent rounded-full" />
          <h2 className="text-2xl font-black tracking-tight italic uppercase">Prints & Licenciamento</h2>
        </div>
        <PrintsTeaser />
      </SectionShell>

      {/* 6. Soluções & Atendimento */}
      <SectionShell id="servicos" className="pb-10 md:pb-12">
        <Services />
      </SectionShell>

      {/* 7. FAQ Técnico */}
      <SectionShell id="faq" className="bg-slate-50/30 py-10 md:py-12">
        <FAQ />
      </SectionShell>

      {/* 8. Trajetória / Cronos */}
      <SectionShell id="sobre" className="py-10 md:py-12">
        <Timeline />
      </SectionShell>

      {/* 9. Clientes & Parceiros */}
      <SectionShell id="clientes" className="bg-white py-6 md:py-8 border-t border-slate-100">
        <Clients />
      </SectionShell>

      {/* 10. Indicadores de Resultados */}
      <SectionShell id="resultados" className="py-10 md:py-14 bg-slate-50/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-4 w-1 bg-emerald-500 rounded-full" />
          <h2 className="text-2xl font-black tracking-tight italic uppercase">Relatórios de Impacto</h2>
        </div>
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
