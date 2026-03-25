"use client"

import StampBadge from './StampBadge'
import { useRevealOnView } from '../lib/useRevealOnView'

export default function Clients() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const clients = [
    { label: 'IBASE', variant: 'rect' as const, logo_url: '/clients/ibase.png' },
    { label: 'DuPont', variant: 'tilted' as const, logo_url: '/clients/dupont.svg' },
    { label: 'Diário do Vale', variant: 'rough' as const, logo_url: '/clients/diario-do-vale.png' },
    { label: 'Folha do Aço', variant: 'tilted' as const, logo_url: '/clients/folha-do-aco.png' },
    { label: 'Pavio Curto', variant: 'rect' as const, logo_url: '/clients/pavio-curto.png' }
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-4 w-1 bg-accent rounded-full" />
        <h2 ref={headingRef} className={`reveal-heading text-2xl md:text-3xl font-black tracking-tight italic ${revealed ? 'is-revealed' : ''}`}>Clientes & Veículos</h2>
      </div>
      <p className="text-sm text-slate-600 mb-4">Trabalhos publicados e realizados para:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
        {clients.map((client) => (
          <StampBadge key={client.label} label={client.label} variant={client.variant} logo_url={client.logo_url} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <p className="inline-block rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600">
          Cases detalhados disponíveis sob solicitação
        </p>
      </div>
    </div>
  )
}
