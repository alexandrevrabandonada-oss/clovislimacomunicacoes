"use client"
import { useState } from 'react'

export default function ContactForm(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [message,setMessage] = useState('')
  const [spamToken,setSpamToken] = useState('')

  const submit = (e:any)=>{
    e.preventDefault()
    // anti-spam: require simple math token (client-side); server will validate later
    if(spamToken.trim()!=='7'){ alert('Verificação anti-spam falhou') ; return }
    alert('Mensagem validada (simulada). Próxima etapa: enviar ao backend.')
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold">Contato</h2>
      <form className="mt-4" onSubmit={submit}>
        <label className="block">Nome<input className="w-full border p-2" value={name} onChange={e=>setName(e.target.value)} required /></label>
        <label className="block mt-2">Email<input type="email" className="w-full border p-2" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label className="block mt-2">Mensagem<textarea className="w-full border p-2" value={message} onChange={e=>setMessage(e.target.value)} required /></label>
        <label className="block mt-2">Anti-spam: quanto é 3 + 4? <input className="border p-1" value={spamToken} onChange={e=>setSpamToken(e.target.value)} required /></label>
        <button className="mt-3 bg-accent text-white px-4 py-2 rounded" type="submit">Enviar</button>
      </form>
    </div>
  )
}
