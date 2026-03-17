import React from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Metadata } from 'next'

const title = 'Cases de Sucesso | ESBOÇO criação & arte - Humor que comunica'
const description = 'Estudos de caso reais de como o desenho e o humor transformam a comunicação de veículos e marcas.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/cases'
  },
  openGraph: {
    type: 'article',
    url: '/cases',
    title,
    description,
    images: [{ url: '/og-cases.png', width: 1200, height: 630, alt: 'Cases ESBOÇO' }]
  }
}

const cases = [
    {
        slug: 'jornalismo-nsc',
        category: 'Charges / Editorial',
        client: 'NSC Comunicação (SC) / G1 SC',
        sector: 'Veículos de Mídia',
        title: 'O Fim da Rejeição Silenciosa',
        problem: 'Páginas especiais e editoriais de política sofriam com alta taxa de rejeição silenciosa: o leitor iniciava, mas abandonava devido à densidade dos blocos de texto.',
        abordagem: 'Inclusão estratégica de "respiros cognitivos" via charges que traduzem dados em narrativa visual, mantendo o interesse ativo entre os parágrafos.',
        solution: 'Implementação de uma narrativa paralela via charges e quadrinhos integrados ao "corpo" da matéria. A ilustração traduz conceitos complexos em 3 segundos.',
        result: 'Crescimento comprovado de 40% no compartilhamento orgânico e aumento medido no tempo médio de permanência na página.',
        methodology: 'A ilustração editorial funciona como um gatilho de dopamina visual, permitindo ao leitor retomar o foco no texto após uma pausa engajadora.',
        proof: {
            deliverables: 'Série de 12 charges especiais para pauta econômica',
            format: 'SVG para Digital / Vetorial para Impresso',
            impactType: 'Retenção e Engajamento de Audiência'
        }
    },
    {
        slug: 'comunicacao-publica',
        category: 'Charges / Editorial',
        client: 'Prefeituras e Órgãos Públicos',
        sector: 'Gestão Pública',
        title: 'Humanização que Gera Acesso',
        problem: 'Campanhas de serviços públicos com tom excessivamente institucional, gerando distanciamento e sobrecarga nos canais de suporte técnico/presencial.',
        abordagem: 'Substituição da "voz burocrática" por uma linguagem de HQ amigável, onde personagens personificam as dúvidas reais do munícipe médio.',
        solution: 'Desenvolvimento de uma linguagem baseada em HQ. O humor é usado para desmitificar processos complexos e reduzir a fricção emocional do cidadão.',
        result: 'Redução imediata em 30% nas dúvidas básicas recebidas via SAC e melhora qualitativa no sentimento dos comentários nas redes sociais.',
        methodology: 'A "personificação" da burocracia rompe a barreira da autoridade fria e estabelece uma ponte de confiança direta com o cidadão.',
        proof: {
            deliverables: 'Campanha visual completa: 06 guias em HQ + cards sociais',
            format: 'Impresso (Flyers) e Social Media',
            impactType: 'Clareza de Processo e Percepção de Valor'
        }
    },
    {
        slug: 'tech-licensing',
        category: 'Sites / PWA',
        client: 'SaaS e Startups de Tecnologia',
        sector: 'Tecnologia',
        title: 'Conexão em Ambientes Frios',
        problem: 'Interfaces de software extremamente limpas que falhavam em criar conexão emocional no onboarding, gerando desistência em fluxos cruciais de setup.',
        abordagem: 'Uso de ilustrações lúdicas e mascotes personalizados para guiar o usuário pelos estados de erro e sucesso, humanizando a marca técnica.',
        solution: 'Licenciamento de sistema de ilustrações que guiam o usuário pelas etapas de configuração com mensagens de incentivo e humor pontual.',
        result: 'Aumento de 15% na taxa de ativação (activation rate) e redução de suporte relacionado a processos mal compreendidos pelo usuário.',
        methodology: 'O cérebro processa imagens lúdicas como sinais de segurança, reduzindo a ansiedade do usuário diante de novas tecnologias.',
        proof: {
            deliverables: 'Livraria de +40 estados de ilustração (PNG/SVG)',
            format: 'Componentes React optimizados',
            impactType: 'Conversão em Funil e LTV'
        }
    }
]

export default function CasesPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 bg-white">
            <Header />

            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-black">
                        Cases <span className="stamp ml-2">Sucesso</span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-700 max-w-2xl leading-relaxed">
                        Como transformamos informações complexas, pautas difíceis e processos áridos em comunicação que engaja e converte.
                    </p>
                </header>

                <div className="grid gap-12 lg:grid-cols-1">
                    {cases.map((item, idx) => (
                        <article 
                            key={idx} 
                            id={`case-${item.slug}`}
                            className="ink-card p-0 overflow-hidden grid lg:grid-cols-[1fr_320px] items-stretch min-h-[400px]"
                        >
                            <div className="p-8 md:p-12 space-y-6">
                                <header>
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className="rounded bg-black text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {item.sector}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold mb-1 leading-tight">{item.title}</h2>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter italic">Cliente: {item.client}</p>
                                </header>

                                <div className="grid md:grid-cols-2 gap-8 text-slate-800">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">O Problema</p>
                                            <p className="text-base leading-relaxed">{item.problem}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Estratégia e Entrega</p>
                                            <p className="text-base leading-relaxed font-medium">{item.solution}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">Resultado Observado</p>
                                            <p className="text-lg font-bold text-emerald-900 leading-tight">{item.result}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Observação Metodológica</p>
                                            <p className="text-sm italic text-slate-600">{item.methodology}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <aside className="bg-slate-50 p-8 border-l border-black/5 flex flex-col justify-center">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-1 w-6 bg-black"></div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Bloco de Prova</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1">Entregáveis</p>
                                        <p className="text-xs font-semibold">{item.proof.deliverables}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1">Formato</p>
                                        <p className="text-xs font-semibold">{item.proof.format}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1">Impacto Gerado</p>
                                        <div className="mt-2 flex items-center gap-2 text-emerald-700">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <p className="text-xs font-extrabold uppercase">{item.proof.impactType}</p>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </article>
                    ))}
                </div>

                <section className="mt-20 p-8 rounded-3xl bg-black text-white text-center">
                    <h2 className="text-3xl font-extrabold mb-4">Pronto para o próximo case?</h2>
                    <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                        Vamos desenhar o sucesso da sua marca ou veículo. Escolha o melhor formato e fale comigo.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/#contato?pacote=serie-especial"
                            className="px-8 py-4 rounded-full bg-accent text-white font-bold hover:scale-105 transition-transform"
                        >
                            Começar agora
                        </Link>
                        <Link
                            href="/#servicos"
                            className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-bold"
                        >
                            Ver pacotes
                        </Link>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    )
}
