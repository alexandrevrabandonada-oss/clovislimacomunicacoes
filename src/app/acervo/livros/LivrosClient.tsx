'use client'

import Image from 'next/image'
import Link from 'next/link'
import SectionShell from '../../../components/SectionShell'
import { cases, Case } from '../../../lib/cases'
import { useTilt } from '../../../lib/useTilt'

const bookCases = cases.filter(c => c.isBook)
const flagship = cases.find(c => c.slug === 'mequinho-fundo-poco')

function BookCard({ book }: { book: Case }) {
  const tiltRef = useTilt<HTMLDivElement>(2)

  return (
    <div 
      ref={tiltRef}
      className="group bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_var(--accent)] transition-all flex flex-col h-full overflow-hidden"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-50 border-b-[3px] border-black scale-[0.98] group-hover:scale-100 transition-transform duration-500 origin-bottom">
        <Image 
          src={book.screenshot_url || '/placeholder.png'} 
          alt={book.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white text-[9px] font-black uppercase tracking-widest leading-relaxed">
          <div className="mb-4">
            <span className="text-accent underline block mb-2">Técnico_Metadata</span>
            <p>Autor: {book.bookMetadata?.author}</p>
            <p>Público: {book.bookMetadata?.audience}</p>
            <p>Edição: {book.bookMetadata?.edition}</p>
          </div>
          <Link href={`/acervo/${book.slug}`} className="bg-accent text-black px-4 py-2 text-center hover:bg-white transition-colors">
            Analisar Projeto
          </Link>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="text-[13px] font-black uppercase tracking-tight leading-none mb-3 group-hover:text-accent transition-colors">
          {book.title}
        </h3>
        <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em]">
          {book.bookMetadata?.category}
        </span>
      </div>
    </div>
  )
}

function DiagnosisCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
        <div className="p-8 border-[3px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[12px_12px_0px_0px_var(--accent)] transition-all">
            <div className="text-3xl mb-6">{icon}</div>
            <h4 className="text-lg font-black uppercase tracking-tighter mb-4 italic italic-bold">{title}</h4>
            <p className="text-xs font-bold leading-tight uppercase opacity-60">{desc}</p>
        </div>
    )
}

