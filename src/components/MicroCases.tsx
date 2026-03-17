"use client"
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
                    <h2 ref={headingRef} className={`reveal-heading text-3xl font-extrabold ${revealed ? 'is-revealed' : ''}`}>
                        Casos e Aplicações
                    </h2>
                    <p className="mt-2 text-slate-700 max-w-xl font-medium italic">
                        Estratégias onde a narrativa visual foi ferramenta de autoridade e clareza.
                    </p>
                </div>
                <Link href="/cases" className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-accent hover:border-accent transition-colors">
                    Ver todos os reports →
                </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((item) => (
                    <article key={item.slug} className="ink-card p-6 flex flex-col justify-between bg-white border-2 border-black/5 hover:border-black/20 transition-all group">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="stamp text-[9px] py-1 px-2 bg-slate-100 uppercase font-black tracking-widest text-slate-500">
                                    {item.category}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    Observação de Resultado
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-accent transition-colors italic">&quot;{item.title}&quot;</h3>
                            
                            <div className="space-y-4 text-sm">
                                <section>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">O Problema</p>
                                    <p className="text-slate-700 leading-snug line-clamp-2">{item.problem}</p>
                                </section>
                                
                                <section className="p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Efeito Percebido</p>
                                    <p className="text-slate-900 font-bold leading-tight mb-2 italic">&quot;{item.result}&quot;</p>
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">{item.evidence}</p>
                                </section>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
                            <Link 
                                href={`/cases/${item.slug}`}
                                onClick={() => trackEvent('click_microcase_detail', { slug: item.slug })}
                                className="ink-button block w-full text-center py-2 bg-black text-white text-xs font-bold rounded-full"
                            >
                                Ver Report Completo
                            </Link>
                            <Link 
                                href="/#contato"
                                onClick={() => trackEvent('click_microcase_cta', { slug: item.slug })}
                                className="block w-full text-center text-[10px] font-black uppercase tracking-widest hover:text-accent transition-colors pt-2"
                            >
                                Iniciar projeto similar →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
