export type Case = {
    slug: string
    category: string
    client: string
    sector: string
    title: string
    summary: string
    diagnostic: string // Renamed from problem
    intervention: string // Renamed from solution
    impact: string // Renamed from result
    evidence: string
    methodology: string
    proof: {
        deliverables: string
        format: string
        impactType: string
    }
    screenshot_url?: string
    gallery?: string[]
}

export const cases: Case[] = [
    {
        slug: 'jornalismo-nsc',
        category: 'Asset Editorial',
        client: 'NSC Comunicação / G1 SC',
        sector: 'Mídia e Editorial',
        title: 'Engajamento Narrativo via Âncoras Cognitivas',
        summary: 'Arquitetura de narrativa visual para eliminar a dispersão de leitura em reportagens especiais de alta complexidade.',
        diagnostic: 'Fadiga cognitiva em pautas políticas extensas: a densidade de texto sem pausas visuais bloqueava a retenção do leitor médio.',
        intervention: 'Engenharia de Interrupção Positiva: implementação de uma camada rítmica de charges editoriais que atuam como âncoras cognitivas.',
        impact: 'Aumento real de 24% na profundidade de scroll (VWL) e fixação de autoridade da marca no ambiente digital.',
        evidence: 'MÉTRICA DE RETENÇÃO: +40% SHARES',
        methodology: 'Design de Escaneabilidade: a imagem decodifica o argumento central para sustentar o fluxo de atenção ininterrupta.',
        proof: {
            deliverables: 'Série de 12 intervenções visuais estratégicamente posicionadas',
            format: 'SVG Otimizado / Alta Performance',
            impactType: 'Retenção & Autoridade Editorial'
        }
    },
    {
        slug: 'comunicacao-publica',
        category: 'Report Técnico',
        client: 'Prefeituras e Órgãos Governamentais',
        sector: 'Setor Público',
        title: 'Otimização de Fluxos de Serviço ao Cidadão',
        summary: 'Conversão de manuais técnicos burocráticos em jornadas visuais de alta taxa de conformidade.',
        diagnostic: 'Ruptura de conformidade: editais e portarias com linguagem hermética gerando falhas operacionais críticas no atendimento.',
        intervention: 'Intervenção via Legal Design e Graphic Medicine: simplificação radical de procedimentos em fluxos lógicos e sequenciais.',
        impact: 'Redução de 35% nos chamados de suporte e eliminação de gargalos operacionais no preenchimento de protocolos.',
        evidence: 'OPERACIONAL: ERRO_ZERO ALCANÇADO',
        methodology: 'Tradução Semiológica: redução da barreira de entrada cognitiva através de pontes visuais de confiança institucional.',
        proof: {
            deliverables: 'Ecossistema de 06 Guias HQ + Matriz de Cards Operacionais',
            format: 'Design Omnichannel (Print/Digital Ready)',
            impactType: 'Eficiência de Estado'
        }
    },
    {
        slug: 'tech-licensing',
        category: 'Sistema Digital',
        client: 'SaaS e Startups Tech',
        sector: 'Tecnologia',
        title: 'Onboarding Cognitivo Assistido para Produtos Críticos',
        summary: 'Licenciamento de linguagem visual para aceleração de ativação em interfaces complexas (SaaS).',
        diagnostic: 'Inércia de Setup: interfaces de software frias e densas que causavam churn elevado no primeiro contato do usuário técnico.',
        intervention: 'Criação de ecossistema de Brand Assets assistivos (mascotes e micro-orientadores) que guiam o usuário via reforço de sucesso.',
        impact: 'Elevação definitiva no NPS de onboarding e redução de 20% no tempo médio de ativação de conta (Time-To-Value).',
        evidence: 'UX_KPI: RETENÇÃO_SETUP ▲ 22%',
        methodology: 'Antropomorfização Funcional: humanização da curva de aprendizado para reduzir a ansiedade de configuração inicial.',
        proof: {
            deliverables: 'Livraria de +40 Brand Assets modulares (SVG/Lottie)',
            format: 'Integration Ready / UI-Compatible',
            impactType: 'Ativação & Retenção de SaaS'
        }
    },
    {
        slug: 'unipampa-camisaria',
        category: 'Prova Física',
        client: 'UNIPAMPA — Campus Dom Pedrito/RS',
        sector: 'Educação / Governo',
        title: 'UNIPAMPA — Camisaria Institucional',
        summary: 'Sistema gráfico aplicado em camisetas institucionais para a Universidade Federal do Pampa.',
        diagnostic: 'A Educação do Campo da UNIPAMPA necessitava de uma uniformização que aliasse o peso institucional à identidade orgânica do curso, garantindo legibilidade em múltiplas variações de vestuário.',
        intervention: 'Desenvolvimento de matriz gráfica adaptativa para camisaria. O sistema foi modularizado para suportar versões em manga curta e longa, com aplicação em fundos branco, azul e verde, mantendo a integridade cromática.',
        impact: 'Consolidação da identidade visual física do curso, resultando em um sistema de uniformização robusto, de alta durabilidade estética e fácil reprodução técnica.',
        evidence: 'PROVA_REAL: SISTEMA_FÍSICO_ATIVO',
        methodology: 'Engenharia de Suporte: adaptação técnica de traços e preenchimentos para substratos têxteis, prevendo a distorção térmica na aplicação.',
        proof: {
            deliverables: 'Camisaria Institucional, Aplicação Multiversão, Preparação Têxtil, Consistência Física',
            format: 'Vetor Nativo / Matriz de Produção',
            impactType: 'Legitimidade Institucional'
        },
        screenshot_url: '/portfolio/unipampa-manga-curta.jpg',
        gallery: [
            '/portfolio/unipampa-manga-curta.jpg',
            '/portfolio/unipampa-manga-longa.jpg'
        ]
    },
    {
        slug: 'aps-sustentabilidade',
        category: 'Sistema Digital',
        client: 'APS Sustentabilidade',
        sector: 'Socioambiental',
        title: 'APS Sustentabilidade — Plataforma de Legitimidade Digital',
        summary: 'Engenharia de presença digital para consolidação de legado institucional e transparência ativa via PWA.',
        diagnostic: 'Fragmentação de autoridade: ausência de uma base técnica centralizada capaz de suportar reports de ESG decisórios.',
        intervention: 'Arquitetura de Plataforma (Next.js) orientada à hierarquia de informação técnica e tempo de resposta zero.',
        impact: 'Soberania digital absoluta e redução da latência de acesso a documentos críticos pela diretoria.',
        evidence: 'LIGHTHOUSE_AUDIT: 100/100',
        methodology: 'Arquitetura de Confiança: interface estéril e precisa que reforça a natureza técnica da associação.',
        proof: {
            deliverables: 'Plataforma Web Institucional Hub / PWA',
            format: 'Vercel Edge / PWA Manifest Optimized',
            impactType: 'Soberania & Autoridade de Dados'
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
