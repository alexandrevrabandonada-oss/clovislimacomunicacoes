"use client"
import React, { useEffect, useRef } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  labelledById?: string
}

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, children, labelledById }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (!dialogRef.current) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledById}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div ref={dialogRef} className="bg-white p-4 rounded max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <button ref={closeButtonRef} className="float-right" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
