"use client"
import React, { useState } from 'react'
import Modal from './Modal'

type Work = { id:string; title:string; image:string|null; content_warning?:string }

const SAMPLE:Work[] = [
  { id:'1', title:'Charge A', image:null, content_warning: undefined },
  { id:'2', title:'Charge B', image:null, content_warning: 'contains_political' },
  { id:'3', title:'Illustration', image:null }
]

export default function Gallery(){
  const [filter,setFilter] = useState('all')
  const [selected,setSelected] = useState<Work|undefined>()
  const [unlocked, setUnlocked] = useState<Record<string,boolean>>({})

  const works = SAMPLE.filter(w=> filter==='all' || (w.content_warning? 'sensitive'===filter : 'safe'===filter))

  return (
    <div>
      <h2 className="text-2xl font-bold">Trabalhos</h2>
      <div className="mt-3 flex gap-2">
        <button onClick={()=>setFilter('all')} className="px-3 py-1 border">Todos</button>
        <button onClick={()=>setFilter('safe')} className="px-3 py-1 border">Sem alerta</button>
        <button onClick={()=>setFilter('sensitive')} className="px-3 py-1 border">Com aviso</button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {works.map(w=> (
          <article key={w.id} className="border p-3 bg-white">
            <h3 className="font-semibold">{w.title}</h3>
            {w.content_warning && !unlocked[w.id] ? (
              <div className="mt-2 p-4 bg-red-50">Aviso: conteúdo sensível. <button className="ml-2 underline" onClick={()=>setUnlocked(prev=>({...prev,[w.id]:true}))}>Mostrar</button></div>
            ) : (
              <div className="mt-2 h-40 bg-gray-100 flex items-center justify-center">Preview</div>
            )}
            <div className="mt-3 flex gap-2">
              <button onClick={()=>setSelected(w)} className="px-2 py-1 border">Abrir</button>
            </div>
          </article>
        ))}
      </div>
      <Modal open={!!selected} onClose={()=>setSelected(undefined)}>
        {selected && (
          <div>
            <h3 className="text-xl font-bold">{selected.title}</h3>
            <p className="mt-2">Detalhes do trabalho aqui. (conteúdo sensível ocultado até confirmação)</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
