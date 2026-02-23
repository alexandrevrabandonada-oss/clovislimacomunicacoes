export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'http://localhost:3000'

  const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`
  return withProtocol.replace(/\/+$/, '')
}
