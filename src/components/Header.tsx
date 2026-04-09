"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type NavItem = {
  label: string
  href: string
  isPage?: boolean
}

const navItems: NavItem[] = [
  { label: 'Livros', href: '/acervo/livros', isPage: true },
  { label: 'Acervo', href: '#trabalhos' },
  { label: 'Cases', href: '/cases', isPage: true },
  { label: 'Soluções', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' }
]

export default function Header() {
  const [activeHash, setActiveHash] = useState<string>('#hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionIds = useMemo(
    () => navItems.map((item) => item.href.replace('#', '')),
    []
  )

  useEffect(() => {
    const pickActive = () => {
      const hash = window.location.hash
      if (hash && navItems.some((item) => item.href === hash)) {
        setActiveHash(hash)
        return
      }

      let current = '#hero'
      let bestTop = Number.NEGATIVE_INFINITY
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (!section) continue
        const top = section.getBoundingClientRect().top
        if (top <= 140 && top > bestTop) {
          bestTop = top
          current = `#${id}`
        }
      }
      setActiveHash(current)
    }

    pickActive()
    window.addEventListener('hashchange', pickActive)
    window.addEventListener('scroll', pickActive, { passive: true })
    return () => {
      window.removeEventListener('hashchange', pickActive)
      window.removeEventListener('scroll', pickActive)
    }
  }, [sectionIds])

  // Close menu on route change or scroll
  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true, once: true })
    return () => window.removeEventListener('scroll', close)
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b-[3px] border-black shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-5">
          {/* Logo + badge */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <Image 
                src="/brand/logo-horizontal.png" 
                alt="ESBOÇO criação & arte" 
                width={140} 
                height={40} 
                className="h-8 md:h-10 w-auto object-contain"
                priority
              />
            </Link>
            <Link href="/" className="hidden xl:flex items-center gap-3 bg-black text-white px-3 py-1 border border-black hover:bg-accent transition-colors">
               <span className="w-1.5 h-1.5 bg-white animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocolo_2026 :: Estratégia & Design v3.4</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const isActive = activeHash === item.href
              const isContact = item.label === 'Contato'
              
              const baseClass = isContact
                ? 'bg-black text-white px-5 py-2 border-[3px] border-black text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                : 'text-[11px] font-black uppercase tracking-[0.15em] text-black/40 hover:text-black transition-colors relative group'
              
              const activeClass = isActive && !isContact ? ' text-black' : ''

              return (
                  <div key={item.href} className="flex flex-col items-center">
                      {item.isPage ? (
                          <Link href={item.href} className={`${baseClass}${activeClass}`}>
                              {item.label}
                              {isActive && !isContact && <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent" />}
                          </Link>
                      ) : (
                          <a href={item.href} className={`${baseClass}${activeClass}`}>
                              {item.label}
                              {isActive && !isContact && <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent" />}
                          </a>
                      )}
                  </div>
              )
            })}
          </div>

          {/* Mobile: Contato CTA + Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="#contato"
              className="bg-black text-white px-4 py-2 border-[3px] border-black text-[10px] font-black uppercase tracking-widest"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </a>
            <button
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex flex-col justify-center items-center w-10 h-10 border-[3px] border-black bg-white gap-1.5 shrink-0"
            >
              <span className={`block w-5 h-[3px] bg-black transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-[3px] bg-black transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[3px] bg-black transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col" style={{ top: 0 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer panel */}
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-white border-l-[3px] border-black flex flex-col overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-[3px] border-black">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center border-[2px] border-black font-black text-sm"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>
            {/* Nav items */}
            <nav className="flex flex-col divide-y divide-black/10 flex-1">
              {navItems.map((item) => {
                const isContact = item.label === 'Contato'
                if (isContact) return null // shown separately at bottom
                return (
                  <div key={item.href}>
                    {item.isPage ? (
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-4 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-4 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </div>
                )
              })}
            </nav>
            {/* Contato always at bottom */}
            <div className="p-6 border-t-[3px] border-black">
              <a
                href="#contato"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-black text-white px-6 py-4 font-black text-[12px] uppercase tracking-widest hover:bg-accent transition-colors border-[3px] border-black"
              >
                Iniciar Projeto →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
