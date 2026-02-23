import { ImageResponse } from 'next/og'
import { fetchPublishedWorkBySlug } from '../../../lib/works'

export const runtime = 'edge'

function isSensitive(contentWarning: string | null): boolean {
  if (contentWarning === null || contentWarning === undefined) return false
  const text = String(contentWarning).trim().toLowerCase()
  if (!text) return false
  if (['false', '0', 'no', 'none', 'null'].includes(text)) return false
  return true
}

export const alt = 'Obra do portfólio de Clóvis Lima'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const work = await fetchPublishedWorkBySlug(params.slug)

  if (!work) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            color: '#0f172a',
            fontSize: 56,
            fontWeight: 800
          }}
        >
          Obra não encontrada
        </div>
      ),
      size
    )
  }

  const sensitive = isSensitive(work.content_warning || null)
  if (sensitive) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(140deg,#111827 0%,#334155 100%)',
            color: '#f8fafc',
            fontFamily: 'Arial, sans-serif',
            padding: 56,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.9 }}>Conteúdo sensível</div>
          <div style={{ marginTop: 18, fontSize: 58, lineHeight: 1.1, fontWeight: 900 }}>{work.title}</div>
          <div style={{ marginTop: 20, fontSize: 24, opacity: 0.9 }}>Prévia neutra para compartilhamento</div>
        </div>
      ),
      size
    )
  }

  const cover = work.cover_url || work.cover_image_url || ''
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#0f172a',
          color: '#fff',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={work.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg,rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.72) 100%)'
          }}
        />
        <div style={{ position: 'relative', marginTop: 'auto', padding: 44 }}>
          <div style={{ fontSize: 24, opacity: 0.9 }}>{work.type}</div>
          <div style={{ marginTop: 10, fontSize: 58, lineHeight: 1.05, fontWeight: 900 }}>{work.title}</div>
        </div>
      </div>
    ),
    size
  )
}
