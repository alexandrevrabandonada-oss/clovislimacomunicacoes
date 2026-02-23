"use client"
export const dynamic = 'force-dynamic'
import React, { useEffect, useState, useRef } from 'react'

export default function AdminPage(){
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File|undefined>()
  const [title, setTitle] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [workType, setWorkType] = useState('website')

  const supabaseRef = useRef<any>(null)
  useEffect(()=>{
    let mounted = true
    let subscription: any
    import('../../lib/supabase/client').then(({ supabase: sb })=>{
      if(!mounted) return
      supabaseRef.current = sb
      const res = sb.auth.onAuthStateChange((event, session)=>{
        setUser(session?.user ?? null)
      })
      subscription = res?.data?.subscription
      sb.auth.getUser().then((r: any)=> setUser(r.data.user ?? null))
    })
    return ()=>{ mounted = false; if(subscription) subscription.unsubscribe() }
  },[])

  const signIn = async ()=>{
    const sb = supabaseRef.current
    if(!sb){ alert('Supabase não inicializado ainda'); return }
    await sb.auth.signInWithOtp({ email: window.prompt('Email para magic link') || '' })
    alert('Verifique seu email para o link mágico')
  }

  const upload = async ()=>{
    if(!user){ alert('Faça login'); return }
    if(!file){ alert('Escolha um arquivo'); return }
    if(!title.trim()){ alert('Informe o titulo'); return }
    const sb = supabaseRef.current
    if(!sb){ alert('Supabase não inicializado'); return }
    const path = `${Date.now()}-${file.name}`
    const { error: upErr } = await sb.storage.from('portfolio').upload(path, file)
    if(upErr) { alert('Upload failed'); return }
    const url = sb.storage.from('portfolio').getPublicUrl(path).data.publicUrl
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    const { error: insertErr } = await sb.from('works').insert([{
      title,
      slug: `${slug}-${Date.now()}`,
      type: workType,
      cover_url: url,
      cover_image_url: url,
      project_url: projectUrl || null,
      content_warning: null,
      is_published: true
    }])
    if(insertErr) { alert(`Insert failed: ${insertErr.message}`) }
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
          <label className="block mt-2">Tipo
            <select value={workType} onChange={e=>setWorkType(e.target.value)} className="border p-1 ml-2">
              <option value="branding">Branding</option>
              <option value="social_media">Social Media</option>
              <option value="website">Website</option>
              <option value="video">Video</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="block mt-2">URL do projeto<input value={projectUrl} onChange={e=>setProjectUrl(e.target.value)} className="border p-1" /></label>
          <label className="block mt-2">Arquivo<input type="file" onChange={e=>setFile(e.target.files?.[0])} /></label>
          <div className="mt-3"><button onClick={upload} className="px-3 py-1 bg-accent text-white rounded">Upload</button></div>
        </div>
      )}
    </div>
  )
}
