import type { MetadataRoute } from 'next'
import { fetchPublishedWorks } from '../lib/works'
import { cases } from '../lib/cases'
import { getSiteUrl } from '../lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const works = await fetchPublishedWorks()

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: `${siteUrl}/admin`,
      changeFrequency: 'monthly',
      priority: 0.2
    },
    {
      url: `${siteUrl}/cases`,
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ]

  const workRoutes: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${siteUrl}/w/${work.slug}`,
    lastModified: work.updated_at || work.created_at || undefined,
    changeFrequency: 'monthly',
    priority: 0.7
  }))

  const caseRoutes: MetadataRoute.Sitemap = cases.map((item) => ({
    url: `${siteUrl}/cases/${item.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7
  }))

  return [...routes, ...workRoutes, ...caseRoutes]
}
