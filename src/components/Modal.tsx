import React from 'react'

export default function Modal({ open, onClose, children }: { open:boolean, onClose: ()=>void, children: React.ReactNode }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true">
      <div className="bg-white p-4 rounded max-w-3xl w-full">
        <button className="float-right" onClick={onClose} aria-label="Fechar">✕</button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
