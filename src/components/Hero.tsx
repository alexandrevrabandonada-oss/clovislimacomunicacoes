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

const LOCAL_FLAGSHIP = {
  id: 'local-flagship',
  slug: 'aps-sustentabilidade',
  title: 'APS Sustentabilidade',
  type: 'Sites / PWA',
  cover_url: '/portfolio/aps-real-desktop.png',
  cover_image_url: null,
  content_warning: null
}

export default function Hero({ works }: HeroProps) {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  
  // Find flagship or featured safe work, fallback to local flagship
  const featuredSafeWork = works.find(w => w.slug === 'aps-sustentabilidade') || 
                           works.find(w => w.is_featured === true && !isSensitive(w.content_warning)) ||
                           LOCAL_FLAGSHIP
  
  // Force real asset for APS Flagship
  const isAPS = featuredSafeWork?.slug === 'aps-sustentabilidade'
  const featuredImage = isAPS ? '/portfolio/aps-real-desktop.png' : (featuredSafeWork?.cover_url || featuredSafeWork?.cover_image_url || null)
  
  const titleWords = ['Criação,', 'arte', '&', 'direção', 'estratégica.']

  return (
    <div className="min-h-[50vh] md:min-h-[60vh] grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center strategy-grid py-12 md:py-20">
      <div className="z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">ESTÚDIO DE DESIGN & ESTRATÉGIA</p>
        </div>
        
        <h1
          ref={headingRef}
          className={`hero-kinetic-title text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter text-black ${revealed ? 'is-revealed' : ''}`}
        >
          {titleWords.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`hero-kinetic-word ${word === 'estratégica.' ? 'hero-ink-underline italic font-serif' : ''}`}
                style={{ ['--d' as string]: index }}
              >
                {word}
              </span>
              {index < titleWords.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h1>
        <p className="mt-10 max-w-xl text-xl md:text-2xl text-black font-bold leading-tight italic border-l-[6px] border-black pl-8">
          Atendimento consultivo focado em autoridade digital e narrativa visual técnica.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <a
            href="#trabalhos"
            onClick={() => trackEvent('click_cta_portfolio')}
            className="ink-button inline-block text-center bg-black text-white px-10 py-5 text-[11px] tracking-widest"
          >
            Analisar Repertório →
          </a>
          <a
            href="#servicos"
            onClick={() => trackEvent('click_cta_servicos')}
            className="ink-button inline-block text-center px-10 py-5 text-[11px] tracking-widest"
          >
            Diagnóstico Técnico
          </a>
        </div>
        <div className="mt-8 flex items-center gap-3 opacity-90">
           <div className="h-[3px] w-8 bg-black" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Agendamento via Consultiva Direta</p>
        </div>
      </div>

      {featuredImage ? (
        <div className="relative group perspective-1000">
          {/* Main Proof Container */}
          <div className="relative z-10 ink-card p-0 overflow-hidden bg-white border-[3px] border-black shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] aspect-[16/11] md:aspect-[16/10] group-hover:shadow-[28px_28px_0px_0px_var(--accent)] transition-all duration-500">
            
            {/* High-Fidelity Browser Frame UI */}
            <div className="absolute top-0 inset-x-0 h-10 bg-black flex items-center px-4 justify-between z-20">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="bg-white/10 px-4 py-1 rounded-md flex items-center gap-2 max-w-[200px] sm:max-w-[300px]">
                <div className="w-3 h-3 text-white/40">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M2 12H22"/><path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"/></svg>
                </div>
                <span className="text-[9px] text-white/80 font-black truncate tracking-widest uppercase">esboco.me/projeto/{featuredSafeWork?.slug || 'aps-sustentabilidade'}</span>
              </div>
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-10 flex items-center justify-center p-0 bg-white halftone-bg">
              <div className="relative w-full h-full">
                <Image
                  src={featuredImage}
                  alt={featuredSafeWork?.title || 'Obra em destaque'}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
                />
                
                {/* Mobile Proof - Double Evidence for APS */}
                {isAPS && (
                  <div className="absolute bottom-2 right-2 w-[80px] sm:w-[120px] aspect-[9/19] z-30 transition-all duration-700 delay-300 group-hover:scale-110 group-hover:-translate-y-4">
                    <div className="relative w-full h-full ink-card p-0 overflow-hidden border-2 border-black shadow-2xl bg-white rounded-lg sm:rounded-2xl">
                        {/* Mobile Header */}
                        <div className="absolute top-0 inset-x-0 h-3 bg-black flex items-center justify-center gap-0.5 z-20">
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
                <div className="absolute bottom-4 left-4 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded shadow-xl flex items-center gap-2 border border-black/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    CASE REAL / AUTORIDADE 2026
                </div>
              </div>
            </div>
          </div>

          {/* Floating Strategic Labels - Consolidated */}
          <div className="absolute -top-6 -right-6 z-30 bg-accent text-white border-[3px] border-black px-6 py-3 font-black text-[12px] uppercase tracking-[0.3em] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-3 transition-all hover:rotate-0 hover:scale-105">
             {isAPS ? 'PROVA TÉCNICA · APS SUSTENTABILIDADE' : 'PROVA REAL · AUTORIDADE DIGITAL'}
          </div>
          
          <div className="absolute -bottom-6 -left-6 z-30 bg-white border-[3px] border-black px-5 py-3 text-black font-black text-[10px] uppercase tracking-[0.3em] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-2">
            {isAPS ? 'PWA INSTITUCIONAL / NEXT.JS' : 'ESTÚDIO DE ESTRATÉGIA ⚡ 2026'}
          </div>
        </div>
      ) : null}
    </div>
  )
}
