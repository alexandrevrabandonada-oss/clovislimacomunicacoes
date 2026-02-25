"use client"

import { useTilt } from '../lib/useTilt'

const proofItems = [
  '+15 anos de jornalismo e comunicacao visual',
  'Trabalho sob demanda',
  'Entrega com revisao',
  'Foco em clareza e impacto'
]

function ProofPill({ text }: { text: string }) {
  const tiltRef = useTilt<HTMLElement>(2)

  return (
    <article ref={tiltRef} className="ink-card px-3 py-2 text-sm font-semibold">
      {text}
    </article>
  )
}

export default function ProofStrip() {
  return (
    <section aria-label="Provas de confianca" className="mt-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {proofItems.map((item) => (
          <ProofPill key={item} text={item} />
        ))}
      </div>
    </section>
  )
}
