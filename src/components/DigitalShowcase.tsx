"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'
import { useRevealOnView } from '../lib/useRevealOnView'

export default function DigitalShowcase() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

  const techStack = [
    { category: "Frontend", items: ["Next.js 14+", "React Server", "TypeScript", "TailwindCSS"] },
    { category: "Backend", items: ["Node.js / Edge", "Supabase", "PostgreSQL", "Redis"] },
    { category: "Infra", items: ["Cloudflare", "Vercel", "CDN Global", "CI/CD"] },
    { category: "PWA", items: ["Service Workers", "App Shell", "Offline First", "Push API"] }
  ]

  const deliverables = [
    { title: "Brand Hubs", desc: "Centrais de marca com CMS integrado", icon: "🎯" },
    { title: "PWAs Institucionais", desc: "Apps web de alta performance", icon: "⚡" },
    { title: "Dashboards Técnicos", desc: "Visualização de dados complexos", icon: "📊" },
    { title: "Editoriais Digitais", desc: "Publicações com narrativa rica", icon: "📰" }
  ]

  const outcomes = [
    { metric: "< 0.9s", label: "LCP - Largest Contentful Paint", status: "excellent" },
    { metric: "100/100", label: "Performance Lighthouse", status: "excellent" },
    { metric: "100/100", label: "SEO Técnico", status: "excellent" },
    { metric: "100/100", label: "Acessibilidade", status: "excellent" }
  ]

  return (
    <div className="w-full space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-4 w-1 bg-accent rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Engenharia de Presença Digital</p>
          </div>
          <h2 ref={headingRef} className={`text-4xl md:text-5xl font-black tracking-tight leading-none ${revealed ? 'is-revealed' : ''}`}>
             Interfaces que <br/> <span className="hero-ink-underline italic">Convertem & Escalam</span>
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-200 pl-6">
          Desenvolvimento de sistemas web de alta performance, PWAs e plataformas de autoridade técnica. 
          Arquitetura orientada a Core Web Vitals e experiência crítica.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flagship Case - APS */}
        <div className="lg:col-span-7 group relative">
          <div className="ink-card p-0 overflow-hidden bg-white border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,0.05)] h-full flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
               {/* Browser UI */}
               <div className="absolute top-0 inset-x-0 h-8 bg-slate-900 flex items-center px-4 gap-2 z-20">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/40" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="bg-white/10 px-3 py-0.5 rounded text-[8px] text-white/40 font-mono">apsustentabilidade.org</div>
               </div>
               <Image 
                src="/portfolio/aps-real-desktop.png"
                alt="APS Sustentabilidade - Flagship Case"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <Link 
                    href="/cases/aps-sustentabilidade"
                    onClick={() => trackEvent('click_digital_flagship_case')}
                    className="bg-white text-black px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-accent hover:text-white transition-all"
                  >
                    Analisar Case Completo →
                  </Link>
               </div>
            </div>
            
            <div className="p-6 border-t-[3px] border-black">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded">
                  CASE REAL PROOF
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PWA Institucional</span>
              </div>
              <h3 className="text-xl font-black mb-2">APS Sustentabilidade</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Refatoração completa de presença digital institucional focada em soberania de dados, 
                performance extrema e acessibilidade técnica. Sistema em produção ativa.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Soberania de Dados", "Core Web Vitals", "Mobile First", "PWA Ready"].map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Capability Stack */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Tech Stack */}
          <div className="ink-card bg-slate-900 text-white p-6 border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] flex-grow">
            <h3 className="text-lg font-black mb-4 italic">Stack Técnico</h3>
            <div className="grid grid-cols-2 gap-3">
              {techStack.map((stack) => (
                <div key={stack.category} className="p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-accent mb-2">{stack.category}</p>
                  <ul className="space-y-1">
                    {stack.items.map(item => (
                      <li key={item} className="text-[10px] text-slate-300">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="ink-card bg-white p-6 border-[3px] border-black">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Performance Audit - APS Real</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {outcomes.map((outcome) => (
                <div key={outcome.label} className="p-3 bg-slate-50 rounded-lg border border-black/5">
                  <p className="text-xl font-black text-emerald-500">{outcome.metric}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{outcome.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables Grid */}
      <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-black/5">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-6 bg-slate-300" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Tipos de Entrega & Projetos</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deliverables.map((item) => (
            <div key={item.title} className="p-4 bg-white rounded-xl border border-black/5 hover:border-black/20 hover:shadow-lg transition-all">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <p className="text-sm font-black mb-1">{item.title}</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process & CTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex items-center gap-4 p-6 bg-black text-white rounded-2xl">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Fluxo de Trabalho</p>
            <div className="flex flex-wrap gap-4">
              {["Diagnóstico Técnico", "Arquitetura", "Desenvolvimento", "Deploy", "Métricas"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-xs font-black text-accent">0{i + 1}</span>
                  <span className="text-xs font-bold">{step}</span>
                  {i < 4 && <span className="text-slate-600 ml-2">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Link 
          href="#contato"
          onClick={() => trackEvent('click_digital_diagnostico')}
          className="ink-card bg-accent text-white p-6 border-[3px] border-black flex flex-col justify-center items-center text-center hover:shadow-xl transition-all"
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-1">Próximo Passo</p>
          <p className="text-lg font-black italic">Diagnóstico Técnico Gratuito →</p>
        </Link>
      </div>
    </div>
  )
}
