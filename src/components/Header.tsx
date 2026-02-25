"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type NavItem = {
  label: string
  href: '#trabalhos' | '#servicos' | '#sobre' | '#contato'
}

const navItems: NavItem[] = [
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' }
]

export default function Header(){
  const [activeHash, setActiveHash] = useState<string>('#trabalhos')
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

      let current = '#trabalhos'
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
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur z-40 border-b">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="#hero" className="text-xl font-bold">Clóvis Lima</Link>
          <span className="stamp">Cartunista</span>
        </div>
        <div className="flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = activeHash === item.href
            const baseClass = item.label === 'Contato'
              ? 'btn border px-3 py-1 rounded'
              : 'hover:underline'
            const activeClass = isActive ? ' underline font-semibold' : ''

            return (
              <a key={item.href} href={item.href} className={`${baseClass}${activeClass}`}>
                {item.label}
              </a>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
