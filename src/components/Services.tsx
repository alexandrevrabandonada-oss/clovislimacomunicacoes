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
    title: "Sites / PWA / Digital",
    description: "Interfaces autorais e plataformas de autoridade com foco em performance técnica. Ex: APS Sustentabilidade.",
    forWhom: "Startups, Instituicões e Projetos Editoriais que buscam excelência técnica e visual.",
    deliverables: ["Sites Institucionais", "PWAs (WebApps)", "Landing Pages de Alta Conversão", "Branding Digital"],
    timing: "5 a 15 dias úteis",
    cta: "Análise Técnica"
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

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((item) => (
          <article
            key={item.slug}
            className="ink-card p-8 flex flex-col justify-between group hover:border-black/20 transition-all"
          >
            <div>
              <header className="mb-6">
                 <h3 className="text-2xl font-black mb-2 group-hover:text-accent transition-colors leading-tight">{item.title}</h3>
                 <p className="text-slate-600 text-sm font-medium leading-relaxed">{item.description}</p>
              </header>
              
              <div className="space-y-6 pt-6 border-t border-black/5">
                <section>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Para quem é</p>
                    <p className="text-xs font-bold text-slate-800">{item.forWhom}</p>
                </section>

                <section>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">O que entrega</p>
                    <div className="flex flex-wrap gap-2">
                        {item.deliverables.map(d => (
                            <span key={d} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{d}</span>
                        ))}
                    </div>
                </section>

                <section>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Dinâmica</p>
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {item.timing}
                    </p>
                </section>
              </div>
            </div>

            <button
              className="ink-button mt-10 w-full bg-black text-white px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-accent hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              onClick={() => {
                trackEvent('click_service_card', { package: item.slug })
                setSelected(item)
              }}
            >
              Iniciar {item.cta} →
            </button>
          </article>
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
