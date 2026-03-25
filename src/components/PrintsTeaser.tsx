"use client";

import { trackEvent } from '../lib/analytics';

export default function PrintsTeaser() {
  const productTracks = [
    {
      id: "editorial",
      title: "Cessão Editorial",
      headline: "Uso imediato para veículos de alta tiragem",
      description: "Licenciamento ágil para pautas de impacto socioambiental e político. Entrega técnica em resoluções mutáveis para impresso e digital.",
      specs: ["Arquivo Vetorial ou 300dpi", "Cálculo por Tiragem/Alcance", "Selo de Autoridade Clóvis Lima", "Uso Single/Editorial"],
      priceHint: "Consultoria de Pauta",
      cta: "Liberar para Pauta",
      badge: "Editorial Sync",
      color: "bg-white"
    },
    {
      id: "institucional",
      title: "Licença de Campanha",
      headline: "Direito de uso para Branding & ESG",
      description: "Cessão estratégica para campanhas publicitárias, relatórios anuais e branding institucional. Foco em autoridade e narrativa proprietária.",
      specs: ["Uso Customizado / Perpétuo", "Exclusividade de Segmento", "Manual de Aplicação Visual", "Certificação de Direitos"],
      priceHint: "Projeto Estratégico",
      cta: "Analisar Campanha",
      badge: "High Impact",
      featured: true,
      color: "bg-black text-white"
    },
    {
      id: "fineart",
      title: "Acervo Fine-Art",
      headline: "Impressões museológicas para coleções",
      description: "Edições limitadas e assinadas. Impressão Giclée em papel algodão 310g com pigmentos minerais. O ápice da qualidade física da obra.",
      specs: ["Papel Hahnemühle 310g", "Pigmentos Minerais", "Certificado de Autenticidade", "Série Limitada e Numerada"],
      priceHint: "Colecionismo",
      cta: "Consultar Obra",
      badge: "Museum Grade",
      color: "bg-white"
    }
  ];

  const qualityStandards = [
    { label: "Precisão Cromática", value: "Delta-E < 2.0", context: "Fidelidade absoluta em qualquer substrato" },
    { label: "Durabilidade Fine-Art", value: "100+ anos", context: "Longevidade museológica garantida" },
    { label: "Entrega Técnica", value: "Vetor Nativo", context: "Escalabilidade infinita para grandes formatos" },
    { label: "Legal Design", value: "Cessão Própria", context: "Segurança jurídica total na contratação" }
  ];

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end border-b-2 border-slate-900 pb-10">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Direitos Autoriais & Reprodução Técnica</p>
          </div>
          <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-none text-slate-900">
            A obra como ativo de <br/> <span className="hero-ink-underline">Autoridade & Legado</span>
          </h3>
        </div>
        <div className="lg:col-span-5">
          <p className="text-base text-slate-900 font-bold leading-tight italic border-l-4 border-slate-900 pl-6">
            O acervo ESBOÇO transita entre a agilidade editorial e a perenidade do fine-art. 
            Sistemas de licenciamento sob medida para veículos, marcas e acervos privados.
          </p>
        </div>
      </div>

      {/* Product Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {productTracks.map((track) => (
          <div 
            key={track.id}
            className={`ink-card p-0 flex flex-col border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(239,68,68,0.2)] transition-all ${track.featured ? 'md:scale-[1.05] z-10' : ''} ${track.color}`}
          >
            {/* Card Header */}
            <div className={`p-8 border-b-2 ${track.featured ? 'border-white/20' : 'border-black'}`}>
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm ${track.featured ? 'bg-accent text-white' : 'bg-slate-900 text-white'}`}>
                  {track.badge}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {track.priceHint}
                </span>
              </div>
              <h4 className="text-2xl font-black italic mb-3 tracking-tight">{track.title}</h4>
              <p className={`text-sm font-bold leading-tight ${track.featured ? 'text-slate-400' : 'text-slate-600'}`}>
                {track.headline}
              </p>
            </div>

            {/* Card Body */}
            <div className="p-8 flex-grow">
              <p className={`text-sm leading-relaxed mb-8 font-medium ${track.featured ? 'text-slate-300' : 'text-slate-700'}`}>
                {track.description}
              </p>
              
              <div className="space-y-4">
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${track.featured ? 'text-accent' : 'text-slate-400'}`}>
                  Entrega Técnica:
                </p>
                <ul className="space-y-2.5">
                  {track.specs.map((spec) => (
                    <li key={spec} className={`flex items-center gap-3 text-[11px] font-bold ${track.featured ? 'text-slate-100' : 'text-slate-900'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${track.featured ? 'bg-accent' : 'bg-black'}`} />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-8 pt-0">
              <a 
                href="#contato"
                onClick={() => trackEvent('click_prints_track', { track: track.id })}
                className={`inline-block w-full text-center py-5 font-black text-[11px] uppercase tracking-[0.2em] transition-all ink-button ${
                  track.featured 
                  ? 'bg-white text-black hover:bg-accent hover:text-white' 
                  : 'bg-black text-white hover:bg-accent'
                }`}
              >
                {track.cta} →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Quality Standards Bar */}
      <div className="bg-white border-[3px] border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] strategy-grid">
        <div className="flex items-center gap-3 mb-10">
          <span className="h-[2px] w-8 bg-slate-900" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Padrão de Qualidade ESBOÇO / MUSEUM GRADE</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {qualityStandards.map((std) => (
            <div key={std.label} className="group">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 group-hover:text-accent transition-colors">{std.label}</p>
              <p className="text-xl font-black text-black mb-1">{std.value}</p>
              <p className="text-[10px] text-slate-600 font-bold leading-tight">{std.context}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t-2 border-black/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-black text-lg border-2 border-accent">CL</div>
            <p className="text-xs font-bold text-slate-900 max-w-[200px]">Curadoria e Assinatura Autoral de Clóvis Lima.</p>
          </div>
          <p className="text-[10px] text-slate-400 font-medium max-w-sm text-center md:text-right">
            Certificados de autenticidade emitidos em papel antifraude com numeração única e registro em acervo proprietário.
          </p>
        </div>
      </div>

      {/* Process Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-black/5">
        {[
          { step: "01", label: "Consulta", desc: "Identificação da obra e modalidade" },
          { step: "02", label: "Proposta", desc: "Termos de cessão e orçamento" },
          { step: "03", label: "Aprovação", desc: "Contrato e documentação" },
          { step: "04", label: "Entrega", desc: "Arquivos + certificados" }
        ].map((item, index) => (
          <div key={item.step} className="flex items-start gap-3 group/step">
            <span className="text-xl font-black text-slate-200 group-hover/step:text-accent transition-colors">{item.step}</span>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-900">{item.label}</p>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">{item.desc}</p>
            </div>
            {index < 3 && <span className="hidden md:block ml-auto text-slate-300">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
