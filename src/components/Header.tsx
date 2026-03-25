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

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b-[3px] border-black shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-6">
          <Link href="#hero" className="flex items-center gap-2 group">
            <Image 
              src="/brand/logo-horizontal.png" 
              alt="ESBOÇO criação & arte" 
              width={160} 
              height={45} 
              className="h-10 w-auto object-contain group-hover:invert-0 transition-all"
              priority
            />
          </Link>
          <div className="hidden lg:flex items-center gap-3 bg-black text-white px-4 py-1 border border-black group">
             <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocolo_2026 :: Estratégia & Design v3.4</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeHash === item.href
            const isContact = item.label === 'Contato'
            
            const baseClass = isContact
              ? 'bg-black text-white px-6 py-2 border-[3px] border-black text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:border-accent transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]'
              : 'text-[11px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors relative group'
            
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
      </nav>
    </header>
  )
}
