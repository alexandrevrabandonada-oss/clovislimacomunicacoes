"use client";
import { useState } from "react";
import Modal from "./Modal";
import { PRICING } from "../lib/data";
import { trackEvent } from "../lib/analytics";

type ServiceItem = {
  slug: "editorial" | "licença" | "tech";
  title: string;
  description: string;
  forWhom: string;
  deliverables: string[];
  timing: string;
  cta: string;
};

const services: ServiceItem[] = [
  {
    slug: "editorial",
    title: "Charges / Editorial",
    description: "Engajamento e narrativa visual para veículos de mídia e pautas densas.",
    forWhom: "Portais, Revistas e Editoriais de Política/Economia.",
    deliverables: ["Charge Digital (SVG/PNG)", "Infográficos Narrativos", "Direção de Arte Editorial"],
    timing: "2 a 5 dias úteis",
    cta: "Diagnóstico Editorial"
  },
  {
    slug: "licença",
    title: "Licenciamento / Prints",
    description: "Arte autoral para marcas, campanhas e acervos exclusivos.",
    forWhom: "Agências de Publicidade, Departamentos de Marketing e Colecionadores.",
    deliverables: ["Cessão de Direitos de Uso", "Prints Fine-Art Assinados", "Arquitetura de Acervo"],
    timing: "Imediato (Digital) / 7 dias (Físico)",
    cta: "Consultar Acervo"
  },
    {
      slug: "tech",
      title: "Engenharia de Presença / PWA",
      description: "Sistemas web de alta performance e plataformas de autoridade técnica. Arquitetura orientada a Core Web Vitals e UX crítica.",
      forWhom: "Organizações, Apps e Projetos Editoriais que exigem rapidez, soberania de dados e escala.",
      deliverables: ["Arquitetura PWA Ready", "Performance (Core Web Vitals)", "Interfaces de Autoridade", "Soberania de Dados"],
      timing: "5 a 15 dias úteis",
      cta: "Análise de Viabilidade"
    },
];

function goToContact(slug: string, title: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("pacote", slug);
  url.hash = "contato";
  window.history.pushState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`
  );
  window.dispatchEvent(
    new CustomEvent("contact-prefill", { 
        detail: { 
            message: `Olá! Gostaria de um atendimento para o pacote de ${title}. Meu objetivo principal é: ` 
        } 
    })
  );
  trackEvent('click_service_package_selected', { package: slug });
  document.getElementById("contato")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function Services() {
  const [selected, setSelected] = useState<ServiceItem | null>(null);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[3px] border-black pb-10 mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 bg-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Soluções & Estratégia // 2026 Ready</p>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] text-black uppercase">Capabilities</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 relative z-10">
        {services.map((service, index) => (
          <div 
            key={service.slug}
            className="ink-card group/service p-10 flex flex-col h-full bg-white border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_var(--accent)] transition-all relative overflow-hidden"
          >
            {/* Tech Marker */}
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/service:opacity-20 transition-opacity">
              <span className="text-6xl font-black italic">0{index + 1}</span>
            </div>

            <div className="relative z-10 flex-grow">
              <h3 className="text-3xl font-black tracking-tighter mb-6 group-hover/service:text-accent transition-colors italic uppercase leading-none">
                {service.title}
              </h3>
              <p className="text-base text-black font-bold leading-tight mb-8 italic border-l-4 border-black pl-6">
                {service.description}
              </p>
              
              <div className="space-y-4 mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Protocolo_Entrega:</p>
                <ul className="space-y-3">
                  {service.deliverables.map(item => (
                    <li key={item} className="text-sm font-black text-black flex items-center gap-3 italic uppercase tracking-tighter">
                      <span className="w-2 h-2 bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              className="ink-button mt-4 w-full bg-black text-white px-8 py-6 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
              onClick={() => {
                trackEvent('click_service_card', { package: service.slug })
                setSelected(service)
              }}
            >
              Analisar Viabilidade →
            </button>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-accent animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Technical_Diagnostic :: Deep_Dive</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic mb-8 tracking-tighter leading-none uppercase">&quot;{selected.title}&quot;</h2>
            
            <div className="space-y-10">
                <section>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-black/40">Escopo da Intervenção:</h4>
                    <div className="grid gap-4">
                        {selected.deliverables.map((b) => (
                            <div key={b} className="flex items-center gap-4 p-5 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <span className="w-2 h-2 bg-accent" />
                                <span className="text-base font-black uppercase tracking-tight italic">{b}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="p-8 bg-black text-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(239,68,68,1)]">
                    <p className="text-lg font-bold text-white/80 leading-tight italic">
                        &quot;O atendimento da ESBOÇO inicia com um diagnóstico profundo para garantir que a solução visual opere como um ativo estratégico soberano.&quot;
                    </p>
                </div>
            </div>

            <button
              type="button"
              onClick={() => {
                goToContact(selected.slug, selected.title);
                setSelected(null);
              }}
              className="mt-12 w-full bg-accent text-white border-[3px] border-black px-10 py-6 text-center font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
            >
              Confirmar Interesse Técnico
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
}
