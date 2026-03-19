
"use client";

export default function PrintsTeaser() {
  const productTiers = [
    {
      title: "Cessão Editorial",
      desc: "Uso imediato para veículos de mídia, portais e pautas de impacto.",
      features: ["Alta Resolução (PNG/SVG)", "Cálculo por Tiragem", "Entrega em < 24h"],
      cta: "Liberar para Pauta",
      color: "bg-slate-50"
    },
    {
      title: "Licença Institucional",
      desc: "Direito de uso para campanhas, relatórios ESG e branding de marca.",
      features: ["Uso Perpétuo/Limitado", "Exclusividade Opcional", "Manual de Aplicação"],
      cta: "Análise de Campanha",
      isFeatured: true,
      color: "bg-slate-900 text-white"
    },
    {
      title: "Coleções Fine-Art",
      desc: "Prints físicos assinados para colecionadores e acervos privados.",
      features: ["Papel Algodão 310g", "Certificado de Autenticidade", "Edições Limitadas"],
      cta: "Consultar Obra",
      color: "bg-slate-50"
    }
  ];

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productTiers.map((tier) => (
          <div 
            key={tier.title} 
            className={`ink-card p-8 flex flex-col justify-between border-[3px] border-black transition-all hover:translate-y-[-4px] hover:shadow-2xl ${tier.isFeatured ? 'shadow-xl' : ''} ${tier.color}`}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-2 py-1 border border-black/10 rounded ${tier.isFeatured ? 'bg-accent text-white border-none' : 'text-slate-400'}`}>
                  {tier.isFeatured ? 'Mais Demandado' : 'Modalidade'}
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={tier.isFeatured ? 'text-accent' : 'text-slate-300'}><path d="M12 5v14M5 12h14"/></svg>
              </div>
              
              <h4 className="text-xl font-black italic mb-4 leading-tight">{tier.title}</h4>
              <p className={`text-xs font-medium leading-relaxed mb-8 ${tier.isFeatured ? 'text-slate-400' : 'text-slate-500'}`}>
                {tier.desc}
              </p>
              
              <ul className="space-y-3 mb-10">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight">
                    <span className={`w-1 h-1 rounded-full ${tier.isFeatured ? 'bg-accent' : 'bg-black'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            
            <a 
              href="#contato"
              className={`inline-block text-center py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                tier.isFeatured 
                ? 'bg-white text-black hover:bg-accent hover:text-white' 
                : 'bg-black text-white hover:bg-accent'
              }`}
            >
              {tier.cta} →
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-slate-100 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-black/5">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Especificações Técnicas: <span className="text-black ml-2">Vetor Escalável (AI/SVG) • Raster High-DPI (300dpi) • Gestão de Cor CMYK/RGB</span>
         </p>
         <div className="flex gap-4">
            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-2">
               <span className="w-2 h-0.5 bg-slate-300" /> Atendimento Autoral
            </span>
         </div>
      </div>
    </div>
  );
}
