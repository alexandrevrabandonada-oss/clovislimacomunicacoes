export default function Clients(){
  const logos = ['IBASE','Dupont','Diário do Vale','Folha do Aço','Pavio Curto']
  return (
    <div>
      <h2 className="text-2xl font-bold">Clientes / Veículos</h2>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
        {logos.map(l=> (
          <div key={l} className="bg-white border p-3 text-center">{l}</div>
        ))}
      </div>
    </div>
  )
}
