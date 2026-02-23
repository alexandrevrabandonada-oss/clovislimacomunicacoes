type LeadNotificationPayload = {
  leadId: string
  name: string
  email: string
  phone: string
  company?: string | null
  message: string
}

type NotifyResult = {
  sent: boolean
  reason?: string
}

type LeadNotifier = {
  sendLeadCreated: (payload: LeadNotificationPayload) => Promise<NotifyResult>
}

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    ''
  )
}

function buildAdminLink(leadId: string): string {
  const base = getBaseUrl().trim()
  if (!base) return `/admin/leads?focus=${encodeURIComponent(leadId)}`
  const normalized = base.startsWith('http') ? base : `https://${base}`
  return `${normalized.replace(/\/+$/, '')}/admin/leads?focus=${encodeURIComponent(leadId)}`
}

class ResendLeadNotifier implements LeadNotifier {
  async sendLeadCreated(payload: LeadNotificationPayload): Promise<NotifyResult> {
    const apiKey = process.env.RESEND_API_KEY || ''
    const to = process.env.LEADS_NOTIFY_TO || ''
    const from = process.env.LEADS_NOTIFY_FROM || 'Leads <onboarding@resend.dev>'

    if (!apiKey || !to) {
      console.log('[lead-notify] not configured')
      return { sent: false, reason: 'not_configured' }
    }

    const adminLink = buildAdminLink(payload.leadId)
    const subject = `Novo lead: ${payload.name}`
    const text = [
      'Novo lead recebido.',
      '',
      `Nome: ${payload.name}`,
      `Email: ${payload.email}`,
      `Telefone: ${payload.phone}`,
      `Empresa: ${payload.company || '-'}`,
      '',
      'Mensagem:',
      payload.message,
      '',
      `Abrir no painel: ${adminLink}`
    ].join('\n')

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
        <h2>Novo lead recebido</h2>
        <p><strong>Nome:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Empresa:</strong> ${escapeHtml(payload.company || '-')}</p>
        <p><strong>Mensagem:</strong></p>
        <pre style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px;">${escapeHtml(payload.message)}</pre>
        <p><a href="${escapeHtml(adminLink)}">Abrir no painel de leads</a></p>
      </div>
    `

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: to.split(',').map((item) => item.trim()).filter(Boolean),
        subject,
        text,
        html
      })
    })

    if (!response.ok) {
      console.log('[lead-notify] send failed')
      return { sent: false, reason: 'provider_error' }
    }

    return { sent: true }
  }
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function getLeadNotifier(): LeadNotifier {
  return new ResendLeadNotifier()
}
