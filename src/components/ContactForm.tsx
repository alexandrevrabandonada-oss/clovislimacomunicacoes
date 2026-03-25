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
  licenciamento: 'Licenciamento / Prints',
  digital: 'Sistemas Digitais / PWA',
  consultoria: 'Consultoria Especializada'
}

type ContactPath = 'editorial' | 'licenciamento' | 'digital' | 'consultoria';

export default function ContactForm() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()
  const [activePath, setActivePath] = useState<ContactPath>('editorial')
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
  const whatsAppNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5524992544760').replace(/\D/g, '')
  const leadEmail = 'clovischarges@gmail.com'
  const hasTurnstile = Boolean(turnstileSiteKey)

  const whatsappLink = whatsAppNumber
    ? `https://wa.me/${whatsAppNumber}`
    : `https://wa.me/`

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get('pacote')
    if (p && PACKAGE_LABELS[p]) {
      setActivePath(p as ContactPath)
    }
  }, [])

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
        body: JSON.stringify({ name, email, phone, message: `[TRILHA: ${PACKAGE_LABELS[activePath]}] ${message}`, honeypot, turnstileToken })
      })
      
      if (!response.ok) throw new Error('Falha no envio')
      
      setStatus('success')
      trackEvent('submit_lead_success', { package: activePath })
    } catch {
      setStatus('error')
      setFeedback('Não foi possível enviar agora. Tente novamente ou use o WhatsApp.')
    }
  }

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
    if (!widgetReady) return
    mountTurnstile()
  }, [widgetReady, mountTurnstile])

  return (
    <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 border-[4px] border-black shadow-[32px_32px_0px_0px_rgba(0,0,0,1)]">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setWidgetReady(true)}
      />
      
      <header className="mb-12 border-b-[3px] border-black pb-10">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Technical_Onboarding // Protocolo_2026</p>
        </div>
        <h2 ref={headingRef} className={`reveal-heading text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase ${revealed ? 'is-revealed' : ''}`}>
          Protocolo <br/> <span className="text-accent text-glow">De Entrada</span>
        </h2>
        <p className="mt-8 text-xl text-black font-bold leading-tight max-w-2xl italic border-l-8 border-black pl-8">
          Inicie uma interlocução técnica soberana. Selecione a vertical de ativos e aguarde o diagnóstico de viabilidade estratégia e impacto narrativo.
        </p>
      </header>

      {/* Path Selector */}
      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(PACKAGE_LABELS) as ContactPath[]).map(path => (
          <button
            key={path}
            onClick={() => setActivePath(path)}
            className={`p-6 border-[3px] text-left transition-all relative overflow-hidden group 
              ${activePath === path ? 'border-accent bg-black text-white shadow-[8px_8px_0px_0px_var(--accent)]' : 'border-black bg-white text-black hover:border-accent hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'}
            `}
          >
            <div className={`w-2 h-8 absolute left-0 top-1/2 -translate-y-1/2 ${activePath === path ? 'bg-accent' : 'bg-black/10'}`} />
            <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Vertical_{path}</p>
            <p className="text-xs font-black uppercase tracking-tighter leading-tight italic">{PACKAGE_LABELS[path]}</p>
          </button>
        ))}
      </div>
      
      <div className="mb-16 p-10 bg-black text-white border-[3px] border-black relative overflow-hidden group shadow-[16px_16px_0px_0px_rgba(239,68,68,1)]">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20"/></svg>
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-10 flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-accent animate-ping" />
          Protocolo_Triagem_Estratégica ::
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <li className="flex flex-col gap-6 items-start">
            <span className="shrink-0 w-8 h-8 bg-white text-black text-[12px] flex items-center justify-center font-black border-2 border-white shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">01</span>
            <div>
               <p className="text-[13px] font-black text-white mb-2 uppercase tracking-widest">Triagem_Pauta</p>
               <p className="text-[11px] text-white/50 leading-tight font-bold uppercase tracking-tight">Verificação de aderência do projeto ao repertório soberano do estúdio.</p>
            </div>
          </li>
          <li className="flex flex-col gap-6 items-start">
            <span className="shrink-0 w-8 h-8 bg-white text-black text-[12px] flex items-center justify-center font-black border-2 border-white shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">02</span>
            <div>
               <p className="text-[13px] font-black text-white mb-2 uppercase tracking-widest">Diagnóstico_Impacto</p>
               <p className="text-[11px] text-white/50 leading-tight font-bold uppercase tracking-tight">Dimensionamento de esforço técnico e narrativa visual esperada.</p>
            </div>
          </li>
          <li className="flex flex-col gap-6 items-start">
            <span className="shrink-0 w-8 h-8 bg-white text-black text-[12px] flex items-center justify-center font-black border-2 border-white shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">03</span>
            <div>
               <p className="text-[13px] font-black text-white mb-2 uppercase tracking-widest">Aprovação_Técnica</p>
               <p className="text-[11px] text-white/50 leading-tight font-bold uppercase tracking-tight">Proposta técnica enviada via canal oficial em até 24h úteis.</p>
            </div>
          </li>
        </ul>
      </div>

      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Entidade / Identidade</label>
                <input 
                  required 
                  placeholder="Seu nome ou Razão Social" 
                  className="w-full rounded-none border-[3px] border-black bg-white p-5 text-sm focus:border-accent focus:ring-0 focus:outline-none transition-all font-black uppercase tracking-tight placeholder:text-black/20" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">E-mail_Institucional</label>
                <input 
                  type="email" 
                  required 
                  placeholder="seu@contato.com.br" 
                  className="w-full rounded-none border-[3px] border-black bg-white p-5 text-sm focus:border-accent focus:ring-0 focus:outline-none transition-all font-black uppercase tracking-tight placeholder:text-black/20" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Canal_WhatsApp</label>
                <input 
                  type="tel" 
                  placeholder="(00) 00000-0000" 
                  className="w-full rounded-none border-[3px] border-black bg-white p-5 text-sm focus:border-accent focus:ring-0 focus:outline-none transition-all font-black uppercase tracking-tight placeholder:text-black/20" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40 ml-1">Briefing_Técnico :: Diagnóstico_Necessário</label>
              <textarea 
                ref={messageRef} 
                required 
                rows={6} 
                placeholder="Qual o seu principal desafio de comunicação ou pauta atual? Descreva o impacto desejado." 
                className="w-full rounded-none border-[3px] border-black bg-white p-5 text-sm focus:border-accent focus:ring-0 focus:outline-none transition-all font-black uppercase tracking-tight placeholder:text-black/20 resize-none min-h-[250px]" 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
              />
            </div>
          </div>

          <div style={{ display: 'none' }} aria-hidden="true">
            <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
          </div>

          <div className="space-y-8 pt-4">
            <div className="min-h-[70px]">
              {turnstileStatus === 'error' ? (
                <div className="bg-red-50 p-6 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-sm text-black font-black uppercase tracking-widest leading-none">Erro de Verificação</p>
                  <p className="text-[11px] text-black/60 mt-3 font-bold uppercase tracking-tight">Utilize o <a href={whatsappLink} onClick={() => trackEvent('click_contact_fallback_whatsapp')} className="underline text-accent">WhatsApp_Gabinete</a> ou o <a href={`mailto:${leadEmail}`} onClick={() => trackEvent('click_contact_fallback_email')} className="underline text-accent">E-mail_Direto</a>.</p>
                </div>
              ) : (
                <div ref={turnstileContainerRef} className="flex justify-center md:justify-start" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <button
                type="submit"
                disabled={status === 'loading' || (hasTurnstile && !turnstileToken)}
                className="flex-grow bg-accent text-white py-6 border-[3px] border-black font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                {status === 'loading' ? 'PROCESSANDO_PROTOCOLO...' : 'Protocolar Diagnóstico Técnico →'}
                </button>
                <a 
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('click_contact_alternative_whatsapp')}
                className="inline-flex items-center justify-center px-10 py-6 bg-white text-black border-[3px] border-black font-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
                >
                WhatsApp_Fast
                </a>
            </div>
            
            {status === 'error' && (
              <p className="text-center text-[11px] font-black text-red-600 uppercase tracking-[0.3em]">{feedback}</p>
            )}
          </div>
        </form>
      ) : (
        <div className="py-20 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-accent text-white border-[4px] border-black flex items-center justify-center mx-auto mb-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-5xl font-black text-black mb-6 italic uppercase tracking-tighter">&quot;Briefing_Protocolado&quot;</h3>
          <p className="text-xl text-black/60 max-w-lg mx-auto mb-12 leading-tight font-black italic uppercase tracking-tighter">
            Sua solicitação está na mesa de curadoria técnica. Iniciando análise de ativos e aderência estratégica.
          </p>
          
          <div className="max-w-md mx-auto text-left space-y-6 mb-16 bg-white p-8 border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-black/30 mb-4">Pipeline_Status:</h4>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-accent border-2 border-black flex items-center justify-center text-white text-[12px] font-black italic">!</div>
              <p className="text-sm font-black uppercase tracking-tight italic">Briefing em Analise_Surgical</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-black flex items-center justify-center text-black animate-pulse font-black text-[12px]">⋯</div>
              <p className="text-sm font-black uppercase tracking-tight italic">Verificação de Aderência_Capability</p>
            </div>
            <div className="flex items-center gap-4 opacity-30">
              <div className="w-6 h-6 border-2 border-black/20" />
              <p className="text-sm font-black uppercase tracking-tight italic">Retorno Estratégico :: T_24h</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
             <button
              onClick={() => setStatus('idle')}
              className="text-[11px] font-black uppercase tracking-[0.4em] text-black/40 hover:text-black transition-colors"
            >
              Protocolar_Novo_Briefing
            </button>
            <div className="hidden sm:block h-6 w-[2px] bg-black/10" />
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('click_contact_success_whatsapp')}
              className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-accent hover:rotate-2 transition-transform"
            >
              Acelerar via Gabinete ⚡
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
