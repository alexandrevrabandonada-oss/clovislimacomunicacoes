"use client"
import { useMemo, useState } from 'react'
import Image from 'next/image'

export type WorkDetailData = {
  id: string
  slug: string
  title: string
  type: string
  description: string | null
  cover_url: string | null
  cover_image_url: string | null
  content_warning: string | null
  created_at: string | null
  year: number | null
  tags: string[]
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
    const base = work.tags.length ? work.tags : [work.type]
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
              <Image src={cover} alt={work.title} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" />
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
          <h1 id="work-detail-title" className="text-3xl md:text-4xl font-extrabold leading-tight">
            {work.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-black/70 bg-white px-2 py-1">{work.type}</span>
            {year && <span className="rounded-full border border-black/70 bg-white px-2 py-1">{year}</span>}
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-black/40 bg-slate-50 px-2 py-1">
                {tag}
              </span>
            ))}
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
