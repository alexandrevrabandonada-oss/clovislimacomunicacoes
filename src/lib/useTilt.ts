"use client"

import { useEffect, useRef } from 'react'

export function useTilt<T extends HTMLElement>(maxDeg = 3) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const canTilt =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!canTilt) return

    let frame = 0
    let rotateX = 0
    let rotateY = 0

    const applyTransform = () => {
      frame = 0
      element.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
    }

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      rotateY = (x - 0.5) * 2 * maxDeg
      rotateX = (0.5 - y) * 2 * maxDeg
      if (!frame) frame = window.requestAnimationFrame(applyTransform)
    }

    const onEnter = () => {
      element.style.willChange = 'transform'
      element.style.transition = 'transform 80ms ease-out'
    }

    const onLeave = () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
      rotateX = 0
      rotateY = 0
      element.style.transition = 'transform 180ms ease-out'
      element.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
      window.setTimeout(() => {
        element.style.willChange = ''
      }, 200)
    }

    element.addEventListener('pointerenter', onEnter)
    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', onLeave)

    return () => {
      element.removeEventListener('pointerenter', onEnter)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
      if (frame) window.cancelAnimationFrame(frame)
      element.style.willChange = ''
      element.style.transform = ''
      element.style.transition = ''
    }
  }, [maxDeg])

  return ref
}
