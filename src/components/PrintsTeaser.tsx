"use client";

import Image from 'next/image';
import { trackEvent } from '../lib/analytics';

export default function PrintsTeaser() {
  const productTracks = [
    {
      id: "editorial",
      title: "Cessão Editorial",
      headline: "Uso imediato para veículos de alta tiragem",
      description: "Licenciamento ágil para pautas de impacto socioambiental e político. Entrega técnica em resoluções mutáveis para impresso e digital.",
      specs: ["Arquivo Vetorial ou 300dpi", "Cálculo por Tiragem/Alcance", "Selo de Autoridade Clóvis Lima", "Uso Single/Editorial"],
      priceHint: "Consulte Pauta",
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
      badge: "Alto Impacto",
      featured: true,
      color: "bg-black text-white"
    },
    {
      id: "fineart",
      title: "Padrão Museológico",
      headline: "Edições Fine-Art para coleções",
      description: "Impressões museológicas assinadas. Giclée em papel algodão 310g com pigmentos minerais. O ápice da qualidade física da obra.",
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
    { label: "Segurança Jurídica", value: "Cessão Direta", context: "Processo blindado de transferência de direitos" }
  ];

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end border-b-[3px] border-black pb-10">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 bg-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Direitos Autorais & Reprodução Técnica</p>
          </div>
          <h3 className="text-3xl md:text-6xl font-black italic tracking-tighter leading-[0.85] text-black">
            A obra como ativo de <br/> <span className="hero-ink-underline">Autoridade & Legado</span>
          </h3>
        </div>
        <div className="lg:col-span-5">
          <p className="text-base text-black font-bold leading-tight italic border-l-[6px] border-black pl-8">
            O acervo ESBOÇO transita entre a agilidade editorial e a perenidade do fine-art. 
            Sistemas de licenciamento sob medida para veículos, marcas e acervos privados.
          </p>
        </div>
      </div>

      {/* Product Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {productTracks.map((track) => (
          <div 
            key={track.id}
            className={`ink-card p-0 flex flex-col border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_var(--accent)] md:hover:shadow-[20px_20px_0px_0px_var(--accent)] transition-all ${track.featured ? 'md:scale-[1.05] z-10' : ''} ${track.color}`}
          >
            {/* Card Header */}
            <div className={`p-5 md:p-10 border-b-[3px] ${track.featured ? 'border-white/20' : 'border-black'}`}>
              <div className="flex justify-between items-start mb-5 md:mb-8">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border-2 ${track.featured ? 'bg-accent text-white border-white' : 'bg-black text-white border-black'}`}>
                  {track.badge}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${track.featured ? 'text-white/40' : 'text-black/30'}`}>
                  {track.priceHint}
                </span>
              </div>
              <h4 className="text-3xl font-black italic mb-4 tracking-tighter uppercase">{track.title}</h4>
              <p className={`text-sm font-black leading-tight italic ${track.featured ? 'text-white/60' : 'text-black/50'}`}>
                {track.headline}
              </p>
            </div>

            {/* Card Body */}
            <div className="p-5 md:p-10 flex-grow">
              <p className={`text-sm leading-relaxed mb-6 md:mb-10 font-bold ${track.featured ? 'text-white/80' : 'text-black/80'}`}>
                {track.description}
              </p>
              
              <div className="space-y-6">
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${track.featured ? 'text-accent' : 'text-black/40'}`}>
                  Especificação Técnica:
                </p>
                <ul className="space-y-3">
                  {track.specs.map((spec) => (
                    <li key={spec} className={`flex items-center gap-4 text-[11px] font-black ${track.featured ? 'text-white' : 'text-black'}`}>
                      <div className={`w-2 h-2 ${track.featured ? 'bg-accent' : 'bg-black'}`} />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 md:p-10 pt-0">
              <a 
                href="#contato"
                onClick={() => trackEvent('click_prints_track', { track: track.id })}
                className={`inline-block w-full text-center py-6 font-black text-[12px] uppercase tracking-[0.2em] transition-all ink-button ${
                  track.featured 
                  ? 'bg-white text-black hover:bg-black hover:text-white hover:border-black' 
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
      <div className="bg-white border-[3px] border-black p-6 md:p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <div className="h-[3px] w-12 bg-black" />
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-black">Certificação de Qualidade / MUSEUM GRADE ⚡</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {qualityStandards.map((std) => (
            <div key={std.label} className="group/std">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-3 group-hover/std:text-accent transition-colors">{std.label}</p>
              <p className="text-3xl font-black text-black mb-2 tracking-tighter">{std.value}</p>
              <p className="text-[11px] text-black/60 font-bold leading-tight italic">{std.context}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-16 pt-6 md:pt-12 border-t-[3px] border-black/10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-black text-2xl border-[3px] border-accent shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">CL</div>
            <p className="text-sm font-black text-black max-w-[240px] italic leading-tight uppercase tracking-tight">Curadoria, Assinatura e Selo de Autoridade Clóvis Lima.</p>
          </div>
          <div className="max-w-md text-center md:text-right">
            <p className="text-[10px] text-black/40 font-black uppercase tracking-widest mb-2">Segurança de Acervo / Proof of Origin</p>
            <p className="text-[11px] text-black/50 font-bold leading-relaxed italic">
              Certificados de autenticidade emitidos em papel antifraude com numeração única, registro em acervo proprietário e validação de direitos perpétuos.
            </p>
          </div>
        </div>
      </div>

      {/* Real Application Proof: UNIPAMPA */}
      <div className="bg-black text-white border-[3px] border-accent p-6 md:p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
        <div className="absolute inset-0 halftone-bg opacity-5 group-hover:opacity-10 transition-opacity" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 bg-accent animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Prova_Física // 001</p>
            </div>
            <h4 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85] italic mb-8 uppercase">
              Consistência visual em <br/> <span className="underline decoration-accent underline-offset-8">Suporte Têxtil</span>
            </h4>
            <div className="space-y-6 max-w-md">
              <p className="text-base font-bold italic leading-tight text-white/80 border-l-[6px] border-accent pl-8">
                &quot;O case UNIPAMPA demonstra a resiliência do sistema gráfico ESBOÇO em aplicações de alta complexidade física e institucional.&quot;
              </p>
              <ul className="space-y-3 pt-6 border-t border-white/10">
                {[
                  "Identidade aplicada em camisaria institucional",
                  "Desdobramento gráfico para produção física",
                  "Arte preparada para múltiplas versões e suportes",
                  "Fidelidade técnica em substratos cromáticos"
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                    <div className="w-1.5 h-1.5 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ink-frame relative aspect-[16/10] border-[3px] border-white/20 bg-white overflow-hidden shadow-2xl group-hover:border-accent transition-colors">
             <Image 
                src="/portfolio/unipampa-manga-curta.jpg" 
                alt="UNIPAMPA Camisaria Proof" 
                fill 
                className="object-contain p-6 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-4 right-4 bg-black text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 border border-white/20">
                CASE::UNIPAMPA_2024
              </div>
          </div>
        </div>
      </div>

      {/* Process Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-10 pt-6 md:pt-10 border-t-[3px] border-black/5">
        {[
          { step: "01", label: "Consulta", desc: "Identificação da obra e modalidade" },
          { step: "02", label: "Proposta", desc: "Termos de cessão e orçamento" },
          { step: "03", label: "Aprovação", desc: "Contrato e documentação" },
          { step: "04", label: "Entrega", desc: "Arquivos + certificados" }
        ].map((item, index) => (
          <div key={item.step} className="flex items-start gap-4 group/step">
            <span className="text-2xl font-black text-black/10 group-hover/step:text-accent transition-colors">{item.step}</span>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-black">{item.label}</p>
              <p className="text-[11px] text-black/40 font-bold leading-tight italic">{item.desc}</p>
            </div>
            {index < 3 && <span className="hidden md:block ml-auto text-black/10">/</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
