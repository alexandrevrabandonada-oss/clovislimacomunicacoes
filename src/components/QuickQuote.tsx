"use client"

import { useCallback, useState } from 'react'
import { trails, trailsMap, Trail, TrailId } from '../lib/trails'
import TrailPanel from './TrailPanel'
import { trackEvent } from '../lib/analytics'

function scrollToContact(trailId: TrailId) {
  const url = new URL(window.location.href)
  url.searchParams.set('pacote', trailId)
  url.hash = 'contato'
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)

  const trail = trailsMap[trailId]
  window.dispatchEvent(
    new CustomEvent('contact-prefill', {
      detail: { message: trail.whatsappText, package: trailId },
    })
  )

  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('contato')?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'start',
  })
}

function scrollToPanel() {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('trail-panel')?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'nearest',
  })
}

export default function QuickQuote() {
  const [activeId, setActiveId] = useState<TrailId | null>(null)
  const activeTrail: Trail | null = activeId ? trailsMap[activeId] : null

  const handleSelect = useCallback(
    (id: TrailId) => {
      const isDeselect = activeId === id
      const next = isDeselect ? null : id
      setActiveId(next)

      if (next) {
        trackEvent('quick_quote_select', { trail: next })
        // Mobile: scroll suave até o painel após leve delay de render
        const isMobile = window.innerWidth < 1024
        if (isMobile) {
          setTimeout(scrollToPanel, 80)
        }
      }
    },
    [activeId]
  )

  const handleCta = useCallback(() => {
    if (!activeId) return
    scrollToContact(activeId)
  }, [activeId])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
        <h3 className="text-xl font-black uppercase tracking-tight">Orçamento Rápido</h3>
      </div>
      <p className="text-[11px] font-bold text-black/50 uppercase tracking-[0.2em] leading-relaxed">
        Selecione a trilha e veja entregas, prazo e próximo passo.
      </p>

      {/* Trail buttons */}
      <div
        role="radiogroup"
        aria-label="Trilhas de atendimento"
        className="flex flex-col gap-2 pt-2"
      >
        {trails.map((trail) => {
          const isActive = activeId === trail.id
          return (
            <button
              key={trail.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-pressed={isActive}
              onClick={() => handleSelect(trail.id)}
              className={[
                'group relative flex items-center gap-4 w-full text-left px-5 py-4',
                'border-[3px] font-black text-[11px] uppercase tracking-[0.15em]',
                'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                isActive
                  ? 'border-accent bg-black text-white shadow-[6px_6px_0px_0px_var(--accent)]'
                  : 'border-black bg-white text-black hover:border-accent hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)] hover:bg-slate-50',
              ].join(' ')}
            >
              {/* Active indicator bar */}
              <span
                className={[
                  'absolute left-0 top-0 bottom-0 w-1 transition-all duration-150',
                  isActive ? 'bg-accent' : 'bg-transparent group-hover:bg-black/10',
                ].join(' ')}
                aria-hidden="true"
              />

              {/* Radio dot */}
              <span
                className={[
                  'shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all',
                  isActive ? 'border-accent bg-accent' : 'border-black/30 bg-transparent',
                ].join(' ')}
                aria-hidden="true"
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>

              <span className="flex-1 leading-tight">{trail.label}</span>

              {/* Arrow indicator */}
              <span
                className={[
                  'text-sm transition-transform duration-150',
                  isActive ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-40',
                ].join(' ')}
                aria-hidden="true"
              >
                →
              </span>
            </button>
          )
        })}
      </div>

      {/* Dynamic Panel */}
      <div className="pt-2">
        <TrailPanel trail={activeTrail} onCta={handleCta} />
      </div>

      {/* Fallback — sem trilha definida */}
      {!activeId && (
        <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] text-center pt-1">
          Sem trilha definida? {' '}
          <button
            type="button"
            onClick={() => scrollToContact('consultoria')}
            className="underline hover:text-black transition-colors"
          >
            Ir para contato livre →
          </button>
        </p>
      )}
    </div>
  )
}
