import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import WorkDetail, { WorkDetailData } from '../../../components/WorkDetail'
import { fetchPublishedWorkBySlug } from '../../../lib/works'
import { getSiteUrl } from '../../../lib/site'

function isSensitive(contentWarning: string | null): boolean {
  if (contentWarning === null || contentWarning === undefined) return false
  const text = String(contentWarning).trim().toLowerCase()
  if (!text) return false
  if (['false', '0', 'no', 'none', 'null'].includes(text)) return false
  return true
}

type ManifestItem = {
  file?: string
  title?: string
  type?: string
  content_warning?: boolean
}

type ManifestEntry = {
  slug: string
  title: string
  type: string
  file: string
  contentWarning: boolean
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function readManifestEntries(): Promise<ManifestEntry[]> {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'portfolio', 'manifest.json')
    const raw = await fs.readFile(manifestPath, 'utf8')
    const parsed = JSON.parse(raw) as { defaultType?: string; items?: Record<string, ManifestItem> }
    const defaultType = (parsed.defaultType || 'obra').trim() || 'obra'
    const entries = Object.entries(parsed.items || {})
      .map(([key, value]) => {
        const file = (value.file || key || '').trim()
        const title = (value.title || file || 'Obra').trim()
        const type = (value.type || defaultType).trim() || defaultType
        return {
          slug: slugify(title) || slugify(file),
          title,
          type,
          file,
          contentWarning: value.content_warning === true
        }
      })
      .filter((item) => item.file && item.slug)
    return entries
  } catch {
    return []
  }
}

async function getWork(slug: string): Promise<WorkDetailData | null> {
  const row = await fetchPublishedWorkBySlug(slug)
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    description: row.description || null,
    cover_url: row.cover_url || null,
    cover_image_url: row.cover_image_url || null,
    content_warning: row.content_warning || null,
    created_at: row.created_at || null,
    year: row.year || null,
    tags: Array.isArray(row.tags) ? row.tags : row.type ? [row.type] : []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const siteUrl = getSiteUrl()
  const [work, manifestEntries] = await Promise.all([getWork(params.slug), readManifestEntries()])
  const manifestCurrent =
    manifestEntries.find((item) => item.slug === params.slug) ||
    (work ? manifestEntries.find((item) => item.slug === slugify(work.title)) : null)

  if (manifestCurrent) {
    const title = `${manifestCurrent.title} | Mini-case`
    const description = `Mini-case de ${manifestCurrent.title} (${manifestCurrent.type}) no portfolio de Clovis Lima.`
    const image = `${siteUrl}/portfolio/${encodeURIComponent(manifestCurrent.file)}`
    return {
      title,
      description,
      alternates: {
        canonical: `/w/${params.slug}`
      },
      openGraph: {
        type: 'article',
        url: `${siteUrl}/w/${params.slug}`,
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: manifestCurrent.title }]
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image]
      }
    }
  }

  if (!work) {
    return {
      title: 'Obra não encontrada',
      alternates: { canonical: `/w/${params.slug}` }
    }
  }

  const sensitive = isSensitive(work.content_warning)
  const title = sensitive ? `${work.title} | Conteúdo sensível` : work.title
  const description =
    work.description ||
    (sensitive
      ? 'Obra marcada como conteúdo sensível.'
      : 'Obra do portfólio de Clóvis Lima com linguagem autoral.')
  const image = sensitive
    ? `${siteUrl}/w/${encodeURIComponent(work.slug)}/opengraph-image`
    : `${siteUrl}/w/${encodeURIComponent(work.slug)}/opengraph-image`

  return {
    title,
    description,
    alternates: {
      canonical: `/w/${work.slug}`
    },
    openGraph: {
      type: 'article',
      url: `${siteUrl}/w/${work.slug}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: work.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    }
  }
}

export default async function WorkDetailPage({ params }: { params: { slug: string } }) {
  const siteUrl = getSiteUrl()
  const [work, manifestEntries] = await Promise.all([getWork(params.slug), readManifestEntries()])
  if (!work) notFound()
  const sensitive = isSensitive(work.content_warning)
  const currentManifestIndex = manifestEntries.findIndex(
    (item) => item.slug === params.slug || item.slug === slugify(work.title)
  )
  const previousWork = currentManifestIndex > 0 ? manifestEntries[currentManifestIndex - 1] : null
  const nextWork =
    currentManifestIndex >= 0 && currentManifestIndex < manifestEntries.length - 1
      ? manifestEntries[currentManifestIndex + 1]
      : null

  const suggestedPackage = work.type.toLowerCase().includes('charge') ? 'charge-avulsa' : 'site-completo'
  const contactMessage = `Ola! Quero algo nesse estilo: "${work.title}" (${work.type}). Meu objetivo e: ... Prazo ideal: ...`
  const contactHref = `/?pacote=${encodeURIComponent(suggestedPackage)}&prefill_message=${encodeURIComponent(contactMessage)}#contato`

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.title,
    url: `${siteUrl}/w/${work.slug}`,
    genre: work.type,
    datePublished: work.created_at || undefined,
    description:
      work.description ||
      (sensitive ? 'Obra marcada como conteúdo sensível.' : 'Obra do portfólio de Clóvis Lima.'),
    inLanguage: 'pt-BR',
    image: sensitive
      ? `${siteUrl}/w/${work.slug}/opengraph-image`
      : (work.cover_url || work.cover_image_url || `${siteUrl}/w/${work.slug}/opengraph-image`)
  }

  return (
    <section className="mt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <WorkDetail work={work} />

      <div className="mx-auto mt-8 max-w-6xl grid grid-cols-1 gap-4 md:grid-cols-2">
        <aside className="ink-card p-4">
          <h2 className="text-xl font-extrabold">Quer algo nesse estilo?</h2>
          <p className="mt-2 text-sm text-slate-700">
            Transformamos esta linguagem visual em uma solucao sob medida para sua pauta, campanha ou produto digital.
          </p>
          <Link href={contactHref} className="ink-button mt-4 inline-block rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white">
            Quero conversar sobre este estilo
          </Link>
        </aside>

        <aside className="ink-card p-4">
          <h2 className="text-xl font-extrabold">Navegar no portfolio</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {previousWork ? (
              <Link href={`/w/${previousWork.slug}`} className="ink-button inline-block rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold">
                Obra anterior
              </Link>
            ) : (
              <span className="inline-block rounded-full border border-black/30 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-500">
                Obra anterior
              </span>
            )}
            {nextWork ? (
              <Link href={`/w/${nextWork.slug}`} className="ink-button inline-block rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold">
                Proxima obra
              </Link>
            ) : (
              <span className="inline-block rounded-full border border-black/30 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-500">
                Proxima obra
              </span>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
