"use client"

import { useEffect, useRef, useState } from 'react'

export function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (revealed) return
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setRevealed(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px'
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [revealed])

  return { ref, revealed }
}
