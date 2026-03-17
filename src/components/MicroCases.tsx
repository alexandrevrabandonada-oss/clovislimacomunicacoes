"use client"
import Image from 'next/image'
import { useRevealOnView } from '../lib/useRevealOnView'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'
import { cases } from '../lib/cases'

export default function MicroCases() {
    const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 ref={headingRef} className={`reveal-heading text-4xl font-black ${revealed ? 'is-revealed' : ''}`}>
                        Reports de <span className="italic">Impacto</span>
                    </h2>
                    <p className="mt-2 text-slate-500 max-w-xl font-medium italic border-l-2 border-accent pl-4">
                        Análise técnica de como transformamos pautas complexas em autoridade visual e resultados operacionais.
                    </p>
                </div>
                <Link href="/cases" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-accent hover:border-accent transition-colors">
                    Ver todos os reports →
                </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((item) => (
                    <article key={item.slug} className="ink-card p-6 flex flex-col justify-between bg-white border-2 border-black/5 hover:border-black/20 transition-all group relative overflow-hidden">
                        {/* Digital/PWA Indicator */}
                        {item.category.includes('Digital') && (
                            <div className="absolute top-0 right-0 bg-accent text-white text-[8px] font-black px-3 py-1 uppercase tracking-[0.2em] shadow-sm z-20">
                                High Tech / PWA
                            </div>
                        )}
                        
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <span className="stamp text-[9px] py-1 px-2 bg-slate-100 uppercase font-black tracking-widest text-slate-500 border border-slate-200">
                                    Report: {item.category}
                                </span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                </div>
                            </div>

                            {/* Case Screenshot Thumbnail */}
                            {item.screenshot_url && (
                                <div className="mb-6 relative aspect-video rounded-lg overflow-hidden border border-black/10 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute top-0 inset-x-0 h-3 bg-slate-100 flex items-center px-1.5 gap-0.5 z-10 border-b border-black/5">
                                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    </div>
                                    <Image 
                                        src={item.screenshot_url} 
                                        alt={item.title} 
                                        fill 
                                        className="object-cover object-top pt-3"
                                    />
                                </div>
                            )}
                            
                            <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-accent transition-colors italic">
                                &quot;{item.title}&quot;
                            </h3>
                            
                            <div className="space-y-5 text-sm">
                                <section className="relative pl-4 border-l border-slate-200">
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1.5 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" /> Desafio / Problema
                                    </p>
                                    <p className="text-slate-600 leading-snug line-clamp-2 italic">{item.problem}</p>
                                </section>
                                
                                <div className="border-t border-dashed border-slate-200 w-full my-2" />

                                <section className="p-4 bg-slate-50/50 border border-black/5 rounded-xl">
                                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-1.5">Retorno Operacional</p>
                                    <p className="text-slate-900 font-bold leading-tight mb-2 tracking-tight">&quot;{item.result}&quot;</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-px flex-grow bg-slate-200" />
                                        <p className="text-[8px] font-black uppercase text-accent tracking-[0.2em] whitespace-nowrap">{item.evidence}</p>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <Link 
                                href={`/cases/${item.slug}`}
                                onClick={() => trackEvent('click_microcase_detail', { slug: item.slug })}
                                className="ink-button block w-full text-center py-2.5 bg-black text-white text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-accent transition-all"
                            >
                                Analisar Diagnóstico Completo →
                            </Link>
                            <Link 
                                href="/#contato"
                                onClick={() => trackEvent('click_microcase_cta', { slug: item.slug })}
                                className="block w-full text-center text-[9px] font-black uppercase tracking-[0.15em] hover:text-accent transition-colors pt-1"
                            >
                                Agendar Consultiva Sobre Este Formato
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
