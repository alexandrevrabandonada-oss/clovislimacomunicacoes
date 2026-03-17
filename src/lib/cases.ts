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
}

export const cases: Case[] = [
    {
        slug: 'jornalismo-nsc',
        category: 'Charges / Editorial',
        client: 'NSC Comunicação (SC) / G1 SC',
        sector: 'Veículos de Mídia',
        title: 'O Fim da Rejeição Silenciosa',
        summary: 'Como o humor e a narrativa visual reduziram o abandono de leitura em pautas políticas densas.',
        problem: 'Páginas especiais e editoriais de política sofriam com alta taxa de abandono: o leitor iniciava, mas não concluía a leitura devido à densidade dos blocos de texto.',
        solution: 'Implementação de uma narrativa paralela via charges e quadrinhos integrados ao fluxo da matéria. A ilustração traduz conceitos complexos em 3 segundos.',
        result: 'Aumento significativo na fluidez de leitura e na identidade visual do conteúdo compartilhado em redes sociais.',
        evidence: 'Report de engajamento interno / Feedback de audiência digital.',
        methodology: 'A ilustração editorial funciona como um gatilho de atenção, permitindo ao leitor retomar o foco no texto após uma pausa engajadora.',
        proof: {
            deliverables: 'Série de 12 charges especiais para pauta econômica',
            format: 'SVG para Digital / Vetorial para Impresso',
            impactType: 'Retenção e Engajamento de Audiência'
        }
    },
    {
        slug: 'comunicacao-publica',
        category: 'Charges / Editorial',
        client: 'Prefeituras e Órgãos Públicos',
        sector: 'Gestão Pública',
        title: 'Humanização que Gera Acesso',
        summary: 'Transformando guias burocráticos em narrativas visuais amigáveis para o cidadão.',
        problem: 'Campanhas de serviços públicos com tom excessivamente institucional, gerando distanciamento e sobrecarga nos canais de suporte técnico.',
        solution: 'Desenvolvimento de uma linguagem baseada em HQ. O humor é usado para desmitificar processos complexos e facilitar a compreensão do cidadão.',
        result: 'Redução percebida na incidência de dúvidas básicas no suporte e melhora no sentimento das interações sociais.',
        evidence: 'Report de atendimento (SAC) / Análise de sentimento em redes sociais.',
        methodology: 'A "personificação" da burocracia rompe a barreira da autoridade fria e estabelece uma ponte de confiança direta com o cidadão.',
        proof: {
            deliverables: 'Campanha visual completa: 06 guias em HQ + cards sociais',
            format: 'Impresso (Flyers) e Social Media',
            impactType: 'Clareza de Processo e Percepção de Valor'
        }
    },
    {
        slug: 'tech-licensing',
        category: 'Sites / PWA',
        client: 'SaaS e Startups de Tecnologia',
        sector: 'Tecnologia',
        title: 'Conexão em Ambientes Frios',
        summary: 'Humanização de interfaces técnicas através de ilustrações lúdicas e mascotes personalizados.',
        problem: 'Interfaces de software extremamente limpas que falhavam em criar conexão emocional no onboarding, dificultando fluxos cruciais de setup.',
        solution: 'Licenciamento de sistema de ilustrações que guiam o usuário pelas etapas de configuração com mensagens de incentivo e humor pontual.',
        result: 'Melhora na jornada de configuração assistida e redução de fricção em fluxos de erro complexos.',
        evidence: 'Feedback qualitativo de usuários / Testes de usabilidade assistida.',
        methodology: 'O cérebro processa imagens lúdicas como sinais de segurança, reduzindo a ansiedade do usuário diante de novas tecnologias.',
        proof: {
            deliverables: 'Livraria de +40 estados de ilustração (PNG/SVG)',
            format: 'Componentes React optimizados',
            impactType: 'Experiência do Usuário (UX) e Retenção'
        }
    },
    {
        slug: 'aps-sustentabilidade',
        category: 'Sites / PWA',
        client: 'APS Sustentabilidade',
        sector: 'Sustentabilidade',
        title: 'APS: Presença Institucional Digital',
        summary: 'Arquitetura de informação e desenvolvimento de plataforma institucional para consolidação de legado e atuação pública.',
        problem: 'Necessidade de organizar a comunicação pública da associação, unificando causas, projetos e histórico em uma estrutura digital profissional e segura.',
        solution: 'Desenvolvimento de uma plataforma institucional performática, com leitura clara da missão e fácil acesso aos canais de transparência e projetos.',
        result: 'Aumento na percepção de legitimidade pública e facilidade no compartilhamento da atuação da APS para parceiros e órgãos reguladores.',
        evidence: 'Feedback direto da diretoria / Consolidação de tráfego institucional.',
        methodology: 'Design centrado na clareza e autoridade, utilizando uma linguagem visual limpa que transmite confiança e compromisso socioambiental.',
        proof: {
            deliverables: 'Plataforma Web (Sites / PWA)',
            format: 'Next.js / Cloudflare Optimization',
            impactType: 'Legitimidade e Transparência Institucional'
        }
    }
]

export function getCaseBySlug(slug: string) {
    return cases.find((c) => c.slug === slug)
}

export function getAllCaseSlugs() {
    return cases.map((c) => c.slug)
}
