"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase/client'

export default function AdminPage(){
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File|undefined>()
  const [title, setTitle] = useState('')

  useEffect(()=>{
    const s = supabase.auth.onAuthStateChange((event, session)=>{
      setUser(session?.user ?? null)
    })
    supabase.auth.getUser().then(r=> setUser(r.data.user ?? null))
    return ()=> s.subscription.unsubscribe()
  },[])

  const signIn = async ()=>{
    await supabase.auth.signInWithOtp({ email: window.prompt('Email para magic link') || '' })
    alert('Verifique seu email para o link mágico')
  }

  const upload = async ()=>{
    if(!user){ alert('Faça login'); return }
    if(!file){ alert('Escolha um arquivo'); return }
    const path = `${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('portfolio').upload(path, file)
    if(upErr) { alert('Upload failed'); return }
    const url = supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl
    const { error: insertErr } = await supabase.from('works').insert([{ title, image: url }])
    if(insertErr) { alert('Insert failed') }
    else { alert('Work created') }
  }

  return (
    <div className="mt-20">
      <h1 className="text-2xl font-bold">Admin</h1>
      {!user ? (
        <div className="mt-4">
          <p>Protegido por Supabase Magic Link.</p>
          <button onClick={signIn} className="mt-2 px-3 py-1 border">Entrar</button>
        </div>
      ) : (
        <div className="mt-4 bg-white p-4 border">
          <div>Logado como: {user.email}</div>
          <label className="block mt-2">Título<input value={title} onChange={e=>setTitle(e.target.value)} className="border p-1" /></label>
          <label className="block mt-2">Arquivo<input type="file" onChange={e=>setFile(e.target.files?.[0])} /></label>
          <div className="mt-3"><button onClick={upload} className="px-3 py-1 bg-accent text-white rounded">Upload</button></div>
        </div>
      )}
    </div>
  )
}
