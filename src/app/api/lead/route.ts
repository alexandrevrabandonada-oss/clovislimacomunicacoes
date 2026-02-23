import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type RateEntry = {
  count: number
  resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10
const rateStore = new Map<string, RateEntry>()

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real.trim()
  const cf = req.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  return 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const current = rateStore.get(ip)

  if (!current || now > current.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  current.count += 1
  rateStore.set(ip, current)
  return false
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function validateTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY || ''
  if (!secret) return false

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  if (ip && ip !== 'unknown') body.set('remoteip', ip)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })

  if (!response.ok) return false
  const data = (await response.json()) as { success?: boolean }
  return data.success === true
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Ops, muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.' },
      { status: 429 }
    )
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || ''

  if (!supabaseUrl || !serviceRoleKey || !turnstileSecret) {
    return NextResponse.json({ error: 'Configuração de servidor incompleta.' }, { status: 500 })
  }

  let payload: Record<string, unknown>
  try {
    payload = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Ops, faltou um payload JSON válido.' }, { status: 400 })
  }

  const name = String(payload.name || '').trim()
  const email = String(payload.email || '').trim().toLowerCase()
  const phone = String(payload.phone || '').trim()
  const company = String(payload.company || '').trim()
  const message = String(payload.message || '').trim()
  const turnstileToken = String(payload.turnstileToken || '').trim()

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Ops, faltou informar um nome válido.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Ops, faltou informar um email válido.' }, { status: 400 })
  }
  if (!message || message.length < 10) {
    return NextResponse.json({ error: 'Ops, faltou detalhar melhor sua mensagem.' }, { status: 400 })
  }
  if (!turnstileToken) {
    return NextResponse.json({ error: 'Ops, faltou validar o anti-spam.' }, { status: 400 })
  }

  const turnstileOk = await validateTurnstile(turnstileToken, ip)
  if (!turnstileOk) {
    return NextResponse.json({ error: 'Ops, não conseguimos validar o anti-spam.' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  const { error } = await supabase.from('leads').insert([
    {
      name,
      email,
      phone: phone || null,
      company: company || null,
      message,
      metadata: {
        source: 'contact_form',
        ip,
        created_at: new Date().toISOString()
      }
    }
  ])

  if (error) {
    return NextResponse.json({ error: 'Ops, faltou concluir o envio. Tente novamente.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
