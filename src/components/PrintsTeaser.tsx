
"use client";

export default function PrintsTeaser() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-4">
      <div className="space-y-6">
        <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none italic">
          O Acervo como <br/> <span className="hero-ink-underline">Ativo Estratégico</span>
        </h3>
        <p className="text-lg text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6 max-w-lg">
          Transformamos narrativas visuais autorais em ativos para marcas e coleções. Prints fine-art assinados e licenciamento técnico para pautas de alto impacto.
        </p>
      </div>
      
      <div className="ink-card bg-slate-900 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
           <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Trilha de Licenciamento:</p>
          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-sm font-bold tracking-tight">Cessão Editorial para Veículos e Portais</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-sm font-bold tracking-tight">Prints Assinados em Papel Algodão (Fine-Art)</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-sm font-bold tracking-tight">Direito de Uso para Campanhas Institucionais</span>
            </li>
          </ul>
          <a 
            href="#contato"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl"
          >
            Consultar Disponibilidade de Obra →
          </a>
        </div>
      </div>
    </div>
  );
}
