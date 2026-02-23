"use client"
import Image from 'next/image'
import { trackEvent } from '../lib/analytics'

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

export default function Hero({ works }: HeroProps){
  const featuredSafeWork = works.find((work) => work.is_featured === true && !isSensitive(work.content_warning))
  const featuredImage = featuredSafeWork?.cover_url || featuredSafeWork?.cover_image_url || null

  return (
    <div className="min-h-[56vh] md:min-h-[58vh] grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
      <div>
        <p className="stamp">Ilustração + Produto Digital</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight">Humor que comunica. Design que converte.</h1>
        <p className="mt-3 max-w-2xl text-base md:text-lg">
          Charges e ilustração editorial com linguagem autoral, junto de sites e PWAs sob medida para captar, engajar e converter.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="#works"
            onClick={() => trackEvent('click_cta_ver_trabalhos')}
            className="ink-button inline-block w-full sm:w-auto text-center bg-accent text-white px-5 py-2.5 font-semibold"
          >
            Ver trabalhos
          </a>
          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault()
              trackEvent('click_cta_site_pwa')
              const message = 'Quero um site ou PWA com a identidade da minha marca.'
              const url = new URL(window.location.href)
              url.searchParams.set('prefill_message', message)
              window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
              window.dispatchEvent(new CustomEvent('contact-prefill', { detail: { message } }))
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="ink-button inline-block w-full sm:w-auto text-center px-5 py-2.5 font-semibold bg-white"
          >
            Quero um site/PWA
          </a>
        </div>
      </div>
      <div className="relative h-[280px] sm:h-[320px] md:h-[360px] rounded-[22px] overflow-hidden border-2 border-black bg-white">
        {featuredImage ? (
          <>
            <Image src={featuredImage} alt={featuredSafeWork?.title || 'Obra em destaque'} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/70 text-white px-3 py-2 text-sm">
              <strong>Destaque:</strong> {featuredSafeWork?.title}
            </div>
          </>
        ) : (
          <div className="h-full w-full halftone-bg flex items-center justify-center p-6">
            <svg viewBox="0 0 520 340" className="w-full h-full" role="img" aria-label="Ilustração de assinatura e pena em estilo HQ">
              <path d="M34 244 C 108 170, 206 166, 286 224 C 334 258, 384 264, 486 226" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
              <path d="M80 280 C 164 228, 256 226, 356 270" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              <path d="M322 86 C 350 70, 380 62, 424 60 C 422 104, 416 136, 388 166 C 362 194, 336 204, 304 214 C 304 178, 304 138, 322 86 Z" fill="#111827" />
              <path d="M350 116 C 362 128, 372 140, 382 154" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
              <circle cx="126" cy="98" r="44" fill="none" stroke="#0f172a" strokeWidth="6" />
              <circle cx="126" cy="98" r="7" fill="#0f172a" />
              <path d="M94 146 C 120 162, 140 162, 164 146" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
              <text x="190" y="314" fontSize="42" fill="#0f172a" fontFamily="Georgia, serif" transform="rotate(-6 190 314)">Clóvis Lima</text>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
