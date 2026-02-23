"use client"
import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export default function ContactForm(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [company,setCompany] = useState('')
  const [message,setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const [widgetReady, setWidgetReady] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  const mountTurnstile = useCallback(() => {
    if (!turnstileSiteKey) return
    if (!turnstileContainerRef.current || !window.turnstile) return
    if (widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => {
        setTurnstileToken('')
        setStatus('error')
        setFeedback('Ops, faltou validar o anti-spam. Tente novamente.')
      }
    })
  }, [turnstileSiteKey])

  useEffect(() => {
    const prefillFromQuery = () => {
      const params = new URLSearchParams(window.location.search)
      const prefill = params.get('prefill_message')
      if (prefill && !message.trim()) {
        setMessage(prefill)
      }
    }

    const onPrefill = (event: Event) => {
      const custom = event as CustomEvent<{ message?: string }>
      const incoming = custom.detail?.message || ''
      if (!incoming) return
      setMessage(incoming)
      setTimeout(() => messageRef.current?.focus(), 100)
    }

    prefillFromQuery()
    window.addEventListener('contact-prefill', onPrefill)
    return () => window.removeEventListener('contact-prefill', onPrefill)
  }, [message])

  useEffect(() => {
    if (!widgetReady) return
    mountTurnstile()
  }, [widgetReady, mountTurnstile])

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [])

  const submit = async (e:any)=>{
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error')
      setFeedback('Ops, faltou preencher nome, email e mensagem.')
      return
    }
    if (!turnstileToken) {
      setStatus('error')
      setFeedback('Ops, faltou confirmar o anti-spam.')
      return
    }

    setStatus('loading')
    setFeedback('Enviando...')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          message,
          turnstileToken
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setStatus('error')
        setFeedback(data?.error || 'Ops, faltou algo no envio. Revise e tente novamente.')
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken('')
        return
      }

      setStatus('success')
      setFeedback('Recebido. Retorno em até 24 horas.')
      setName('')
      setEmail('')
      setPhone('')
      setCompany('')
      setMessage('')
      setTurnstileToken('')
      if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current)
    } catch {
      setStatus('error')
      setFeedback('Ops, faltou conexão para enviar agora. Tente novamente em instantes.')
    }
  }

  return (
    <div className="max-w-2xl">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setWidgetReady(true)}
      />
      <h2 className="text-2xl font-bold">Contato</h2>
      <form className="mt-4" onSubmit={submit}>
        <label className="block">Nome<input className="w-full border p-2" value={name} onChange={e=>setName(e.target.value)} required /></label>
        <label className="block mt-2">Email<input type="email" className="w-full border p-2" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label className="block mt-2">Telefone<input className="w-full border p-2" value={phone} onChange={e=>setPhone(e.target.value)} /></label>
        <label className="block mt-2">Empresa<input className="w-full border p-2" value={company} onChange={e=>setCompany(e.target.value)} /></label>
        <label className="block mt-2">Mensagem<textarea ref={messageRef} className="w-full border p-2" value={message} onChange={e=>setMessage(e.target.value)} required /></label>
        <div className="mt-3">
          {turnstileSiteKey ? (
            <div ref={turnstileContainerRef} />
          ) : (
            <p className="text-sm text-red-700">Falta configurar `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.</p>
          )}
        </div>
        <button className="mt-3 bg-accent text-white px-4 py-2 rounded disabled:opacity-70" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Enviando...' : 'Enviar'}
        </button>
        {status !== 'idle' && (
          <p
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              status === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : status === 'error'
                  ? 'border-red-300 bg-red-50 text-red-800'
                  : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            {feedback}
          </p>
        )}
      </form>
    </div>
  )
}
