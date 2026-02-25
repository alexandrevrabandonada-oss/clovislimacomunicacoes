"use client"

type WorkShareBlockProps = {
  shareUrl: string
  title: string
}

export default function WorkShareBlock({ shareUrl, title }: WorkShareBlockProps) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // no-op
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Confira esta obra: ${title} ${shareUrl}`)}`

  return (
    <aside className="ink-card p-4">
      <h2 className="text-xl font-extrabold">Compartilhar</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="ink-button inline-block rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold"
        >
          Copiar link
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="ink-button inline-block rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold"
        >
          WhatsApp
        </a>
      </div>
    </aside>
  )
}
