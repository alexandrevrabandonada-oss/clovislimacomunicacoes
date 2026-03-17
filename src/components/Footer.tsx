export default function Footer() {
  return (
    <footer className="mt-16 py-6 pb-20 md:pb-6 text-center text-sm text-gray-600">
      <div className="max-w-6xl mx-auto space-y-2">
        <p className="text-xs text-slate-400 max-w-md mx-auto">ESBOÇO é um estúdio focado em estratégia e impacto visual, sob direção criativa de Clóvis Lima.</p>
        <p>© {new Date().getFullYear()} ESBOÇO criação & arte — Clóvis Lima</p>
      </div>
    </footer>
  )
}
