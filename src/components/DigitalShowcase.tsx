"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'
import { useRevealOnView } from '../lib/useRevealOnView'

export default function DigitalShowcase() {
  const { ref: headingRef, revealed } = useRevealOnView<HTMLHeadingElement>()

  const techStack = [
    { category: "Arquitetura Frontend", items: ["Next.js 15 (App Router)", "React Server Components", "TypeScript 5+", "TailwindCSS 4"] },
    { category: "Backend & Dados", items: ["Node.js Edge Runtime", "Supabase / PostgreSQL", "Redis Caching", "Busca Vetorial"] },
    { category: "Operações de Performance", items: ["Cloudflare Global Network", "Vercel Deployment", "Brotli/Gzip Compression", "Core Web Vitals Audit"] },
    { category: "Alta Disponibilidade", items: ["Service Workers (PWA)", "Offline Sync", "Zero-Latency Interactions", "Manifest Optimization"] }
  ]

  const capabilities = [
    { 
      title: "PWA Institucional", 
      desc: "Websites que funcionam como apps nativos: offline, rápidos e instaláveis.", 
      icon: "📱",
      tags: ["Offline First", "Instalável", "App Shell"]
    },
    { 
      title: "Dashboards Técnicos", 
      desc: "Interfaces de dados complexos com foco em usabilidade e performance crítica.", 
      icon: "📊", 
      tags: ["Data Viz", "Real-time", "Baixa Latência"]
    },
    { 
      title: "Hubs Editoriais", 
      desc: "Centrais de marca com gestão de conteúdo via Headless CMS para escala.", 
      icon: "🎯",
      tags: ["SEO Pro", "Narrativa High", "CMS Sync"]
    },
    { 
      title: "Arquitetura de Autoridade", 
      desc: "Sistemas digitais projetados para converter leads de alto ticket.", 
      icon: "⚡",
      tags: ["Conversão Art", "Segurança", "Escalável"]
    }
  ]

  const metrics = [
    { metric: "< 0.8s", label: "LCP - Performance Extrema", status: "excellent" },
    { metric: "100/100", label: "Lighthouse Score Real", status: "excellent" },
    { metric: "Zero", label: "Runtime Exceptions", status: "excellent" },
    { metric: "100%", label: "SEO & Meta-Autoridade", status: "excellent" }
  ]

  return (
    <div className="w-full space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[3px] border-black pb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 bg-accent" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black">Arquitetura de Presença Digital // Capability</p>
          </div>
          <h2 ref={headingRef} className={`text-4xl md:text-7xl font-black tracking-tighter leading-[0.85] text-black ${revealed ? 'is-revealed' : ''}`}>
             Sistemas de <br/> <span className="hero-ink-underline italic font-serif text-accent">Alta Autoridade</span>
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-sm md:text-base text-black font-bold leading-tight italic border-l-[6px] border-black pl-6 uppercase tracking-tighter">
            Desenvolvimento de arquiteturas web que não apenas existem, mas dominam o ambiente técnico e comercial.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Proof Card */}
        <div className="lg:col-span-8 group">
          <div className="ink-card p-0 overflow-hidden bg-white h-full flex flex-col border-[3px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_var(--accent)] transition-all">
            <div className="relative aspect-[16/9] overflow-hidden bg-white border-b-[3px] border-black">
               {/* High-Fidelity Browser Frame */}
               <div className="absolute top-0 inset-x-0 h-10 bg-black flex items-center px-4 justify-between z-20">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="bg-white/10 px-4 py-1 rounded text-[9px] text-white/80 font-black tracking-widest uppercase">AUDIT_STAGING_PRODUCTION // CL.ENGINE</div>
                  <div className="w-4 h-4 border-2 border-white/20" />
               </div>
               <Image 
                src="/portfolio/aps-real-desktop.png"
                alt="APS Sustentabilidade - Engineering Case"
                fill
                className="object-cover object-top transition-transform duration-1000 group-hover:scale-[1.03]"
               />
               
               {/* Technical Blueprint Overlay */}
               <div className="absolute inset-0 bg-accent/5 mix-blend-overlay pointer-events-none" />
               <div className="absolute top-14 left-6 z-20 pointer-events-none bg-black text-[9px] font-black text-emerald-400 p-3 border-2 border-emerald-500/50 shadow-2xl">
                  <p className="mb-2 uppercase tracking-widest border-b border-emerald-500/20 pb-1">Status: LIVE_CAPABILITY</p>
                  <p className="mb-1">Latency: 38ms (Edge)</p>
                  <p className="mb-1">Core Vitals: Optimized</p>
                  <p>Security: SSL / Encrypted</p>
               </div>
            </div>
            
            <div className="p-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border-2 border-black">
                  FLAGSHIP_CASE
                </span>
                <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">PWA · INSTITUCIONAL · PERFORMANCE ⚡</span>
              </div>
              <h3 className="text-4xl font-black mb-6 tracking-tighter italic">APS Sustentabilidade</h3>
              <p className="text-lg text-black font-bold leading-snug mb-8 max-w-2xl italic border-l-4 border-accent pl-6">
                Refatoração de presença digital focada em soberania de dados e dominância técnica. 
                PWA de alto impacto com performance Lighthouse 100/100.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Soberania de Dados", "Edge Runtime", "Hybrid Rendering", "PWA Installable"].map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 border-[2px] border-black hover:bg-black hover:text-white transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="ink-card bg-black text-white p-8 border-[3px] border-black shadow-[12px_12px_0px_0px_var(--accent)]">
            <h3 className="text-xl font-black mb-8 italic text-accent uppercase tracking-widest border-b border-white/10 pb-4">Protocolo Técnico 2026</h3>
            <div className="space-y-8">
              {techStack.map((stack) => (
                <div key={stack.category} className="group/stack">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-3 group-hover/stack:text-accent transition-colors">{stack.category}</p>
                  <ul className="space-y-2">
                    {stack.items.map(item => (
                      <li key={item} className="text-[11px] text-white font-bold flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-accent opacity-80" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="ink-card bg-white p-6 border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-6">Auditoria / Vitals Real-Time</h4>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m) => (
                <div key={m.label} className="p-4 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group/metric">
                  <p className="text-3xl font-black leading-none mb-2 tracking-tighter">{m.metric}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-black/40 group-hover/metric:text-white/60">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Capability Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
        {capabilities.map((cap) => (
          <div key={cap.title} className="ink-card p-8 border-[3px] border-black bg-white hover:border-black transition-all group">
            <span className="text-4xl mb-6 block transform group-hover:scale-110 transition-transform">{cap.icon}</span>
            <h4 className="text-xl font-black mb-3 italic tracking-tight">{cap.title}</h4>
            <p className="text-xs text-black/70 leading-relaxed font-bold mb-6">{cap.desc}</p>
            <div className="flex flex-wrap gap-2">
              {cap.tags.map(tag => (
                <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-black border-2 border-black px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-black p-10 md:p-16 border-[4px] border-black flex flex-col lg:flex-row items-center justify-between gap-12 shadow-[24px_24px_0px_0px_rgba(239,68,68,1)]">
         <div className="max-w-2xl text-center lg:text-left">
            <h3 className="text-4xl md:text-5xl font-black text-white italic mb-6 leading-[0.9] tracking-tighter">
              Infraestrutura de Elite para <br/> <span className="text-accent underline decoration-white/20 underline-offset-8">Marcas Inevitáveis.</span>
            </h3>
            <p className="text-white/40 font-black text-xs uppercase tracking-[0.4em] mb-4">
              Diagnóstico de Performance · Estratégia PWA · Segurança de Dados
            </p>
         </div>
         <Link 
            href="#contato"
            onClick={() => trackEvent('click_digital_diagnostico_final')}
            className="ink-button bg-accent text-white border-white px-12 py-6 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:scale-105 transition-all w-full lg:w-auto text-center"
          >
            Escalar Autoridade Digital →
          </Link>
      </div>
    </div>
  )
}
