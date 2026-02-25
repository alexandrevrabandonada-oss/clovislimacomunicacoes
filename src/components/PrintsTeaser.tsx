"use client"

type OfferItem = {
  slug: 'prints' | 'licenca-editorial' | 'licenca-campanha'
  title: string
  benefit: string
}

const offers: OfferItem[] = [
  {
    slug: 'prints',
    title: 'Print assinado',
    benefit: 'Edicao para colecionar, com autenticidade e impacto visual.'
  },
  {
    slug: 'licenca-editorial',
    title: 'Licenca editorial',
    benefit: 'Uso em jornal, revista ou portal com ajuste ao contexto da pauta.'
  },
  {
    slug: 'licenca-campanha',
    title: 'Licenca campanha',
    benefit: 'Aplicacao em campanha com linguagem autoral e uso combinado.'
  }
]

function goToContact(item: OfferItem) {
  const url = new URL(window.location.href)
  url.searchParams.set('pacote', item.slug)
  url.hash = 'contato'
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  window.dispatchEvent(new CustomEvent('contact-package', { detail: { slug: item.slug, title: item.title } }))
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function PrintsTeaser() {
  return (
    <div>
      <h2 className="text-3xl font-extrabold">Prints &amp; Licenciamento</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {offers.map((item) => (
          <article key={item.slug} className="ink-card p-4">
            <h3 className="text-xl font-extrabold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{item.benefit}</p>
            <button
              type="button"
              onClick={() => goToContact(item)}
              className="ink-button mt-4 rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Quero isso
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
