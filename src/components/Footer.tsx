export default function Footer() {
  return (
    <footer className="mt-16 py-6 pb-20 md:pb-6 text-center text-sm text-gray-600">
      <div className="max-w-6xl mx-auto space-y-2">
        <p className="text-xs text-slate-400 max-w-md mx-auto">ESBOÇO — Estúdio de Estratégia e Impacto Visual. Direção Criativa: Clóvis Lima.</p>
        <p>© {new Date().getFullYear()} ESBOÇO criação & arte</p>
      </div>
    </footer>
  )
}
