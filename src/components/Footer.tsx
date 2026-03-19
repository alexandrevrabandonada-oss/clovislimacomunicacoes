export default function Footer() {
  return (
    <footer className="mt-16 py-6 pb-20 md:pb-6 text-center text-sm text-gray-600">
      <div className="max-w-6xl mx-auto space-y-3">
        <p className="text-xs text-slate-400 max-w-md mx-auto">ESBOÇO — Estratégia & Design. Direção Criativa: Clóvis Lima.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
           <a href="mailto:clovischarges@gmail.com" className="hover:text-black transition-colors">clovischarges@gmail.com</a>
           <span className="hidden md:block w-1 h-1 bg-slate-200 rounded-full" />
           <a href="https://wa.me/5524992544760" className="hover:text-black transition-colors">+55 24 99254-4760</a>
        </div>
        <p>© {new Date().getFullYear()} ESBOÇO criação & arte</p>
        <p className="text-[10px] font-black tracking-[0.3em] text-slate-300 mt-2 uppercase">CNPJ 61.117.359/0001-38</p>
      </div>
    </footer>
  )
}
