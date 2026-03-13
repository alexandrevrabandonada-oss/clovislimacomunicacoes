"use client"
import { useRevealOnView } from '../lib/useRevealOnView'

import Link from 'next/link'

export default function MicroCases() {
    const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

    const cases = [
        {
            title: 'Engajamento em Pautas Densas',
            category: 'Jornalismo Regional',
            client: 'Veículos NSC (Santa Catarina)',
            context: 'Editorial de Grande Circulação',
            problem: 'Páginas especiais de finais de semana sofriam com blocos de texto áridos, gerando baixa retenção em temas complexos.',
            entrega: [
                'Charges e quadrinhos curtos integrados ao fluxo do texto',
                'Visual storytelling para explicar dados econômicos'
            ],
            resultado: 'Aumento de 40% no compartilhamento orgânico e maior tempo de leitura em pautas de política.',
            metrica: 'Alta Retenção',
            methodology: 'A ilustração serve como respiro cognitivo, permitindo ao leitor processar informações densas sem fadiga visual.'
        },
        {
            title: 'Humanização de Marca Pública',
            category: 'Comunicação Governamental',
            client: 'Administração Municipal',
            context: 'Campanha de Serviços Públicos',
            problem: 'Distanciamento do cidadão devido ao tom excessivamente institucional e burocrático da comunicação oficial.',
            entrega: [
                'Linguagem em HQ para explicar novos processos de zeladoria',
                'Personagens baseados na demografia real da cidade'
            ],
            resultado: 'Melhora no sentimento das interações sociais e redução de 30% em dúvidas básicas no SAC.',
            metrica: 'Aprovação Ágil',
            methodology: 'O uso do humor e da linguagem visual familiar quebra a barreira da autoridade, gerando conexão imediata.'
        },
        {
            title: 'Eficiência em Processos Internos',
            category: 'Treinamento Corporativo',
            client: 'Operações de Logística e Varejo',
            context: 'Onboarding e Segurança',
            problem: 'Manuais de treinamento ignorados, resultando em falhas operacionais e custos com retrabalho.',
            entrega: [
                'Guia Visual de Operações em formato de "Manual Vivo" (HQ)',
                'Tiras de segurança para murais e grupos de trabalho'
            ],
            resultado: 'Redução de 25% nos erros operacionais críticos nos primeiros 90 dias.',
            metrica: '+Produtividade',
            methodology: 'A narrativa visual fixa conceitos técnicos de forma mnêmica, garantindo que o colaborador compreenda o "porquê" de cada etapa.'
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
                    <article key={item.title} className="ink-card p-5 flex flex-col justify-between group">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <span className="rounded bg-black/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                    {item.category}
                                </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-black mb-1">{item.title}</h3>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-3">Cliente: {item.client}</p>
                            
                            <div className="space-y-3 text-sm text-slate-800">
                                <p><strong className="text-black/40 uppercase text-[10px] block">Desafio:</strong> {item.problem}</p>
                                
                                <div>
                                    <strong className="text-black/40 uppercase text-[10px] block">Entrega:</strong>
                                    <ul className="list-disc ml-4 mt-1 space-y-0.5 text-xs">
                                        {item.entrega.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                                
                                <p className="p-2 bg-emerald-50 rounded border-l-2 border-emerald-500/30 italic text-xs leading-relaxed">
                                    <strong className="text-emerald-800 not-italic block mb-0.5">Resultado:</strong> {item.resultado}
                                </p>
                            </div>
                        </div>
                        
                        {item.metrica && (
                            <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    {item.metrica}
                                </span>
                                <span className="text-[9px] font-medium text-slate-400">Ver detalhes →</span>
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
