"use client"

type OfferItem = {
  slug: 'prints' | 'licenca-editorial' | 'licenca-campanha'
  title: string
  benefit: string
  bullets: string[]
  details: {
    includes: string[]
    excludes: string[]
    timeframe: string
    revisions: string
  }
}

const offers: OfferItem[] = [
  {
    slug: 'prints',
    title: 'Print assinado',
    benefit: 'Edição para colecionar, com autenticidade e impacto visual.',
    bullets: [
      'Formato Fine Art (A3+)',
      'Tiragem limitada (20-50)',
      'Assinatura original na obra'
    ],
    details: {
      includes: ['Impressão em papel fine art', 'Assinatura original', 'Certificado de autenticidade'],
      excludes: ['Moldura', 'Direitos de reprodução comercial', 'Arquivos digitais'],
      timeframe: '7 dias úteis + correios',
      revisions: 'N/A (Obra pronta)'
    }
  },
  {
    slug: 'licenca-editorial',
    title: 'Licença editorial',
    benefit: 'Uso em jornal, revista ou portal com ajuste ao contexto da pauta.',
    bullets: [
      'Pode usar em jornal, revista ou portal',
      'Prazo: 1 publicação (não recorrente)',
      'Crédito obrigatório ao autor'
    ],
    details: {
      includes: ['Direito de publicação única', 'Arquivo digital em alta', 'Créditos obrigatórios'],
      excludes: ['Uso publicitário', 'Exclusividade total', 'Alterações na arte original'],
      timeframe: 'Imediato (após contrato)',
      revisions: 'Ajuste de formato/corte'
    }
  },
  {
    slug: 'licenca-campanha',
    title: 'Licença campanha',
    benefit: 'Aplicação em campanha com linguagem autoral e uso combinado.',
    bullets: [
      'Uso em digital, OOH e impresso',
      'Exclusividade negociável',
      'Valor varia conforme alcance'
    ],
    details: {
      includes: ['Uso multiplataforma (Digital/OOH)', 'Período determinado (6-12 meses)', 'Suporte para implementação'],
      excludes: ['Propriedade intelectual (IP)', 'Merchandising físico ilimitado'],
      timeframe: 'A definir (conforme campanha)',
      revisions: 'Consultoria de aplicação'
    }
  }
]

function goToContact(slug: string, title: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('pacote', slug)
  url.hash = 'contato'
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  window.dispatchEvent(new CustomEvent('contact-package', { detail: { slug, title } }))
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

import { useState } from 'react'
import Modal from './Modal'

export default function PrintsTeaser() {
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null)

  return (
    <div className="relative z-10 w-full">
      <h2 className="text-3xl font-extrabold">Prints &amp; Licenciamento</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {offers.map((item) => (
          <article key={item.slug} className="ink-card p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{item.benefit}</p>
              <div className="mt-4 space-y-2 text-sm">
                {item.bullets.map((bullet) => (
                  <p key={bullet} className="rounded border border-black/15 bg-white/70 px-2 py-1">
                    {bullet}
                  </p>
                ))}
              </div>
              import { PRICING } from '../lib/data'
              <button
                return (
                  <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {offers.map((offer) => (
                      <article key={offer.slug} className="ink-card p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-extrabold mb-2 text-black">{offer.title}</h3>
                          <p className="mb-3 text-slate-700 text-sm">{offer.benefit}</p>
                          <ul className="mb-4 list-disc ml-5 text-sm text-slate-800">
                            {offer.bullets.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                          <div className="mb-2 text-xs text-slate-700">
                            {PRICING.prints[offer.slug]?.price && (
                              <span className="inline-block mr-2">{PRICING.prints[offer.slug].price}</span>
                            )}
                            {PRICING.prints[offer.slug]?.prazo && (
                              <span className="inline-block">prazo típico: {PRICING.prints[offer.slug].prazo}</span>
                            )}
                          </div>
                        </div>
                        <button
                          className="ink-button mt-4 bg-black text-white px-4 py-2 rounded-full font-bold"
                          onClick={() => setSelectedOffer(offer)}
                        >
                          Quero este
                        </button>
                      </article>
                    ))}
                  </div>
          <div className="p-2">
            <h2 className="text-2xl font-extrabold">{selectedOffer.title}</h2>
            <p className="mt-2 text-sm text-slate-600 italic">Disponibilidade sob consulta e contrato.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-800">✓</span>
                  O que inclui
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedOffer.details.includes.map(i => <li key={i}>• {i}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] text-red-800">✕</span>
                  Não inclui
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedOffer.details.excludes.map(i => <li key={i}>• {i}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-black/10 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Prazo</p>
                <p className="text-sm font-semibold">{selectedOffer.details.timeframe}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Revisões</p>
                <p className="text-sm font-semibold">{selectedOffer.details.revisions}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                goToContact(selectedOffer.slug, selectedOffer.title)
                setSelectedOffer(null)
              }}
              className="mt-8 w-full rounded-full border border-black bg-black px-6 py-3 text-center font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Quero este pacote
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
