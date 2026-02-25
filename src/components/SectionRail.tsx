"use client"

import { useEffect, useMemo, useState } from 'react'

type SectionItem = {
  id: 'hero' | 'trabalhos' | 'servicos' | 'sobre' | 'contato'
  label: string
}

const sections: SectionItem[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'trabalhos', label: 'Trabalhos' },
  { id: 'servicos', label: 'Servicos' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' }
]

export default function SectionRail() {
  const [activeId, setActiveId] = useState<SectionItem['id']>('hero')
  const sectionIds = useMemo(() => sections.map((item) => item.id), [])

  useEffect(() => {
    const updateActive = () => {
      const hash = window.location.hash.replace('#', '')
      const matchingSection = sections.find((item) => item.id === hash)
      if (matchingSection) {
        setActiveId(matchingSection.id)
        return
      }

      let current: SectionItem['id'] = 'hero'
      let bestTop = Number.NEGATIVE_INFINITY
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (!section) continue
        const top = section.getBoundingClientRect().top
        if (top <= 160 && top > bestTop) {
          bestTop = top
          current = id
        }
      }
      setActiveId(current)
    }

    updateActive()
    window.addEventListener('hashchange', updateActive)
    window.addEventListener('scroll', updateActive, { passive: true })
    return () => {
      window.removeEventListener('hashchange', updateActive)
      window.removeEventListener('scroll', updateActive)
    }
  }, [sectionIds])

  const goToSection = (id: SectionItem['id']) => {
    const section = document.getElementById(id)
    if (!section) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    section.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    window.history.replaceState({}, '', `#${id}`)
    setActiveId(id)
  }

  return (
    <nav aria-label="Navegacao de secoes" className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-30">
      <div className="ink-card bg-white/90 p-2 flex flex-col gap-2 rounded-full border-2 border-black">
        {sections.map((item) => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSection(item.id)}
              aria-label={`Ir para ${item.label}`}
              title={item.label}
              className={`h-3.5 w-3.5 rounded-full border-2 border-black transition-transform ${isActive ? 'bg-accent scale-110' : 'bg-white hover:scale-105'}`}
            />
          )
        })}
      </div>
    </nav>
  )
}
