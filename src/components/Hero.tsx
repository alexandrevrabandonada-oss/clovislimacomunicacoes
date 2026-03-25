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
  type: 'Sistema Digital / PWA',
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-center strategy-grid py-8 md:py-20">
      {/* Text stack — always first on mobile */}
      <div className="z-10">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-black">ESTÚDIO DE DESIGN & ESTRATÉGIA</p>
        </div>
        
        <h1
          ref={headingRef}
          className={`hero-kinetic-title text-4xl sm:text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter text-black ${revealed ? 'is-revealed' : ''}`}
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

        <p className="mt-6 md:mt-10 max-w-xl text-base md:text-2xl text-black font-bold leading-tight italic border-l-[4px] md:border-l-[6px] border-black pl-5 md:pl-8">
          Atendimento consultivo focado em autoridade digital e narrativa visual técnica.
        </p>
        
        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-5">
          <a
            href="#trabalhos"
            onClick={() => trackEvent('click_cta_portfolio')}
            className="ink-button inline-block text-center w-full sm:w-auto bg-black text-white px-6 md:px-10 py-4 md:py-5 text-[11px] tracking-widest"
          >
            Analisar Repertório →
          </a>
          <a
            href="#servicos"
            onClick={() => trackEvent('click_cta_servicos')}
            className="ink-button inline-block text-center w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 text-[11px] tracking-widest"
          >
            Diagnóstico Técnico
          </a>
        </div>

        <div className="mt-6 md:mt-8 flex items-center gap-3 opacity-90">
           <div className="h-[3px] w-8 bg-black" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Agendamento via Consultiva Direta</p>
        </div>
      </div>

      {/* Proof visual — second on mobile, right column on desktop */}
      {featuredImage ? (
        <div className="relative group perspective-1000 mt-2 md:mt-0">
          {/* Main Proof Container */}
          <div className="relative z-10 ink-card p-0 overflow-hidden bg-white border-[3px] border-black aspect-[16/11] md:aspect-[16/10] group-hover:shadow-[24px_24px_0px_0px_var(--accent)] transition-all duration-500">
            
            {/* High-Fidelity Browser Frame UI */}
            <div className="absolute top-0 inset-x-0 h-8 md:h-10 bg-black flex items-center px-3 md:px-4 justify-between z-20">
              <div className="flex gap-1.5 md:gap-2">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-500" />
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="bg-white/10 px-3 py-0.5 rounded-md flex items-center gap-2 max-w-[160px] sm:max-w-[240px] md:max-w-[300px]">
                <div className="w-3 h-3 text-white/40">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M2 12H22"/><path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"/></svg>
                </div>
                <span className="text-[8px] md:text-[9px] text-white/80 font-black truncate tracking-widest uppercase">esboco.me/projeto/{featuredSafeWork?.slug || 'aps-sustentabilidade'}</span>
              </div>
              <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-8 md:top-10 flex items-center justify-center p-0 bg-white halftone-bg">
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
                  <div className="absolute bottom-2 right-2 w-[64px] sm:w-[100px] md:w-[120px] aspect-[9/19] z-30 transition-all duration-700 delay-300 group-hover:scale-110 group-hover:-translate-y-4">
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
                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-emerald-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-2 md:px-3 py-1 md:py-1.5 rounded shadow-xl flex items-center gap-1.5 md:gap-2 border border-black/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    CASE REAL / AUTORIDADE 2026
                </div>
              </div>
            </div>
          </div>

          {/* Floating Strategic Labels — inside bounds on mobile, offset on desktop */}
          <div className="absolute top-2 right-2 md:-top-6 md:-right-6 z-30 bg-accent text-white border-[3px] border-black px-3 md:px-6 py-1.5 md:py-3 font-black text-[10px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-3 transition-all hover:rotate-0 hover:scale-105">
             {isAPS ? 'PROVA TÉCNICA · APS' : 'PROVA REAL · AUTORIDADE'}
          </div>
          
          <div className="absolute bottom-2 left-2 md:-bottom-6 md:-left-6 z-30 bg-white border-[3px] border-black px-3 md:px-5 py-1.5 md:py-3 text-black font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-2">
            {isAPS ? 'PWA / NEXT.JS' : 'ESTÚDIO 2026'}
          </div>
        </div>
      ) : null}
    </div>
  )
}
