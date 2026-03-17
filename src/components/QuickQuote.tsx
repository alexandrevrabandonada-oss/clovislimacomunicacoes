"use client"

import { trackEvent } from '../lib/analytics'

type QuickOption = {
  slug: 'editorial' | 'licença' | 'tech'
  title: string
  button: string
}

const options: QuickOption[] = [
  { slug: 'editorial', title: 'Charges / Editorial', button: 'Charges / Editorial' },
  { slug: 'licença', title: 'Prints / Licenciamento', button: 'Licenciamento' },
  { slug: 'tech', title: 'Sites / PWA', button: 'Sites / PWA' }
]

function packageMessage(option: QuickOption): string {
  if (option.slug === 'editorial') return 'Olá! Gostaria de entender como a narrativa visual e as charges estratégicas podem aumentar a autoridade e o engajamento da minha pauta/veículo. Podemos alinhar um diagnóstico?'
  if (option.slug === 'licença') return 'Olá! Tenho interesse no licenciamento estratégico de obras do acervo ESBOÇO para fins editoriais ou comerciais. Como funciona a cessão de direitos e exclusividade para essa demanda?'
  if (option.slug === 'tech') return 'Olá! Busco uma interface autoral (Site/PWA) que conecte estratégia técnica e design de impacto. Podemos conversar sobre o desafio do meu produto digital?'
  return 'Olá! Gostaria de um orçamento personalizado para um projeto especial de criação visual e estratégia.'
}

function goWithPackage(option: QuickOption) {
  const message = packageMessage(option)
  trackEvent('quick_quote_select', { package: option.slug, title: option.title })
  
  const url = new URL(window.location.href)
  url.searchParams.delete('prefill_message')
  url.searchParams.set('prefill_message', message)
  url.hash = 'contato'
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
  window.dispatchEvent(new CustomEvent('contact-prefill', { detail: { message } }))
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('contato')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
}

function goWithoutPackage() {
  trackEvent('click_quick_quote_help')
  const url = new URL(window.location.href)
  url.searchParams.delete('pacote')
  url.hash = 'contato'
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  const target = document.getElementById('contato')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function QuickQuote() {
  return (
    <div className="ink-card p-6 bg-slate-50/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <h3 className="text-xl font-black uppercase tracking-tight">Orçamento Rápido</h3>
      </div>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        Selecione uma trilha abaixo para iniciar um contato guiado e receber uma estimativa personalizada.
      </p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <button
            key={option.slug}
            type="button"
            onClick={() => goWithPackage(option)}
            className="ink-button rounded-full border border-black bg-white px-5 py-2.5 text-sm font-bold hover:bg-slate-50 transition-all"
          >
            {option.button}
          </button>
        ))}
        <button
          type="button"
          onClick={goWithoutPackage}
          className="ink-button rounded-full border border-black bg-black px-5 py-2.5 text-sm font-bold text-white hover:scale-105 transition-all"
        >
          Ainda estou entendendo
        </button>
      </div>
    </div>
  )
}
