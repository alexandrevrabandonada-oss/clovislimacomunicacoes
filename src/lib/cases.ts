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
        category: 'Editorial',
        client: 'NSC Comunicação / G1 SC',
        sector: 'Mídia e Editorial',
        title: 'Narrativa Visual em Pautas Políticas',
        summary: 'Integração de charges e quadrinhos para reduzir o abandono de leitura em matérias de alta densidade técnica.',
        problem: 'Páginas especiais de política registravam queda na retenção de usuários após os primeiros blocos de texto denso.',
        solution: 'Desenvolvimento de uma narrativa visual paralela que traduz conceitos complexos em ganchos de atenção ao longo do scroll.',
        result: 'Melhora na fluidez de leitura e aumento no tempo de permanência em conteúdos de pauta densa.',
        evidence: 'Feedback editorial e métricas de scroll qualitativas.',
        methodology: 'A ilustração editorial atua como um respiro cognitivo, facilitando a retomada do foco no texto principal.',
        proof: {
            deliverables: 'Série de 12 charges especiais para pauta econômica',
            format: 'SVG para Digital / Vetorial para Impresso',
            impactType: 'Retenção e Engajamento'
        }
    },
    {
        slug: 'comunicacao-publica',
        category: 'Comunicação Pública',
        client: 'Prefeituras e Órgãos Governamentais',
        sector: 'Setor Público',
        title: 'Humanização de Guias de Serviço',
        summary: 'Uso de linguagem de quadrinhos para simplificar processos burocráticos e aproximar a gestão do cidadão.',
        problem: 'Campanhas de serviços públicos com linguagem fria e burocrática, gerando distanciamento e ruído no entendimento do usuário.',
        solution: 'Adaptação de guias técnicos para o formato de HQ, utilizando o humor para desmitificar etapas complexas de atendimento.',
        result: 'Facilitação no entendimento dos fluxos e redução percebida na demanda por suporte básico.',
        evidence: 'Retorno operacional e observação de audiência em canais sociais.',
        methodology: 'A humanização via narrativa visual reduz a barreira de autoridade e estabelece uma ponte de confiança direta.',
        proof: {
            deliverables: 'Campanha visual: 06 guias em HQ + cards informativos',
            format: 'Digital e Impresso',
            impactType: 'Clareza de Processo'
        }
    },
    {
        slug: 'tech-licensing',
        category: 'Digital / UX',
        client: 'SaaS e Startups Tech',
        sector: 'Tecnologia',
        title: 'Identidade e Onboarding Assistido',
        summary: 'Criação de mascotes e ilustrações de interface para humanizar jornadas de configuração de software.',
        problem: 'Interfaces de software minimalistas que falhavam em criar segurança emocional em etapas críticas de setup.',
        solution: 'Sistema de ilustrações lúdicas que guiam o usuário em estados de erro e sucesso, trazendo personalidade ao produto.',
        result: 'Melhora na percepção de suporte ao usuário e suavização de fluxos de configuração complexos.',
        evidence: 'Leitura qualitativa e feedback de interface (UX).',
        methodology: 'O uso de elementos figurativos lúdicos sinaliza acolhimento, reduzindo a ansiedade do usuário diante de tecnologia nova.',
        proof: {
            deliverables: 'Livraria de +40 estados de ilustração (PNG/SVG)',
            format: 'Componentes React',
            impactType: 'Experiência do Usuário (UX)'
        }
    },
    {
        slug: 'aps-sustentabilidade',
        category: 'Presença Digital',
        client: 'APS Sustentabilidade',
        sector: 'Socioambiental',
        title: 'APS Sustentabilidade — Plataforma Institucional PWA',
        summary: 'Arquitetura de informação e presença digital para consolidar legado e transparência ativa de associação socioambiental.',
        problem: 'Necessidade institucional de organizar a comunicação pública e o histórico de projetos em uma estrutura digital única, veloz e acessível.',
        solution: 'Desenvolvimento de ecossistema digital (PWA) focado em performance, hierarquia de pautas e facilidade de contato.',
        result: 'Clareza imediata na apresentação da atuação institucional e fortalecimento da autoridade digital da associação.',
        evidence: 'Retorno operacional e consolidação de canais de contato.',
        methodology: 'O design editorial aplicado à web transforma dados complexos em uma jornada de leitura fluida e confiável.',
        proof: {
            deliverables: 'Plataforma Web Institucional / PWA',
            format: 'Next.js / Cloudflare / Responsive',
            impactType: 'Legitimidade e Transparência'
        }
    }
]

export function getCaseBySlug(slug: string) {
    return cases.find((c) => c.slug === slug)
}

export function getAllCaseSlugs() {
    return cases.map((c) => c.slug)
}
