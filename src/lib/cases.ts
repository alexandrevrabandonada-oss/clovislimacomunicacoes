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
        category: 'Editorial de Alta Escala',
        client: 'NSC Comunicação / G1 SC',
        sector: 'Mídia e Editorial',
        title: 'Engajamento Narrativo em Dados Políticos',
        summary: 'Arquitetura de narrativa visual para reduzir a dispersão de leitura em reportagens especiais de alta complexidade.',
        problem: 'Dispersão crítica em pautas políticas extensas: a densidade do texto bloqueava a retenção do leitor médio.',
        solution: 'Implementação de uma camada rítmica de charges editoriais que atuam como âncoras cognitivas ao longo do scroll.',
        result: 'Aumento de 24% na profundidade de scroll (VWL) e conversão qualitativa em tempo de permanência.',
        evidence: 'MÉTRICA EDITORIAL: +40% SHARES',
        methodology: 'Design de Interrupção Positiva: a imagem decodifica o argumento central para sustentar o fluxo de leitura.',
        proof: {
            deliverables: 'Série de 12 intervenções visuais para pauta econômica',
            format: 'SVG Otimizado para Performance Web',
            impactType: 'Retenção & Autoridade'
        }
    },
    {
        slug: 'comunicacao-publica',
        category: 'Legal Design & Gov',
        client: 'Prefeituras e Órgãos Governamentais',
        sector: 'Setor Público',
        title: 'Humanização de Fluxos de Serviço Público',
        summary: 'Conversão de guias técnicos burocráticos em jornadas visuais acessíveis para o cidadão.',
        problem: 'Ruptura de comunicação: editais e manuais de serviço com linguagem árida gerando alta taxa de erro operacional.',
        solution: 'Intervenção via Graphic Medicine e narrativa sequencial para traduzir procedimentos legais em fluxos lógicos.',
        result: 'Redução de 35% no ruído de canais de atendimento e otimização total de preenchimento de formulários.',
        evidence: 'OPERACIONAL: ERRO_ZERO EM FOCO',
        methodology: 'Tradução Técnica: redução da ansiedade do usuário através de pontes visuais de confiança institucional.',
        proof: {
            deliverables: 'Ecossistema visual: 06 Guias HQ + Matriz de Cards',
            format: 'Design Omnichannel (Print/Social)',
            impactType: 'Eficiência Operacional'
        }
    },
    {
        slug: 'tech-licensing',
        category: 'UX / Product Authority',
        client: 'SaaS e Startups Tech',
        sector: 'Tecnologia',
        title: 'Identidade e Onboarding Cognitivo Assistido',
        summary: 'Licenciamento de linguagem visual para humanização de interfaces críticas em produtos digitais.',
        problem: 'Experiências de software frias e mecanizadas que causavam churn elevado durante o setup técnico inicial.',
        solution: 'Criação de ecossistema de Brand Assets (mascotes e micro-ilustrações) que sinalizam suporte e guiam o usuário.',
        result: 'Elevação substancial no NPS de onboarding e redução de 20% no tempo médio de ativação de conta.',
        evidence: 'UX_KPI: RETENÇÃO_SETUP ▲',
        methodology: 'Antropomorfização de Processos: humanização da curva de aprendizado para reforçar autoridade de marca.',
        proof: {
            deliverables: 'Livraria de +40 Brand Assets (SVG/Lottie)',
            format: 'Integration Ready / Componentized',
            impactType: 'User Success (UX)'
        }
    },
    {
        slug: 'aps-sustentabilidade',
        category: 'PWA / Institutional Engine',
        client: 'APS Sustentabilidade',
        sector: 'Socioambiental',
        title: 'APS Sustentabilidade — Plataforma PWA de Autoridade',
        summary: 'Engenharia de presença digital para consolidação de legado institucional e transparência ativa.',
        problem: 'Fragmentação de canais e ausência de uma base técnica centralizada para reports de ESG e projetos críticos.',
        solution: 'Desenvolvimento de ecossistema PWA (Next.js) centrado em hierarquia de informação e velocidade extrema.',
        result: 'Consolidação da soberania digital da associação e facilitação estratégica no acesso a reports decisórios.',
        evidence: 'LIGHTHOUSE_PERF: 100/100',
        methodology: 'Design de Autoridade: interface orientada a dados e legibilidade técnica para reforçar legitimidade.',
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
