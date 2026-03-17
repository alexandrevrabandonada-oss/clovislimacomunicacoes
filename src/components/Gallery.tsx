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
  tier?: 'curated' | 'regular' | 'archive'
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
  tier: 'curated' | 'regular' | 'archive'
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

  // Mapa de aspect ratio para o container
  const containerAspect = useMemo(() => {
    if (largeTile) return 'aspect-[16/10]'
    if (aspectRatio === 'vertical') return 'aspect-[4/5]'
    if (aspectRatio === 'horizontal') return 'aspect-[16/10]'
    return 'aspect-square'
  }, [largeTile, aspectRatio])

  return (
    <article
      ref={tiltRef}
      className={`ink-card p-2 md:p-3 flex flex-col ${tileClass} group hover:shadow-2xl transition-all duration-300 relative bg-white border border-black/5 rounded-2xl`}
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
      {item.tier === 'curated' && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="stamp text-[8px] px-2 py-0.5 bg-black text-white font-black tracking-widest uppercase rounded">Editorial Selection</span>
        </div>
      )}

      <div className={`ink-frame relative overflow-hidden rounded-xl bg-slate-50 border border-black/5 transition-all duration-500
        ${containerAspect} 
        ${imageLoaded ? 'bg-[radial-gradient(circle_at_center,#ffffff_0%,#f8fafc_100%)]' : 'bg-slate-50'}
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
            priority={index < 4}
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              const ratio = naturalWidth / naturalHeight
              if (ratio < 0.85) setAspectRatio('vertical')
              else if (ratio > 1.2) setAspectRatio('horizontal')
              else setAspectRatio('square')
              setImageLoaded(true)
            }}
            className={`object-contain transition-all duration-700 p-3
              ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
          />
        ) : (
          <div className="h-full w-full halftone-bg opacity-10" />
        )}
      </div>

      <div className="mt-3 px-1 flex flex-col flex-grow">
        <header className="min-h-[3rem] flex flex-col justify-start">
          <h3 className="font-black leading-tight text-base text-black group-hover:text-accent transition-colors line-clamp-2">{item.title}</h3>
          {item.subtitle && (
            <p className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1 italic">{item.subtitle}</p>
          )}
        </header>
        
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-black/5">
             <div className="flex gap-1">
              {item.availableForPrint && (
                <div title="Print Disponível" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
              {item.availableForLicense && (
                <div title="Licença Disponível" className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              )}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-black transition-colors">
              Explorar →
            </span>
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
  const [curated, setCurated] = useState<GalleryItem[]>([])
  const [regular, setRegular] = useState<GalleryItem[]>([])
  const [archive, setArchive] = useState<GalleryItem[]>([])
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
          tier: value?.tier || 'regular',
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
      setCurated(normalized.filter(i => i.tier === 'curated'))
      setRegular(normalized.filter(i => i.tier === 'regular'))
      setArchive(normalized.filter(i => i.tier === 'archive'))
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <h2 ref={headingRef} className={`reveal-heading text-4xl md:text-5xl font-black ${revealed ? 'is-revealed' : ''}`}>Acervo Curado</h2>
          <p className="mt-2 text-base text-slate-600 max-w-2xl italic font-serif">
            Uma seleção de charges e ilustrações que traduzem pautas complexas em impacto visual imediato.
          </p>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[200px]">
           <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar no acervo..."
            className="w-full rounded-full border border-black/10 bg-slate-50 px-4 py-1.5 text-xs focus:ring-1 focus:ring-accent outline-none"
          />
          <div className="flex gap-2">
             <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="flex-1 rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest outline-none"
              >
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Todos os Tipos' : type}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setFilter(filter === 'safe' ? 'all' : 'safe')}
                className={`px-3 py-1 rounded-full border border-black/10 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'safe' ? 'bg-black text-white' : 'bg-slate-50'}`}
              >
                {filter === 'safe' ? 'Filtro Ativo' : 'Sensível: ON'}
              </button>
          </div>
        </div>
      </div>

      {status === 'loading' && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((slot) => (
            <article key={slot} className={`p-4 animate-pulse bg-slate-50 rounded-2xl ${getTileClasses(slot - 1, 6)}`}>
              <div className="aspect-square bg-slate-200 rounded-xl" />
              <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
            </article>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-12 p-8 text-center bg-red-50 rounded-2xl border border-red-100">
          <p className="text-sm text-red-800 font-bold text-lg">Houve um erro técnico.</p>
          <button type="button" onClick={() => void loadManifest()} className="mt-4 bg-black text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            Recarregar Acervo
          </button>
        </div>
      )}

      {status === 'ready' && (
        <div className="space-y-16 mt-12">
          {/* 1. Grade Editorial (Curated) */}
          {curated.length > 0 && searchQuery === '' && typeFilter === 'all' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-black/10" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Curadoria Editorial</h3>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
                {curated.map((item, index) => (
                  <GalleryCard key={item.id} item={item} index={index} total={curated.length} onOpen={openWorkModal} />
                ))}
              </div>
            </section>
          )}

          {/* 2. Últimas Produções (Regular + Filtrado) */}
          {(regular.length > 0 || searchQuery !== '' || typeFilter !== 'all') && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-black/10" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {searchQuery || typeFilter !== 'all' ? 'Resultado da Busca' : 'Produções Recentes'}
                </h3>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                {(searchQuery || typeFilter !== 'all' ? works : regular).map((item, index) => (
                  <GalleryCard key={item.id} item={item} index={index} total={works.length} onOpen={openWorkModal} />
                ))}
                {searchQuery !== '' && works.length === 0 && (
                   <div className="col-span-full py-20 text-center">
                        <p className="text-slate-400 italic">Nenhuma obra corresponde aos termos buscados.</p>
                   </div>
                )}
              </div>
            </section>
          )}

          {/* 3. Acervo Histórico (Archive) */}
          {archive.length > 0 && searchQuery === '' && typeFilter === 'all' && (
            <section className="opacity-70 hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-black/10" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Acervo Histórico</h3>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 opacity-80">
                {archive.map((item, index) => (
                  <GalleryCard key={item.id} item={item} index={index} total={archive.length} onOpen={openWorkModal} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="mt-16 flex justify-between items-center border-t border-black/10 pt-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© Acervo Curado ESBOÇO criação & arte</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publicação / Licenciamento / Prints</p>
      </div>

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
