export default function Timeline(){
  const items = [
    { year: '1984', text: 'Estagiário de arte (cartaz) em rede de supermercados.' },
    { year: '1985', text: 'Charges/ilustrações para boletins do Sindicato dos Metalúrgicos.' },
    { year: '1986', text: 'Estágio como cartunista no Sindicato dos Químicos de SP.' },
    { year: '1996-2000', text: 'Setor de comunicação do governo Inês Pandeló (Barra Mansa-RJ).' },
    { year: '2007', text: 'Animações ETA/ETE (Água das Agulhas Negras).' },
    { year: '2011', text: 'Animação Montverd Eco Clothes.' },
    { year: '2023', text: 'Formado em Artes Visuais.' },
    { year: 'Atual', text: 'Cartunista/diagramador do SEPE-RJ; professor; caricatura ao vivo; ilustração.' }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold">Sobre / Timeline</h2>
      <ol className="mt-4 border-l-2 pl-4">
        {items.map(i=> (
          <li key={i.year} className="mb-4">
            <div className="text-sm font-semibold">{i.year}</div>
            <div className="bg-white p-3 border mt-1">{i.text}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
