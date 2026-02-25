"use client"
import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { trackEvent } from '../lib/analytics'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

const PACKAGE_LABELS: Record<string, string> = {
  'charge-avulsa': 'Charge avulsa',
  'pacote-mensal': 'Pacote mensal',
  'serie-especial': 'Serie / Especial',
  'landing-rapida': 'Landing rapida',
  'site-completo': 'Site completo',
  pwa: 'PWA'
}

function packageMessage(label: string): string {
  return `Ola! Tenho interesse no pacote: ${label}. Meu objetivo e: ... Prazo ideal: ...`
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
  const [whatsAppHref, setWhatsAppHref] = useState('')
  const [widgetReady, setWidgetReady] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
  const whatsAppNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const lastAutoMessageRef = useRef('')

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
      const pacote = (params.get('pacote') || '').trim().toLowerCase()
      if (pacote) {
        const label = PACKAGE_LABELS[pacote] || pacote
        const nextMessage = packageMessage(label)
        if (!message.trim() || message === lastAutoMessageRef.current) {
          setMessage(nextMessage)
          lastAutoMessageRef.current = nextMessage
        }
        return
      }

      const prefill = params.get('prefill_message')
      if (prefill && !message.trim()) {
        setMessage(prefill)
        lastAutoMessageRef.current = prefill
      }
    }

    const onPrefill = (event: Event) => {
      const custom = event as CustomEvent<{ message?: string }>
      const incoming = custom.detail?.message || ''
      if (!incoming) return
      setMessage(incoming)
      lastAutoMessageRef.current = incoming
      setTimeout(() => messageRef.current?.focus(), 100)
    }

    const onPackage = (event: Event) => {
      const custom = event as CustomEvent<{ slug?: string; title?: string }>
      const slug = (custom.detail?.slug || '').trim().toLowerCase()
      const title = custom.detail?.title?.trim() || ''
      const label = title || PACKAGE_LABELS[slug] || slug
      if (!label) return
      const nextMessage = packageMessage(label)
      setMessage(nextMessage)
      lastAutoMessageRef.current = nextMessage
      setTimeout(() => messageRef.current?.focus(), 100)
    }

    prefillFromQuery()
    window.addEventListener('contact-prefill', onPrefill)
    window.addEventListener('contact-package', onPackage)
    window.addEventListener('popstate', prefillFromQuery)
    return () => {
      window.removeEventListener('contact-prefill', onPrefill)
      window.removeEventListener('contact-package', onPackage)
      window.removeEventListener('popstate', prefillFromQuery)
    }
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
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setStatus('error')
      setFeedback('Ops, faltou preencher nome, email, telefone e mensagem.')
      return
    }
    if (!turnstileToken) {
      setStatus('error')
      setFeedback('Ops, faltou confirmar o anti-spam.')
      return
    }

    setStatus('loading')
    setFeedback('Enviando...')

    const params = new URLSearchParams(window.location.search)
    const utmSource = params.get('utm_source') || ''
    const utmMedium = params.get('utm_medium') || ''
    const utmCampaign = params.get('utm_campaign') || ''
    const pageUrl = window.location.href
    const referrer = document.referrer || ''
    const userAgent = navigator.userAgent || ''

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
          turnstileToken,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          referrer,
          page_url: pageUrl,
          user_agent: userAgent
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
      trackEvent('submit_lead_success')
      const prefill = `Olá! Acabei de enviar o formulário pelo site. Meu nome é ${name} e gostaria de continuar o atendimento.`
      const href = whatsAppNumber
        ? `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(prefill)}`
        : `https://wa.me/?text=${encodeURIComponent(prefill)}`
      setWhatsAppHref(href)
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
        <label className="block">Nome<input id="contact-name" name="name" className="w-full border p-2" value={name} onChange={e=>setName(e.target.value)} required /></label>
        <label className="block mt-2">Email<input type="email" className="w-full border p-2" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
        <label className="block mt-2">Telefone<input className="w-full border p-2" value={phone} onChange={e=>setPhone(e.target.value)} required /></label>
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
        {status !== 'idle' && status !== 'success' && (
          <p className={`mt-3 rounded-md border px-3 py-2 text-sm ${
            status === 'error'
              ? 'border-red-300 bg-red-50 text-red-800'
              : 'border-slate-300 bg-white text-slate-700'
          }`}>
            {feedback}
          </p>
        )}
        {status === 'success' && (
          <div className="mt-4 rounded-2xl border-2 border-emerald-300 bg-[linear-gradient(135deg,#f0fdf4_0%,#ecfeff_100%)] p-4 shadow-sm">
            <p className="text-emerald-900 font-semibold">{feedback}</p>
            <p className="mt-1 text-sm text-emerald-800">Se preferir, continue agora pelo WhatsApp.</p>
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-full border border-emerald-800 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Continuar no WhatsApp
            </a>
          </div>
        )}
      </form>
    </div>
  )
}
