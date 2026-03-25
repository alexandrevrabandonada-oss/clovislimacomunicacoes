"use client";

import { trackEvent } from '../lib/analytics';

export default function PrintsTeaser() {
  const productTracks = [
    {
      id: "editorial",
      title: "Cessão Editorial",
      headline: "Uso imediato para veículos de mídia",
      description: "Licenciamento rápido para pautas de impacto. Entrega em alta resolução com cálculo por tiragem.",
      specs: ["Alta Resolução (PNG/SVG)", "Cálculo por Tiragem", "Entrega em < 24h", "Uso Single/Editorial"],
      priceHint: "A partir de R$ 450",
      cta: "Liberar para Pauta",
      badge: "Mais Rápido",
      color: "bg-white"
    },
    {
      id: "institucional",
      title: "Licença Institucional",
      headline: "Direito de uso para campanhas e marcas",
      description: "Cessão de direitos para campanhas publicitárias, relatórios ESG e branding institucional. Exclusividade negociável.",
      specs: ["Uso Perpétuo ou Limitado", "Exclusividade Opcional", "Manual de Aplicação", "Relatório de Autorização"],
      priceHint: "Sob consulta",
      cta: "Análise de Campanha",
      badge: "Mais Demandado",
      featured: true,
      color: "bg-slate-900 text-white"
    },
    {
      id: "fineart",
      title: "Coleções Fine-Art",
      headline: "Prints físicos para acervos privados",
      description: "Edições limitadas assinadas em papel algodão 310g. Certificado de autenticidade e proveniência documentada.",
      specs: ["Papel Algodão 310g", "Certificado de Autenticidade", "Edições Limitadas", "Embalagem Museológica"],
      priceHint: "A partir de R$ 1.200",
      cta: "Consultar Obra",
      color: "bg-white"
    }
  ];

  const deliveryFormats = [
    { label: "Vetor Escalável", value: "AI / SVG / PDF", context: "Para aplicações em qualquer escala" },
    { label: "Raster Profissional", value: "TIFF / PNG 300dpi", context: "Para impressão editorial e publicitária" },
    { label: "Print Fine-Art", value: "Giclée 12 cores", context: "Para acervos e coleções privadas" },
    { label: "Gestão de Cor", value: "CMYK / RGB / Pantone", context: "Fidelidade cromática garantida" }
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-black/10 pb-8">
        <div className="lg:col-span-7">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Arte Autoral / Direitos & Reprodução</p>
          <h3 className="text-2xl md:text-3xl font-black italic leading-tight">
            Disponibilidade de obra para veículos, campanhas e acervos
          </h3>
        </div>
        <div className="lg:col-span-5">
          <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-4">
            O acervo ESBOÇO está disponível para licenciamento editorial, publicitário e coleções fine-art. 
            Processo de cessão documentado e entrega técnica em múltiplos formatos.
          </p>
        </div>
      </div>

      {/* Product Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productTracks.map((track) => (
          <div 
            key={track.id}
            className={`ink-card p-0 flex flex-col border-[3px] border-black transition-all hover:translate-y-[-4px] hover:shadow-2xl ${track.featured ? 'shadow-xl md:scale-[1.02]' : ''} ${track.color}`}
          >
            {/* Card Header */}
            <div className={`p-6 border-b ${track.featured ? 'border-white/20' : 'border-black/10'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[8px] font-black uppercase tracking-[0.25em] px-2 py-1 rounded ${track.featured ? 'bg-accent text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {track.badge || "Modalidade"}
                </span>
                <span className={`text-[9px] font-bold ${track.featured ? 'text-slate-400' : 'text-slate-400'}`}>
                  {track.priceHint}
                </span>
              </div>
              <h4 className="text-xl font-black italic mb-2">{track.title}</h4>
              <p className={`text-xs leading-relaxed ${track.featured ? 'text-slate-400' : 'text-slate-500'}`}>
                {track.headline}
              </p>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-grow">
              <p className={`text-xs leading-relaxed mb-6 ${track.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                {track.description}
              </p>
              
              <div className="space-y-3">
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${track.featured ? 'text-accent' : 'text-slate-400'}`}>
                  Especificações:
                </p>
                <ul className="space-y-2">
                  {track.specs.map((spec) => (
                    <li key={spec} className={`flex items-center gap-2 text-[10px] font-bold ${track.featured ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className={`w-1 h-1 rounded-full ${track.featured ? 'bg-accent' : 'bg-black'}`} />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-6 pt-0">
              <a 
                href="#contato"
                onClick={() => trackEvent('click_prints_track', { track: track.id })}
                className={`inline-block w-full text-center py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${
                  track.featured 
                  ? 'bg-white text-black hover:bg-accent hover:text-white shadow-xl' 
                  : 'bg-black text-white hover:bg-accent'
                }`}
              >
                {track.cta} →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Specs Bar */}
      <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-black/5">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-6 bg-slate-300" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Formatos de Entrega Técnica</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deliveryFormats.map((format) => (
            <div key={format.label} className="p-4 bg-white rounded-xl border border-black/5">
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{format.label}</p>
              <p className="text-sm font-black text-black mb-1">{format.value}</p>
              <p className="text-[10px] text-slate-500">{format.context}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-black/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-bold text-slate-600">Atendimento Autoral Direto</p>
          </div>
          <p className="text-[9px] text-slate-400 max-w-md text-right">
            Todas as obras incluem certificado de autenticidade e documentação de cessão de direitos conforme a modalidade contratada.
          </p>
        </div>
      </div>

      {/* Process Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { step: "01", label: "Consulta", desc: "Identificação da obra e modalidade" },
          { step: "02", label: "Proposta", desc: "Termos de cessão e orçamento" },
          { step: "03", label: "Aprovação", desc: "Contrato e documentação" },
          { step: "04", label: "Entrega", desc: "Arquivos + certificados" }
        ].map((item, index) => (
          <div key={item.step} className="flex items-start gap-3">
            <span className="text-lg font-black text-slate-200">{item.step}</span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider">{item.label}</p>
              <p className="text-[10px] text-slate-500">{item.desc}</p>
            </div>
            {index < 3 && <span className="hidden md:block ml-auto text-slate-300">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
