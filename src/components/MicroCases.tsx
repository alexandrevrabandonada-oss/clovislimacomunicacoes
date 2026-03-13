"use client"
import { useRevealOnView } from '../lib/useRevealOnView'

import Link from 'next/link'

export default function MicroCases() {
    const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

    const cases = [
        {
            title: 'Problema',
            context: 'Veículo regional',
            description: 'A diagramação de páginas extensas apresentava alta taxa de rejeição e os blocos de texto denso afastavam os leitores mais casuais.'
        },
        {
            title: 'Entrega',
            context: 'Arte Editorial',
            description: 'Linguagem visual autoral (charges e quadrinhos curtos) adaptada para costurar blocos textuais e orientar o foco de leitura de forma leve.'
        },
        {
            title: 'Resultado',
            context: 'Impacto Qualitativo',
            description: 'Aumentou expressivamente o engajamento na leitura, facilitou a interpretação da pauta e gerou maior taxa de compartilhamento orgânico.'
        }
    ]

    return (
        <div>
            <h2 ref={headingRef} className={`reveal-heading text-2xl font-bold ${revealed ? 'is-revealed' : ''}`}>
                O que entregamos
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-700">
                Desenho aplicado como ferramenta tática de atenção e clareza.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3 items-stretch">
                {cases.map((item) => (
                    <article key={item.title} className="ink-card p-5 flex flex-col justify-between">
                        <div>
                            <div className="mb-2 inline-block rounded border border-black/20 bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                                {item.context}
                            </div>
                            <h3 className="text-xl font-extrabold text-black">{item.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-slate-800">
                                {item.description}
                            </p>
                        </div>
                        {item.title === 'Resultado' && (
                            <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-semibold text-emerald-800">
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Maior retenção
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    Aprovação ágil
                                </span>
                            </div>
                        )}
                    </article>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Link href="/cases" className="ink-button inline-block rounded-full border border-black px-6 py-2.5 text-sm font-bold hover:bg-black hover:text-white transition-all">
                    Ver todos os cases detalhados →
                </Link>
            </div>
        </div>
    )
}
