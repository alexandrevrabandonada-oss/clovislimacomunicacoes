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
  const featuredSafeWork = works.find((work) => work.is_featured === true && !isSensitive(work.content_warning))
  const featuredImage = featuredSafeWork?.cover_url || featuredSafeWork?.cover_image_url || null
  const titleWords = ['Criação,', 'arte', '&', 'direção', 'estratégica.']

  return (
    <div className="min-h-[56vh] md:min-h-[58vh] grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
      <div>
        <p className="stamp">Estratégia & Design</p>
        <h1
          ref={headingRef}
          className={`hero-kinetic-title mt-3 text-4xl md:text-6xl font-extrabold leading-tight ${revealed ? 'is-revealed' : ''}`}
        >
          {titleWords.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span
                className={`hero-kinetic-word ${word === 'estratégica.' ? 'hero-ink-underline' : ''}`}
                style={{ ['--d' as string]: index }}
              >
                {word}
              </span>
              {index < titleWords.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h1>
        <p className="mt-3 max-w-2xl text-base md:text-lg">
          Atendimento consultivo em direção de arte, branding e soluções digitais sob medida com foco em autoridade e impacto.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="#trabalhos"
            onClick={() => trackEvent('click_cta_portfolio')}
            className="ink-button inline-block w-full sm:w-auto text-center bg-accent text-white px-5 py-2.5 font-semibold"
          >
            Explorar Repertório
          </a>
          <a
            href="#servicos"
            onClick={() => trackEvent('click_cta_servicos')}
            className="ink-button inline-block w-full sm:w-auto text-center px-5 py-2.5 font-semibold bg-white"
          >
            Agendar Diagnóstico
          </a>
        </div>
        <p className="mt-2 text-xs text-slate-500 font-medium italic opacity-80">Resposta estratégica por e-mail ou WhatsApp em ate 24h uteis.</p>
      </div>
      <div className="relative h-[280px] sm:h-[320px] md:h-[380px] group">
        {/* Background 'Studio' Layer - Technical Markers */}
        <div className="absolute inset-0 rounded-[22px] border-2 border-black bg-slate-100 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none">
          <div className="absolute inset-0 halftone-bg opacity-10" />
          {/* Design Guides / Crop Marks */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-black/20" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-black/20" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-black/20" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-black/20" />
          <div className="absolute top-1/2 left-0 w-3 h-px bg-black/20" />
          <div className="absolute top-1/2 right-0 w-3 h-px bg-black/20" />
        </div>

        {/* Main Work Content Layer */}
        <div className="absolute inset-4 sm:inset-6 bg-white border border-black/10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-4 sm:p-8">
          {featuredImage ? (
            <>
              <Image
                src={featuredImage}
                alt={featuredSafeWork?.title || 'Obra em destaque'}
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                className="object-contain p-2 sm:p-4 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Contextual Label */}
              <div className="absolute top-4 right-4 bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rotate-1 group-hover:rotate-0 transition-transform">
                Preview / {featuredSafeWork?.type || 'Work'}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 opacity-30 grayscale transition-all group-hover:opacity-100 group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-24 h-24" role="img">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 50 L 80 50 M 50 20 L 50 80" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="4" fill="currentColor" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Direção Crítica</span>
            </div>
          )}
        </div>

        {/* Brand Overlay Layers - Studio Stamps */}
        <div className="absolute -top-3 -right-3 bg-accent text-white border-2 border-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg -rotate-3 transition-transform group-hover:rotate-0 group-hover:scale-110">
          ESBOÇO ESTÚDIO
        </div>
        
        <div className="absolute -bottom-2 -left-2 bg-white border-2 border-black px-3 py-1 text-black font-black text-[9px] uppercase tracking-widest shadow-md rotate-2 group-hover:rotate-0 transition-transform">
          Direção / Arte ⚡
        </div>

        {/* Captions / Details */}
        {featuredSafeWork && (
          <div className="absolute bottom-6 right-8 left-8 text-center sm:text-left pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
             <p className="text-[9px] font-black uppercase tracking-widest bg-white/90 inline-block px-2 py-1 border border-black/10">
               {featuredSafeWork.title} — {featuredSafeWork.client || 'Acervo'}
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
