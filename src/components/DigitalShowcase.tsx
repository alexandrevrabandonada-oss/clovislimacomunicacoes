"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'
import { useRevealOnView } from '../lib/useRevealOnView'

export default function DigitalShowcase() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

  const techStack = [
    { category: "Frontend Arch", items: ["Next.js 14 (App Router)", "React Server Components", "TypeScript 5+", "TailwindCSS 3"] },
    { category: "Backend & Data", items: ["Node.js Edge Runtime", "Supabase / PostgreSQL", "Redis Caching", "Vector Search"] },
    { category: "Performance Ops", items: ["Cloudflare Global Network", "Vercel Deployment", "Brotli/Gzip Compression", "Core Web Vitals Audit"] },
    { category: "High Availability", items: ["Service Workers (PWA)", "Offline Sync", "Zero-Latency Interactions", "Manifest Optimization"] }
  ]

  const capabilities = [
    { 
      title: "PWA Institucional", 
      desc: "Websites que funcionam como apps nativos: offline, rápidos e instaláveis.", 
      icon: "📱",
      tags: ["Offline First", "Installable", "App Shell"]
    },
    { 
      title: "Dashboards Técnicos", 
      desc: "Interfaces de dados complexos com foco em usabilidade e performance crítica.", 
      icon: "📊", 
      tags: ["Data Viz", "Real-time", "Low Latency"]
    },
    { 
      title: "Hubs Editoriais", 
      desc: "Centrais de marca com gestão de conteúdo via Headless CMS para escala.", 
      icon: "🎯",
      tags: ["SEO Pro", "Narrative High", "CMS Sync"]
    },
    { 
      title: "Arquitetura de Autoridade", 
      desc: "Sistemas digitais projetados para converter leads de alto ticket.", 
      icon: "⚡",
      tags: ["Conversion Art", "Security", "Scalable"]
    }
  ]

  const metrics = [
    { metric: "< 0.8s", label: "LCP - Performance Extrema", status: "excellent" },
    { metric: "100/100", label: "Lighthouse Score Real", status: "excellent" },
    { metric: "Zero", label: "Runtime Exceptions", status: "excellent" },
    { metric: "100%", label: "SEO & Meta-Authority", status: "excellent" }
  ]

  return (
    <div className="w-full space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Engenharia de Presença Digital / Capability</p>
          </div>
          <h2 ref={headingRef} className={`text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900 ${revealed ? 'is-revealed' : ''}`}>
             Sistemas de <br/> <span className="hero-ink-underline italic font-serif">Alta Autoridade</span>
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-sm md:text-base text-slate-900 font-bold leading-tight italic border-l-4 border-slate-900 pl-6">
            Desenvolvimento de arquiteturas web que não apenas existem, mas dominam o ambiente técnico e comercial.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Proof Card */}
        <div className="lg:col-span-8 group">
          <div className="ink-card p-0 overflow-hidden bg-white h-full flex flex-col border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 border-b-[3px] border-black">
               {/* High-Fidelity Browser Frame */}
               <div className="absolute top-0 inset-x-0 h-10 bg-black flex items-center px-4 justify-between z-20">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  </div>
                  <div className="bg-white/10 px-4 py-1 rounded text-[9px] text-white/60 font-mono tracking-tight">ENGINEERING_AUDIT_STAGING.vfc</div>
                  <div className="w-4 h-4 rounded border border-white/20" />
               </div>
               <Image 
                src="/portfolio/aps-real-desktop.png"
                alt="APS Sustentabilidade - Engineering Case"
                fill
                className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
               />
               
               {/* Technical Blueprint Overlay */}
               <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
               <div className="absolute top-12 left-4 z-20 pointer-events-none bg-black/80 text-[8px] font-mono text-emerald-400 p-2 border border-emerald-500/30 rounded backdrop-blur-md">
                  <p className="mb-1 uppercase tracking-tighter">Stack_Status: PRODUCTION</p>
                  <p className="mb-1">Latency: 42ms</p>
                  <p>Payload: Optimized_Brotli</p>
               </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm">
                  CASE FLAGSHIP
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PWA / Institucional / Performance</span>
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">APS Sustentabilidade</h3>
              <p className="text-base text-slate-700 leading-relaxed mb-8 max-w-2xl font-medium">
                Refatoração completa de presença digital focada em soberania de dados. 
                Entregamos um PWA com performance Lighthouse de 100/100, garantindo autoridade total no segmento de consultoria ambiental.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Soberania de Dados", "Edge Runtime", "Hybrid Rendering", "PWA Installable"].map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3 py-1.5 border border-black/5 hover:border-black transition-colors rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="ink-card bg-black text-white p-8 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
            <h3 className="text-xl font-black mb-6 italic text-accent">Blueprint Tecnológico</h3>
            <div className="space-y-6">
              {techStack.map((stack) => (
                <div key={stack.category} className="group/stack">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 group-hover/stack:text-accent transition-colors">{stack.category}</p>
                  <ul className="space-y-1.5">
                    {stack.items.map(item => (
                      <li key={item} className="text-xs text-slate-300 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 bg-accent rounded-full opacity-40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="ink-card bg-slate-50 p-6 border-[3px] border-black">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Vitals / APS Real Audit</h4>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m) => (
                <div key={m.label} className="p-4 bg-white border border-black/10 rounded">
                  <p className="text-2xl font-black text-slate-900 leading-none mb-1">{m.metric}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Capability Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {capabilities.map((cap) => (
          <div key={cap.title} className="ink-card p-6 border-[3px] border-black bg-white hover:bg-slate-50 transition-colors">
            <span className="text-3xl mb-4 block filter grayscale group-hover:grayscale-0 transition-all">{cap.icon}</span>
            <h4 className="text-lg font-black mb-2 italic">{cap.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">{cap.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {cap.tags.map(tag => (
                <span key={tag} className="text-[8px] font-black uppercase tracking-tighter text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 border-[4px] border-black flex flex-col md:flex-row items-center justify-between gap-8 strategy-grid">
         <div className="max-w-xl">
            <h3 className="text-3xl md:text-4xl font-black text-white italic mb-4 leading-tight">
              Sua infraestrutura digital está pronta para o próximo nível de autoridade?
            </h3>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              Análise técnica de arquitetura · Diagnóstico de Performance · Estratégia de PWA
            </p>
         </div>
         <Link 
            href="#contato"
            onClick={() => trackEvent('click_digital_diagnostico_final')}
            className="ink-button bg-accent text-white border-white px-10 py-5 text-[11px] tracking-widest hover:bg-white hover:text-black hover:scale-105 transition-all w-full md:w-auto"
          >
            Solicitar Diagnóstico Técnico →
          </Link>
      </div>
    </div>
  )
}
