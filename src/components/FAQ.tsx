"use client";

import { trackEvent } from '../lib/analytics';

export default function FAQ() {
  const items = [
    {
      q: "Qual o prazo médio de entrega?",
      a: "Depende do escopo técnico. Landing pages: 1-3 semanas. PWAs institucionais: 3-6 semanas. Projetos complexos são divididos em fases com cronograma detalhado. Sempre alinhamos prazos realistas antes do início.",
      tag: "Processo"
    },
    {
      q: "O que preciso enviar para começar?",
      a: "Objetivo de negócio, público-alvo, referências visuais, conteúdo base e prazo desejado. Se faltar algo, conduzo um briefing estruturado para garantir alinhamento completo.",
      tag: "Briefing"
    },
    {
      q: "Qual a diferença entre PWA e app nativo?",
      a: "PWA funciona como app no celular — com instalação, push notifications e performance nativa — sem passar por lojas de app. É a rota mais rápida e econômica para validar produtos digitais com alcance imediato.",
      tag: "Tecnologia"
    },
    {
      q: "Vocês fazem manutenção contínua?",
      a: "Sim. Ofereço pacotes de evolução mensal ou atendimento sob demanda para ajustes, atualizações de conteúdo, otimizações de performance e melhorias técnicas contínuas.",
      tag: "Suporte"
    },
    {
      q: "Como funciona o processo de aprovação?",
      a: "Trabalho com etapas curtas e validações pontuais: proposta → entrega parcial → feedback objetivo → ajuste final. Isso elimina retrabalho e acelera a aprovação com segurança.",
      tag: "Processo"
    },
    {
      q: "Como funciona o licenciamento de obras?",
      a: "O acervo está disponível em três modalidades: cessão editorial (uso imediato), licença institucional (campanhas/ESG) e prints fine-art (edições limitadas). Cada modalidade inclui documentação de direitos e certificados.",
      tag: "Licenciamento"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-4 w-1 bg-accent rounded-full" />
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight italic">Perguntas Frequentes</h2>
          <p className="text-sm text-slate-500 mt-1">Respostas diretas sobre processo, tecnologia e entregas</p>
        </div>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <details 
            key={index} 
            className="ink-card p-0 bg-white border border-black/10 open:border-black/30 transition-all group"
          >
            <summary className="cursor-pointer list-none p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-500 shrink-0">
                  {item.tag}
                </span>
                <span className="font-bold text-sm leading-snug group-hover:text-accent transition-colors">
                  {item.q}
                </span>
              </div>
            </summary>
            <div className="border-t border-black/10 px-5 pb-5 pt-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* CTA Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-black/5">
        <p className="text-sm text-slate-600">
          Não encontrou sua dúvida?
        </p>
        <a 
          href="#contato" 
          onClick={() => trackEvent('click_faq_cta')}
          className="ink-button inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-accent transition-all"
        >
          Iniciar Conversa
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
