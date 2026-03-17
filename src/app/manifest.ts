import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ESBOÇO criação & arte',
    short_name: 'ESBOÇO',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffaf0',
    theme_color: '#ef4444',
    icons: [
      {
        src: '/brand/logo-seal.png',
        sizes: 'any',
        type: 'image/png'
      }
    ]
  }
}
