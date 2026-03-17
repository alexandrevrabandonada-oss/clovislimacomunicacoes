"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'
import { useRevealOnView } from '../lib/useRevealOnView'

export default function DigitalShowcase() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

  return (
    <div className="w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-4 w-1 bg-accent rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Frente Digital & Tecnologia</p>
          </div>
          <h2 ref={headingRef} className={`text-4xl md:text-5xl font-black tracking-tight leading-none ${revealed ? 'is-revealed' : ''}`}>
             Engenharia de <br/> <span className="hero-ink-underline italic">Presença & PWAs</span>
          </h2>
        </div>
        <p className="max-w-md text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-6">
          Desenvolvimento de interfaces de alta performance que conectam estratégia de informação a resultados técnicos mensuráveis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Main Flagship Card */}
        <div className="lg:col-span-8 group relative perspective-1000">
          <div className="ink-card p-0 overflow-hidden bg-white border-[3px] border-black shadow-[32px_32px_0px_0px_rgba(0,0,0,0.03)] h-full flex flex-col md:flex-row">
            <div className="md:w-3/5 relative aspect-video md:aspect-auto min-h-[300px] overflow-hidden bg-slate-100">
               {/* Browser UI Inset */}
               <div className="absolute top-0 inset-x-0 h-8 bg-slate-900 flex items-center px-4 gap-2 z-20">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/40" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="bg-white/10 px-3 py-0.5 rounded text-[8px] text-white/40 font-mono">apsustentabilidade.org</div>
               </div>
               <Image 
                src="/portfolio/aps-real-desktop.png"
                alt="APS Sustentabilidade Flagship"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <Link 
                    href="/cases/aps-sustentabilidade"
                    onClick={() => trackEvent('click_digital_showcase_flagship_image')}
                    className="bg-white text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-accent hover:text-white transition-all"
                  >
                    Analisar Case Completo →
                  </Link>
               </div>
            </div>
            
            <div className="md:w-2/5 p-8 flex flex-col justify-between bg-white border-l-[3px] border-black md:border-l-[3px]">
              <div>
                <div className="inline-block bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded mb-6 italic">
                  FLAGSHIP REAL PROOF
                </div>
                <h3 className="text-2xl font-black mb-4">APS <br/> SUSTENTABILIDADE</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 italic">
                  Refatoração da presença digital institucional focada em soberania de dados, performance PWA e acessibilidade técnica.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Soberania de Dados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Performance Core Web Vitals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Interface PWA / Mobile First</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/cases/aps-sustentabilidade"
                className="mt-10 block text-center bg-black text-white px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-accent transition-all"
                onClick={() => trackEvent('click_digital_showcase_flagship_cta')}
              >
                Ver Relatório de Impacto
              </Link>
            </div>
          </div>
        </div>

        {/* Placeholder for Next Projects / Authority Block */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="ink-card bg-slate-900 text-white p-8 flex-grow border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)]">
            <h3 className="text-xl font-black mb-4 italic">“Design como <br/> Infraestrutura”</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-8">
              Na ESBOÇO, não fazemos apenas sites. Construímos ativos digitais que garantem a autoridade técnica da sua pauta.
            </p>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
               <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Stack de Autoridade:</p>
               <p className="text-[10px] font-bold text-slate-300">Next.js / Supabase / PWA / Edge Config / Meta-SEO</p>
            </div>
            <Link 
                href="#contato"
                className="inline-block mt-4 text-[10px] font-black uppercase tracking-widest border-b-2 border-accent pb-1 hover:text-accent transition-all"
                onClick={() => trackEvent('click_digital_showcase_philosophy')}
              >
                Agendar Diagnóstico Técnico →
              </Link>
          </div>
          
          <div className="ink-card bg-white p-8 border-[3px] border-black border-dashed opacity-50 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Próximos Projetos <br/> em Triagem</p>
          </div>
        </div>
      </div>
    </div>
  )
}
