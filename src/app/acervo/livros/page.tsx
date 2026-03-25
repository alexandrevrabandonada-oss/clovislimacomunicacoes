'use client'

import Image from 'next/image'
import Link from 'next/link'
import SectionShell from '../../../components/SectionShell'
import SectionRail from '../../../components/SectionRail'
import { cases } from '../../../lib/cases'
import { useTilt } from '../../../lib/useTilt'

const bookCases = cases.filter(c => c.isBook)

function BookCard({ book }: { book: any }) {
  const tiltRef = useTilt<HTMLDivElement>(2)

  return (
    <div 
      ref={tiltRef}
      className="ink-card group bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_var(--accent)] transition-all flex flex-col h-full overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden border-b-[3px] border-black">
        <Image 
          src={book.screenshot_url || '/placeholder.png'} 
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center p-6 text-white text-[10px] font-bold uppercase tracking-widest leading-relaxed">
          <p className="text-accent mb-2">Protocolo_Metadata</p>
          <p>Autor: {book.bookMetadata.author}</p>
          <p>Cat: {book.bookMetadata.category}</p>
          <p>Pub: {book.bookMetadata.audience}</p>
          <p>Lang: {book.bookMetadata.language}</p>
          <p>Ed: {book.bookMetadata.edition}</p>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight leading-tight mb-2 group-hover:text-accent transition-colors">
            {book.title}
          </h3>
          <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest italic">
            {book.bookMetadata.type}
          </p>
        </div>
        <Link 
          href={`/acervo/${book.slug}`}
          className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2 group-hover:translate-x-1 transition-transform"
        >
          Analisar Ativo →
        </Link>
      </div>
    </div>
  )
}

function AxeBlock({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-6 border-[3px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:border-accent transition-colors">
      <h4 className="text-xs font-black uppercase tracking-widest text-accent mb-3">{title}</h4>
      <p className="text-[11px] font-bold leading-relaxed text-black/70">
        {description}
      </p>
    </div>
  )
}

export default function LivrosPage() {
  return (
    <main className="min-h-screen bg-off-white pb-32">
      {/* HERO */}
      <SectionShell className="pt-32 pb-16">
        <div className="max-w-4xl">
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-4 block">
            VERTICAL_ESTRATÉGICA :: EDITORIAL
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8 italic">
            Capas & <br/> Universos de Leitura
          </h1>
          <p className="text-xl md:text-2xl font-black leading-tight border-l-[6px] border-black pl-8 max-w-2xl opacity-80">
            Construção de capas, personagens e atmosferas visuais para literatura infantil, infantojuvenil e projetos editoriais de leitura.
          </p>
          <div className="mt-12 flex flex-wrap gap-6">
            <Link href="#biblioteca" className="ink-button bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest">
              Analisar Projetos
            </Link>
            <Link href="#biblioteca" className="ink-button bg-white text-black border-[3px] border-black px-8 py-4 text-xs font-black uppercase tracking-widest">
              Ver Biblioteca
            </Link>
          </div>
        </div>
      </SectionShell>

      {/* DESTAQUES CURADOS */}
      <SectionShell id="destaques">
        <div className="mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Seleção Curada</h2>
          <p className="text-sm font-bold text-black/50 uppercase tracking-widest">Obras de alta tração visual e impacto editorial.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {bookCases.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </SectionShell>

      {/* EIXOS DE ATUAÇÃO */}
      <SectionShell>
        <div className="mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">Eixos de Atuação</h2>
          <p className="text-sm font-bold text-black/50 uppercase tracking-widest">Especializações técnicas em frentes editoriais específicas.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AxeBlock 
            title="Literatura Infantil" 
            description="Personagens carismáticos e paletas narrativas focadas na primeira infância e letramento."
          />
          <AxeBlock 
            title="Educação & Inclusão" 
            description="Projetos visuais que traduzem temas complexos e inclusivos em pontes de compreensão cognitiva."
          />
          <AxeBlock 
            title="Projetos Bilíngues" 
            description="Estética global preparada para licenciamento internacional (Inglês/Português) em múltiplos mercados."
          />
          <AxeBlock 
            title="Infantojuvenil" 
            description="Atmosferas imersivas, fantasia e construção de mundos para leitores em fase de transição."
          />
        </div>
      </SectionShell>

      {/* PROCESSO EDITORIAL */}
      <SectionShell className="bg-black text-white py-24" noPadding>
        <div className="max-w-7xl mx-auto px-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 italic">
            Protocolo de <br/> Produção Editorial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { step: '01', title: 'Briefing Editorial', desc: 'Análise do texto e objetivos pedagógicos/comerciais.' },
              { step: '02', title: 'Arquitetura Visual', desc: 'Concepção de personagens, capas e moodboards.' },
              { step: '03', title: 'Execução Técnica', desc: 'Ilustração em alta densidade e preparação de arquivos.' },
              { step: '04', title: 'Checkout & Entrega', desc: 'Otimização para impressão (CMYK) e formatos digitais.' }
            ].map((item) => (
              <div key={item.step} className="border-l-2 border-accent pl-6 group">
                <span className="text-accent font-black text-xs block mb-2">{item.step}</span>
                <h4 className="text-lg font-black uppercase tracking-tight mb-3 group-hover:text-accent transition-colors">{item.title}</h4>
                <p className="text-xs font-bold text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* CTA FINAL */}
      <SectionShell className="py-32">
        <div className="p-16 border-[8px] border-black bg-white shadow-[20px_20px_0px_0px_var(--accent)] text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic">
            Tem um livro, coleção ou projeto de leitura?
          </h2>
          <p className="text-xl font-bold text-black/60 mb-12 max-w-2xl mx-auto uppercase">
            Vamos transformar o texto em presença visual soberana.
          </p>
          <Link href="/contato" className="ink-button bg-black text-white px-12 py-6 text-sm font-black uppercase tracking-widest inline-block">
            Iniciar Projeto Editorial
          </Link>
        </div>
      </SectionShell>
    </main>
  )
}
