import Link from 'next/link'

export default function Header(){
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur z-40 border-b">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="#hero" className="text-xl font-bold">Clóvis Lima</Link>
          <span className="stamp">Cartunista</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#works" className="hover:underline">Trabalhos</a>
          <a href="#services" className="hover:underline">Serviços</a>
          <a href="#about" className="hover:underline">Sobre</a>
          <a href="#contact" className="btn border px-3 py-1 rounded">Contato</a>
        </div>
      </nav>
    </header>
  )
}
