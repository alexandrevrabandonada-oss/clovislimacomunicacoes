'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cases, Case } from '../lib/cases'
import { useTilt } from '../lib/useTilt'

export default function EditorialTeaser() {
  const flagshipBook = cases.find((c: Case) => c.slug === 'mequinho-fundo-poco')
  const otherBooks = cases.filter((c: Case) => c.isBook && c.slug !== 'mequinho-fundo-poco').slice(0, 3)
  const tiltRef = useTilt<HTMLDivElement>(2)

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
        <div className="max-w-2xl">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-4 block">
            VERTICAL_ESTRATÉGICA :: EDITORIAL
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8 italic">
            Livros & Ilustração <br/> Editorial
          </h2>
          <p className="text-lg md:text-xl font-black leading-tight border-l-[6px] border-black pl-8 opacity-80 mb-10">
            Capas, universos visuais, reedições e ilustração editorial aplicada a livros infantis, juvenis e projetos autorais.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/acervo/livros" className="ink-button bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_var(--accent)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Explorar Biblioteca Publicada
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-stretch">
        {/* FLAGSHIP HIGHLIGHT */}
        {flagshipBook && (
          <div 
            ref={tiltRef}
            className="group relative bg-white border-[3px] border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_var(--accent)] transition-all flex flex-col md:flex-row gap-10 items-center overflow-hidden"
          >
            <div className="w-full md:w-1/2 aspect-[3/4] relative shadow-2xl border-[3px] border-black group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden bg-slate-50">
                <Image 
                    src={flagshipBook.screenshot_url || ''} 
                    alt={flagshipBook.title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1 space-y-6">
               <div className="inline-block px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest">Flagship_Case</div>
               <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">{flagshipBook.title}</h3>
               <p className="text-xs font-bold text-black/60 leading-relaxed uppercase">
                {flagshipBook.summary}
               </p>
               <div className="pt-6 border-t border-black/10 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Status_Publicação</span>
                     <span className="text-xs font-black uppercase">{flagshipBook.bookMetadata?.edition} {'//'} {flagshipBook.bookMetadata?.author}</span>
               </div>
               <Link href={`/acervo/${flagshipBook.slug}`} className="text-xs font-black uppercase tracking-widest text-accent flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Analisar Ativo Editorial →
               </Link>
            </div>
          </div>
        )}

        {/* CURIATED LIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
          {otherBooks.map((book: Case) => (
            <Link 
                key={book.slug} 
                href={`/acervo/${book.slug}`}
                className="group flex gap-6 p-4 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[10px_10px_0px_0px_var(--accent)] transition-all items-center"
            >
                <div className="h-20 w-16 relative flex-shrink-0 border-2 border-black overflow-hidden bg-slate-50 shadow-md group-hover:scale-105 transition-transform">
                    <Image 
                        src={book.screenshot_url || ''} 
                        alt={book.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                     <span className="text-[8px] font-black uppercase tracking-widest text-accent mb-1 block">{book.bookMetadata?.category}</span>
                     <h4 className="text-sm font-black uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">{book.title}</h4>
                </div>
            </Link>
          ))}
          <Link 
            href="/acervo/livros" 
            className="flex items-center justify-center p-6 border-[3px] border-black border-dashed opacity-50 hover:opacity-100 hover:border-accent hover:text-accent font-black uppercase text-xs tracking-widest transition-all"
          >
            + Ver Catálogo Completo
          </Link>
        </div>
      </div>
    </div>
  )
}
