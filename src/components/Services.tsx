"use client";
import { useState } from "react";
import Modal from "./Modal";
import { PRICING } from "../lib/data";
import { trackEvent } from "../lib/analytics";

type ServiceItem = {
  slug: "editorial" | "licença" | "tech";
  title: string;
  description: string;
  bullets: string[];
};

const services: ServiceItem[] = [
  {
    slug: "editorial",
    title: "Charges / Editorial",
    description:
      "Atenção e engajamento para veículos e pautas complexas através de humor e narrativa visual autoral.",
    bullets: [
        "Direção de arte editorial",
        "Storytelling visual para dados",
        "Charges para impacto imediato",
    ],
  },
  {
    slug: "licença",
    title: "Prints / Licenciamento",
    description: "Arte autoral para acervos físicos e direitos de uso comercial para marcas e campanhas.",
    bullets: [
        "Licenças para campanhas e marcas",
        "Prints fine-art sob demanda",
        "Acervo exclusivo para licenciamento",
    ],
  },
  {
    slug: "tech",
    title: "Sites / PWA",
    description: "Desenvolvimento de produtos digitais com identidade visual única e foco em conversão.",
    bullets: [
        "Interfaces personalizadas (UI/UX)",
        "PWAs rápidos e instaláveis",
        "Identidade visual integrada",
    ],
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
    new CustomEvent("contact-package", { detail: { slug, title } })
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
      <h2 className="text-3xl font-extrabold">Serviços</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {services.map((item) => (
          <article
            key={item.slug}
            className="ink-card p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{item.description}</p>
              <div className="mt-4 space-y-2 text-sm">
                {item.bullets.map((bullet) => (
                  <p
                    key={bullet}
                    className="rounded border border-black/15 bg-white/70 px-2 py-1"
                  >
                    {bullet}
                  </p>
                ))}
              </div>
              <div className="mb-2 text-xs text-slate-700">
                {PRICING.services[item.slug]?.price && (
                  <span className="inline-block mr-2">
                    {PRICING.services[item.slug].price}
                  </span>
                )}
                {PRICING.services[item.slug]?.prazo && (
                  <span className="inline-block">
                    prazo típico: {PRICING.services[item.slug].prazo}
                  </span>
                )}
              </div>
            </div>
            <button
              className="ink-button mt-4 bg-black text-white px-4 py-2 rounded-full font-bold"
              onClick={() => {
                trackEvent('click_service_card', { package: item.slug })
                setSelected(item)
              }}
            >
              Quero este
            </button>
          </article>
        ))}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-2">
            <h2 className="text-2xl font-extrabold">{selected.title}</h2>
            <p className="mt-2 text-sm text-slate-600 italic">
              Disponibilidade sob consulta e contrato.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-700">
              {selected.bullets.map((b) => (
                <p key={b}>• {b}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                goToContact(selected.slug, selected.title);
                setSelected(null);
              }}
              className="mt-8 w-full rounded-full border border-black bg-black px-6 py-3 text-center font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Quero este pacote
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
