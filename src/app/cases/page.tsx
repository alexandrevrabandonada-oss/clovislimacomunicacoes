import React from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Metadata } from 'next'
import { cases } from '../../lib/cases'

const title = 'Cases de Sucesso | ESBOÇO criação & arte'
const description = 'Como transformamos desafios de comunicação em resultados reais através de estratégia visual e design.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/cases'
  },
  openGraph: {
    type: 'website',
    url: '/cases',
    title,
    description,
    images: [{ url: '/og-cases.png', width: 1200, height: 630, alt: 'Cases ESBOÇO' }]
  }
}

export default function CasesPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 bg-white">
            <Header />

            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-4 w-1 bg-slate-300 rounded-full" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Estratégia e Efeito</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black">
                        Casos e <span className="stamp ml-2">Resultado</span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-700 max-w-2xl leading-relaxed font-serif italic">
                        Análise de como a narrativa visual e o design estratégico resolvem desafios de clareza, retenção e autoridade.
                    </p>
                </header>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {cases.map((item) => (
                        <article 
                            key={item.slug} 
                            className="ink-card p-0 overflow-hidden flex flex-col group hover:border-black/20 transition-all relative"
                        >
                            {/* Category Badge */}
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-black text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-sm">
                                    {item.category}
                                </span>
                            </div>

                            <div className="p-8 flex flex-col flex-grow bg-white">
                                <header className="mt-4 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            Sector: {item.sector}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black mb-2 leading-tight group-hover:text-accent transition-colors italic">
                                        &quot;{item.title}&quot;
                                    </h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        ID: {item.client}
                                    </p>
                                </header>

                                <div className="space-y-6 text-sm text-slate-700 flex-grow">
                                    <section className="relative pl-4 border-l-2 border-slate-100">
                                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1.5">Contexto & Desafio</p>
                                        <p className="leading-relaxed font-medium line-clamp-3 italic">
                                            {item.problem}
                                        </p>
                                    </section>

                                    <section className="p-4 bg-slate-50 border border-black/5 rounded-2xl">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Intervenção Técnica</p>
                                        <p className="text-slate-800 font-bold leading-tight mb-3">
                                            {item.result}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-black uppercase text-accent tracking-widest">
                                                {item.evidence}
                                            </span>
                                            <div className="flex gap-0.5">
                                                {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-slate-300 rounded-full" />)}
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-8 pt-6 border-t border-black/5">
                                    <Link 
                                        href={`/cases/${item.slug}`}
                                        className="ink-button block w-full text-center py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full group-hover:bg-accent transition-all"
                                    >
                                        Analisar Case Completo →
                                    </Link>
                                    <p className="mt-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Metodologia: {item.methodology.split(':')[0]}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <section className="mt-24 p-12 rounded-[2.5rem] bg-slate-50 border-2 border-black/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4">Pronto para ser nosso próximo case?</h2>
                        <p className="text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                            Vamos desenhar a solução ideal para o seu desafio de comunicação. Atendimento consultivo e estratégico.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/#contato"
                                className="px-10 py-4 rounded-full bg-accent text-white font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg shadow-accent/20"
                            >
                                Iniciar Briefing
                            </Link>
                            <Link
                                href="/#servicos"
                                className="px-10 py-4 rounded-full border-2 border-black bg-white font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-colors"
                            >
                                Ver Soluções
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    )
}
