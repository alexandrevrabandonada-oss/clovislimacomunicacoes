"use client"
import { useTilt } from '../lib/useTilt'
import { useRevealOnView } from '../lib/useRevealOnView'

type PackageItem = {
  slug: string
  title: string
  subtitle: string
  bullets: string[]
}

const artPackages: PackageItem[] = [
  {
    slug: 'charge-avulsa',
    title: 'Charge avulsa',
    subtitle: '1 tema, 1 revisão',
    bullets: ['Direção visual editorial', 'Entrega pronta para publicação']
  },
  {
    slug: 'pacote-mensal',
    title: 'Pacote mensal',
    subtitle: 'X peças por mês',
    bullets: ['Consistência de linguagem', 'Planejamento por pauta']
  },
  {
    slug: 'serie-especial',
    title: 'Série / Especial',
    subtitle: 'Pauta + storyboard + entrega',
    bullets: ['Narrativa sequencial', 'Formato para campanhas e veículos']
  }
]

const digitalPackages: PackageItem[] = [
  {
    slug: 'landing-rapida',
    title: 'Landing rápida',
    subtitle: '1 página, SEO, formulário',
    bullets: ['Copy + design objetivo', 'Captação de leads pronta']
  },
  {
    slug: 'site-completo',
    title: 'Site completo',
    subtitle: 'Páginas + CMS simples',
    bullets: ['Estrutura editorial escalável', 'Atualização facilitada']
  },
  {
    slug: 'pwa',
    title: 'PWA',
    subtitle: 'Offline, instalação, dashboard',
    bullets: ['Experiência tipo app', 'Base para operação e métricas']
  }
]

const processSteps = ['Briefing', 'Rascunho', 'Ajustes', 'Final', 'Entrega/Deploy']

function sendPackagePrefill(item: PackageItem) {
  const url = new URL(window.location.href)
  url.searchParams.set('pacote', item.slug)
  url.hash = 'contato'
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  window.dispatchEvent(new CustomEvent('contact-package', { detail: { slug: item.slug, title: item.title } }))
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function PackageCard({ item, group }: { item: PackageItem; group: string }) {
  const tiltRef = useTilt<HTMLElement>(3)

  return (
    <article ref={tiltRef} className="ink-card p-4">
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
        onClick={() => sendPackagePrefill(item)}
        className="mt-5 rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white"
      >
        Quero este pacote
      </button>
    </article>
  )
}

export default function Services() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

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
              <PackageCard key={item.title} item={item} group="Arte Editorial" />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold">Digital</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {digitalPackages.map((item) => (
              <PackageCard key={item.title} item={item} group="Digital" />
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
    </div>
  )
}
