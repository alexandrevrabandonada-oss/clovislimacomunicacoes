import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getLeadNotifier } from '../../../lib/notify'

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

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

function toText(value: unknown, max = 500): string {
  return String(value || '').trim().slice(0, max)
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
  const email = toText(payload.email, 200).toLowerCase()
  const phone = toText(payload.phone, 30)
  const company = toText(payload.company, 200)
  const message = toText(payload.message, 4000)
  const turnstileToken = toText(payload.turnstileToken, 2000)
  const utmSource = toText(payload.utm_source, 200)
  const utmMedium = toText(payload.utm_medium, 200)
  const utmCampaign = toText(payload.utm_campaign, 200)
  const referrer = toText(payload.referrer, 1000) || toText(req.headers.get('referer') || '', 1000)
  const pageUrl = toText(payload.page_url, 1000)
  const userAgent = toText(payload.user_agent, 1000) || toText(req.headers.get('user-agent') || '', 1000)

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Ops, faltou informar um nome válido.' }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Ops, faltou informar um email válido.' }, { status: 400 })
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: 'Ops, faltou informar um telefone válido com DDD.' }, { status: 400 })
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
  const insert = await supabase
    .from('leads')
    .insert([
      {
        name,
        email,
        phone,
        company: company || null,
        message,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        referrer: referrer || null,
        page_url: pageUrl || null,
        user_agent: userAgent || null,
        status: 'new',
        notes: null,
        metadata: {
          source: 'contact_form',
          ip,
          created_at: new Date().toISOString()
        }
      }
    ])
    .select('id')
    .single()

  if (insert.error) {
    return NextResponse.json({ error: 'Ops, faltou concluir o envio. Tente novamente.' }, { status: 500 })
  }

  const leadId = (insert.data as { id?: string } | null)?.id || ''
  try {
    const notifier = getLeadNotifier()
    await notifier.sendLeadCreated({
      leadId,
      name,
      email,
      phone,
      company: company || null,
      message
    })
  } catch {
    console.log('[lead-notify] send failed')
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
