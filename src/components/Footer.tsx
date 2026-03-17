export default function Footer() {
  return (
    <footer className="mt-16 py-6 pb-20 md:pb-6 text-center text-sm text-gray-600">
      <div className="max-w-6xl mx-auto space-y-2">
        <p className="text-xs text-slate-400 max-w-md mx-auto">ESBOÇO — Estratégia & Design. Direção Criativa: Clóvis Lima.</p>
        <p>© {new Date().getFullYear()} ESBOÇO criação & arte</p>
        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-300 mt-2">CNPJ 61.117.359/0001-38</p>
      </div>
    </footer>
  )
}
