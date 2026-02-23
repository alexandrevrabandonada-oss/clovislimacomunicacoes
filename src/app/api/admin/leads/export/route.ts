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

async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const allowlist = getAdminAllowlist()
  const token = getBearerToken(req)

  if (!supabaseUrl || !anonKey || allowlist.size === 0) {
    return NextResponse.json({ error: 'Configuração de admin incompleta.' }, { status: 500 })
  }
  if (!token) return NextResponse.json({ error: 'Sessão ausente.' }, { status: 401 })

  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } })
  const userRes = await authClient.auth.getUser(token)
  const email = userRes.data.user?.email?.toLowerCase() || ''
  if (userRes.error || !email) {
    return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 })
  }
  if (!allowlist.has(email)) {
    return NextResponse.json({ error: 'Acesso restrito ao time admin.' }, { status: 403 })
  }

  return null
}

function applyFilters(query: any, status: string, days: string, search: string) {
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

function csvEscape(value: unknown): string {
  const text = String(value ?? '')
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })

  const params = req.nextUrl.searchParams
  const status = (params.get('status') || 'all').toLowerCase()
  const days = params.get('days') || '30'
  const search = params.get('search') || ''

  let query = supabase
    .from('leads')
    .select('id,created_at,status,name,email,phone,company,message,utm_source,utm_medium,utm_campaign,referrer,page_url,user_agent,notes')
    .order('created_at', { ascending: false })

  query = applyFilters(query, status, days, search)
  const result = await query

  if (result.error) {
    return NextResponse.json({ error: 'Erro ao exportar leads.' }, { status: 500 })
  }

  const header = [
    'id',
    'created_at',
    'status',
    'name',
    'email',
    'phone',
    'company',
    'message',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'referrer',
    'page_url',
    'user_agent',
    'notes'
  ]

  const lines = [header.join(',')]
  for (const row of result.data || []) {
    lines.push(
      [
        row.id,
        row.created_at,
        row.status,
        row.name,
        row.email,
        row.phone,
        row.company,
        row.message,
        row.utm_source,
        row.utm_medium,
        row.utm_campaign,
        row.referrer,
        row.page_url,
        row.user_agent,
        row.notes
      ]
        .map(csvEscape)
        .join(',')
    )
  }

  const now = new Date()
  const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`

  return new NextResponse(`${lines.join('\n')}\n`, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${dateStamp}.csv"`
    }
  })
}
