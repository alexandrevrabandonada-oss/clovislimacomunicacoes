"use client"

type QuickOption = {
  slug: 'charge-avulsa' | 'landing-rapida' | 'pwa'
  title: string
  button: string
}

const options: QuickOption[] = [
  { slug: 'charge-avulsa', title: 'Charge avulsa', button: 'Quero uma charge' },
  { slug: 'landing-rapida', title: 'Landing rapida', button: 'Quero landing' },
  { slug: 'pwa', title: 'PWA', button: 'Quero PWA' }
]

function goWithPackage(option: QuickOption) {
  const url = new URL(window.location.href)
  url.searchParams.set('pacote', option.slug)
  url.hash = 'contato'
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  window.dispatchEvent(new CustomEvent('contact-package', { detail: { slug: option.slug, title: option.title } }))
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goWithoutPackage() {
  const url = new URL(window.location.href)
  url.searchParams.delete('pacote')
  url.hash = 'contato'
  window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function QuickQuote() {
  return (
    <div className="ink-card p-4">
      <h3 className="text-xl font-extrabold">Orcamento rapido</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.slug}
            type="button"
            onClick={() => goWithPackage(option)}
            className="ink-button rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold"
          >
            {option.button}
          </button>
        ))}
        <button
          type="button"
          onClick={goWithoutPackage}
          className="ink-button rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Nao sei ainda
        </button>
      </div>
    </div>
  )
}
