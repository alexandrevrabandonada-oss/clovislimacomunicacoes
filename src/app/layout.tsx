import '../styles/globals.css'
import React from 'react'
import Header from '../components/Header'

export const metadata = {
  title: 'Clóvis Lima — Portfólio',
  description: 'Portfólio de Clóvis Lima — charges, ilustrações e projetos visuais'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-paper text-primary halftone-bg">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
