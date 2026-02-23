"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Modal from './Modal'
import { trackEvent } from '../lib/analytics'

type Work = {
  id: string
  title: string
  slug: string
  type: string
  description?: string | null
  created_at?: string | null
  cover_url: string | null
  cover_image_url: string | null
  content_warning: string | null
}

type GalleryProps = {
  works: Work[]
}

function isSensitive(contentWarning: string | null): boolean {
  if (contentWarning === null || contentWarning === undefined) return false
  const text = String(contentWarning).trim().toLowerCase()
  if (!text) return false
  if (['false', '0', 'no', 'none', 'null'].includes(text)) return false
  return true
}

function coverUrl(work: Work): string {
  return (work.cover_url || work.cover_image_url || '').trim()
}

const TILE_ASPECTS = [
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-[1/1]',
  'aspect-[5/4]'
]

export default function Gallery({ works: inputWorks }: GalleryProps){
  const [filter,setFilter] = useState('all')
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [unlocked, setUnlocked] = useState<Record<string,boolean>>({})
  const [currentUrl, setCurrentUrl] = useState('')

  const works = inputWorks.filter(
    (w) => filter === 'all' || (isSensitive(w.content_warning) ? filter === 'sensitive' : filter === 'safe')
  )
  const selected = useMemo(
    () => inputWorks.find((work) => work.slug === selectedSlug),
    [inputWorks, selectedSlug]
  )

  const syncSelectedFromLocation = useCallback(() => {
    if (typeof window === 'undefined') return
    setCurrentUrl(window.location.href)
    const match = window.location.pathname.match(/^\/w\/([^/]+)$/)
    if (!match) {
      setSelectedSlug(null)
      return
    }
    const slug = decodeURIComponent(match[1])
    const exists = inputWorks.some((work) => work.slug === slug)
    setSelectedSlug(exists ? slug : null)
  }, [inputWorks])

  useEffect(() => {
    syncSelectedFromLocation()
    const onPop = () => syncSelectedFromLocation()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [syncSelectedFromLocation])

  const openWorkModal = (work: Work) => {
    setSelectedSlug(work.slug)
    window.history.pushState({}, '', `/w/${encodeURIComponent(work.slug)}`)
    setCurrentUrl(window.location.href)
    trackEvent('open_work_modal', { slug: work.slug, type: work.type })
  }

  const closeWorkModal = () => {
    setSelectedSlug(null)
    window.history.pushState({}, '', '/#works')
    setCurrentUrl(window.location.href)
  }

  const askForStyle = (work: Work) => {
    const message = `Quero algo nesse estilo: "${work.title}" (${work.type}).`
    const url = new URL(window.location.href)
    url.searchParams.set('prefill_message', message)
    window.history.replaceState({}, '', `/${url.search}${url.hash}`)
    window.dispatchEvent(new CustomEvent('contact-prefill', { detail: { message } }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setSelectedSlug(null)
  }

  const shareCurrent = async () => {
    const href = window.location.href
    try {
      await navigator.clipboard.writeText(href)
    } catch {
      // no-op
    }
  }

  return (
    <div className="pt-2">
      <h2 className="text-3xl md:text-4xl font-extrabold">Galeria de Charges</h2>
      <p className="mt-2 text-sm md:text-base text-slate-700">Selecione o filtro e explore as obras publicadas.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 mr-1">Filtro</div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>setFilter('all')} className="ink-chip px-3 py-1 text-sm font-medium">Todos</button>
          <button onClick={()=>setFilter('safe')} className="ink-chip px-3 py-1 text-sm font-medium">Sem alerta</button>
          <button onClick={()=>setFilter('sensitive')} className="ink-chip px-3 py-1 text-sm font-medium">Com aviso</button>
        </div>
      </div>

      <div className="mt-6 columns-1 sm:columns-2 xl:columns-3 gap-4 md:gap-5">
        {works.map((w, index)=> {
          const cover = coverUrl(w)
          const sensitive = isSensitive(w.content_warning)
          const locked = sensitive && !unlocked[w.id]
          const aspect = TILE_ASPECTS[index % TILE_ASPECTS.length]

          return (
            <article key={w.id} className="ink-card mb-4 md:mb-5 break-inside-avoid p-3 md:p-3.5">
              <div className={`ink-frame relative ${aspect}`}>
                {cover ? (
                  <Image
                    src={cover}
                    alt={w.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className={`object-cover transition duration-300 ${locked ? 'scale-105 blur-sm' : ''}`}
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(160deg,#f5f5f5_0%,#ececec_100%)]" />
                )}
                {locked && (
                  <button
                    type="button"
                    onClick={()=>setUnlocked((prev)=>({ ...prev, [w.id]: true }))}
                    className="absolute inset-0 flex items-center justify-center bg-black/45 p-4 text-center text-white"
                  >
                    <span className="rounded-full border border-white/70 bg-black/50 px-3 py-2 text-sm font-semibold">
                      Conteúdo sensível • Mostrar
                    </span>
                  </button>
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-semibold leading-tight">{w.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-black/70 px-2 py-1 bg-white">{w.type}</span>
                  {sensitive && <span className="rounded-full border border-red-800/80 px-2 py-1 bg-red-50 text-red-900">sensível</span>}
                </div>
                <div className="mt-3">
                  <button onClick={()=>openWorkModal(w)} className="ink-button px-3 py-1.5 bg-white text-sm font-medium">Abrir obra</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <Modal open={!!selected} onClose={closeWorkModal} labelledById="gallery-modal-title">
        {selected && (
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/30">
              {isSensitive(selected.content_warning) && !unlocked[selected.id] ? (
                <button
                  type="button"
                  onClick={() => setUnlocked((prev) => ({ ...prev, [selected.id]: true }))}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/65 p-4 text-center text-white"
                >
                  <span className="rounded-full border border-white/70 bg-black/50 px-3 py-2 text-sm font-semibold">
                    Conteúdo sensível • Mostrar
                  </span>
                </button>
              ) : null}
              {coverUrl(selected) ? (
                <Image src={coverUrl(selected)} alt={selected.title} fill sizes="90vw" className="object-cover" />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(160deg,#f5f5f5_0%,#ececec_100%)]" />
              )}
            </div>
            <h3 id="gallery-modal-title" className="mt-4 text-2xl font-bold">{selected.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-black/70 px-2 py-1 bg-white">{selected.type}</span>
              {isSensitive(selected.content_warning) && (
                <span className="rounded-full border border-red-800/80 px-2 py-1 bg-red-50 text-red-900">conteúdo sensível</span>
              )}
            </div>
            {selected.created_at && <p className="mt-3 text-sm text-slate-700">Ano: {new Date(selected.created_at).getFullYear()}</p>}
            {selected.description && <p className="mt-2 text-sm leading-relaxed text-slate-700">{selected.description}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={shareCurrent} className="ink-button bg-white px-3 py-1.5 text-sm font-semibold">
                Copiar link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Confira esta obra: ${selected.title} ${currentUrl || `/w/${selected.slug}`}`)}`}
                target="_blank"
                rel="noreferrer"
                className="ink-button bg-white px-3 py-1.5 text-sm font-semibold"
              >
                WhatsApp
              </a>
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Confira esta obra: ${selected.title}`)}&url=${encodeURIComponent(currentUrl || `/w/${selected.slug}`)}`}
                target="_blank"
                rel="noreferrer"
                className="ink-button bg-white px-3 py-1.5 text-sm font-semibold"
              >
                X
              </a>
            </div>
            <button
              type="button"
              onClick={() => askForStyle(selected)}
              className="ink-button mt-5 bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Quero algo nesse estilo
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
