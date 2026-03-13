"use client"
import { useTilt } from '../lib/useTilt'
import { useRevealOnView } from '../lib/useRevealOnView'

type PackageItem = {
  slug: string
  title: string
  subtitle: string
  bullets: string[]
  details: {
    includes: string[]
    excludes: string[]
    timeframe: string
    revisions: string
  import { PRICING } from '../lib/data'
  }
}

const artPackages: PackageItem[] = [
              <div className="mb-2 text-xs text-slate-700">
                  {PRICING.packages[item.slug]?.price && (
                    <span className="inline-block mr-2">{PRICING.packages[item.slug].price}</span>
                  )}
                  {PRICING.packages[item.slug]?.prazo && (
                    <span className="inline-block">prazo típico: {PRICING.packages[item.slug].prazo}</span>
                  )}
              </div>
  {
    slug: 'charge-avulsa',
    title: 'Charge avulsa',
    subtitle: '1 tema, 1 revisão',
    bullets: ['Direção visual editorial', 'Entrega pronta para publicação'],
    details: {
      includes: ['1 Ilustração digital (charge)', 'Arquivo em alta resolução (PNG/JPG)', 'Licença para uso editorial'],
      excludes: ['Arquivos abertos (PSD/AI)', 'Versão animada', 'Uso em campanhas publicitárias (licença extra)'],
      timeframe: '2 dias úteis',
      revisions: '1 rodada de ajustes'
    }
  },
  {
    slug: 'pacote-mensal',
    title: 'Pacote mensal',
    subtitle: 'Ilustração recorrente',
    bullets: ['Consistência de linguagem', 'Planejamento por pauta'],
    details: {
      includes: ['Até 4 charges por mês', 'Reunião estratégica de pauta', 'Consistência de estilo visual'],
      excludes: ['Design de landing pages', 'Gestão de redes sociais'],
      timeframe: 'Entrega semanal',
      revisions: '1 ajuste por peça'
    }
  },
  {
    slug: 'serie-especial',
    title: 'Série / Especial',
    subtitle: 'Pauta + storyboard + entrega',
    bullets: ['Narrativa sequencial', 'Formato para campanhas e veículos'],
    details: {
      includes: ['Roteirização visual', 'Até 6 quadros sequenciais', 'Storyboarding'],
      excludes: ['Animação completa/Motion', 'Impressão física'],
      timeframe: '5 a 10 dias úteis',
      revisions: '2 rodadas de ajustes'
    }
  }
]

const digitalPackages: PackageItem[] = [
  {
    slug: 'landing-rapida',
    title: 'Landing rápida',
    subtitle: '1 página, SEO, formulário',
    bullets: ['Copy + design objetivo', 'Captação de leads pronta'],
    details: {
      includes: ['Design de página única', 'Integração com formulário', 'Otimização de SEO básica'],
      excludes: ['Custos de hospedagem e domínio', 'Gestão de tráfego pago', 'Logo design'],
      timeframe: '3 dias úteis',
      revisions: '1 rodada de ajustes'
    }
  },
  {
    slug: 'site-completo',
    title: 'Site completo',
    subtitle: 'Páginas + CMS simples',
    bullets: ['Estrutura editorial escalável', 'Atualização facilitada'],
    details: {
      includes: ['Até 5 páginas internas', 'Painel de gerenciamento (CMS)', 'Design responsivo'],
      excludes: ['Produção de conteúdo extenso', 'Integração com E-commerce complexo'],
      timeframe: '10 a 15 dias úteis',
      revisions: '2 rodadas de ajustes'
    }
  },
  {
    slug: 'pwa',
    title: 'PWA',
    subtitle: 'Offline, instalação, dashboard',
    bullets: ['Experiência tipo app', 'Base para operação e métricas'],
    details: {
      includes: ['Instalação no celular (A2HS)', 'Modo Offline básico', 'Dashboard de analytics'],
      excludes: ['Publicação na App Store/Play Store (nativo)', 'API complexa de terceiros'],
      timeframe: '15+ dias úteis',
      revisions: 'Consultoria dedicada'
    }
  }
]

const processSteps = ['Briefing', 'Rascunho', 'Ajustes', 'Final', 'Entrega/Deploy']

function sendPackagePrefill(slug: string, title: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('pacote', slug)
  url.hash = 'contato'
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  window.dispatchEvent(new CustomEvent('contact-package', { detail: { slug, title } }))
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function PackageCard({ item, group, onOpenDetails }: { item: PackageItem; group: string; onOpenDetails: (item: PackageItem) => void }) {
  const tiltRef = useTilt<HTMLElement>(3)

  return (
    <article ref={tiltRef} className="ink-card p-4 flex flex-col justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-700">{group}</p>
        <h3 className="mt-1 text-xl font-extrabold">{item.title}</h3>
        <p className="mt-1 inline-block stamp">{item.subtitle}</p>
        <div className="mt-4 space-y-2 text-sm">
          {item.bullets.map((bullet) => (
            <p key={bullet} className="rounded border border-black/15 bg-white/70 px-2 py-1">
              {bullet}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onOpenDetails(item)}
          className="mt-3 text-xs font-semibold text-slate-800 underline underline-offset-4 hover:text-black"
        >
          Ver o que inclui
        </button>
      </div>
      <button
        type="button"
        onClick={() => sendPackagePrefill(item.slug, item.title)}
        className="mt-5 rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white"
      >
        Quero este pacote
      </button>
    </article>
  )
}

import { useState } from 'react'
import Modal from './Modal'

export default function Services() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const [selectedItem, setSelectedItem] = useState<PackageItem | null>(null)

  return (
    <div className="space-y-14">
      <section>
        <h2 ref={headingRef} className={`reveal-heading text-3xl font-extrabold ${revealed ? 'is-revealed' : ''}`}>Pacotes</h2>
        <p className="mt-2 max-w-3xl text-slate-700">
          Combinações prontas para acelerar contratação e entrega, com linguagem visual autoral de HQ.
        </p>

        <div className="mt-6">
          <h3 className="text-xl font-bold">Arte Editorial</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {artPackages.map((item) => (
              <PackageCard key={item.title} item={item} group="Arte Editorial" onOpenDetails={setSelectedItem} />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold">Digital</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {digitalPackages.map((item) => (
              <PackageCard key={item.title} item={item} group="Digital" onOpenDetails={setSelectedItem} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-extrabold">Processo</h2>
        <p className="mt-2 text-slate-700">Fluxo curto, transparente e orientado a resultado.</p>
        <ol className="mt-5 grid gap-3 md:grid-cols-5">
          {processSteps.map((step, index) => (
            <li key={step} className="ink-card p-3">
              <p className="text-xs font-bold tracking-wider text-slate-600">ETAPA {index + 1}</p>
              <p className="mt-1 text-lg font-extrabold">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div className="p-2">
            <h2 className="text-2xl font-extrabold">{selectedItem.title}</h2>
            <p className="mt-1 stamp inline-block">{selectedItem.subtitle}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-800">✓</span>
                  O que inclui
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedItem.details.includes.map(i => <li key={i}>• {i}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-2 font-bold text-slate-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] text-red-800">✕</span>
                  Não inclui
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {selectedItem.details.excludes.map(i => <li key={i}>• {i}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-black/10 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Prazo típico</p>
                <p className="text-sm font-semibold">{selectedItem.details.timeframe}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Revisões</p>
                <p className="text-sm font-semibold">{selectedItem.details.revisions}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sendPackagePrefill(selectedItem.slug, selectedItem.title)
                setSelectedItem(null)
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
