import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-32 py-20 bg-black text-white border-t-[8px] border-accent relative overflow-hidden">
        {/* Decorative Grid Overlay for Footer */}
        <div className="absolute inset-0 halftone-bg opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
                <div className="md:col-span-5 space-y-8">
                    <Image 
                        src="/brand/logo-horizontal.png" 
                        alt="ESBOÇO" 
                        width={200} 
                        height={60} 
                        className="h-10 w-auto brightness-0 invert" 
                    />
                    <p className="text-xl font-black italic tracking-tighter leading-tight border-l-4 border-accent pl-8 text-white/80">
                        Convertendo complexidade em autoridade visual. <br/> Design Técnico & Narrativa de Soberania.
                    </p>
                </div>

                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-accent">Canais_Diretos</p>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:clovischarges@gmail.com" className="text-lg font-black hover:text-accent transition-colors">clovischarges@gmail.com</a>
                            <a href="https://wa.me/5524992544760" className="text-lg font-black hover:text-accent transition-colors">+55 24 99254-4760</a>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30">Operação_Studio</p>
                        <p className="text-sm font-bold text-white/50 leading-relaxed uppercase tracking-widest">
                            Barra Mansa — rj <br/>
                            Brasil :: 27330-010 <br/>
                            CNPJ 61.117.359/0001-38
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">© {new Date().getFullYear()} Studio ESBOÇO creation & technical art</p>
                <div className="flex gap-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">2026_Standard_Ready</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">All_Diagnostics_Reserved</span>
                </div>
            </div>
        </div>
    </footer>
  )
}
