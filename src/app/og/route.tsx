import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #f8fafc 0%, #ffffff 35%, #e2e8f0 100%)',
          padding: 56,
          fontFamily: 'Arial, sans-serif',
          color: '#0f172a'
        }}
      >
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: '#ef4444',
              border: '3px solid #111827'
            }}
          />
          <div style={{ fontSize: 32, fontWeight: 700 }}>Clóvis Lima Comunicações</div>
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.03, fontWeight: 900, letterSpacing: -1 }}>
          Humor que comunica.
          <br />
          Design que converte.
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>
          Charges, ilustração editorial e sites/PWAs sob medida.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}
