"use client"

import { useRevealOnView } from '../lib/useRevealOnView'

export default function Timeline(){
    const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
    
    const cycles = [
      {
        era: '1984 — 1990',
        title: 'Formação & Ativismo Visual',
        milestones: [
          'Estágio em Arte (Cartazismo) — Início da disciplina de síntese visual.',
          'Charges e Ilustração Sindical (Metalúrgicos/Químicos SP) — A arte como ferramenta de mobilização e política.'
        ],
        badge: 'Roots'
      },
      {
        era: '1996 — 2011',
        title: 'Gestão, Comunicação & Movimento',
        milestones: [
          'Comunicação Governamental (Barra Mansa-RJ) — Estratégia de imagem pública.',
          'Animação Técnica e Editorial (ETA/ETE) — Decodificação de processos complexos em narrativa visual.'
        ],
        badge: 'Strategy'
      },
      {
        era: '2023 — Presente',
        title: 'ESBOÇO: A Consolidação do Legado',
        milestones: [
          'Artes Visuais (Graduação) — Refinamento acadêmico e autoral.',
          'Operação SEPE-RJ — Diagramação e Charge Editorial de alto impacto diário.',
          'Studio ESBOÇO — Fusão de 40 anos de autoridade em Design, Digital & Prints.'
        ],
        badge: 'Nexus 2026',
        current: true
      }
    ];

    return (
        <div className="space-y-12">
            {/* Timeline Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Evolução & Autoridade / 1984 — 2026</p>
                    </div>
                    <h2 ref={headingRef} className={`text-4xl md:text-6xl font-black tracking-tighter leading-none text-slate-900 ${revealed ? 'is-revealed' : ''}`}>
                        Legado em <span className="italic font-serif">Construção Ativa</span>
                    </h2>
                </div>
                <div className="max-w-xs">
                    <p className="text-xs font-bold text-slate-600 leading-tight italic border-l-2 border-accent pl-4">
                        Quatro décadas transformando pautas complexas em narrativa visual. O Studio ESBOÇO é a convergência técnica deste percurso.
                    </p>
                </div>
            </div>

            {/* Cycles Grid */}
            <div className="grid grid-cols-1 gap-12 relative pb-12">
                {/* Vertical Line */}
                <div className="absolute left-[15px] md:left-1/2 top-4 bottom-0 w-[2px] bg-black/10 hidden md:block" />

                {cycles.map((cycle, index) => (
                    <div key={cycle.era} className={`relative flex flex-col md:flex-row gap-8 items-start ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                        {/* Desktop Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-10 hidden md:flex items-center justify-center z-10">
                            <div className={`w-4 h-4 rounded-full border-4 border-white ${cycle.current ? 'bg-accent animate-ping scale-150' : 'bg-black'}`} />
                        </div>

                        {/* Content Card */}
                        <div className={`w-full md:w-[45%] ink-card p-0 border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden ${cycle.current ? 'ring-4 ring-accent/20' : ''}`}>
                            <div className={`p-6 border-b-2 border-black flex items-center justify-between ${cycle.current ? 'bg-black text-white' : 'bg-slate-50'}`}>
                                <span className="text-[10px] font-black uppercase tracking-widest">{cycle.era}</span>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${cycle.current ? 'bg-accent text-white' : 'bg-black text-white'}`}>
                                    {cycle.badge}
                                </span>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-black italic mb-6 tracking-tight leading-none">{cycle.title}</h3>
                                <ul className="space-y-4">
                                    {cycle.milestones.map((ms, i) => (
                                        <li key={i} className="flex items-start gap-4 group">
                                            <span className="text-[10px] font-black text-accent mt-1">0{i+1}</span>
                                            <p className="text-sm font-bold text-slate-700 leading-snug group-hover:text-black transition-colors">
                                                {ms}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Mobile Spacer / Line Indicator */}
                        <div className="md:hidden flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${cycle.current ? 'bg-accent animate-pulse' : 'bg-black'}`} />
                             <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Ponto de Evolução</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Closing Statement */}
            <div className="bg-black text-white p-12 border-[3px] border-black flex flex-col md:flex-row items-center justify-between gap-10 shadow-[16px_16px_0px_0px_rgba(239,68,68,1)]">
                <div className="max-w-xl">
                    <p className="text-accent text-xs font-black uppercase tracking-[0.4em] mb-4">Manifesto ESBOÇO 2026</p>
                    <h4 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none mb-6">
                        O tempo não apenas passa. <br/> Ele <span className="text-accent underline decoration-white/20 underline-offset-8">Acumula Autoridade.</span>
                    </h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        Nossa trajetória é a garantia de que cada traço, cada linha de código e cada report estratégico possui a densidade de quem entende a comunicação como um ativo de longo prazo.
                    </p>
                </div>
                <div className="shrink-0">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center p-4">
                        <div className="w-full h-full rounded-full bg-accent flex items-center justify-center text-4xl font-black italic">CL</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
