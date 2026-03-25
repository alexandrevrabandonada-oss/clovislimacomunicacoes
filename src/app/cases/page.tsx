import Link from 'next/link'
import Image from 'next/image'
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
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <Header />

            <div className="max-w-7xl mx-auto px-8">
                <header className="mb-20 border-b-[3px] border-black pb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="w-3 h-3 bg-accent animate-pulse" />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-black">Technical_Registry // Cases_&_Impact</p>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-black leading-[0.85] tracking-tighter uppercase italic">
                        Cases e <br/> <span className="text-accent underline decoration-black/10 underline-offset-[12px]">Resultados Técnicos</span>
                    </h1>
                    <p className="mt-10 text-2xl md:text-3xl text-black font-black italic max-w-3xl leading-tight border-l-[12px] border-black pl-10">
                        Análise quirúrgica de como a narrativa visual soberana e o design de autoridade convertem desafios complexos em ativos de valor real.
                    </p>
                </header>

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {cases.map((item) => (
                        <article 
                            key={item.slug} 
                            className="ink-card p-0 border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[24px_24px_0px_0px_var(--accent)] transition-all flex flex-col group bg-white relative overflow-hidden"
                        >
                            {/* Category Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] border-2 border-black">
                                    {item.category}
                                </span>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                {/* Case Screenshot Thumbnail */}
                                {item.screenshot_url && (
                                    <div className="mb-10 relative aspect-video border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-[12px_12px_0px_0px_var(--accent)] transition-all duration-500 overflow-hidden bg-white">
                                        <div className="absolute top-0 inset-x-0 h-6 bg-black flex items-center px-3 gap-1.5 z-20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <Image 
                                            src={item.screenshot_url} 
                                            alt={item.title} 
                                            fill 
                                            className="object-cover object-top pt-6"
                                        />
                                    </div>
                                )}

                                <header className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="w-2 h-2 bg-accent animate-pulse" />
                                        <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em]">
                                            Sector::{item.sector}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-black mb-4 leading-none group-hover:text-accent transition-colors italic uppercase tracking-tighter">
                                        &quot;{item.title}&quot;
                                    </h2>
                                    <p className="text-[11px] font-black text-black/20 uppercase tracking-[0.5em] border-l-2 border-black/10 pl-4">
                                        ID::{item.client}
                                    </p>
                                </header>

                                <div className="space-y-8 text-sm text-black flex-grow">
                                    <section className="relative pl-6 border-l-[4px] border-black/5">
                                        <p className="text-[10px] font-black uppercase text-black/30 tracking-[0.4em] mb-3">Diagnostic_Context</p>
                                        <p className="leading-tight font-black italic line-clamp-3 uppercase tracking-tighter">
                                            {item.diagnostic}
                                        </p>
                                    </section>

                                    <section className="p-6 bg-black text-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
                                        <p className="text-[10px] font-black uppercase text-accent tracking-[0.5em] mb-4">Strategic_Impact</p>
                                        <p className="text-lg font-black leading-tight mb-6 italic uppercase tracking-tighter">
                                            {item.impact}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                            <span className="text-[9px] font-black uppercase text-white tracking-[0.4em]">
                                                Evidence::{item.evidence.split(' ')[0]}
                                            </span>
                                            <div className="flex gap-1.5">
                                                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-accent" />)}
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-12">
                                    <Link 
                                        href={`/cases/${item.slug}`}
                                        className="ink-button block w-full text-center py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] border-[3px] border-black hover:bg-accent transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,0.2)]"
                                    >
                                        Analisar Case Completo →
                                    </Link>
                                    <p className="mt-6 text-center text-[10px] font-black text-black/40 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity">
                                        Metodologia // {item.methodology.split(':')[0]}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <section className="mt-40 p-16 md:p-24 bg-black text-white border-[4px] border-accent text-center shadow-[40px_40px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                    <div className="absolute inset-0 halftone-bg opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-black mb-10 italic uppercase leading-[0.8] tracking-tighter">Seu desafio pode ser o <br/> <span className="text-accent underline decoration-white/10 underline-offset-[12px]">Próximo Registro Técnica?</span></h2>
                        <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto font-black italic uppercase leading-tight tracking-tighter">
                            Inicie um diagnóstico de viabilidade para converter sua pauta estratégica em autoridade visual soberana.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-8">
                            <Link
                                href="/#contato"
                                className="px-16 py-8 bg-accent text-white font-black uppercase text-xs tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-[16px_16px_0px_0px_rgba(255,255,255,0.1)]"
                            >
                                Protocolar Diagnóstico
                            </Link>
                            <Link
                                href="/#servicos"
                                className="px-16 py-8 border-[3px] border-white bg-transparent text-white font-black uppercase text-xs tracking-[0.5em] hover:bg-white hover:text-black transition-all"
                            >
                                Listar Capabilities
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    )
}
