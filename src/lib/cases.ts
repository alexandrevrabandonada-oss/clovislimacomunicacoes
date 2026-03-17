export type Case = {
    slug: string
    category: string
    client: string
    sector: string
    title: string
    summary: string
    problem: string
    solution: string
    result: string
    evidence: string
    methodology: string
    proof: {
        deliverables: string
        format: string
        impactType: string
    }
    screenshot_url?: string
}

export const cases: Case[] = [
    {
        slug: 'jornalismo-nsc',
        category: 'Editorial',
        client: 'NSC Comunicação / G1 SC',
        sector: 'Mídia e Editorial',
        title: 'Engajamento Narrativo em Dados Políticos',
        summary: 'Arquitetura de narrativa visual para reduzir a dispersão de leitura em reportagens especiais de alta complexidade.',
        problem: 'Abandono prematuro de leitura em pautas políticas extensas, onde a densidade do texto criava barreiras de retenção.',
        solution: 'Implementação de uma camada rítmica de charges editoriais que atuam como âncoras visuais e síntese cognitiva ao longo do scroll.',
        result: 'Aumento na profundidade de scroll e conversão qualitativa de tempo de permanência em conteúdos "long-form".',
        evidence: 'Validação editorial e aumento na taxa de compartilhamento orgânico.',
        methodology: 'Design de interrupção positiva: a imagem não apenas ilustra, ela decodifica o argumento central para manter o fluxo.',
        proof: {
            deliverables: 'Série de 12 intervenções visuais para pauta econômica',
            format: 'SVG Otimizado para Performance Web',
            impactType: 'Retenção & Autoridade'
        }
    },
    {
        slug: 'comunicacao-publica',
        category: 'Comunicação Pública',
        client: 'Prefeituras e Órgãos Governamentais',
        sector: 'Setor Público',
        title: 'Humanização de Fluxos de Serviço',
        summary: 'Conversão de guias técnicos burocráticos em jornadas visuais acessíveis para o cidadão.',
        problem: 'Ruptura de comunicação entre gestão e cidadão devido a editais e manuais de serviço com linguagem excessivamente árida.',
        solution: 'Intervenção via "Graphic Medicine" e narrativa sequencial para traduzir procedimentos legais em fluxos amigáveis.',
        result: 'Redução drástica em erros de preenchimento e diminuição do ruído em canais de atendimento direto.',
        evidence: 'Otimização operacional e feedback de experiência do usuário.',
        methodology: 'A narrativa visual reduz a ansiedade do usuário e estabelece uma ponte de confiança técnica e emocional.',
        proof: {
            deliverables: 'Ecossistema visual: 06 Guias HQ + Matriz de Cards',
            format: 'Design Omnichannel (Print/Social)',
            impactType: 'Eficiência Operacional'
        }
    },
    {
        slug: 'tech-licensing',
        category: 'Digital / UX',
        client: 'SaaS e Startups Tech',
        sector: 'Tecnologia',
        title: 'Identidade e Onboarding Assistido',
        summary: 'Licenciamento de linguagem visual para humanização de interfaces críticas em produtos digitais.',
        problem: 'Experiências de software mecanizadas que falhavam em reter o usuário durante etapas críticas de configuração.',
        solution: 'Criação de sistema de ativos visuais (mascotes e micro-ilustrações) que sinalizam suporte e guiam o usuário.',
        result: 'Elevação na percepção de valor do produto e redução de "churn" durante o setup técnico inicial.',
        evidence: 'Aumento em índices de NPS e facilidade de suporte técnico.',
        methodology: 'A antropomorfização de processos tech amortece a curva de aprendizado e reforça o tom de voz da marca.',
        proof: {
            deliverables: 'Livraria de +40 Brand Assets (SVG/Lottie)',
            format: 'Integration Ready / Componentized',
            impactType: 'User Success (UX)'
        }
    },
    {
        slug: 'aps-sustentabilidade',
        category: 'Digital / PWA',
        client: 'APS Sustentabilidade',
        sector: 'Socioambiental',
        title: 'APS Sustentabilidade — Plataforma PWA',
        summary: 'Engenharia de presença digital para consolidação de legado institucional e transparência ativa.',
        problem: 'Fragmentação de canais digitais e ausência de uma base centralizada para reports de sustentabilidade e projetos.',
        solution: 'Desenvolvimento de ecossistema PWA (Next.js) com foco em hierarquia de informação e velocidade de acesso mobile.',
        result: 'Consolidação da autoridade digital da associação e facilitação estratégica no acesso a reports institucionais.',
        evidence: 'Redução no tempo de carregamento e aumento em leads orgânicos de parceiros.',
        methodology: 'Design de Autoridade: interface centrada em dados e legibilidade técnica para reforçar legitimidade institucional.',
        proof: {
            deliverables: 'Plataforma Web Institucional / PWA',
            format: 'Next.js / SEO Otimizado / PWA Ready',
            impactType: 'Legitimidade & Lead Gen'
        },
        screenshot_url: '/portfolio/aps-real-desktop.png'
    }
]

export function getCaseBySlug(slug: string) {
    return cases.find((c) => c.slug === slug)
}

export function getAllCaseSlugs() {
    return cases.map((c) => c.slug)
}
