import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type LeadStatus = 'new' | 'contacted' | 'closed' | 'spam'

const ALLOWED_STATUSES: LeadStatus[] = ['new', 'contacted', 'closed', 'spam']

function getAdminAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || ''
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
  )
}

function getBearerToken(req: NextRequest): string {
  const auth = req.headers.get('authorization') || ''
  if (!auth.toLowerCase().startsWith('bearer ')) return ''
  return auth.slice(7).trim()
}

async function requireAdmin(req: NextRequest): Promise<{ ok: true; email: string } | { ok: false; response: NextResponse }> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const allowlist = getAdminAllowlist()
  const token = getBearerToken(req)

  if (!supabaseUrl || !anonKey || allowlist.size === 0) {
    return { ok: false, response: NextResponse.json({ error: 'Configuração de admin incompleta.' }, { status: 500 }) }
  }
  if (!token) {
    return { ok: false, response: NextResponse.json({ error: 'Sessão ausente.' }, { status: 401 }) }
  }

  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
  const userRes = await authClient.auth.getUser(token)
  const email = userRes.data.user?.email?.toLowerCase() || ''
  if (userRes.error || !email) {
    return { ok: false, response: NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 }) }
  }
  if (!allowlist.has(email)) {
    return { ok: false, response: NextResponse.json({ error: 'Acesso restrito ao time admin.' }, { status: 403 }) }
  }

  return { ok: true, email }
}

function applyFilters(
  query: any,
  status: string,
  days: string,
  search: string
) {
  let q = query
  if (status && status !== 'all' && ALLOWED_STATUSES.includes(status as LeadStatus)) {
    q = q.eq('status', status)
  }

  if (days && ['7', '30', '90'].includes(days)) {
    const cutoff = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000).toISOString()
    q = q.gte('created_at', cutoff)
  }

  if (search.trim()) {
    const term = search.trim().replace(/[%_]/g, '')
    q = q.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`)
  }

  return q
}

function parseIntSafe(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed) || parsed <= 0) return fallback
  return parsed
}

function getServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const adminCheck = await requireAdmin(req)
  if (!adminCheck.ok) return adminCheck.response

  const supabase = getServiceClient()
  const params = req.nextUrl.searchParams
  const page = parseIntSafe(params.get('page') || '1', 1)
  const pageSize = Math.min(parseIntSafe(params.get('pageSize') || '20', 20), 100)
  const status = (params.get('status') || 'all').toLowerCase()
  const days = params.get('days') || '30'
  const search = params.get('search') || ''
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('leads')
    .select(
      'id,name,email,phone,company,message,status,notes,created_at,utm_source,utm_medium,utm_campaign,referrer,page_url,user_agent',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to)

  query = applyFilters(query, status, days, search)
  const result = await query

  if (result.error) {
    return NextResponse.json({ error: 'Erro ao carregar leads.' }, { status: 500 })
  }

  return NextResponse.json({
    items: result.data || [],
    page,
    pageSize,
    total: result.count || 0
  })
}

export async function PATCH(req: NextRequest) {
  const adminCheck = await requireAdmin(req)
  if (!adminCheck.ok) return adminCheck.response

  let payload: Record<string, unknown>
  try {
    payload = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const id = String(payload.id || '').trim()
  const status = String(payload.status || '').trim().toLowerCase()
  const notes = String(payload.notes || '').trim()

  if (!id) {
    return NextResponse.json({ error: 'Lead inválido.' }, { status: 400 })
  }
  if (!ALLOWED_STATUSES.includes(status as LeadStatus)) {
    return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
  }

  const supabase = getServiceClient()
  const update = await supabase
    .from('leads')
    .update({ status, notes: notes || null })
    .eq('id', id)
    .select('id,status,notes')
    .single()

  if (update.error) {
    return NextResponse.json({ error: 'Não foi possível atualizar o lead.' }, { status: 500 })
  }

  return NextResponse.json({ item: update.data })
}
