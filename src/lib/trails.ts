export type TrailId = 'editorial' | 'livro' | 'licenciamento' | 'digital' | 'consultoria'

export type Trail = {
  id: TrailId
  label: string
  headline: string
  description: string
  deliverables: string[]
  pricingNote: string
  ctaLabel: string
  whatsappText: string
}

const WHATSAPP_NUMBER = '5524992544760'

export const trails: Trail[] = [
  {
    id: 'editorial',
    label: 'Charges / Editorial',
    headline: 'Narrativa Visual de Alta Autoridade',
    description:
      'Charges estratégicas e arte editorial que ampliam a legibilidade da sua pauta, posicionam seu veículo e geram impacto imediato no debate público.',
    deliverables: [
      'Charge digital finalizada em alta resolução',
      'Arte editorial adaptada para web e impresso',
      'Adaptações de formato (stories, feed, OG)',
      'Série temática sob briefing',
      'Arquivo fonte editável (opcional)',
    ],
    pricingNote: 'Prazo estimado: 3 a 10 dias úteis por peça',
    ctaLabel: 'Protocolar Briefing Editorial →',
    whatsappText:
      'Olá! Gostaria de solicitar orçamento para a trilha *Charges / Editorial*. Tenho interesse em narrativa visual estratégica para minha pauta ou veículo. Podemos alinhar um diagnóstico técnico?',
  },
  {
    id: 'livro',
    label: 'Livro / Proj. Editorial',
    headline: 'Universo Visual para sua Obra',
    description:
      'Projetos editoriais completos: de capa a ilustrações internas. Combinamos direção de arte e estratégia visual para construir a identidade visual da sua publicação.',
    deliverables: [
      'Capa (frente, verso e lombada)',
      'Ilustrações internas e vinhetas',
      'Direção de arte e paleta cromática',
      'Diagramação e preparação para impressão/ebook',
      'Reedição e modernização visual',
    ],
    pricingNote: 'Escopo e prazo sob consulta — projeto personalizado',
    ctaLabel: 'Iniciar Projeto Editorial →',
    whatsappText:
      'Olá! Gostaria de solicitar orçamento para a trilha *Livro / Projeto Editorial*. Tenho interesse em um projeto de capa, ilustração interna ou direção de arte para minha obra. Podemos conversar sobre o escopo?',
  },
  {
    id: 'licenciamento',
    label: 'Licenciamento / Prints',
    headline: 'Ativos Editoriais com Direito de Uso',
    description:
      'Licenciamento estratégico de obras do acervo para uso editorial, comercial ou institucional. Cessão formal de direitos com documentação e arquivos prontos para produção.',
    deliverables: [
      'Seleção de obra(s) do acervo',
      'Contrato de licenciamento por uso',
      'Kit de arquivos em resolução para o canal de uso',
      'Orientação técnica de impressão ou publicação digital',
      'Suporte de adaptação de formato (mediante consulta)',
    ],
    pricingNote: 'Prazo estimado: 2 a 5 dias úteis após aprovação contratual',
    ctaLabel: 'Solicitar Licenciamento →',
    whatsappText:
      'Olá! Gostaria de solicitar orçamento para a trilha *Licenciamento / Prints*. Tenho interesse em licenciar ativos editoriais do acervo para uso específico. Como funciona a cessão de direitos?',
  },
  {
    id: 'digital',
    label: 'Sistemas Digitais / PWA',
    headline: 'Infraestrutura de Presença Digital Soberana',
    description:
      'Desenvolvimento de sites, PWAs e sistemas web de alta performance com arquitetura editorial. Foco em autoridade técnica, Core Web Vitals e conversão estratégica.',
    deliverables: [
      'Arquitetura Next.js (App Router) com TypeScript',
      'Deploy PWA instalável (offline-first)',
      'Performance audit — Lighthouse 100/100',
      'Design system e componentes sob medida',
      'Integração com CMS, banco de dados e APIs',
    ],
    pricingNote: 'Prazo estimado: 4 a 12 semanas — scoping na primeira reunião',
    ctaLabel: 'Iniciar Diagnóstico Digital →',
    whatsappText:
      'Olá! Gostaria de solicitar orçamento para a trilha *Sistemas Digitais / PWA*. Busco um site ou sistema web de alta autoridade para meu produto digital. Podemos conversar sobre o desafio?',
  },
  {
    id: 'consultoria',
    label: 'Consultoria Especializada',
    headline: 'Diagnóstico Estratégico de Alto Nível',
    description:
      'Sessão consultiva fechada para mapear desafios de comunicação, posicionamento visual e estratégia de presença digital. Sem compromisso de projeto — foco em clareza e direção.',
    deliverables: [
      'Sessão de diagnóstico (90 min)',
      'Briefing técnico documentado',
      'Roadmap visual e de comunicação',
      'Relatório de aderência estratégica',
      'Indicação de trilha recomendada',
    ],
    pricingNote: 'Formato: sessão única ou pacote de acompanhamento mensal',
    ctaLabel: 'Agendar Consultoria →',
    whatsappText:
      'Olá! Gostaria de solicitar orçamento para a trilha *Consultoria Especializada*. Preciso de uma sessão de diagnóstico estratégico para mapear minha comunicação e presença digital. Como funciona?',
  },
]

export const trailsMap: Record<TrailId, Trail> = Object.fromEntries(
  trails.map((t) => [t.id, t])
) as Record<TrailId, Trail>

export const WHATSAPP_LINK = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