export default function LivrosClient() {
  return (
    <main className="min-h-screen bg-off-white pb-32">
      {/* 1. HERO COMERCIAL / EDITORIAL */}
      <SectionShell className="pt-32 pb-20 border-b-[3px] border-black bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <span className="h-[3px] w-12 bg-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black">DIREÇÃO_EDITORIAL</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                    Capas, Personagens <br/> & Universos <br/> <span className="text-accent">de Leitura</span>
                </h1>
                <p className="text-xl md:text-2xl font-black leading-[1.1] border-l-[8px] border-black pl-8 max-w-xl opacity-80 uppercase tracking-tighter">
                   Construção de presença visual para livros infantis, juvenis, bilingues e projetos de impacto editorial.
                </p>
                <div className="flex flex-wrap gap-6 items-center">
                    <Link href="#catalogo" className="ink-button bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_var(--accent)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                        Explorar Catálogo
                    </Link>
                    <Link href="/contato" className="text-xs font-black uppercase tracking-widest underline decoration-accent decoration-[3px] underline-offset-8 hover:text-accent transition-all">
                        Iniciar Trilha Editorial →
                    </Link>
                </div>
            </div>
            
            {/* FLAGSHIP PREVIEW */}
            {flagship && (
                <div className="relative group">
                    <div className="absolute inset-0 bg-accent translate-x-6 translate-y-6 -z-10 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]" />
                    <div className="bg-white border-[3px] border-black p-4 md:p-10 shadow-lg flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4] shadow-2xl border-[3px] border-black overflow-hidden mb-8">
                            <Image 
                                src={flagship.screenshot_url || ''} 
                                alt={flagship.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center w-full">
                            <span className="text-[9px] font-black uppercase opacity-40 block mb-2">Flagship_Case_Current</span>
                            <h2 className="text-xl font-black uppercase tracking-tight leading-none mb-4 italic">{flagship.title}</h2>
                            <Link href={`/acervo/${flagship.slug}`} className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Análise Técnica do Projeto →</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </SectionShell>

      {/* 2. EIXOS E CATEGORIAS */}
      <SectionShell className="py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-6 italic">Arquitetura Editorial <br/> de Impacto</h2>
                <p className="text-sm font-bold opacity-60 uppercase leading-relaxed">Não é sobre &quot;fazer uma capa&quot;. É sobre construir a porta de entrada para um universo de leitura capaz de converter atenção em adesão literária.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-black text-white">
                    <span className="text-xl font-black block leading-none italic">+15</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Títulos Publicados</span>
                </div>
                <div className="p-4 border-[3px] border-black">
                    <span className="text-xl font-black block leading-none italic">100%</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Direção Autoral</span>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DiagnosisCard 
                icon="🎨"
                title="Capa Infantil"
                desc="Cores vibrantes, hierarquia clara e apelido visual imediato para a primeira infância."
            />
            <DiagnosisCard 
                icon="👤"
                title="Personagem IP"
                desc="Identidades proprietárias curadas para sustentar séries e coleções literárias."
            />
            <DiagnosisCard 
                icon="🌍"
                title="Projetos Bilingues"
                desc="Direção de arte preparada para o mercado global sem perda de identidade autoral."
            />
            <DiagnosisCard 
                icon="🔄"
                title="Reedição Visual"
                desc="Revitalização de obras clássicas para ganho de presença em novas frentes comerciais."
            />
        </div>
      </SectionShell>

      {/* 3. O CATÁLOGO / BIBLIOTECA */}
      <SectionShell id="catalogo" className="bg-slate-100 py-24 border-y-[3px] border-black">
        <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
                <div className="h-6 w-6 bg-accent border-[2px] border-black" />
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Biblioteca Digital Publicada</h2>
            </div>
            <span className="hidden md:block text-[10px] font-black uppercase tracking-widest opacity-40">Seed_Data_Registry v2.0</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-10">
          {bookCases.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
          {/* PLACEHOLDER PRA MANTER GRID DENSOS CASO PRECISE */}
          <div className="border-[3px] border-black border-dashed flex items-center justify-center p-8 opacity-20 hover:opacity-100 hover:border-accent hover:text-accent transition-all cursor-pointer">
             <span className="text-[10px] font-black uppercase text-center tracking-widest">Envia seu Original <br/> para Consultoria Visual</span>
          </div>
        </div>
      </SectionShell>

      {/* 4. DIAGNÓSTICOS DE IMPACTO */}
      <SectionShell className="py-24">
        <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic italic-bold">Protocolos de Impacto</h2>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest">A ilustração editorial como solução de problemas críticos do mercado de livros.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group relative bg-white border-[3px] border-black p-10 hover:shadow-[16px_16px_0px_0px_var(--accent)] transition-all">
                <span className="text-xs font-black text-accent block mb-4 italic">Caso_Técnico {"//"} Conversão de Capa</span>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Transformando Concept em Presença Comercial</h3>
                <p className="text-xs font-bold leading-relaxed uppercase opacity-80 mb-8 max-w-lg">
                    O desafio de capas infantis é equilibrar a linguagem lúdica para a criança com a autoridade técnica para o comprador (pais/escola). Nossos diagnósticos focam em legibilidade de título e saturação estratégica para o PDV digital ou físico.
                </p>
                <div className="h-1 bg-black/10 w-full mb-8" />
                <ul className="text-[10px] font-black uppercase tracking-widest space-y-3">
                    <li className="flex items-center gap-3">✓ Alto Contraste de Background</li>
                    <li className="flex items-center gap-3">✓ Hierarquia Tipográfica Dominante</li>
                    <li className="flex items-center gap-3">✓ Centralização de Personagem IP</li>
                </ul>
            </div>
            <div className="group relative bg-black text-white border-[3px] border-black p-10 hover:shadow-[16px_16px_0px_0px_var(--accent)] transition-all">
                <span className="text-xs font-black text-accent block mb-4 italic">Estratégia {"//"} World Building</span>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Construção de Universos para Coleções</h3>
                <p className="text-xs font-bold leading-relaxed uppercase opacity-80 mb-8 max-w-lg">
                    Para editoras que buscam serialização, o estúdio entrega não apenas uma ilustração, mas um Guia de Estilo Editorial. Isso garante que o Volume 1 e o Volume 10 possuam a mesma coerência cromática e estrutural, reduzindo custos de direção de arte futuros.
                </p>
                <div className="h-1 bg-white/10 w-full mb-8" />
                <ul className="text-[10px] font-black uppercase tracking-widest space-y-3">
                    <li className="flex items-center gap-3 text-accent transition-colors">✓ Paletas Próprias por Título</li>
                    <li className="flex items-center gap-3">✓ Guia de Traço e Proporção</li>
                    <li className="flex items-center gap-3">✓ Escalabilidade em Mídias Ativas</li>
                </ul>
            </div>
        </div>
      </SectionShell>

      {/* 5. FAQ ESPECÍFICO */}
      <SectionShell className="py-24 bg-white border-t-[3px] border-black">
        <div className="mb-16 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic italic-bold">Perguntas Técnicas</h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
            {[
                { q: "Qual o prazo médio para uma capa de livro?", a: "Para o ciclo completo (Briefing > Rafe > Finalização), trabalhamos com uma janela de 10 a 15 dias úteis, dependendo da complexidade do universo visual." },
                { q: "Vocês fazem o projeto gráfico completo ou só a capa?", a: "Atuamos tanto na Direção de Arte da capa quanto no suporte para intervenções internas e diagramação técnica em parceria com designers editoriais." },
                { q: "O estúdio trabalha com licenciamento de personagens existentes?", a: "Sim. Podemos revitalizar personagens para novas edições ou desenvolver novos IPs do zero com cessão total de direitos comerciais." }
            ].map((faq, index) => (
                <div key={index} className="p-8 border-[3px] border-black bg-slate-50 relative">
                    <span className="absolute -top-4 -left-4 w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs">?</span>
                    <h4 className="text-lg font-black uppercase tracking-tighter mb-4 italic italic-bold">{faq.q}</h4>
                    <p className="text-xs font-bold uppercase opacity-60 leading-relaxed">{faq.a}</p>
                </div>
            ))}
        </div>
      </SectionShell>

      {/* CTA FINAL */}
      <SectionShell className="py-32">
        <div className="p-16 border-[10px] border-black bg-white shadow-[24px_24px_0px_0px_var(--accent)] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl italic">EDITORIAL</div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic italic-bold z-10 relative">
            Inicie seu <br/> Atendimento Editorial
          </h2>
          <p className="text-xl font-black text-black/60 mb-12 max-w-2xl mx-auto uppercase tracking-tighter z-10 relative">
            Seja autor independente ou editora, entregamos o rigor visual que sua obra exige para performar no mercado.
          </p>
          <div className="flex justify-center gap-6 z-10 relative">
            <Link href="/contato" className="ink-button bg-black text-white px-12 py-6 text-sm font-black uppercase tracking-widest inline-block shadow-lg hover:translate-y-[-4px] transition-all">
                Iniciar Protocolo
            </Link>
          </div>
        </div>
      </SectionShell>
    </main>
  )
}
