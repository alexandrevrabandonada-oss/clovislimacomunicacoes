"use client"
import { useRevealOnView } from '../lib/useRevealOnView'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'

export default function MicroCases() {
    const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

    const cases = [
        {
            slug: 'jornalismo-nsc',
            title: 'O Fim da Rejeição Silenciosa',
            category: 'Charges / Editorial',
            client: 'NSC Comunicação (Santa Catarina)',
            context: 'Editorial de Grande Circulação / G1 SC',
            problem: 'Matérias densas de política e economia causavam abandono de leitura precoce.',
            abordagem: 'Inclusão de "respiros cognitivos" via charges que traduzem dados em narrativa visual.',
            entrega: 'Série de ilustrações dinâmicas integradas ao fluxo da pauta.',
            resultado: 'Aumento de 40% no compartilhamento e maior retenção média na página.',
            metric: '+40% Sharing',
            cta: 'Quero engajar minha pauta'
        },
        {
            slug: 'comunicacao-publica',
            title: 'Humanização que Gera Acesso',
            category: 'Charges / Editorial',
            client: 'Administrações Municipais',
            context: 'Campanha de Serviços Públicos',
            problem: 'Tom burocrático afastava o cidadão e sobrecarregava o suporte (SAC).',
            abordagem: 'Linguagem baseada em HQ personificando o munícipe e simplificando processos.',
            entrega: 'Guias Visuais Amigáveis e Cards para Social Media.',
            resultado: 'Redução de 30% nas dúvidas básicas e melhora no sentimento das redes.',
            metric: '-30% SAC Noise',
            cta: 'Quero humanizar minha marca'
        },
        {
            slug: 'tech-licensing',
            title: 'Conexão em Ambientes Frios',
            category: 'Sites / PWA',
            client: 'SaaS e Startups de Tecnologia',
            context: 'UI/UX & Product Design',
            problem: 'Fluxos de onboarding extremamente técnicos falhavam em reter novos usuários.',
            abordagem: 'Licenciamento de mascotes e estados lúdicos para guiar o setup com humor.',
            entrega: 'Livraria de +40 estados de ilustração (Empty states, Success).',
            resultado: 'Crescimento de 15% na taxa de ativação (onboarding completion).',
            metric: '+15% Ativação',
            cta: 'Quero uma interface que converte'
        }
    ]

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 ref={headingRef} className={`reveal-heading text-3xl font-extrabold ${revealed ? 'is-revealed' : ''}`}>
                        Provas de Resultado
                    </h2>
                    <p className="mt-2 text-slate-700 max-w-xl">
                        Estratégias onde o desenho e o humor foram ferramentas de autoridade e conversão real.
                    </p>
                </div>
                <Link href="/cases" className="text-sm font-bold border-b-2 border-black pb-1 hover:text-accent hover:border-accent transition-colors">
                    Ver reports completos →
                </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {cases.map((item) => (
                    <article key={item.slug} className="ink-card p-6 flex flex-col justify-between bg-white border-2 border-black/5 hover:border-black/20 transition-all group">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="stamp text-[10px] py-0.5 px-2 bg-slate-100 uppercase font-black tracking-widest text-slate-500">
                                    {item.category}
                                </span>
                                <span className="text-[10px] font-bold text-accent uppercase">
                                    {item.metric}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-accent transition-colors">&quot;{item.title}&quot;</h3>
                            
                            <div className="space-y-4 text-sm">
                                <section>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">O Problema</p>
                                    <p className="text-slate-700 leading-snug">{item.problem}</p>
                                </section>

                                <section>
                                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">A Abordagem</p>
                                    <p className="text-slate-700 leading-snug italic">&quot;{item.abordagem}&quot;</p>
                                </section>
                                
                                <section className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                                    <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest mb-1">Resultado Observado</p>
                                    <p className="text-emerald-900 font-bold leading-tight">{item.resultado}</p>
                                </section>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
                            <Link 
                                href={`/cases#case-${item.slug}`}
                                onClick={() => trackEvent('click_microcase_detail', { slug: item.slug })}
                                className="ink-button block w-full text-center py-2 bg-black text-white text-xs font-bold rounded-full"
                            >
                                Ver Contexto Técnico
                            </Link>
                            <Link 
                                href={`#contato?ref=case-${item.slug}`}
                                onClick={() => trackEvent('click_microcase_cta', { slug: item.slug })}
                                className="block w-full text-center text-[11px] font-bold hover:text-accent transition-colors"
                            >
                                {item.cta} →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
