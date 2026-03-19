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
      <div className="flex items-center gap-3 mb-8">
        <div className="h-4 w-1 bg-accent rounded-full" />
        <h2 className="text-3xl font-extrabold tracking-tight">Soluções & Estratégia</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
        {services.map((service, index) => (
          <div 
            key={service.slug}
            className="ink-card group/service p-8 flex flex-col h-full bg-white relative overflow-hidden"
          >
            {/* Tech Marker */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/service:opacity-20 transition-opacity">
              <span className="text-4xl font-black">0{index + 1}</span>
            </div>

            <div className="relative z-10 flex-grow">
              <h3 className="text-xl font-black tracking-tight mb-4 group-hover/service:text-accent transition-colors italic">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                {service.description}
              </p>
              
              <div className="space-y-3 mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entrega Técnica:</p>
                <ul className="space-y-2">
                  {service.deliverables.map(item => (
                    <li key={item} className="text-[11px] font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              className="ink-button mt-10 w-full bg-black text-white px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-accent hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              onClick={() => {
                trackEvent('click_service_card', { package: service.slug })
                setSelected(service)
              }}
            >
              Iniciar {service.cta} →
            </button>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-4">
            <h2 className="text-3xl font-black italic mb-2 tracking-tight">&quot;A Solução em Detalhe&quot;</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8">Trilha: {selected.title}</p>
            
            <div className="space-y-8">
                <section>
                    <h4 className="text-xs font-black uppercase mb-3 text-slate-400">Escopo da Entrega:</h4>
                    <div className="grid gap-3">
                        {selected.deliverables.map((b) => (
                            <div key={b} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-black/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <span className="text-sm font-bold text-slate-800">{b}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="p-5 bg-black text-white rounded-2xl">
                    <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                        &quot;O atendimento da ESBOÇO inicia com uma análise profunda do seu desafio de comunicação para garantir que a solução visual tenha impacto real.&quot;
                    </p>
                </div>
            </div>

            <button
              type="button"
              onClick={() => {
                goToContact(selected.slug, selected.title);
                setSelected(null);
              }}
              className="mt-10 w-full rounded-full border-2 border-black bg-black px-8 py-5 text-center font-black text-xs uppercase tracking-widest text-white transition-all hover:bg-accent hover:border-accent shadow-2xl"
            >
              Confirmar Interesse na Solução
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
