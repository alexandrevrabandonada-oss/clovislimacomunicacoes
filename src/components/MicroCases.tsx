"use client"
import Image from 'next/image'
import { useRevealOnView } from '../lib/useRevealOnView'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'
import { cases } from '../lib/cases'

export default function MicroCases() {
    const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Reports Técnicos & Prova de Conceito</p>
                    </div>
                    <h2 ref={headingRef} className={`text-4xl md:text-6xl font-black tracking-tighter leading-none text-slate-900 ${revealed ? 'is-revealed' : ''}`}>
                         Diagnósticos de <span className="italic font-serif">Impacto Real</span>
                    </h2>
                </div>
                <Link href="/cases" className="ink-button bg-white text-black px-6 py-3 text-[9px]">
                    Ver Repositório de Cases →
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {cases.slice(0, 4).map((item) => (
                    <article key={item.slug} className="ink-card p-0 flex flex-col bg-white border-[3px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_rgba(239,68,68,0.1)] transition-all group overflow-hidden">
                        
                        <div className="p-8 flex-grow">
                            <div className="flex items-center justify-between mb-8">
                                <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm">
                                    ESTRATÉGIA / {item.category}
                                </span>
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Case Verificado</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-12">
                                    <h3 className="text-3xl font-black mb-6 leading-[1.1] tracking-tight group-hover:text-accent transition-colors italic">
                                        &quot;{item.title}&quot;
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                        <section className="p-5 bg-slate-50 border border-black/5 rounded-lg">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-black rounded-full" /> Desafio Estratégico
                                            </p>
                                            <p className="text-sm text-slate-900 font-bold leading-tight italic">{item.problem}</p>
                                        </section>

                                        <section className="p-5 bg-black text-white rounded-lg">
                                            <p className="text-[9px] font-black uppercase text-accent tracking-widest mb-3">Metodologia Esboço</p>
                                            <p className="text-sm font-medium leading-tight text-slate-300">{item.methodology}</p>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            <section className="mt-2 p-6 bg-slate-100 border-t-4 border-slate-900 rounded-b-xl">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 font-mono">Retorno Operacional_Log</p>
                                        <p className="text-lg font-black text-slate-900 leading-tight tracking-tight italic">&quot;{item.result}&quot;</p>
                                    </div>
                                    <div className="bg-white border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <p className="text-[9px] font-black text-accent uppercase tracking-widest">{item.evidence}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
                            <Link 
                                href={`/cases/${item.slug}`}
                                onClick={() => trackEvent('click_microcase_detail', { slug: item.slug })}
                                className="ink-button flex-1 text-center py-4 bg-black text-white text-[10px] uppercase font-black tracking-widest hover:rotate-1"
                            >
                                Analisar Diagnóstico →
                            </Link>
                            <Link 
                                href="/#contato"
                                onClick={() => trackEvent('click_microcase_cta', { slug: item.slug })}
                                className="ink-button flex-1 text-center py-4 bg-white text-black text-[10px] uppercase font-black tracking-widest border-2 border-black -rotate-1"
                            >
                                Consultar Formato
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
