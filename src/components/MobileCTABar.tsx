"use client"

import { useEffect, useState } from 'react'

const DEFAULT_TEXT = 'Ola! Quero conversar sobre um projeto.'

export default function MobileCTABar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const body = document.body
    if (!body) return

    const updateVisibility = () => {
      const modalByOverflow = body.style.overflow === 'hidden'
      const modalByFlag = body.dataset.modalOpen === 'true'
      setHidden(modalByOverflow || modalByFlag)
    }

    updateVisibility()
    const observer = new MutationObserver(updateVisibility)
    observer.observe(body, { attributes: true, attributeFilter: ['style', 'data-modal-open'] })
    return () => observer.disconnect()
  }, [])

  const goTo = (targetId: string, focusName = false) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = document.getElementById(targetId)
    if (!target) return
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState({}, '', `#${targetId}`)
    if (focusName) {
      window.setTimeout(() => {
        const input = document.getElementById('contact-name') as HTMLInputElement | null
        input?.focus()
      }, reduced ? 0 : 120)
    }
  }

  const openWhatsApp = () => {
    const href = `https://wa.me/?text=${encodeURIComponent(DEFAULT_TEXT)}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  if (hidden) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t-2 border-black bg-paper px-3 py-2">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2">
        <button
          type="button"
          onClick={openWhatsApp}
          className="ink-button rounded-full border border-black bg-black px-2 py-2 text-xs font-semibold text-white"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => goTo('contato', true)}
          className="ink-button rounded-full border border-black bg-white px-2 py-2 text-xs font-semibold text-black"
        >
          Orcamento
        </button>
        <button
          type="button"
          onClick={() => goTo('trabalhos')}
          className="ink-button rounded-full border border-black bg-accent px-2 py-2 text-xs font-semibold text-white"
        >
          Trabalhos
        </button>
      </div>
    </div>
  )
}
