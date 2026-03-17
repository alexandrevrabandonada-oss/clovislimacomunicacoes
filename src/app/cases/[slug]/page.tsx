import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { getCaseBySlug, getAllCaseSlugs } from '../../../lib/cases'
import { Metadata } from 'next'

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const item = getCaseBySlug(params.slug)
    if (!item) return {}

    return {
        title: `${item.title} | Case ESBOÇO`,
        description: item.summary,
        openGraph: {
            title: item.title,
            description: item.summary,
            type: 'article',
            url: `/cases/${params.slug}`
        }
    }
}

export async function generateStaticParams() {
    const slugs = getAllCaseSlugs()
    return slugs.map((slug) => ({ slug }))
}

export default function CaseDetailPage({ params }: Props) {
    const item = getCaseBySlug(params.slug)

    if (!item) {
        notFound()
    }

    return (
        <main className="min-h-screen pt-24 pb-16 bg-white">
            <Header />

            <div className="max-w-4xl mx-auto px-6">
                <nav className="mb-12">
                    <Link href="/cases" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors flex items-center gap-2">
                        ← Voltar para todos os cases
                    </Link>
                </nav>

                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="rounded bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                            {item.category}
                        </span>
                        <span className="h-px w-8 bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.sector}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-black leading-tight mb-4">
                        {item.title}
                    </h1>
                    <p className="text-xl text-slate-500 font-serif italic max-w-2xl leading-relaxed">
                        &quot;{item.summary}&quot;
                    </p>
                    <div className="mt-8 pt-8 border-t border-black/5 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Cliente: <span className="text-black">{item.client}</span></span>
                    </div>
                </header>

                <div className="grid gap-16">
                    {/* Visão Geral & Problema */}
                    <section className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
                        <aside>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black bg-slate-50 px-3 py-2 border-l-2 border-black inline-block">
                                Detalhes do Desafio
                            </h2>
                        </aside>
                        <div className="space-y-6">
                            <p className="text-lg leading-relaxed text-slate-800">
                                {item.problem}
                            </p>
                        </div>
                    </section>

                    {/* Estratégia & Solução */}
                    <section className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
                        <aside>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black bg-slate-50 px-3 py-2 border-l-2 border-black inline-block">
                                Estratégia ESBOÇO
                            </h2>
                        </aside>
                        <div className="space-y-6">
                            <div className="p-8 bg-black text-white rounded-[2rem] shadow-2xl shadow-black/10">
                                <p className="text-xl leading-relaxed font-medium mb-6 italic">
                                    {item.solution}
                                </p>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-xl pb-4 border-b border-white/10">
                                    {item.methodology}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4 text-[10px] uppercase font-black tracking-widest text-accent">
                                    <span>Entregáveis: {item.proof.deliverables}</span>
                                    <span className="text-white/20">|</span>
                                    <span>Formato: {item.proof.format}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Resultados / Efeitos */}
                    <section className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12">
                        <aside>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black bg-slate-50 px-3 py-2 border-l-2 border-black inline-block">
                                Efeito Percebido
                            </h2>
                        </aside>
                        <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 flex flex-col justify-center gap-6">
                            <p className="text-3xl font-black text-slate-900 leading-tight">
                                {item.result}
                            </p>
                            <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                                <div className="p-3 bg-slate-800 rounded-xl text-white">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Tipo de Evidência</p>
                                    <p className="text-sm font-bold text-slate-600">{item.evidence}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="mt-28 p-12 rounded-[3rem] bg-accent text-white text-center shadow-2xl shadow-accent/20">
                    <h2 className="text-4xl font-black mb-6 italic">&quot;Vamos desenhar o próximo capítulo?&quot;</h2>
                    <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                        Se sua marca precisa de autoridade visual, memória afetiva ou fluidez narrativa, vamos conversar sobre sua pauta.
                    </p>
                    <Link
                        href="/#contato"
                        className="inline-block px-12 py-5 rounded-full bg-black text-white font-black uppercase text-sm tracking-widest hover:scale-105 transition-transform shadow-xl"
                    >
                        Solicitar Atendimento Expert
                    </Link>
                </section>
            </div>

            <Footer />
        </main>
    )
}
