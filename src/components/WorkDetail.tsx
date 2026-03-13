"use client"
import { useMemo, useState } from 'react'
import Image from 'next/image'

export type WorkDetailData = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  type: string
  description: string | null
  client: string | null
  vehicle: string | null
  available_for_print: boolean
  available_for_license: boolean
  featured: boolean
  cover_url: string | null
  cover_image_url: string | null
  content_warning: string | null
  created_at: string | null
  year: number | null
  tags: string[] | null
}

function isSensitive(contentWarning: string | null): boolean {
  if (contentWarning === null || contentWarning === undefined) return false
  const text = String(contentWarning).trim().toLowerCase()
  if (!text) return false
  if (['false', '0', 'no', 'none', 'null'].includes(text)) return false
  return true
}

function getCover(work: WorkDetailData): string {
  return (work.cover_url || work.cover_image_url || '').trim()
}

export default function WorkDetail({ work }: { work: WorkDetailData }) {
  const [revealed, setRevealed] = useState(false)
  const sensitive = isSensitive(work.content_warning)
  const showImage = !sensitive || revealed
  const cover = getCover(work)
  const year = work.year || (work.created_at ? new Date(work.created_at).getFullYear() : null)
  const tags = useMemo(() => {
    const rawTags = work.tags || []
    const base = rawTags.length ? rawTags : [work.type]
    return Array.from(new Set(base.filter(Boolean)))
  }, [work.tags, work.type])

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    if (!currentUrl) return
    try {
      await navigator.clipboard.writeText(currentUrl)
    } catch {
      // no-op
    }
  }

  const shareText = encodeURIComponent(`Confira esta obra: ${work.title}`)
  const shareUrl = encodeURIComponent(currentUrl || `/w/${work.slug}`)
  const whatsappHref = `https://wa.me/?text=${shareText}%20${shareUrl}`
  const xHref = `https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`

  return (
    <article className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="ink-card p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/20 bg-slate-100">
            {showImage && cover ? (
              <Image src={cover} alt={work.title} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-contain max-h-[70vh]" />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(160deg,#f8fafc_0%,#e2e8f0_100%)]" />
            )}

            {sensitive && !revealed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-4 text-center text-white">
                <div>
                  <p className="text-lg font-semibold">Conteúdo sensível</p>
                  <p className="mt-1 text-sm opacity-90">Esta obra pode conter temas sensíveis.</p>
                  <button
                    type="button"
                    onClick={() => setRevealed(true)}
                    className="mt-4 rounded-full border border-white/80 px-4 py-2 text-sm font-semibold"
                  >
                    Mostrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 id="work-detail-title" className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            {work.title}
          </h1>
          {work.subtitle && (
            <p className="mt-2 text-lg text-slate-600 italic font-medium">{work.subtitle}</p>
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-y border-black/10 py-6">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Contexto Editorial</p>
                <p className="mt-1 text-sm font-semibold">{work.client || 'Acervo Vivo'} {work.vehicle ? ` / ${work.vehicle}` : ''}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Data de Produção</p>
                <p className="mt-1 text-sm font-semibold">{year || '—'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Classificação</p>
                <p className="mt-1 text-sm font-semibold capitalize">{work.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Tags</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-black/10 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {work.available_for_print && (
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4 flex-1 min-w-[200px]">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                <div>
                  <p className="text-xs font-bold text-green-900 uppercase tracking-wide">Print Disponível</p>
                  <p className="text-[11px] text-green-700 mt-1">Acabamento fine-art sob demanda</p>
                </div>
              </div>
            )}
            {work.available_for_license && (
              <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex-1 min-w-[200px]">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                <div>
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">Licenciamento Aberto</p>
                  <p className="text-[11px] text-blue-700 mt-1">Disponível para uso editorial e marcas</p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-slate-800">
            {work.description || 'Obra do portfólio com direção visual autoral e foco em impacto editorial.'}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <button onClick={copyLink} className="rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold">
              Copiar link
            </button>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold">
              WhatsApp
            </a>
            <a href={xHref} target="_blank" rel="noreferrer" className="rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold">
              X
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
