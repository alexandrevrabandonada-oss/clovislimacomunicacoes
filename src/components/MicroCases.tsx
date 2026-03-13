"use client"
import { useRevealOnView } from '../lib/useRevealOnView'

import Link from 'next/link'

export default function MicroCases() {
    const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

    const cases = [
        {
            title: 'Engajamento em Pautas Densas',
            context: 'Editorial Regional',
            problem: 'Páginas extensas de jornais regionais sofriam com alta taxa de rejeição e blocos de texto que afastavam leitores casuais.',
            entrega: [
                'Charges e quadrinhos curtos costurando blocos de texto',
                'Pontos de ancoragem visual e respiro editorial'
            ],
            resultado: 'Aumento no tempo de permanência e crescimento de 40% no compartilhamento orgânico.',
            metrica: 'Maior retenção'
        },
        {
            title: 'Humanização de Marca Pública',
            context: 'Campanha Local',
            problem: 'Comunicação governamental com tom excessivamente institucional, gerando distanciamento e percepção de frieza.',
            entrega: [
                'Linguagem visual baseada em HQ para explicar serviços',
                'Foco no cidadão e cotidiano'
            ],
            resultado: 'Melhora imediata no sentimento dos comentários e maior clareza na compreensão de processos.',
            metrica: 'Aprovação ágil'
        },
        {
            title: 'Redução de Erros em Processos',
            context: 'Treinamento Corporativo',
            problem: 'Manuais de treinamento complexos e ignorados, resultando em falhas operacionais recorrentes.',
            entrega: [
                'Manuais em HQ transformando regras técnicas em narrativas visuais',
                'Conteúdo memorável e engajador'
            ],
            resultado: 'Redução de 25% nos erros operacionais nos primeiros 3 meses.',
            metrica: '+clareza'
        }
    ]

    return (
        <div>
            <h2 ref={headingRef} className={`reveal-heading text-2xl font-bold ${revealed ? 'is-revealed' : ''}`}>
                Cases de impacto
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-700">
                Resultados reais em comunicação visual estratégica.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3 items-stretch">
                {cases.map((item) => (
                    <article key={item.title} className="ink-card p-5 flex flex-col justify-between">
                        <div>
                            <div className="mb-2 inline-block rounded border border-black/20 bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                                {item.context}
                            </div>
                            <h3 className="text-xl font-extrabold text-black mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-800 mb-2"><strong>Problema:</strong> {item.problem}</p>
                            <div className="mb-2">
                                <strong>Entrega:</strong>
                                <ul className="list-disc ml-5 mt-1 text-sm text-slate-800">
                                    {item.entrega.map((e, i) => <li key={i}>{e}</li>)}
                                </ul>
                            </div>
                            <p className="text-sm text-slate-800 mb-2"><strong>Resultado:</strong> {item.resultado}</p>
                        </div>
                        {item.metrica && (
                            <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-semibold text-emerald-800">
                                <span className="flex items-center gap-1.5">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    {item.metrica}
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
