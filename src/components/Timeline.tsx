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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[3px] border-black pb-10">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-2.5 h-2.5 bg-accent" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Evolução & Autoridade // 1984 — 2026</p>
                    </div>
                    <h2 ref={headingRef} className={`text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] text-black ${revealed ? 'is-revealed' : ''}`}>
                        Legado em <br/> <span className="italic font-serif text-accent">Construção Ativa</span>
                    </h2>
                </div>
                <div className="max-w-sm">
                    <p className="text-sm font-black text-black leading-tight italic border-l-[6px] border-black pl-8 uppercase tracking-tighter">
                        Quatro décadas transformando pautas complexas em narrativa visual soberana. O Studio ESBOÇO é a convergência técnica deste percurso.
                    </p>
                </div>
            </div>

            {/* Cycles Grid */}
            <div className="grid grid-cols-1 gap-16 relative pb-16">
                {/* Vertical Line */}
                <div className="absolute left-[15px] md:left-1/2 top-4 bottom-0 w-[3px] bg-black/5 hidden md:block" />

                {cycles.map((cycle, index) => (
                    <div key={cycle.era} className={`relative flex flex-col md:flex-row gap-12 items-start ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                        {/* Desktop Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-12 hidden md:flex items-center justify-center z-10">
                            <div className={`w-6 h-6 border-[3px] border-black transition-all ${cycle.current ? 'bg-accent shadow-[0_0_15px_var(--accent)] animate-pulse' : 'bg-white'}`} />
                        </div>

                        {/* Content Card */}
                        <div className={`w-full md:w-[45%] ink-card p-0 border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_var(--accent)] transition-all bg-white overflow-hidden`}>
                            <div className={`p-4 border-b-[3px] border-black flex items-center justify-between ${cycle.current ? 'bg-black text-white' : 'bg-white'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 ${cycle.current ? 'bg-accent' : 'bg-black'}`} />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{cycle.era}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 border-2 ${cycle.current ? 'bg-accent text-white border-white' : 'bg-black text-white border-black'}`}>
                                    {cycle.badge}
                                </span>
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-black italic mb-6 tracking-tighter leading-none uppercase">{cycle.title}</h3>
                                <ul className="space-y-4">
                                    {cycle.milestones.map((ms, i) => (
                                        <li key={i} className="flex items-start gap-4 group">
                                            <span className="text-[10px] font-black text-accent mt-1 tracking-widest">0{i+1}</span>
                                            <p className="text-sm font-bold text-black leading-tight group-hover:text-accent transition-colors italic">
                                                {ms}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20 italic">Technical_Log // {cycle.badge}_Protocol</span>
                                    <div className="flex gap-1">
                                      {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-black/5" />)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Spacer / Line Indicator */}
                        <div className="md:hidden flex items-center gap-4">
                             <div className={`w-3 h-3 ${cycle.current ? 'bg-accent animate-pulse shadow-lg' : 'bg-black'}`} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-black/30">Protocolo_Evolução</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Closing Statement */}
            <div className="bg-black text-white p-12 md:p-20 border-[4px] border-black flex flex-col lg:flex-row items-center justify-between gap-16 shadow-[32px_32px_0px_0px_rgba(239,68,68,1)]">
                <div className="max-w-2xl">
                    <p className="text-accent text-[11px] font-black uppercase tracking-[0.5em] mb-6">Manifesto ESBOÇO 2026</p>
                    <h4 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.85] mb-8 uppercase">
                        O tempo não apenas passa. <br/> Ele <span className="text-accent underline decoration-white/20 underline-offset-8">Acumula Autoridade.</span>
                    </h4>
                    <p className="text-lg md:text-xl text-white/60 font-black italic leading-tight border-l-[8px] border-accent pl-8">
                        Nossa trajetória é a garantia técnica de que cada traço, cada linha de código e cada report estratégico possui a soberania de quem opera no topo da cadeia de comunicação.
                    </p>
                </div>
                <div className="shrink-0">
                    <div className="w-40 h-40 border-[4px] border-accent flex items-center justify-center p-6 shadow-[16px_16px_0px_0px_rgba(255,255,255,0.1)] transition-transform hover:scale-110">
                        <div className="w-full h-full bg-white text-black flex items-center justify-center text-5xl font-black italic shadow-inner">CL</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
