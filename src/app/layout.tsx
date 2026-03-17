import '../styles/globals.css'
import React from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import Header from '../components/Header'
import { getSiteUrl } from '../lib/site'

const siteUrl = getSiteUrl()
const siteName = 'ESBOÇO criação & arte'
const defaultTitle = 'ESBOÇO criação & arte | Humor que comunica. Design que converte.'
const defaultDescription =
  'Estratégia & Design. Charges, identidade e impacto visual sob direção criativa de Clóvis Lima.'
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ''
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || ''
const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | ESBOÇO criação & arte'
  },
  description: defaultDescription,
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/`,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ESBOÇO criação & arte'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/og.png']
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: '/brand/logo-seal.png',
    apple: '/brand/logo-seal.png',
  }
}

export const viewport: Viewport = {
  themeColor: '#ef4444'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ESBOÇO criação & arte',
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-horizontal.png`,
    founder: {
      '@type': 'Person',
      name: 'Clóvis Lima'
    },
    sameAs: []
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    inLanguage: 'pt-BR'
  }

  return (
    <html lang="pt-BR">
      <body className="bg-paper text-primary halftone-bg">
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : umamiWebsiteId ? (
          <Script
            defer
            src={umamiScriptUrl}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
