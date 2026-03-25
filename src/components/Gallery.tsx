"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  external_link?: string
  is_flagship?: boolean
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
  externalLink?: string
  isFlagship: boolean
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
  if (total <= 2) return 'sm:col-span-1 lg:col-span-3'
  if (total < 6) return 'sm:col-span-1 lg:col-span-3'
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
      className={`ink-card p-3 md:p-4 flex flex-col ${tileClass} group transition-all duration-300 relative bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_var(--accent)]`}
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
      {item.isFlagship && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="relative group/flag">
            <div className="absolute inset-0 bg-accent blur-md opacity-20 group-hover/flag:opacity-40 transition-opacity" />
            <span className="relative bg-black text-white text-[8px] px-4 py-2 font-black tracking-[0.3em] uppercase border-2 border-accent flex items-center gap-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              Flagship Capability
            </span>
          </div>
        </div>
      )}

      {item.tier === 'curated' && !item.isFlagship && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
          <span className="stamp text-[8px] px-3 py-1 bg-black text-white font-black tracking-[0.2em] uppercase border border-white/20">Seleção Editorial</span>
          {item.type === 'Sistema Digital' && (
            <span className="stamp text-[8px] px-3 py-1 bg-accent text-white font-black tracking-[0.2em] uppercase border border-black shadow-lg">Sistema Digital</span>
          )}
        </div>
      )}

      <div className={`ink-frame relative overflow-hidden bg-white border-b-[3px] border-black transition-all duration-500
        ${containerAspect} 
        ${imageLoaded ? 'bg-white' : 'bg-white'}
      `}>
        {/* Browser Frame Header for Digital Systems */}
        {item.type === 'Sistema Digital' && (
          <div className="absolute top-0 inset-x-0 h-8 bg-black flex items-center px-4 gap-2 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <div className="ml-3 h-4 flex-grow bg-white/5 border border-white/10" />
          </div>
        )}

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
            className={`transition-all duration-700 
              ${item.type === 'Sistema Digital' ? 'object-cover object-top pt-6' : 'object-contain p-3'}
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
            <p className="text-[10px] font-bold text-black/40 mt-1 line-clamp-1 italic tracking-tight">{item.subtitle}</p>
          )}
        </header>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t-[2px] border-black/10">
             <div className="flex gap-2">
              {item.availableForPrint && (
                <div title="Print Disponível" className="h-2 w-2 bg-emerald-500" />
              )}
              {item.availableForLicense && (
                <div title="Licença Disponível" className="h-2 w-2 bg-accent shadow-[0_0_8px_var(--accent)]" />
              )}
            </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 group-hover:text-black transition-colors">
              Analisar Ativo →
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
          contentWarning: normalizeWarning(value?.content_warning),
          externalLink: (value as any)?.external_link,
          isFlagship: !!(value as any)?.is_flagship
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
      if (w.isFlagship) return false
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 border-b-[3px] border-black pb-6 md:pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-accent animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Acervo Técnico & Curadoria Editorial</p>
          </div>
          <h2 ref={headingRef} className={`reveal-heading text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] text-black ${revealed ? 'is-revealed' : ''}`}>Acervo <br/> <span className="italic font-serif text-accent text-glow">Ativos Editoriais</span></h2>
          <p className="mt-6 text-lg text-black font-bold max-w-2xl italic leading-tight border-l-[6px] border-black pl-8">
            Intervenções visuais de alta densidade técnica aplicáveis a pautas editoriais, governança e campanhas de soberania digital.
          </p>
          
          {/* FRENTE EDITORIAL TEASER */}
          <Link 
            href="/acervo/livros" 
            className="mt-6 md:mt-10 inline-flex items-center gap-4 md:gap-8 p-4 md:p-10 border-[3px] border-black bg-white shadow-[8px_8px_0px_0px_var(--accent)] hover:shadow-[12px_12px_0px_0px_var(--accent)] hover:-translate-y-1 transition-all group max-w-full md:max-w-xl"
          >
            <div className="relative h-20 md:h-24 w-14 md:w-16 border-[3px] border-black shadow-xl overflow-hidden bg-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image 
                src="/portfolio/books/mequinho.jpg"
                alt="Flagship Editorial"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">Frente_Editorial_Flagship</span>
                <span className="h-px w-8 bg-accent/30" />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tighter leading-none italic">Biblioteca de <br/> Ilustração Editorial</h4>
              <p className="text-[10px] font-bold text-black/60 uppercase tracking-widest mt-4 leading-relaxed">
                Capas, Personagens e Universos de Leitura para o Mercado Editorial.
              </p>
              <div className="mt-4 flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest">
                Explorar Biblioteca <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[180px] md:min-w-[200px]">
           <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="PROTOCOLO_ID :: PESQUISAR"
            className="w-full rounded-none border-[3px] border-black bg-white px-6 py-3 text-[11px] font-black uppercase tracking-widest focus:ring-0 focus:border-accent outline-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          />
          <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="flex-1 rounded-none border-[3px] border-black bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]"
              >
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'Categorias' : type}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => setFilter(filter === 'safe' ? 'all' : 'safe')}
                className={`px-5 py-3 rounded-none border-[3px] border-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] ${filter === 'safe' ? 'bg-black text-white' : 'bg-white text-black'}`}
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
          {/* 0. Destaque do Acervo */}
          {items.find(i => i.featured) && searchQuery === '' && typeFilter === 'all' && (
            <section className="group cursor-pointer" onClick={() => {
                const featured = items.find(i => i.featured);
                if (featured) openWorkModal(featured);
            }}>
                <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-8 bg-black/10" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        Destaque do Acervo
                    </h3>
                </div>
                {(() => {
                    const featured = items.find(i => i.featured);
                    if (!featured) return null;
                    return (
                        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center bg-white p-5 md:p-20 border-[4px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] md:shadow-[32px_32px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_var(--accent)] md:hover:shadow-[40px_40px_0px_0px_var(--accent)] transition-all group-hover:bg-black group-hover:text-white group">
                            <div className="ink-frame relative aspect-[4/3] md:aspect-[16/10] overflow-hidden border-[3px] border-black bg-white shadow-2xl group-hover:scale-[1.03] transition-transform">
                                <Image 
                                    src={featured.src} 
                                    alt={featured.title} 
                                    fill 
                                    className="object-contain p-10"
                                />
                                <div className="absolute inset-0 bg-accent/5 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                                <div className="space-y-6 md:space-y-12">
                                    <div>
                                    <span className="text-[12px] font-black uppercase tracking-[0.5em] text-accent mb-6 block">Ativo de Autoridade // {featured.type}</span>
                                        <h4 className="text-4xl md:text-8xl font-black leading-[0.8] tracking-tighter italic mb-4 md:mb-8 uppercase">&quot;{featured.title}&quot;</h4>
                                        <p className="text-lg md:text-2xl font-black italic mt-4 md:mt-8 leading-none border-l-[4px] md:border-l-[8px] border-accent pl-4 md:pl-8">&quot;{featured.subtitle}&quot;</p>
                                </div>
                                <div className="pt-6 md:pt-12 border-t-[3px] border-current flex flex-wrap gap-4 md:gap-10 items-center">
                                        <button className="ink-button bg-accent text-white border-black px-6 md:px-12 py-4 md:py-6 text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                                        Explorar Ativo →
                                    </button>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Authority_Client</span>
                                        <span className="text-sm font-black uppercase tracking-widest">{featured.client || 'Strategic_Archive'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </section>
          )}

          {/* 1. Sistemas Digitais */}
          {items.some(i => i.type === 'Sistema Digital') && searchQuery === '' && typeFilter === 'all' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-black/10" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Sistemas Digitais & PWAs</h3>
                <span className="h-px flex-1 bg-black/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                {items.filter(i => i.type === 'Sites / PWA').map((item, index) => (
                  <GalleryCard key={item.id} item={item} index={index} total={items.filter(i => i.type === 'Sites / PWA').length} onOpen={openWorkModal} />
                ))}
              </div>
            </section>
          )}

          {/* 2. Ativos Editoriais (Curated) */}
          {curated.length > 0 && searchQuery === '' && typeFilter === 'all' && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px flex-1 bg-black/10" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ativos Editoriais</h3>
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
            <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/30 bg-white ${selected.type === 'Sites / PWA' ? 'pt-8 halftone-bg' : ''}`}>
              {selected.type === 'Sites / PWA' && (
                <div className="absolute top-0 inset-x-0 h-8 bg-slate-900 flex items-center px-4 gap-2 z-20">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              )}
              <Image src={selected.src} alt={selected.title} fill sizes="90vw" className={selected.type === 'Sites / PWA' ? "object-cover object-top pt-8" : "object-contain max-h-[80vh]"} />
            </div>
            <h3 id="gallery-modal-title" className="mt-4 text-2xl font-extrabold">{selected.title}</h3>
            {selected.subtitle && (
              <p className="text-sm italic text-slate-600 mt-1">{selected.subtitle}</p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 border-y border-black/10 py-4 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {selected.type === 'Sistema Digital' ? 'Arquitetura' : 'Contexto'}
                </p>
                <p className="mt-1 font-medium italic">
                  {selected.type === 'Sistema Digital' ? 'PWA de Alta Performance' : (selected.client || 'Acervo Vivo')}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                   {selected.type === 'Sistema Digital' ? 'Stack Técnico' : 'Ano / Classe'}
                </p>
                <p className="mt-1 font-medium">
                  {selected.type === 'Sistema Digital' ? 'Next.js / Vercel / PWA' : `${selected.year || '—'} / ${selected.type}`}
                </p>
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
                {selected.externalLink && (
                  <a
                    href={selected.externalLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ink-button bg-accent px-4 py-1.5 text-sm font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-2"
                  >
                    Visitar Projeto
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => askForThisCharge(selected)}
                  className="ink-button bg-black px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Quero este projeto
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
