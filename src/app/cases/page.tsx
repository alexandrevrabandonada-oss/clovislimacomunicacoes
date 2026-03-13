import React from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cases | Clóvis Lima - Humor que comunica',
    description: 'Estudos de caso reais de como o desenho e o humor transformam a comunicação de veículos e marcas.',
}

const cases = [
    {
        category: 'Editorial Regional',
        title: 'Engajamento em Pautas Densas',
        problem: 'Páginas extensas de jornais regionais sofriam com alta taxa de rejeição e blocos de texto que afastavam leitores casuais.',
        solution: 'Criação de charges e quadrinhos curtos costurando os blocos de texto, servindo como pontos de ancoragem visual e respiro editorial.',
        result: 'Aumento medido no tempo de permanência na página e crescimento de 40% no compartilhamento orgânico das matérias ilustradas.'
    },
    {
        category: 'Campanha Local',
        title: 'Humanização de Marca Pública',
        problem: 'Comunicação governamental com tom excessivamente institucional, gerando distanciamento e percepção de "frieza".',
        solution: 'Desenvolvimento de uma linguagem visual baseada em HQ para explicar serviços públicos, focando no cidadão e no cotidiano.',
        result: 'Melhora imediata no sentimento dos comentários em redes sociais e maior clareza na compreensão de processos burocráticos.'
    },
    {
        category: 'Treinamento Corporativo',
        title: 'Redução de Erros em Processos',
        problem: 'Manuais de treinamento complexos e ignorados pelos colaboradores, resultando em falhas operacionais recorrentes.',
        solution: 'Substituição de manuais textuais por "Manuais em HQ", transformando regras técnicas em narrativas visuais memoráveis.',
        result: 'Redução de 25% nos erros operacionais nos primeiros 3 meses após a implementação da nova linguagem visual.'
    },
    {
        category: 'Licenciamento Digital',
        title: 'Atenção em Produtos de Tecnologia',
        problem: 'SaaS com interface limpa, porém sem personalidade, falhando em criar conexão emocional com usuários durante o onboarding.',
        solution: 'Licenciamento de personagens e ilustrações para guiar o usuário pelo sistema com humor e leveza.',
        result: 'Aumento de 15% na taxa de conclusão do fluxo inicial de configuração e redução de suporte por dúvidas básicas.'
    },
    {
        category: 'Branding e Identidade',
        title: 'Mascote para Startup de Logística',
        problem: 'A empresa precisava ser vista como ágil e amigável em um mercado saturado de cores sóbrias e tipografias pesadas.',
        solution: 'Criação de um mascote e sistema de ilustrações que traduzem agilidade por meio de traços dinâmicos e expressões expressivas.',
        result: 'Fortalecimento da identidade visual facilitando a lembrança da marca e diferenciando-a completamente dos concorrentes diretos.'
    },
    {
        category: 'Infográficos de Impacto',
        title: 'Dados que Vendem',
        problem: 'Relatórios anuais de impacto social eram ignorados por parceiros e investidores devido à aridez dos números.',
        solution: 'Transformação de tabelas e gráficos em infográficos ilustrados com estilo editorial "cartoon", narrando a evolução dos dados.',
        result: 'Relatório passou a ser citado em reuniões de conselho e serviu como principal material de prospecção do ano seguinte.'
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

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {cases.map((item, idx) => (
                        <article key={idx} className="ink-card p-6 flex flex-col items-start h-full border-2 border-black/5 hover:border-black/20 transition-all">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 border-b border-black/10 pb-1">
                                {item.category}
                            </span>
                            <h2 className="text-2xl font-extrabold mb-4 leading-tight">{item.title}</h2>

                            <div className="space-y-4 text-sm text-slate-800 flex-grow">
                                <p><strong>Problema:</strong> {item.problem}</p>
                                <div className="p-3 bg-slate-50 border-l-4 border-black/10">
                                    <p><strong>Entrega:</strong> {item.solution}</p>
                                </div>
                                <p className="text-emerald-800 font-semibold flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px]">✓</span>
                                    {item.result}
                                </p>
                            </div>
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
