"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Modal from './Modal'

type Work = {
  id: string
  title: string
  slug: string
  type: string
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
  const [selected,setSelected] = useState<Work|undefined>()
  const [unlocked, setUnlocked] = useState<Record<string,boolean>>({})

  const works = inputWorks.filter(
    (w) => filter === 'all' || (isSensitive(w.content_warning) ? filter === 'sensitive' : filter === 'safe')
  )

  const askForStyle = (work: Work) => {
    const message = `Quero algo nesse estilo: "${work.title}" (${work.type}).`
    const url = new URL(window.location.href)
    url.searchParams.set('prefill_message', message)
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    window.dispatchEvent(new CustomEvent('contact-prefill', { detail: { message } }))
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setSelected(undefined)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold">Galeria de Charges</h2>
        <div className="flex gap-2">
          <button onClick={()=>setFilter('all')} className="px-3 py-1 border border-black bg-white rounded-full text-sm">Todos</button>
          <button onClick={()=>setFilter('safe')} className="px-3 py-1 border border-black bg-white rounded-full text-sm">Sem alerta</button>
          <button onClick={()=>setFilter('sensitive')} className="px-3 py-1 border border-black bg-white rounded-full text-sm">Com aviso</button>
        </div>
      </div>

      <div className="mt-6 columns-1 sm:columns-2 xl:columns-3 gap-5">
        {works.map((w, index)=> {
          const cover = coverUrl(w)
          const sensitive = isSensitive(w.content_warning)
          const locked = sensitive && !unlocked[w.id]
          const aspect = TILE_ASPECTS[index % TILE_ASPECTS.length]

          return (
            <article key={w.id} className="ink-card mb-5 break-inside-avoid p-3">
              <div className={`relative ${aspect} overflow-hidden rounded-[18px] border border-black/30`}>
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
                  <button onClick={()=>setSelected(w)} className="px-3 py-1.5 border border-black rounded-full bg-white text-sm font-medium">Abrir obra</button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <Modal open={!!selected} onClose={()=>setSelected(undefined)}>
        {selected && (
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/30">
              {coverUrl(selected) ? (
                <Image
                  src={coverUrl(selected)}
                  alt={selected.title}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(160deg,#f5f5f5_0%,#ececec_100%)]" />
              )}
            </div>
            <h3 className="mt-4 text-2xl font-bold">{selected.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-black/70 px-2 py-1 bg-white">{selected.type}</span>
              {isSensitive(selected.content_warning) && (
                <span className="rounded-full border border-red-800/80 px-2 py-1 bg-red-50 text-red-900">conteúdo sensível</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => askForStyle(selected)}
              className="mt-5 rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Quero algo nesse estilo
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
