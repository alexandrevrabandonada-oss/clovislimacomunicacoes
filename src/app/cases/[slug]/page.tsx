import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <Header />

            <div className="max-w-7xl mx-auto px-8">
                <nav className="mb-16">
                    <Link href="/cases" className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 hover:text-black transition-colors flex items-center gap-3">
                        <span className="w-4 h-px bg-black/20" />
                        Retroceder_Navegação // LIST_CASES
                    </Link>
                </nav>

                <header className="mb-24 border-b-[3px] border-black pb-16">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="max-w-full break-words bg-black text-white px-5 py-2 text-[11px] font-black uppercase tracking-[0.24em] leading-tight border-[2px] border-black">
                            {item.category}
                        </span>
                        <span className="h-[2px] w-12 bg-accent opacity-50" />
                        <span className="text-[11px] font-black text-black uppercase tracking-[0.3em] break-words leading-tight">
                            Sector::{item.sector}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-9xl font-black text-black leading-[0.85] tracking-tighter mb-8 uppercase italic">
                        {item.title}
                    </h1>
                    {item.subtitle && (
                        <p className="mb-8 max-w-5xl text-[11px] md:text-[12px] font-black uppercase tracking-[0.32em] text-black/50 leading-tight break-words">
                            {item.subtitle}
                        </p>
                    )}
                    <p className="text-2xl md:text-3xl text-black font-black italic max-w-4xl leading-tight border-l-[12px] border-accent pl-10">
                        &quot;{item.summary}&quot;
                    </p>
                    <div className="mt-12 pt-8 border-t border-black/5 flex flex-wrap items-center gap-4 md:gap-6 text-[11px] font-black text-black/40 uppercase tracking-[0.3em]">
                         <span>PROTOCOLO_CLIENTE: <span className="text-black bg-black/5 px-3 py-1 break-words">{item.client}</span></span>
                         {item.websiteUrl && (
                            <a
                                href={item.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center border-[2px] border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
                            >
                                Abrir produto vivo
                            </a>
                         )}
                    </div>
                    {item.tags && item.tags.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-3">
                            {item.tags.map((tag) => (
                                <span key={tag} className="border-[2px] border-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-black">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    {item.screenshot_url && (
                        <div className="mt-12 overflow-hidden border-[3px] border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,0.08)]">
                            <div className="flex h-8 items-center gap-2 bg-black px-4">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            </div>
                            <div className="relative aspect-[16/9] bg-white">
                                <Image
                                    src={item.screenshot_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid gap-24">
                    {/* Diagnostic section */}
                    <section className="grid lg:grid-cols-[300px_1fr] gap-12 md:gap-20">
                        <aside>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-3 h-3 bg-black animate-pulse" />
                                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-black">
                                    01. Technical_Diagnostic
                                </h2>
                            </div>
                        </aside>
                        <div className="space-y-8">
                            <p className="text-xl md:text-2xl leading-tight text-black font-bold italic border-l-4 border-black pl-8">
                                {item.diagnostic}
                            </p>
                        </div>
                    </section>

                    {/* Intervention section */}
                    <section className="grid lg:grid-cols-[300px_1fr] gap-12 md:gap-20">
                        <aside>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-3 h-3 bg-accent" />
                                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-black">
                                    02. Strategic_Intervention
                                </h2>
                            </div>
                        </aside>
                        <div className="space-y-10">
                            <div className="p-10 md:p-16 bg-black text-white border-[3px] border-black shadow-[32px_32px_0px_0px_rgba(239,68,68,1)]">
                                <p className="text-2xl md:text-3xl leading-[0.9] font-black mb-10 italic uppercase border-b border-white/10 pb-10">
                                    {item.intervention}
                                </p>
                                <p className="text-lg text-white/60 leading-tight font-bold italic max-w-2xl mb-12">
                                    {item.methodology}
                                </p>
                                <div className="flex flex-col sm:flex-row flex-wrap gap-8 text-[11px] uppercase font-black tracking-[0.3em] text-accent">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-white/20">Entregáveis::</span>
                                        <span className="text-white border border-white/20 px-3 py-1">{item.proof.deliverables}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-white/20">Protocolo_Formato::</span>
                                        <span className="text-white border border-white/20 px-3 py-1">{item.proof.format}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Impact section */}
                    <section className="grid lg:grid-cols-[300px_1fr] gap-12 md:gap-20">
                        <aside>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-3 h-3 bg-black animate-ping" />
                                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-black">
                                    03. Perceived_Impact
                                </h2>
                            </div>
                        </aside>
                        <div className="bg-white p-12 md:p-16 border-[3px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center gap-10">
                            <p className="text-4xl md:text-6xl font-black text-black leading-[0.85] tracking-tighter uppercase italic">
                                {item.impact}
                            </p>
                            <div className="flex items-center gap-6 pt-10 border-t-2 border-black/5">
                                <div className="w-16 h-16 bg-black text-accent flex items-center justify-center border-2 border-black">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black/30">Evidence_Classification</p>
                                    <p className="text-lg font-black text-black uppercase italic">{item.evidence}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {(item.portfolioSummary || (item.highlights && item.highlights.length > 0) || (item.protocol && item.protocol.length > 0)) && (
                        <section className="grid lg:grid-cols-[300px_1fr] gap-12 md:gap-20">
                            <aside>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-3 h-3 bg-accent animate-pulse" />
                                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-black">
                                        04. Operational_Protocol
                                    </h2>
                                </div>
                            </aside>
                            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                                <div className="border-[3px] border-black bg-black p-10 text-white shadow-[20px_20px_0px_0px_rgba(239,68,68,1)] md:p-12">
                                    <p className="mb-4 text-[11px] font-black uppercase tracking-[0.42em] text-accent">Portfolio_Readout</p>
                                    <p className="text-2xl md:text-3xl font-black italic uppercase leading-[0.95] tracking-tighter">
                                        {item.portfolioSummary || item.summary}
                                    </p>
                                    {item.highlights && item.highlights.length > 0 && (
                                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                            {item.highlights.map((highlight) => (
                                                <div key={highlight} className="border border-white/15 px-4 py-4 text-[10px] font-black uppercase leading-tight tracking-[0.18em] text-white/85">
                                                    {highlight}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-[3px] border-black bg-white p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] md:p-10">
                                    <p className="mb-6 text-[11px] font-black uppercase tracking-[0.42em] text-black/40">Protocolo_Técnico</p>
                                    <div className="space-y-4">
                                        {(item.protocol || []).map((protocolItem) => (
                                            <div key={protocolItem} className="flex items-start gap-3 border-b border-black/10 pb-4 last:border-b-0 last:pb-0">
                                                <span className="mt-1 h-2.5 w-2.5 shrink-0 bg-black" />
                                                <p className="text-[11px] font-black uppercase leading-tight tracking-[0.18em] text-black/75">{protocolItem}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="border-[2px] border-black px-4 py-4">
                                            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-black/35">Impact_Type</p>
                                            <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-black">{item.proof.impactType}</p>
                                        </div>
                                        <div className="border-[2px] border-black px-4 py-4">
                                            <p className="text-[9px] font-black uppercase tracking-[0.32em] text-black/35">Delivery_Mode</p>
                                            <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-black">{item.proof.format}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Technical Gallery Section */}
                {item.gallery && item.gallery.length > 0 && (
                    <section className="mt-32 pb-32 border-b-[3px] border-black">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-3 h-3 bg-accent animate-pulse" />
                            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-black">
                                04. Technical_Gallery // {item.gallery.length}_Assets
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {item.gallery.map((img, idx) => (
                                <div key={idx} className="ink-frame relative aspect-[16/10] border-[3px] border-black bg-white group overflow-hidden shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[20px_20px_0px_0px_var(--accent)] transition-all">
                                    <Image 
                                        src={img} 
                                        alt={`${item.title} Asset ${idx + 1}`} 
                                        fill 
                                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-black text-white text-[8px] font-black px-2 py-1 border border-white/20">
                                        VAR::{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 flex items-center gap-4 text-[10px] font-black text-black/40 uppercase tracking-[0.4em]">
                                REGISTRO_VISUAL: <span className="text-black italic">Capturas operacionais do produto</span>
                        </div>
                    </section>
                )}

                <section className="mt-40 p-16 md:p-24 bg-black text-white border-[4px] border-accent text-center shadow-[40px_40px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                    <div className="absolute inset-0 halftone-bg opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="relative z-10">
                        <h2 className="text-5xl md:text-8xl font-black mb-10 italic uppercase leading-[0.8] tracking-tighter">&quot;Vamos protocolar o <br/> <span className="text-accent underline decoration-white/10 underline-offset-[12px]">Próximo Capítulo?</span>&quot;</h2>
                        <p className="text-white/60 mb-12 max-w-2xl mx-auto text-xl md:text-2xl font-bold leading-tight uppercase italic tracking-tighter">
                            Se sua pauta exige autoridade visual soberana ou narrativa estratégica de impacto, o STUDIO ESBOÇO possui a capability necessária.
                        </p>
                        <Link
                            href="/#contato"
                            className="inline-block px-16 py-8 bg-accent text-white font-black uppercase text-sm tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-[16px_16px_0px_0px_rgba(255,255,255,0.1)]"
                        >
                            Solicitar Diagnóstico Expert →
                        </Link>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    )
}
