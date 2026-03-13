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
  subtitle?: string
  year?: number
  client?: string
  vehicle?: string
  tags?: string[]
  available_for_print?: boolean
  available_for_license?: boolean
  featured?: boolean
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
  subtitle: string
  year: number | null
  client: string | null
  vehicle: string | null
  tags: string[]
  availableForPrint: boolean
  availableForLicense: boolean
  featured: boolean
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
  const [aspectRatio, setAspectRatio] = useState<'vertical' | 'horizontal' | 'square' | null>(null)
  
  const tileClass = getTileClasses(index, total)
  const largeTile = total >= 6 && index % 6 === 0

  return (
    <article
      ref={tiltRef}
      className={`ink-card p-3 md:p-4 flex flex-col ${tileClass} group hover:shadow-xl transition-all duration-300`}
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
      <div className={`ink-frame relative overflow-hidden rounded-lg bg-slate-50 border border-black/5 
        ${largeTile ? 'aspect-[16/10]' : 'aspect-[4/5]'} 
        ${aspectRatio === 'vertical' ? 'bg-[radial-gradient(circle,#f8fafc_0%,#f1f5f9_100%)]' : ''}
      `}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse" aria-hidden="true" />
        )}
        {item.src ? (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              const ratio = naturalWidth / naturalHeight
              if (ratio < 0.85) setAspectRatio('vertical')
              else if (ratio > 1.2) setAspectRatio('horizontal')
              else setAspectRatio('square')
              setImageLoaded(true)
            }}
            className={`object-contain transition-all duration-500 
              ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              ${aspectRatio === 'vertical' ? 'py-4' : 'px-4'}
            `}
          />
        ) : (
          <div className="h-full w-full halftone-bg opacity-10" />
        )}
      </div>

      <div className="mt-4 flex flex-col flex-grow">
        <header className="min-h-[3rem]">
          <h3 className="font-extrabold leading-tight text-lg text-black group-hover:text-accent transition-colors">{item.title}</h3>
          {item.subtitle && (
            <p className="text-[11px] font-bold uppercase tracking-tight text-slate-400 mt-1 line-clamp-1">{item.subtitle}</p>
          )}
        </header>
        
        <div className="mt-auto pt-4 space-y-3">
          <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] uppercase tracking-widest font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded border border-black/5">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/5 pt-3">
            <div className="flex gap-1.5">
              {item.availableForPrint && (
                <div title="Print Disponível" className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              )}
              {item.availableForLicense && (
                <div title="Licença Disponível" className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              )}
            </div>
            <span className="text-[10px] font-bold text-black border-b border-black uppercase tracking-wider group-hover:border-accent group-hover:text-accent transition-all">
              Detalhes →
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Gallery() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const [filter, setFilter] = useState<'all' | 'safe' | 'sensitive'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [items, setItems] = useState<GalleryItem[]>([])
  const [featured, setFeatured] = useState<GalleryItem[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
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
          slug: (value as any)?.slug || `obra-${String(index + 1).padStart(2, '0')}-${titleSlug || 'item'}`,
          file,
          src: `/portfolio/${encodeURIComponent(file)}`,
          title,
          subtitle: value?.subtitle || '',
          year: value?.year || null,
          client: value?.client || null,
          vehicle: value?.vehicle || null,
          tags: Array.isArray(value?.tags) ? value.tags : [],
          availableForPrint: !!value?.available_for_print,
          availableForLicense: !!value?.available_for_license,
          featured: !!value?.featured,
          type: (value?.type || defaultType).trim(),
          contentWarning: normalizeWarning(value?.content_warning)
        }
      }).filter((item) => item.file)
      setItems(normalized)
      // Seleciona até 6 featured, ou as 6 primeiras se não houver featured
      const featuredItems = normalized.filter((item) => (item as any).featured).slice(0, 6)
      setFeatured(featuredItems.length > 0 ? featuredItems : normalized.slice(0, 6))
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    void loadManifest()
  }, [])

  const availableTypes = useMemo(
    () => ['all', ...Array.from(new Set(items.map((item) => item.type.trim().toLowerCase()).filter(Boolean))).sort()],
    [items]
  )

  const works = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return items.filter((w) => {
      const byWarning = filter === 'all' || (w.contentWarning ? filter === 'sensitive' : filter === 'safe')
      const normalizedType = w.type.trim().toLowerCase()
      const byType = typeFilter === 'all' || normalizedType === typeFilter
      const bySearch =
        !q || w.title.toLowerCase().includes(q) || normalizedType.includes(q)
      return byWarning && byType && bySearch
    })
  }, [items, filter, typeFilter, searchQuery])

  const selected = useMemo(
    () => items.find((work) => work.slug === selectedSlug) || null,
    [items, selectedSlug]
  )
  const canonicalHref =
    selected && typeof window !== 'undefined' ? `${window.location.origin}/w/${selected.slug}` : ''

  useEffect(() => {
    if (!items.length) return
    const fromQuery = () => {
      const params = new URLSearchParams(window.location.search)
      const obra = (params.get('obra') || '').trim()
      if (!obra) {
        setSelectedSlug(null)
        return
      }
      const exists = items.some((item) => item.slug === obra)
      setSelectedSlug(exists ? obra : null)
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
    const href = selected ? `${window.location.origin}/w/${selected.slug}` : window.location.href
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
      <p className="mt-2 text-sm md:text-base text-slate-700">Explore as últimas produções, licenciamentos e rascunhos em destaque.</p>

      {/* Destaques */}
      {status === 'ready' && featured.length > 0 && (
        <section className="mt-8 mb-8">
          <h3 className="text-xl font-bold mb-3">Destaques</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
            {featured.map((item, index) => (
              <GalleryCard key={item.id} item={item} index={index} total={featured.length} onOpen={openWorkModal} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 mr-1">Filtro</div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')} className="ink-chip px-3 py-1 text-sm font-medium">Todos</button>
          <button onClick={() => setFilter('safe')} className="ink-chip px-3 py-1 text-sm font-medium">Sem alerta</button>
          <button onClick={() => setFilter('sensitive')} className="ink-chip px-3 py-1 text-sm font-medium">Com aviso</button>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
        <label className="block text-sm">
          <span className="sr-only">Buscar obras por titulo ou tipo</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Buscar obras por titulo ou tipo"
            placeholder="Buscar por titulo ou tipo"
            className="w-full rounded border border-black/30 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="sr-only">Filtrar obras por tipo</span>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filtrar obras por tipo"
            className="w-full rounded border border-black/30 bg-white px-3 py-2 text-sm"
          >
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'Todos' : type}
              </option>
            ))}
          </select>
        </label>
      </div>

      {status === 'loading' && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
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
          <p className="text-sm text-slate-700">Nenhuma obra encontrada para esse filtro/busca.</p>
        </div>
      )}

      {status === 'ready' && works.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
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
              <Image src={selected.src} alt={selected.title} fill sizes="90vw" className="object-contain max-h-[80vh]" />
            </div>
            <h3 id="gallery-modal-title" className="mt-4 text-2xl font-extrabold">{selected.title}</h3>
            {selected.subtitle && (
              <p className="text-sm italic text-slate-600 mt-1">{selected.subtitle}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 border-y border-black/10 py-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contexto</p>
                <p className="mt-1 font-medium">{selected.client || 'Acervo Vivo'} {selected.vehicle ? ` / ${selected.vehicle}` : ''}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ano / Tipo</p>
                <p className="mt-1 font-medium">{selected.year || '—'} / <span className="capitalize">{selected.type}</span></p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selected.tags.map(tag => (
                <span key={tag} className="rounded-full border border-black/20 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                  #{tag}
                </span>
              ))}
              {selected.contentWarning && (
                <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-900">Conteúdo Sensível</span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {selected.availableForPrint && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50/50 p-3 flex-1 min-w-[140px]">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <div>
                    <p className="text-[10px] font-bold text-green-800 uppercase leading-none">Print Disponível</p>
                    <p className="text-[9px] text-green-700 mt-1 leading-none">Edição limitada sob demanda</p>
                  </div>
                </div>
              )}
              {selected.availableForLicense && (
                <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3 flex-1 min-w-[140px]">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                  <div>
                    <p className="text-[10px] font-bold text-blue-800 uppercase leading-none">Licenciável</p>
                    <p className="text-[9px] text-blue-700 mt-1 leading-none">Uso em veículos e campanhas</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5 border-t border-black/15 pt-4">
              <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Compartilhar</h4>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={copyLink} className="ink-button bg-white px-3 py-1.5 text-sm font-semibold">
                  Copiar link
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Confira esta obra: ${selected.title} ${canonicalHref}`)}`}
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
                <a
                  href={`/w/${selected.slug}`}
                  className="text-sm text-slate-600 underline hover:text-black transition-colors ml-1"
                >
                  Abrir página da obra
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-700">Publicacao / licenciamento / prints sob demanda.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
