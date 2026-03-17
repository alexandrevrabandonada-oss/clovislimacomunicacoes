"use client"
import Image from 'next/image'
import { Fragment } from 'react'
import { trackEvent } from '../lib/analytics'
import { useRevealOnView } from '../lib/useRevealOnView'

type Work = {
  id: string
  slug?: string
  type?: string
  is_featured?: boolean | null
  title: string
  client?: string | null
  cover_url: string | null
  cover_image_url: string | null
  content_warning: string | null
}

type HeroProps = {
  works: Work[]
}

function isSensitive(contentWarning: string | null): boolean {
  if (contentWarning === null || contentWarning === undefined) return false
  const text = String(contentWarning).trim().toLowerCase()
  if (!text) return false
  if (['false', '0', 'no', 'none', 'null'].includes(text)) return false
  return true
}

export default function Hero({ works }: HeroProps) {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  
  // Find flagship or featured safe work
  const featuredSafeWork = works.find(w => w.slug === 'aps-sustentabilidade') || 
                           works.find(w => w.is_featured === true && !isSensitive(w.content_warning))
  
  // Force real asset for APS Flagship
  const isAPS = featuredSafeWork?.slug === 'aps-sustentabilidade'
  const featuredImage = isAPS ? '/portfolio/aps-real-desktop.png' : (featuredSafeWork?.cover_url || featuredSafeWork?.cover_image_url || null)
  
  const titleWords = ['Criação,', 'arte', '&', 'direção', 'estratégica.']

  return (
    <div className="min-h-[60vh] md:min-h-[65vh] grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center strategy-grid py-8 md:py-16">
      <div className="z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Strategy & Design Studio</p>
        </div>
        
        <h1
          ref={headingRef}
          className={`hero-kinetic-title text-5xl md:text-7xl font-black leading-[0.95] tracking-tight text-slate-900 ${revealed ? 'is-revealed' : ''}`}
        >
          {titleWords.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`hero-kinetic-word ${word === 'estratégica.' ? 'hero-ink-underline italic' : ''}`}
                style={{ ['--d' as string]: index }}
              >
                {word}
              </span>
              {index < titleWords.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h1>
        <p className="mt-8 max-w-xl text-lg md:text-xl text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
          Atendimento consultivo focado em autoridade digital e narrativa visual técnica para organizações que buscam impacto real.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="#trabalhos"
            onClick={() => trackEvent('click_cta_portfolio')}
            className="ink-button inline-block text-center bg-black text-white px-8 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-accent transition-all shadow-2xl"
          >
            Analisar Repertório →
          </a>
          <a
            href="#servicos"
            onClick={() => trackEvent('click_cta_servicos')}
            className="ink-button inline-block text-center px-8 py-4 font-black uppercase text-[11px] tracking-widest bg-white border-2 border-slate-100 hover:border-black transition-all"
          >
            Diagnóstico Técnico
          </a>
        </div>
        <div className="mt-6 flex items-center gap-2 opacity-60">
           <div className="h-px w-6 bg-slate-300" />
           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Agendamento via Consultiva Direta</p>
        </div>
      </div>

      <div className="relative group perspective-1000">
        {/* Main Proof Container */}
        <div className="relative z-10 ink-card p-0 overflow-hidden bg-slate-50 border-[3px] border-slate-900 shadow-[20px_20px_0px_0px_rgba(15,23,42,0.05)] aspect-[16/11] md:aspect-[16/10] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500">
          
          {/* High-Fidelity Browser Frame UI */}
          <div className="absolute top-0 inset-x-0 h-10 bg-slate-900 flex items-center px-4 justify-between z-20">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="bg-white/10 px-4 py-1 rounded-md flex items-center gap-2 max-w-[200px] sm:max-w-[300px]">
              <div className="w-3 h-3 text-white/40">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M2 12H22"/><path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"/></svg>
              </div>
              <span className="text-[9px] text-white/60 font-medium truncate tracking-tight">esboco.me/projeto/{featuredSafeWork?.slug || 'estudio'}</span>
            </div>
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 top-10 flex items-center justify-center p-0 bg-white halftone-bg">
            <div className="relative w-full h-full">
              {featuredImage && (
                <Image
                  src={featuredImage}
                  alt={featuredSafeWork?.title || 'Obra em destaque'}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                />
              )}
              
              {/* Mobile Proof - Double Evidence for APS */}
              {isAPS && (
                <div className="absolute bottom-2 right-2 w-[80px] sm:w-[120px] aspect-[9/19] z-30 transition-all duration-700 delay-300 group-hover:scale-110 group-hover:-translate-y-4">
                  <div className="relative w-full h-full ink-card p-0 overflow-hidden border-2 border-slate-900 shadow-2xl bg-white rounded-lg sm:rounded-2xl">
                      {/* Mobile Header */}
                      <div className="absolute top-0 inset-x-0 h-3 bg-slate-900 flex items-center justify-center gap-0.5 z-20">
                        <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                      </div>
                      <div className="absolute inset-0 pt-3">
                      <Image
                          src="/portfolio/aps-real-mobile.png"
                          alt="Mobile view"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                  </div>
                </div>
              )}
              
              {/* Deployed State Overlay */}
              <div className="absolute bottom-4 left-4 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-xl flex items-center gap-2 border border-black/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  PROJETO ATIVO / PROVA REAL PWA
              </div>
            </div>
          </div>
        </div>

        {/* Floating Strategic Labels */}
        <div className="absolute -top-6 -right-6 z-30 bg-accent text-white border-2 border-black px-5 py-2 font-black text-[11px] uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-3 transition-all hover:rotate-0 hover:scale-105">
           {isAPS ? 'APS Sustentabilidade • PWA INSTITUCIONAL' : 'CASE REAL • AUTORIDADE DIGITAL'}
        </div>
        
        <div className="absolute -bottom-6 -left-6 z-30 bg-white border-2 border-black px-4 py-2 text-slate-900 font-bold text-[10px] uppercase tracking-[0.25em] shadow-xl rotate-2">
          ESTÚDIO DE ESTRATÉGIA ⚡ 2026
        </div>

        {/* Technical Callouts */}
        <div className="hidden xl:block absolute -right-24 top-1/2 -translate-y-1/2 space-y-4 pointer-events-none opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <div className="bg-black/90 text-white p-3 border-l-4 border-emerald-500 rounded-r-lg shadow-2xl">
            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Performance / Métricas</p>
            <p className="text-[10px] font-bold">LCP: 0.8s (Otimização Real)</p>
          </div>
          <div className="bg-black/90 text-white p-3 border-l-4 border-accent rounded-r-lg shadow-2xl">
             <p className="text-[8px] font-black uppercase tracking-widest text-accent">Tech / Arquitetura</p>
             <p className="text-[10px] font-bold">Next.js + PWA / Soberania Digital</p>
          </div>
        </div>
      </div>
    </div>
  )
}
