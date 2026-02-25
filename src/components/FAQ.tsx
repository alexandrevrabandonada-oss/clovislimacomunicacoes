export default function FAQ() {
  const items = [
    {
      q: 'Qual o prazo medio?',
      a: 'Depende do escopo. Uma landing costuma levar de 1 a 3 semanas; projetos maiores entram em fases com cronograma claro. Sempre alinhamos prazo realista antes de iniciar.'
    },
    {
      q: 'O que eu preciso te enviar pra comecar?',
      a: 'Objetivo do projeto, publico, referencias, conteudo base e prazo desejado. Se faltar algo, eu te guio com um briefing simples e direto.'
    },
    {
      q: 'PWA e app?',
      a: 'PWA funciona como app no celular, com instalacao e boa performance, mas sem passar por loja em muitos casos. E uma rota rapida para validar produto.'
    },
    {
      q: 'Voces fazem manutencao?',
      a: 'Sim. Posso cuidar de ajustes, atualizacao de conteudo e melhorias continuas por pacote recorrente ou sob demanda, conforme sua necessidade.'
    },
    {
      q: 'Como funciona revisao/aprovacao?',
      a: 'Trabalho com etapas curtas: proposta, entrega parcial, feedback objetivo e ajuste final. Isso reduz retrabalho e acelera a aprovacao.'
    }
  ]

  return (
    <section>
      <h2 className="text-3xl font-extrabold">FAQ</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="ink-card p-0 open:bg-white/95">
            <summary className="cursor-pointer list-none px-4 py-3 font-semibold hover:bg-black/[0.03]">
              {item.q}
            </summary>
            <div className="border-t border-black/10 px-4 py-3 text-sm leading-relaxed text-slate-800">
              {item.a}
            </div>
          </details>
        ))}
      </div>
      <a href="#contato" className="ink-button mt-4 inline-block rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold">
        Ainda com duvida? Fala comigo
      </a>
    </section>
  )
}
