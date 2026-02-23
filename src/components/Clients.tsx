import StampBadge from './StampBadge'

export default function Clients(){
  const clients = [
    { label: 'IBASE', variant: 'rect' as const },
    { label: 'Dupont', variant: 'tilted' as const },
    { label: 'Diário do Vale', variant: 'rough' as const },
    { label: 'Folha do Aço', variant: 'tilted' as const },
    { label: 'Pavio Curto', variant: 'rect' as const }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold">Clientes / Veículos</h2>
      <p className="mt-3 text-sm md:text-base">Trabalhos publicados/realizados para:</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
        {clients.map((client)=> (
          <StampBadge key={client.label} label={client.label} variant={client.variant} />
        ))}
      </div>
    </div>
  )
}
