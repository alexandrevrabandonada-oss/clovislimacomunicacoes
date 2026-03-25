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
    isBook?: boolean
    bookMetadata?: {
        author: string
        category: string
        audience: string
        language: string
        edition: string
        type: string
    }
}

export const cases: Case[] = [
    {
        slug: 'barnabe',
        category: 'Ilustração Editorial',
        client: 'Editora Criativa Leitura',
        sector: 'Literatura Infantil',
        title: 'A Grande Sacada de Barnabé',
        summary: 'Desenvolvimento de universo visual e personagens para obra literária infantil focada em criatividade e superação.',
        diagnostic: 'Necessidade de transformar conceitos abstratos de "ideia" e "motivação" em elementos visuais tangíveis e carismáticos para o público infantil.',
        intervention: 'Criação de paleta vibrante e traço dinâmico que sustenta a narrativa de descoberta do protagonista.',
        impact: 'Alta aceitação em projetos de leitura escolares e consolidação do personagem como IP (Identidade Proprietária).',
        evidence: 'CIRCULAÇÃO: REDE ESCOLAR RS/RJ',
        methodology: 'Design de Personagem focado em expressão e empatia visual.',
        isBook: true,
        bookMetadata: {
            author: 'Marcio Marinho Nogueira',
            category: 'Literatura Infantil',
            audience: 'Infantil',
            language: 'Português',
            edition: '1ª Edição',
            type: 'Capa e Ilustrações'
        },
        proof: {
            deliverables: 'Capa, Personagens e 24 Ilustrações de Miolo',
            format: 'Digital Painting / Print Ready',
            impactType: 'Engajamento Literário'
        },
        screenshot_url: '/portfolio/books/barnabe.jpg'
    },
    {
        slug: 'mequinho-poco',
        category: 'Ilustração Editorial',
        client: 'Editora Criativa Leitura',
        sector: 'Literatura Infantil',
        title: 'A Viagem de Mequinho ao Fundo do Poço',
        summary: 'Revitalização visual e nova edição de obra clássica da literatura infantil educativa.',
        diagnostic: 'Obra em 2ª edição necessitava de atualização estética para manter relevância comercial perante a nova geração de leitores.',
        intervention: 'Pintura digital de alta densidade e reforço de sombreamento para criar atmosfera de imersão e aventura.',
        impact: 'Lançamento bem-sucedido da 2ª Edição (Revista e Ampliada) com aumento de demanda editorial.',
        evidence: 'STATUS: 2ª EDIÇÃO - AMPLIADA',
        methodology: 'Color Grading Editorial: uso de luz e sombra para acentuar o drama e a redenção narrativa.',
        isBook: true,
        bookMetadata: {
            author: 'Marcio Marinho Nogueira',
            category: 'Literatura Infantil',
            audience: 'Infantil / Educativo',
            language: 'Português',
            edition: '2ª Edição - Revista e Ampliada',
            type: 'Capa e Ilustrações'
        },
        proof: {
            deliverables: 'Nova Capa e Atualização de Pranchas Internas',
            format: 'High-Res Digital Art',
            impactType: 'Revitalização de Ativo Editorial'
        },
        screenshot_url: '/portfolio/books/mequinho.jpg'
    },
    {
        slug: 'etzarolhinho',
        category: 'Ilustração Editorial',
        client: 'Editora Criativa Leitura',
        sector: 'Literatura Infantil / Inclusão',
        title: 'O Etzarolhinho no Planeta das Diferenças',
        summary: 'Criação de universo visual para obra pioneira em educação inclusiva e respeito às diferenças.',
        diagnostic: 'O desafio de representar a "diferença" de forma lúdica, sem estigmas, promovendo a identificação imediata do leitor.',
        intervention: 'Design de personagem alienígena (Etzarolhinho) como metáfora visual positiva para a diversidade.',
        impact: 'Referência em bibliotecas escolares para pautas de inclusão e diversidade.',
        evidence: 'ACERVO: EDUCAÇÃO INCLUSIVA',
        methodology: 'Semiótica da Empatia: traços arredondados e cores primárias para acolhimento cognitivo.',
        isBook: true,
        bookMetadata: {
            author: 'Marcio Marinho Nogueira',
            category: 'Inclusão / Fantasia',
            audience: 'Infantil',
            language: 'Português',
            edition: '2ª Edição',
            type: 'Capa e Ilustrações'
        },
        proof: {
            deliverables: 'Concepção de Personagem e Storyboarding Visual',
            format: 'Technical Illustration',
            impactType: 'Impacto Social e Educativo'
        },
        screenshot_url: '/portfolio/books/etzarolhinho.jpg'
    },
    {
        slug: 'christmas-reindeer',
        category: 'Ilustração Editorial',
        client: 'International Editorial Project',
        sector: 'Literatura Infantojuvenil',
        title: "Everyday's Christmas",
        summary: 'Projeto editorial internacional (Bilingue) com foco em atmosfera sazonal e narrativa emocional.',
        diagnostic: 'Necessidade de uma estética que conversasse com o mercado global (EUA/Brasil), mantendo o rigor técnico da ilustração clássica.',
        intervention: 'Composição de capa cinematográfica com uso estratégico de efeitos de luz e partículas digitais.',
        impact: 'Entrada do estúdio no mercado de licenciamento bilingue.',
        evidence: 'PROJETO: INTERNATIONAL EDITION',
        methodology: 'Renderização Atmosférica: foco em ambientação e "mood" para capturar a magia sazonal.',
        isBook: true,
        bookMetadata: {
            author: 'Marcio Marinho Nogueira',
            category: 'Fantasia / Bilingue',
            audience: 'Infantojuvenil',
            language: 'Inglês',
            edition: 'International Edition',
            type: 'Capa e Ilustrações'
        },
        proof: {
            deliverables: 'Capa de Edição Especial e Design de Ambiente',
            format: 'Global Ready / CMYK Optimized',
            impactType: 'Expansão de Mercado Artístico'
        },
        screenshot_url: '/portfolio/books/christmas.jpg'
    },
    {
        slug: 'politica-institucional',
        category: 'Ilustração Editorial',
        client: 'Carbo Editora / Institucional',
        sector: 'Educação / Cidadania',
        title: 'Se preocupe, se importe, se interesse por POLÍTICA',
        summary: 'Aplicação de ilustração técnica em obra de conscientização política e social para jovens.',
        diagnostic: 'Complexidade de um tema "árido" para o público jovem: como gerar interesse visual em pautas de cidadania?',
        intervention: 'Estética de "Charge de Multidão" (Crowd Scene) para representar a diversidade do corpo social brasileiro de forma vibrante.',
        impact: 'Material utilizado em frentes de educação política não-partidária em escolas públicas.',
        evidence: 'UTILIDADE: EDUCAÇÃO CIDADÃ',
        methodology: 'Narrativa Visual Coletiva: composição multi-personagem para reforçar o pertencimento.',
        isBook: true,
        bookMetadata: {
            author: 'Adriane Nopes / Maycon Oliveira',
            category: 'Educação / Cidadania',
            audience: 'Jovem / Adulto',
            language: 'Português',
            edition: 'Edição Institucional',
            type: 'Ilustrações de Capa e Miolo'
        },
        proof: {
            deliverables: 'Ilustração de Capa e 16 Intervenções Internas',
            format: 'Technical Vector / Raster Mix',
            impactType: 'Conformidade e Engajamento Social'
        },
        screenshot_url: '/portfolio/books/se-preocupe.jpg'
    },
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
