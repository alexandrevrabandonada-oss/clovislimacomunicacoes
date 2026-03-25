"use client"

import { useTilt } from '../lib/useTilt'

const proofItems = [
  "40 Anos de Autoridade em Síntese Visual",
  "Protocolo Consultivo de Alto Impacto",
  "Rigor Editorial em Ativos de Comunicação",
  "Escalabilidade Técnica em Sistemas Digitais"
]

function ProofPill({ text, index }: { text: string, index: number }) {
  const tiltRef = useTilt<HTMLElement>(2)

  return (
    <article ref={tiltRef} className="ink-card px-6 py-4 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:shadow-[12px_12px_0px_0px_var(--accent)] transition-all">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-accent opacity-40 group-hover:opacity-100 transition-opacity">PROT_{index + 1}</span>
        <p className="text-[11px] font-black uppercase tracking-widest leading-none italic">{text}</p>
      </div>
    </article>
  )
}

export default function ProofStrip() {
  return (
    <div aria-label="Evidências de Autoridade">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {proofItems.map((item, index) => (
          <ProofPill key={item} text={item} index={index} />
        ))}
      </div>
    </div>
  )
}
