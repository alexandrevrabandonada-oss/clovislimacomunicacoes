"use client"
export const dynamic = 'force-dynamic'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Modal from '../../../components/Modal'

type LeadStatus = 'new' | 'contacted' | 'closed' | 'spam'

type LeadItem = {
  id: string
  created_at: string
  status: LeadStatus
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referrer: string | null
  page_url: string | null
  user_agent: string | null
  notes: string | null
}

type SessionUser = {
  email?: string
}

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'closed', 'spam']

function formatDate(value: string) {
  const d = new Date(value)
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AdminLeadsPage() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [accessToken, setAccessToken] = useState('')
  const [items, setItems] = useState<LeadItem[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('new')
  const [daysFilter, setDaysFilter] = useState<'7' | '30' | '90'>('30')
  const [searchDraft, setSearchDraft] = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [selected, setSelected] = useState<LeadItem | null>(null)
  const supabaseRef = useRef<any>(null)

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  useEffect(() => {
    let mounted = true
    let subscription: any

    import('../../../lib/supabase/client').then(({ supabase: sb }) => {
      if (!mounted) return
      supabaseRef.current = sb

      const authSub = sb.auth.onAuthStateChange((_event: string, session: any) => {
        setUser(session?.user || null)
        setAccessToken(session?.access_token || '')
      })
      subscription = authSub?.data?.subscription

      sb.auth.getSession().then((res: any) => {
        if (!mounted) return
        setUser(res.data.session?.user || null)
        setAccessToken(res.data.session?.access_token || '')
      })
    })

    return () => {
      mounted = false
      if (subscription) subscription.unsubscribe()
    }
  }, [])

  const signIn = async () => {
    const sb = supabaseRef.current
    if (!sb) return
    await sb.auth.signInWithOtp({ email: window.prompt('Email admin para magic link') || '' })
    alert('Confira seu email para entrar no painel de leads.')
  }

  const fetchLeads = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        status: statusFilter,
        days: daysFilter
      })
      if (searchApplied.trim()) params.set('search', searchApplied.trim())

      const res = await fetch(`/api/admin/leads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Não foi possível carregar os leads.')
        setItems([])
        setTotal(0)
        return
      }
      setItems(data.items || [])
      setTotal(Number(data.total || 0))
    } catch {
      setError('Falha de conexão ao carregar leads.')
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, pageSize, statusFilter, daysFilter, searchApplied])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const applySearch = () => {
    setPage(1)
    setSearchApplied(searchDraft)
  }

  const updateStatus = async (id: string, status: LeadStatus) => {
    if (!accessToken) return
    const previous = items
    setItems((curr) => curr.map((item) => (item.id === id ? { ...item, status } : item)))
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ id, status })
      })
      const data = await res.json()
      if (!res.ok) {
        setItems(previous)
        setError(data?.error || 'Falha ao atualizar status.')
      }
    } catch {
      setItems(previous)
      setError('Falha de conexão ao atualizar status.')
    }
  }

  const copyToClipboard = async (value: string) => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      setError('Não foi possível copiar para a área de transferência.')
    }
  }

  const exportCsv = async () => {
    if (!accessToken) return
    setError('')
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        days: daysFilter
      })
      if (searchApplied.trim()) params.set('search', searchApplied.trim())

      const res = await fetch(`/api/admin/leads/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data?.error || 'Falha ao exportar CSV.')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads-export.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError('Falha de conexão ao exportar CSV.')
    }
  }

  if (!user) {
    return (
      <div className="mt-20">
        <h1 className="text-2xl font-bold">Admin Leads</h1>
        <p className="mt-2">Acesso protegido por Supabase Auth (magic link).</p>
        <button onClick={signIn} className="mt-3 px-3 py-1 border rounded">
          Entrar
        </button>
      </div>
    )
  }

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-slate-600">Sessão: {user.email}</p>
        </div>
        <button onClick={exportCsv} className="px-3 py-1.5 border rounded bg-white">
          Export CSV
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className="text-sm">
          <span className="block mb-1">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1)
              setStatusFilter(e.target.value as 'all' | LeadStatus)
            }}
            className="w-full border p-2"
          >
            <option value="all">Todos</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="block mb-1">Período</span>
          <select
            value={daysFilter}
            onChange={(e) => {
              setPage(1)
              setDaysFilter(e.target.value as '7' | '30' | '90')
            }}
            className="w-full border p-2"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </label>

        <label className="text-sm md:col-span-2">
          <span className="block mb-1">Busca (nome/email/telefone)</span>
          <div className="flex gap-2">
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              className="w-full border p-2"
            />
            <button type="button" onClick={applySearch} className="px-3 py-2 border rounded bg-white">
              Buscar
            </button>
          </div>
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <div className="mt-4 overflow-x-auto border rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Contato</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((lead) => (
              <tr key={lead.id} className="border-t">
                <td className="p-2">{formatDate(lead.created_at)}</td>
                <td className="p-2">
                  <div className="font-medium">{lead.name}</div>
                  {lead.company && <div className="text-xs text-slate-600">{lead.company}</div>}
                </td>
                <td className="p-2">
                  <div>{lead.email}</div>
                  {lead.phone && <div>{lead.phone}</div>}
                </td>
                <td className="p-2">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                    className="border p-1"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => copyToClipboard(lead.email)} className="px-2 py-1 border rounded">
                      Copiar email
                    </button>
                    <button
                      onClick={() => copyToClipboard(`https://wa.me/${(lead.phone || '').replace(/\D/g, '')}`)}
                      className="px-2 py-1 border rounded"
                    >
                      Copiar WhatsApp
                    </button>
                    <button onClick={() => setSelected(lead)} className="px-2 py-1 border rounded">
                      Detalhes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-600">
                  Nenhum lead encontrado para os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-700">
          Página {page} de {pageCount} • {total} lead(s)
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold">{selected.name}</h3>
            <p className="text-sm text-slate-600">{selected.email} • {selected.phone || '-'}</p>
            <div className="rounded border bg-slate-50 p-3 whitespace-pre-wrap">{selected.message}</div>
            <div className="text-sm space-y-1">
              <p><strong>UTM Source:</strong> {selected.utm_source || '-'}</p>
              <p><strong>UTM Medium:</strong> {selected.utm_medium || '-'}</p>
              <p><strong>UTM Campaign:</strong> {selected.utm_campaign || '-'}</p>
              <p><strong>Referrer:</strong> {selected.referrer || '-'}</p>
              <p><strong>Page URL:</strong> {selected.page_url || '-'}</p>
              <p><strong>User Agent:</strong> {selected.user_agent || '-'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
