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
      <div className="relative h-[280px] sm:h-[320px] md:h-[360px] rounded-[22px] overflow-hidden border-2 border-black bg-slate-50">
        {featuredImage ? (
          <>
            <Image
              src={featuredImage}
              alt={featuredSafeWork?.title || 'Obra em destaque'}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4 transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/80 text-white px-3 py-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
              <span className="opacity-50">Destaque:</span> {featuredSafeWork?.title}
            </div>
          </>
        ) : (
          <div className="h-full w-full halftone-bg flex items-center justify-center p-6">
            <svg viewBox="0 0 520 340" className="w-64 h-auto opacity-20 grayscale" role="img" aria-label="Assinatura minimalista ESBOÇO">
              <path d="M100 200 C 150 180, 250 180, 420 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <text x="100" y="180" fontSize="60" fontWeight="900" fontFamily="system-ui" letterSpacing="0.1em">ESBOÇO</text>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
