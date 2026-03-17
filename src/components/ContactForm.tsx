"use client"
import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { trackEvent } from '../lib/analytics'
import { useRevealOnView } from '../lib/useRevealOnView'

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
  editorial: 'Charges / Editorial',
  'licença': 'Prints / Licenciamento',
  tech: 'Sites / PWA'
}

function packageMessage(label: string): string {
  return `Olá! Tenho interesse na trilha de ${label}. Meu objetivo é: [descreva brevemente]. Prazo ideal: [data ou período].`
}

function formatWorkLabel(slug: string): string {
  const clean = slug.trim().toLowerCase()
  if (!clean) return ''
  const parts = clean.split('-').filter(Boolean)
  if (parts.length >= 2 && parts[0] === 'obra') {
    const number = parts[1]
    const titleParts = parts.slice(2).map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    if (titleParts.length) return `Obra ${number} - ${titleParts.join(' ')}`
    return `Obra ${number}`
  }
  return clean
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildTemplate(packageSlug: string, packageLabel: string, workLabel: string): string {
  if (['prints', 'licenca-editorial', 'licenca-campanha', 'licença'].includes(packageSlug)) {
    return `Olá! Tenho interesse em adquirir ou licenciar uma obra. Gostaria de saber mais sobre valores e formatos para ${packageLabel || 'impressão/licença'}.`
  }
  if (['editorial', 'tech'].includes(packageSlug)) {
    return `Olá! Gostaria de conversar sobre um projeto de ${packageLabel}. Meu objetivo principal é: [descreva brevemente].`
  }
  if (packageLabel && workLabel) {
    return `Olá! Vi a referência "${workLabel}" e gostaria de algo similar no pacote de ${packageLabel}. Podemos falar sobre prazos?`
  }
  if (workLabel) {
    return `Olá! Gostaria de conversar sobre a obra "${workLabel}" (licenciamento ou print assinado).`
  }
  if (packageLabel) {
    return `Olá! Tenho interesse na trilha de ${packageLabel}. Como podemos começar?`
  }
  return 'Olá! Gostaria de conversar sobre um projeto de comunicação. Meu objetivo é: [descreva o projeto].'
}

export default function ContactForm() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')
  const [widgetReady, setWidgetReady] = useState(false)
  const [turnstileStatus, setTurnstileStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const messageRef = useRef<HTMLTextAreaElement | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
  const whatsAppNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const leadEmail = 'contato@clovislimacomunicacoes.com.br' // Fallback fix
  const hasTurnstile = Boolean(turnstileSiteKey)
  const lastAutoMessageRef = useRef('')
  const [selectedPackageLabel, setSelectedPackageLabel] = useState('')
  const [selectedWorkSlug, setSelectedWorkSlug] = useState('')
  const [selectedWorkLabel, setSelectedWorkLabel] = useState('')

  const whatsappLink = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber}`
    : `https://wa.me/`

  const mountTurnstile = useCallback(() => {
    if (!hasTurnstile) return
    if (!turnstileContainerRef.current || !window.turnstile) return
    if (widgetIdRef.current) return

    try {
      widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token: string) => {
          setTurnstileToken(token)
          setTurnstileStatus('success')
        },
        'expired-callback': () => {
          setTurnstileToken('')
          setTurnstileStatus('idle')
        },
        'error-callback': () => {
          setTurnstileToken('')
          setTurnstileStatus('error')
        }
      })
    } catch (e) {
      console.error('Turnstile render error:', e)
      setTurnstileStatus('error')
    }
  }, [hasTurnstile, turnstileSiteKey])

  useEffect(() => {
    const prefillFromQuery = () => {
      const params = new URLSearchParams(window.location.search)
      const pacote = (params.get('pacote') || '').trim().toLowerCase()
      const obra = (params.get('obra') || '').trim().toLowerCase()
      const packageLabel = pacote ? (PACKAGE_LABELS[pacote] || pacote) : ''
      const workLabel = obra ? formatWorkLabel(obra) : ''
      const prefill = params.get('prefill_message')
      
      setSelectedPackageLabel(packageLabel)
      setSelectedWorkSlug(obra)
      setSelectedWorkLabel(workLabel)

      if (prefill && (!message.trim() || message === lastAutoMessageRef.current)) {
        setMessage(prefill)
        lastAutoMessageRef.current = prefill
        return
      }

      if ((packageLabel || workLabel) && (!message.trim() || message === lastAutoMessageRef.current)) {
        const nextMessage = buildTemplate(pacote, packageLabel, workLabel)
        setMessage(nextMessage)
        lastAutoMessageRef.current = nextMessage
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

    prefillFromQuery()
    window.addEventListener('contact-prefill', onPrefill)
    window.addEventListener('popstate', prefillFromQuery)
    return () => {
      window.removeEventListener('contact-prefill', onPrefill)
      window.removeEventListener('popstate', prefillFromQuery)
    }
  }, [message])

  useEffect(() => {
    if (!widgetReady) return
    mountTurnstile()
  }, [widgetReady, mountTurnstile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error')
      setFeedback('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, honeypot, turnstileToken })
      })
      
      if (!response.ok) throw new Error('Falha no envio')
      
      setStatus('success')
      trackEvent('submit_lead_success', { package: selectedPackageLabel })
    } catch {
      setStatus('error')
      setFeedback('Não foi possível enviar agora. Tente novamente ou use o WhatsApp.')
    }
  }

  return (
    <div className="max-w-2xl bg-white p-8 md:p-12 rounded-[2rem] border-2 border-black/5 shadow-sm">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setWidgetReady(true)}
      />
      
      <header className="mb-8">
        <h2 ref={headingRef} className={`reveal-heading text-3xl font-black ${revealed ? 'is-revealed' : ''}`}>
          Vamos iniciar seu projeto?
        </h2>
        <p className="mt-2 text-slate-600">
          Atendimento consultivo e estratégico para marcas que buscam autoridade visual.
        </p>
      </header>
      
      <div className="mb-10 p-6 bg-slate-50 border border-black/5 rounded-2xl relative overflow-hidden group">
        <h3 className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          Expectativas de Atendimento:
        </h3>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">01</span>
            <p className="text-xs text-slate-600 leading-relaxed"><strong className="text-black">Resposta em 24h:</strong> Analisamos pessoalmente cada briefing para garantir aderência à nossa técnica e estética.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">02</span>
            <p className="text-xs text-slate-600 leading-relaxed"><strong className="text-black">Alinhamento Expert:</strong> Definimos juntos a narrativa, o tom e os objetivos comerciais do seu projeto.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">03</span>
            <p className="text-xs text-slate-600 leading-relaxed"><strong className="text-black">Envio de Proposta:</strong> Você recebe um report técnico com solução, cronograma e investimento.</p>
          </li>
        </ul>
      </div>

      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Seu Nome / Marca</label>
                <input 
                  required 
                  placeholder="Como gostaria de ser chamado?" 
                  className="w-full rounded-xl border-2 border-black/5 bg-slate-50 p-3.5 text-sm focus:border-black/20 focus:outline-none transition-all font-medium" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail de Contato</label>
                <input 
                  type="email" 
                  required 
                  placeholder="seu@email.com" 
                  className="w-full rounded-xl border-2 border-black/5 bg-slate-50 p-3.5 text-sm focus:border-black/20 focus:outline-none transition-all font-medium" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Seu Desafio / Briefing</label>
              <textarea 
                ref={messageRef} 
                required 
                rows={5} 
                placeholder="Conte-me um pouco sobre o que você busca..." 
                className="w-full h-full min-h-[125px] rounded-xl border-2 border-black/5 bg-slate-50 p-3.5 text-sm focus:border-black/20 focus:outline-none transition-all font-medium resize-none" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ display: 'none' }} aria-hidden="true">
            <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
          </div>

          <div className="space-y-4 pt-2">
            <div className="min-h-[65px]">
              {turnstileStatus === 'error' ? (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-900 font-bold">Verificando segurança...</p>
                  <p className="text-[10px] text-amber-700 mt-1">Se o verificador demorar, você pode usar o <a href={whatsappLink} onClick={() => trackEvent('click_contact_fallback_whatsapp')} className="underline font-bold">WhatsApp</a> ou o <a href={`mailto:${leadEmail}`} onClick={() => trackEvent('click_contact_fallback_email')} className="underline font-bold">E-mail</a>.</p>
                </div>
              ) : (
                <div ref={turnstileContainerRef} className="flex justify-center md:justify-start" />
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || (hasTurnstile && !turnstileToken)}
              className="w-full bg-black text-white py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-accent hover:scale-[1.01] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Enviando pauta...' : 'Solicitar Atendimento Expert →'}
            </button>
            
            {status === 'error' && (
              <p className="text-center text-[10px] font-bold text-red-500 uppercase tracking-widest">{feedback}</p>
            )}
          </div>
        </form>
      ) : (
        <div className="py-12 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-black mb-4 italic">&quot;Tudo certo.&quot;</h3>
          <p className="text-slate-600 max-w-sm mx-auto mb-10 leading-relaxed font-serif text-lg">
            Sua mensagem está sendo processada. Iniciei a curadoria de referências para nosso papo.
          </p>
          
          <div className="max-w-xs mx-auto text-left space-y-4 mb-12 bg-slate-50 p-6 rounded-2xl border border-black/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Próximos Passos:</h4>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</div>
              <p className="text-xs font-bold text-slate-800">Briefing recebido</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 animate-pulse font-bold text-[10px]">⋯</div>
              <p className="text-xs font-bold text-slate-800">Análise técnica (Em andamento)</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
              <p className="text-xs font-medium text-slate-400">Primeiro contato (Até 24h)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
             <button
              onClick={() => setStatus('idle')}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
            >
              Enviar nova mensagem
            </button>
            <div className="hidden sm:block h-4 w-px bg-slate-200" />
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('click_contact_success_whatsapp')}
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:scale-105 transition-transform"
            >
              Acelerar via WhatsApp ⚡
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
