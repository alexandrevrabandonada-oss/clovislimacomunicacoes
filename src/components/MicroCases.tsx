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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[3px] border-black pb-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-2.5 h-2.5 bg-accent" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Reports Técnicos & Prova de Conceito</p>
                    </div>
                    <h2 ref={headingRef} className={`text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] text-black ${revealed ? 'is-revealed' : ''}`}>
                         Diagnósticos de <br/> <span className="italic font-serif text-accent">Impacto Real</span>
                    </h2>
                </div>
                <Link href="/cases" className="ink-button bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest border-[3px] border-black hover:bg-black hover:text-white transition-all">
                    Analisar Repositório →
                </Link>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
                {cases.slice(0, 4).map((item) => (
                    <article key={item.slug} className="ink-card p-0 flex flex-col bg-white border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_var(--accent)] transition-all group overflow-hidden rounded-none">
                        
                        <div className="p-10 flex-grow border-b-[3px] border-black">
                            <div className="flex items-center justify-between mb-8">
                                <span className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border-2 border-black">
                                    ESTRATÉGIA_ENGINE // {item.category}
                                </span>
                                <div className="flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em]">Case_Verified</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-12">
                                    <h3 className="text-4xl font-black mb-8 leading-[0.95] tracking-tighter group-hover:text-accent transition-colors italic uppercase">
                                        &quot;{item.title}&quot;
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 gap-6 mb-8">
                                        <section className="p-6 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                                            <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.3em] mb-4 flex items-center gap-3">
                                                <div className="w-2 h-2 bg-black" /> Diagnóstico Técnico
                                            </p>
                                            <p className="text-base text-black font-bold leading-tight italic border-l-4 border-black pl-4">{item.diagnostic}</p>
                                        </section>

                                        <section className="p-6 bg-black text-white">
                                            <p className="text-[10px] font-black uppercase text-accent tracking-[0.4em] mb-4">Intervenção Estratégica</p>
                                            <p className="text-base font-bold leading-tight italic text-white/80">{item.intervention}</p>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            <section className="mt-4 p-8 bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="max-w-md">
                                        <p className="text-[10px] font-black uppercase text-black/30 tracking-[0.3em] mb-3 font-mono">Retorno_Operacional :: Impacto</p>
                                        <p className="text-xl font-black text-black leading-none tracking-tight italic uppercase">&quot;{item.impact}&quot;</p>
                                    </div>
                                    <div className="bg-accent text-white border-[3px] border-black px-5 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">{item.evidence}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="p-10 pt-0 flex flex-col sm:flex-row gap-6 bg-white">
                            <Link 
                                href={`/cases/${item.slug}`}
                                onClick={() => trackEvent('click_microcase_detail', { slug: item.slug })}
                                className="ink-button flex-1 text-center py-6 bg-black text-white text-[11px] uppercase font-black tracking-[0.2em] hover:bg-accent transition-all"
                            >
                                Analisar Report →
                            </Link>
                            <Link 
                                href="/#contato"
                                onClick={() => trackEvent('click_microcase_cta', { slug: item.slug })}
                                className="ink-button flex-1 text-center py-6 bg-white text-black text-[11px] uppercase font-black tracking-[0.2em] border-[3px] border-black hover:bg-black hover:text-white transition-all"
                            >
                                Solicitar Diagnóstico
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
