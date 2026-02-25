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
  slug: string
  file: string
  src: string
  title: string
  type: string
  contentWarning: boolean
}

function normalizeWarning(value: unknown): boolean {
  return value === true || String(value).toLowerCase() === 'true'
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getTileClasses(index: number, total: number): string {
  if (total < 6) return 'sm:col-span-1 lg:col-span-2'
  if (index % 6 === 0) return 'sm:col-span-2 lg:col-span-3'
  return 'sm:col-span-1 lg:col-span-2'
}

type GalleryCardProps = {
  item: GalleryItem
  index: number
  total: number
  onOpen: (work: GalleryItem, trigger?: HTMLElement | null) => void
}

function GalleryCard({ item, index, total, onOpen }: GalleryCardProps) {
  const tiltRef = useTilt<HTMLElement>(3)
  const [imageLoaded, setImageLoaded] = useState(false)
  const sensitive = item.contentWarning
  const tileClass = getTileClasses(index, total)
  const largeTile = total >= 6 && index % 6 === 0

  return (
    <article
      ref={tiltRef}
      className={`ink-card p-3 md:p-3.5 ${tileClass}`}
      role="button"
      tabIndex={0}
      aria-label={`Abrir obra ${item.title}`}
      onClick={(event) => onOpen(item, event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(item, event.currentTarget as HTMLElement)
        }
      }}
    >
      <div className={`ink-frame relative ${largeTile ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#f5f5f5_0%,#ececec_100%)]" aria-hidden="true" />
        )}
        {item.src ? (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
            className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
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
              onOpen(item, event.currentTarget)
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
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [currentShareUrl, setCurrentShareUrl] = useState('')
  const [lastTrigger, setLastTrigger] = useState<HTMLElement | null>(null)

  const updateUrlWithSelected = (slug: string | null) => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (slug) {
      url.searchParams.set('obra', slug)
    } else {
      url.searchParams.delete('obra')
    }
    const next = `${url.pathname}${url.search}${url.hash}`
    window.history.replaceState({}, '', next)
    setCurrentShareUrl(window.location.href)
  }

  const loadManifest = async () => {
    setStatus('loading')
    try {
      const response = await fetch('/portfolio/manifest.json', { cache: 'no-store' })
      if (!response.ok) throw new Error('manifest fetch failed')
      const manifest = (await response.json()) as ManifestData
      const defaultType = (manifest.defaultType || 'obra').trim() || 'obra'
      const rawItems = manifest.items || {}
      const normalized = Object.entries(rawItems).map(([key, value], index) => {
        const file = (value?.file || key || '').trim()
        const title = (value?.title || file || 'Obra').trim()
        const titleSlug = slugify(title || file)
        return {
          id: key,
          slug: `obra-${String(index + 1).padStart(2, '0')}-${titleSlug || 'item'}`,
          file,
          src: `/portfolio/${encodeURIComponent(file)}`,
          title,
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
    () => items.find((work) => work.slug === selectedSlug) || null,
    [items, selectedSlug]
  )
  const shareHref = currentShareUrl || ''

  useEffect(() => {
    if (!items.length) return
    const fromQuery = () => {
      const params = new URLSearchParams(window.location.search)
      const obra = (params.get('obra') || '').trim()
      if (!obra) {
        setSelectedSlug(null)
        setCurrentShareUrl(window.location.href)
        return
      }
      const exists = items.some((item) => item.slug === obra)
      setSelectedSlug(exists ? obra : null)
      setCurrentShareUrl(window.location.href)
    }

    fromQuery()
    window.addEventListener('popstate', fromQuery)
    return () => window.removeEventListener('popstate', fromQuery)
  }, [items])

  const openWorkModal = (work: GalleryItem, trigger?: HTMLElement | null) => {
    setSelectedSlug(work.slug)
    setLastTrigger(trigger || null)
    updateUrlWithSelected(work.slug)
    trackEvent('open_work_modal', { file: work.file, type: work.type, slug: work.slug })
  }

  const closeWorkModal = () => {
    setSelectedSlug(null)
    updateUrlWithSelected(null)
    if (lastTrigger) {
      window.setTimeout(() => lastTrigger.focus(), 0)
    }
  }

  const copyLink = async () => {
    const href = currentShareUrl || window.location.href
    try {
      await navigator.clipboard.writeText(href)
    } catch {
      // no-op
    }
  }

  const askForThisCharge = (work: GalleryItem) => {
    const message = `Ola! Tenho interesse nesta obra: "${work.title}" (${work.type}). Podemos conversar sobre valores e prazo?`
    const url = new URL(window.location.href)
    url.searchParams.delete('obra')
    url.searchParams.set('prefill_message', message)
    url.hash = 'contato'
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    window.dispatchEvent(new CustomEvent('contact-prefill', { detail: { message } }))
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('contato')?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    setSelectedSlug(null)
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5 lg:grid-flow-dense lg:auto-rows-[10px]">
          {[1, 2, 3, 4, 5, 6].map((slot) => (
            <article key={slot} className={`ink-card p-3 md:p-3.5 animate-pulse ${getTileClasses(slot - 1, 6)}`}>
              <div className={`ink-frame relative ${slot === 1 ? 'aspect-[16/10]' : 'aspect-[4/3]'} bg-slate-200`} />
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5 lg:grid-flow-dense lg:auto-rows-[10px]">
        {works.map((item, index) => (
          <GalleryCard key={item.id} item={item} index={index} total={works.length} onOpen={openWorkModal} />
        ))}
      </div>
      )}
      <p className="mt-4 text-xs text-slate-700">Publicacao / licenciamento / prints sob demanda.</p>

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
            <div className="mt-5 border-t border-black/15 pt-4">
              <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Compartilhar</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={copyLink} className="ink-button bg-white px-3 py-1.5 text-sm font-semibold">
                  Copiar link
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Confira esta obra: ${selected.title} ${shareHref}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ink-button bg-white px-3 py-1.5 text-sm font-semibold"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => askForThisCharge(selected)}
                  className="ink-button bg-black px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Quero esta charge
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-700">Publicacao / licenciamento / prints sob demanda.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
