"use client"

import StampBadge from './StampBadge'
import { useRevealOnView } from '../lib/useRevealOnView'

export default function Clients(){
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const clients = [
    { label: 'IBASE', variant: 'rect' as const, logo_url: '/clients/ibase.png' },
    { label: 'DuPont', variant: 'tilted' as const, logo_url: '/clients/dupont.svg' },
    { label: 'Diário do Vale', variant: 'rough' as const, logo_url: '/clients/diario-do-vale.png' },
    { label: 'Folha do Aço', variant: 'tilted' as const, logo_url: '/clients/folha-do-aco.png' },
    { label: 'Pavio Curto', variant: 'rect' as const, logo_url: '/clients/pavio-curto.png' }
  ]
  const testimonials = [
    {
      quote: '"(inserir depoimento real) - Entregou com agilidade e manteve o tom editorial que precisavamos."',
      name: 'Nome do cliente',
      role: 'Editor',
      context: 'Editorial'
    },
    {
      quote: '"(inserir depoimento real) - A linguagem visual ajudou a campanha a ter mais impacto."',
      name: 'Nome do cliente',
      role: 'Coordenacao de comunicacao',
      context: 'Campanha'
    }
  ]

  return (
    <div>
      <h2 ref={headingRef} className={`reveal-heading text-2xl font-bold ${revealed ? 'is-revealed' : ''}`}>Clientes / Veículos</h2>
      <p className="mt-3 text-sm md:text-base">Trabalhos publicados/realizados para:</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
        {clients.map((client)=> (
          <StampBadge key={client.label} label={client.label} variant={client.variant} logo_url={client.logo_url} />
        ))}
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {testimonials.map((item) => (
          <article key={`${item.name}-${item.context}`} className="ink-card p-4">
            <p className="text-sm leading-relaxed text-slate-800">{item.quote}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700">
              {item.name} • {item.role} • {item.context}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
