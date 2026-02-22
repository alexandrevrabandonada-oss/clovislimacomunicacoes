export default function Hero(){
  return (
    <div className="min-h-[64vh] flex items-center">
      <div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Clóvis Lima</h1>
        <p className="mt-4 max-w-2xl">Cartunista, ilustrador e professor. Trabalho com charges, ilustração editorial e projetos visuais para mídia impressa e digital.</p>
        <a href="#works" className="inline-block mt-6 bg-accent text-white px-4 py-2 rounded">Ver trabalhos</a>
      </div>
      <div className="ml-auto hidden md:block w-48 h-48 bg-white border-4 border-black rounded-full flex items-center justify-center strong-stroke">\o/</div>
    </div>
  )
}
