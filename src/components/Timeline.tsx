"use client"

import { useRevealOnView } from '../lib/useRevealOnView'

export default function Timeline(){
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const items = [
    { year: '1984', text: 'Estagiário de arte (cartaz) em rede de supermercados.', kind: 'poster' },
    { year: '1985', text: 'Charges/ilustrações para boletins do Sindicato dos Metalúrgicos.', kind: 'union' },
    { year: '1986', text: 'Estágio como cartunista no Sindicato dos Químicos de SP.', kind: 'union' },
    { year: '1996-2000', text: 'Setor de comunicação do governo Inês Pandeló (Barra Mansa-RJ).', kind: 'government' },
    { year: '2007', text: 'Animações ETA/ETE (Água das Agulhas Negras).', kind: 'animation' },
    { year: '2011', text: 'Animação Montverd Eco Clothes.', kind: 'animation' },
    { year: '2023', text: 'Formado em Artes Visuais.', kind: 'graduation' },
    { year: 'Atual', text: 'Cartunista/diagramador do SEPE-RJ; professor; caricatura ao vivo; ilustração.', kind: 'current' }
  ]

  const Icon = ({ kind }: { kind: string }) => {
    if (kind === 'poster') return <span aria-hidden="true">🪧</span>
    if (kind === 'union') return <span aria-hidden="true">✊</span>
    if (kind === 'government') return <span aria-hidden="true">🏛️</span>
    if (kind === 'animation') return <span aria-hidden="true">🎞️</span>
    if (kind === 'graduation') return <span aria-hidden="true">🎓</span>
    return <span aria-hidden="true">✍️</span>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-4 w-1 bg-accent rounded-full" />
        <h2 ref={headingRef} className={`reveal-heading text-2xl md:text-3xl font-black tracking-tight italic ${revealed ? 'is-revealed' : ''}`}>Trajetória & Experiência</h2>
      </div>
      <p className="text-sm text-slate-600 mb-4">Mais de 30 anos de experiência em narrativa visual e estratégia editorial. A ESBOÇO consolida esse legado em projetos de Design & Estratégia de alto impacto.</p>
      <div className="relative mt-8 text-sm">
        <div className="absolute left-4 top-0 h-full w-[3px] rounded-full bg-black/70 md:left-1/2 md:-translate-x-1/2" />
        <ol className="space-y-6 md:space-y-8">
          {items.map((i, idx)=> {
            const left = idx % 2 === 0
            return (
              <li key={`${i.year}-${i.text}`} className="relative pl-12 md:pl-0">
                <div className={`md:grid md:grid-cols-2 md:items-center ${left ? '' : 'md:[&>article]:col-start-2'}`}>
                  <article className={`timeline-card ${left ? 'md:mr-10' : 'md:ml-10'}`}>
                    <div className="flex items-center gap-2">
                      <span className="stamp">{i.year}</span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/70 bg-white">
                        <Icon kind={i.kind} />
                      </span>
                    </div>
                    <p className="mt-3 leading-relaxed">{i.text}</p>
                  </article>
                </div>
                <span className="timeline-node" aria-hidden="true" />
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
