"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Modal from './Modal'
import { trackEvent } from '../lib/analytics'
import { useTilt } from '../lib/useTilt'
import { useRevealOnView } from '../lib/useRevealOnView'

type ManifestItem = {
  file: string
  title: string
  type?: string
  content_warning?: boolean
}

type ManifestData = {
  defaultType?: string
  items?: Record<string, ManifestItem>
}

type GalleryItem = {
  id: string
  file: string
  src: string
  title: string
  type: string
  contentWarning: boolean
}

function normalizeWarning(value: unknown): boolean {
  return value === true || String(value).toLowerCase() === 'true'
}

const TILE_ASPECTS = [
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-[1/1]',
  'aspect-[5/4]'
]

function getTileClasses(index: number): string {
  if (index === 0) return 'sm:col-span-2 lg:col-span-4 lg:row-span-2'
  if (index === 4) return 'sm:col-span-2 lg:col-span-3 lg:row-span-2'
  return 'sm:col-span-1 lg:col-span-2 lg:row-span-1'
}

type GalleryCardProps = {
  item: GalleryItem
  index: number
  onOpen: (work: GalleryItem) => void
}

function GalleryCard({ item, index, onOpen }: GalleryCardProps) {
  const tiltRef = useTilt<HTMLElement>(3)
  const sensitive = item.contentWarning
  const aspect = TILE_ASPECTS[index % TILE_ASPECTS.length]
  const tileClass = getTileClasses(index)
  const largeTile = index === 0 || index === 4

  return (
    <article
      ref={tiltRef}
      className={`ink-card p-3 md:p-3.5 ${tileClass}`}
      role="button"
      tabIndex={0}
      aria-label={`Abrir obra ${item.title}`}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(item)
        }
      }}
    >
      <div className={`ink-frame relative ${largeTile ? 'aspect-[16/10]' : aspect}`}>
        {item.src ? (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-300"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(160deg,#f5f5f5_0%,#ececec_100%)]" />
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-semibold leading-tight">{item.title}</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-black/70 px-2 py-1 bg-white">{item.type}</span>
          {sensitive && <span className="rounded-full border border-red-800/80 px-2 py-1 bg-red-50 text-red-900">sensível</span>}
        </div>
        <div className="mt-3">
          <button
            onClick={(event) => {
              event.stopPropagation()
              onOpen(item)
            }}
            className="ink-button px-3 py-1.5 bg-white text-sm font-medium"
          >
            Abrir obra
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Gallery(){
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const [filter,setFilter] = useState<'all' | 'safe' | 'sensitive'>('all')
  const [items, setItems] = useState<GalleryItem[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const loadManifest = async () => {
    setStatus('loading')
    try {
      const response = await fetch('/portfolio/manifest.json', { cache: 'no-store' })
      if (!response.ok) throw new Error('manifest fetch failed')
      const manifest = (await response.json()) as ManifestData
      const defaultType = (manifest.defaultType || 'obra').trim() || 'obra'
      const rawItems = manifest.items || {}
      const normalized = Object.entries(rawItems).map(([key, value]) => {
        const file = (value?.file || key || '').trim()
        return {
          id: key,
          file,
          src: `/portfolio/${encodeURIComponent(file)}`,
          title: (value?.title || file || 'Obra').trim(),
          type: (value?.type || defaultType).trim(),
          contentWarning: normalizeWarning(value?.content_warning)
        }
      }).filter((item) => item.file)
      setItems(normalized)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    void loadManifest()
  }, [])

  const works = useMemo(
    () => items.filter((w) => filter === 'all' || (w.contentWarning ? filter === 'sensitive' : filter === 'safe')),
    [items, filter]
  )

  const selected = useMemo(
    () => items.find((work) => work.id === selectedId) || null,
    [items, selectedId]
  )

  const openWorkModal = (work: GalleryItem) => {
    setSelectedId(work.id)
    trackEvent('open_work_modal', { file: work.file, type: work.type })
  }

  const closeWorkModal = () => {
    setSelectedId(null)
  }

  return (
    <div className="pt-2">
      <h2 ref={headingRef} className={`reveal-heading text-3xl md:text-4xl font-extrabold ${revealed ? 'is-revealed' : ''}`}>Galeria de Charges</h2>
      <p className="mt-2 text-sm md:text-base text-slate-700">Selecione o filtro e explore as obras publicadas.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 mr-1">Filtro</div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>setFilter('all')} className="ink-chip px-3 py-1 text-sm font-medium">Todos</button>
          <button onClick={()=>setFilter('safe')} className="ink-chip px-3 py-1 text-sm font-medium">Sem alerta</button>
          <button onClick={()=>setFilter('sensitive')} className="ink-chip px-3 py-1 text-sm font-medium">Com aviso</button>
        </div>
      </div>

      {status === 'loading' && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5 lg:grid-flow-dense">
          {[1, 2, 3, 4, 5, 6].map((slot) => (
            <article key={slot} className={`ink-card p-3 md:p-3.5 animate-pulse ${getTileClasses(slot - 1)}`}>
              <div className="ink-frame relative aspect-[4/5] bg-slate-200" />
              <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-slate-200" />
            </article>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 ink-card p-4">
          <p className="text-sm text-slate-700">Nao foi possivel carregar a galeria agora.</p>
          <button type="button" onClick={() => void loadManifest()} className="ink-button mt-3 bg-white px-3 py-1.5 text-sm font-semibold">
            Tentar novamente
          </button>
        </div>
      )}

      {status === 'ready' && works.length === 0 && (
        <div className="mt-6 ink-card p-4">
          <p className="text-sm text-slate-700">Nenhuma obra encontrada.</p>
        </div>
      )}

      {status === 'ready' && works.length > 0 && (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5 lg:grid-flow-dense">
        {works.map((item, index) => (
          <GalleryCard key={item.id} item={item} index={index} onOpen={openWorkModal} />
        ))}
      </div>
      )}

      <Modal open={!!selected} onClose={closeWorkModal} labelledById="gallery-modal-title">
        {selected && (
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/30">
              <Image src={selected.src} alt={selected.title} fill sizes="90vw" className="object-cover" />
            </div>
            <h3 id="gallery-modal-title" className="mt-4 text-2xl font-bold">{selected.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-black/70 px-2 py-1 bg-white">{selected.type || 'obra'}</span>
              {selected.contentWarning && (
                <span className="rounded-full border border-red-800/80 px-2 py-1 bg-red-50 text-red-900">conteúdo sensível</span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-700">Arquivo: {selected.file}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
