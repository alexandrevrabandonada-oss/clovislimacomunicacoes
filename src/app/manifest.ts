import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Clovis Lima Comunicacoes',
    short_name: 'Clovis Lima',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffaf0',
    theme_color: '#ef4444',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}
