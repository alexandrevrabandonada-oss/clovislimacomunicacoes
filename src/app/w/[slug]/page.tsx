import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
  const work = await getWork(params.slug)
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
  const work = await getWork(params.slug)
  if (!work) notFound()
  const sensitive = isSensitive(work.content_warning)

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
    </section>
  )
}
