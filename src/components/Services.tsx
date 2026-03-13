"use client";
import { useState } from "react";
import Modal from "./Modal";
import { PRICING } from "../lib/data";

type ServiceItem = {
  slug: "ensaio" | "campanha" | "evento";
  title: string;
  description: string;
  bullets: string[];
};

const services: ServiceItem[] = [
  {
    slug: "ensaio",
    title: "Ensaio autoral",
    description:
      "Retratos, editoriais e projetos pessoais com direção criativa.",
    bullets: [
      "Direção de arte inclusa",
      "Locação e figurino sob consulta",
      "Entrega digital em alta resolução",
    ],
  },
  {
    slug: "campanha",
    title: "Campanha comercial",
    description: "Produção para marcas, lançamentos e publicidade.",
    bullets: [
      "Equipe e casting sob medida",
      "Pré-produção detalhada",
      "Entrega para múltiplos canais",
    ],
  },
  {
    slug: "evento",
    title: "Cobertura de evento",
    description: "Registros de eventos, palestras e ativações de marca.",
    bullets: [
      "Entrega rápida",
      "Galeria online privada",
      "Opção de fotos impressas",
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
  document.getElementById("contato")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function Services() {
  const [selected, setSelected] = useState<ServiceItem | null>(null);

  return (
    <div className="relative z-10 w-full">
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
              onClick={() => setSelected(item)}
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
