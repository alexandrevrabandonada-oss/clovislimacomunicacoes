#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const ROOT = process.cwd()
const REPORTS_DIR = path.join(ROOT, 'reports')

function parseEnvFile(content) {
  const env = {}
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf('=')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

async function loadDotEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  try {
    const text = await fs.readFile(envPath, 'utf8')
    const parsed = parseEnvFile(text)
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // optional
  }
}

function nowStamp(date) {
  const yyyy = String(date.getFullYear())
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mi = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}${mm}${dd}-${hh}${mi}`
}

function short(value, len = 80) {
  if (!value) return ''
  return value.length > len ? `${value.slice(0, len)}...` : value
}

function normalizeWarning(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'boolean') return value
  const text = String(value).trim().toLowerCase()
  if (!text) return null
  if (['false', '0', 'no', 'none', 'null'].includes(text)) return false
  if (['true', '1', 'yes'].includes(text)) return true
  return text
}

function classifyCover(value) {
  const v = (value || '').trim()
  if (!v) return 'empty'
  if (/^https?:\/\//i.test(v) || /^data:/i.test(v)) return 'url'
  if (/^[a-z]+:\/\//i.test(v)) return 'url_other_scheme'
  if (v.startsWith('/')) return 'path'
  if (/^[^/]+\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(v)) return 'path'
  if (/^portfolio\//i.test(v)) return 'path'
  return 'unknown'
}

function tableRow(cells) {
  return `| ${cells.join(' | ')} |`
}

function resolveCoverCandidates(rawCover, supabaseUrl) {
  const value = (rawCover || '').trim()
  if (!value) return []
  if (/^https?:\/\//i.test(value)) return [value]

  const cleanSupabaseUrl = (supabaseUrl || '').replace(/\/+$/, '')
  if (!cleanSupabaseUrl) return []

  const normalized = value.replace(/^\/+/, '')
  if (/^portfolio\//i.test(normalized)) {
    const withoutPrefix = normalized.replace(/^portfolio\//i, '')
    return [
      `${cleanSupabaseUrl}/storage/v1/object/public/portfolio/${withoutPrefix}`,
      `${cleanSupabaseUrl}/storage/v1/object/public/${normalized}`
    ]
  }

  return [`${cleanSupabaseUrl}/storage/v1/object/public/portfolio/${normalized}`]
}

async function probeUrl(url) {
  const timeout = 6000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    let res = await fetch(url, { method: 'HEAD', signal: controller.signal })
    if (res.status === 405 || res.status === 400) {
      res = await fetch(url, { method: 'GET', signal: controller.signal })
    }
    return { status: res.status, ok: res.ok }
  } catch (error) {
    return { status: 0, ok: false, error: error instanceof Error ? error.message : String(error) }
  } finally {
    clearTimeout(timer)
  }
}

async function fetchWorksRows(supabase) {
  const variants = [
    ['slug,title,cover_url,cover_image_url,content_warning,created_at', true],
    ['slug,title,cover_image_url,content_warning,created_at', false],
    ['slug,title,cover_image_url,created_at', false]
  ]
  let lastError = null
  for (const [select, hasCoverUrl] of variants) {
    const query = await supabase
      .from('works')
      .select(select)
      .order('created_at', { ascending: false })
      .limit(10000)
    if (!query.error) {
      return { rows: query.data || [], hasCoverUrl, hasContentWarning: select.includes('content_warning') }
    }
    lastError = query.error
  }
  throw new Error(lastError?.message || 'failed to query works')
}

async function main() {
  await loadDotEnvLocal()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const envCheck = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', ok: !!supabaseUrl },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', ok: !!anonKey }
  ]

  await fs.mkdir(REPORTS_DIR, { recursive: true })
  const reportPath = path.join(REPORTS_DIR, `doctor-${nowStamp(new Date())}.md`)

  if (!supabaseUrl || !anonKey) {
    const report = [
      '# Doctor Report',
      '',
      `- Generated at: ${new Date().toISOString()}`,
      '',
      '## Env Validation',
      '',
      ...envCheck.map((i) => `- ${i.ok ? 'OK' : 'MISSING'}: \`${i.key}\``),
      '',
      '## Result',
      '',
      '- Aborted: missing required env vars.'
    ].join('\n')
    await fs.writeFile(reportPath, `${report}\n`, 'utf8')
    console.error('Missing required env vars. Check report:', path.relative(ROOT, reportPath))
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, anonKey)
  let fetched
  try {
    fetched = await fetchWorksRows(supabase)
  } catch (error) {
    const report = [
      '# Doctor Report',
      '',
      `- Generated at: ${new Date().toISOString()}`,
      '',
      '## Env Validation',
      '',
      ...envCheck.map((i) => `- ${i.ok ? 'OK' : 'MISSING'}: \`${i.key}\``),
      '',
      '## Supabase',
      '',
      `- Connection: failed`,
      `- Error: ${error instanceof Error ? error.message : String(error)}`
    ].join('\n')
    await fs.writeFile(reportPath, `${report}\n`, 'utf8')
    console.error('Supabase query failed. Check report:', path.relative(ROOT, reportPath))
    process.exit(1)
  }

  const rows = fetched.rows || []
  const hasCoverUrlColumn = fetched.hasCoverUrl
  const hasContentWarningColumn = fetched.hasContentWarning
  const total = rows.length
  let emptyCoverUrl = 0
  let warningTrueCount = 0
  let warningAnyCount = 0
  let placeholderCount = 0
  let pathLikeCount = 0
  let urlLikeCount = 0

  for (const row of rows) {
    const coverUrl = ((row.cover_url || '') + '').trim()
    const fallbackUrl = (row.cover_image_url || '').trim()
    const merged = coverUrl || fallbackUrl
    const warning = normalizeWarning(row.content_warning)

    if (!coverUrl) emptyCoverUrl += 1
    if (warning === true) warningTrueCount += 1
    if (warning !== null && warning !== false) warningAnyCount += 1
    if (!merged) placeholderCount += 1

    const kind = classifyCover(merged)
    if (kind === 'path') pathLikeCount += 1
    if (kind === 'url' || kind === 'url_other_scheme') urlLikeCount += 1
  }

  const sample = rows.slice(0, 10).map((row) => {
    const merged = ((row.cover_url || '') + '').trim() || (row.cover_image_url || '').trim()
    return {
      slug: row.slug || '',
      title: row.title || '',
      cover: short(merged, 80),
      cover_raw: merged,
      cover_kind: classifyCover(merged),
      content_warning: row.content_warning === null ? '' : String(row.content_warning),
      checked_url: '',
      http_status: '',
      http_note: ''
    }
  })

  let sampleHttpOk = 0
  let sampleHttp404 = 0
  let sampleHttpOther = 0
  for (const item of sample) {
    const candidates = resolveCoverCandidates(item.cover_raw, supabaseUrl)
    if (candidates.length === 0) {
      item.http_status = 'n/a'
      item.http_note = 'sem cover para testar'
      continue
    }

    let best = null
    for (const candidate of candidates) {
      const result = await probeUrl(candidate)
      if (!best || result.ok || result.status === 404) {
        best = { ...result, url: candidate }
      }
      if (result.ok) break
    }

    item.checked_url = short(best?.url || '', 80)
    item.http_status = best?.status ? String(best.status) : 'error'
    item.http_note = best?.error ? short(best.error, 60) : ''

    if (best?.status === 200) sampleHttpOk += 1
    else if (best?.status === 404) sampleHttp404 += 1
    else sampleHttpOther += 1
  }

  const explanation = []
  if (placeholderCount > 0) {
    explanation.push(
      `-${placeholderCount} card(s) caem no placeholder porque \`cover_url\` e \`cover_image_url\` estao vazios.`
    )
  }
  if (pathLikeCount > 0) {
    explanation.push(
      `-${pathLikeCount} card(s) possuem \`cover_url\` em formato de caminho (ex: \`01.jpg\`, \`portfolio/01.jpg\`), nao URL completa.`
    )
  }
  if (sampleHttp404 > 0) {
    explanation.push(
      `-${sampleHttp404} item(ns) da amostra retornaram HTTP 404 no teste do endpoint da imagem.`
    )
  }
  if (warningAnyCount > 0) {
    explanation.push(
      `-${warningAnyCount} card(s) tem \`content_warning\` preenchido; na galeria eles podem exibir aviso antes da imagem.`
    )
  }
  if (explanation.length === 0) {
    explanation.push('-Nao foram detectadas causas obvias para placeholder nos dados atuais.')
  }

  const reportLines = [
    '# Doctor Report',
    '',
    `- Generated at: ${new Date().toISOString()}`,
    '',
    '## Env Validation',
    '',
    ...envCheck.map((i) => `- ${i.ok ? 'OK' : 'MISSING'}: \`${i.key}\``),
    '',
    '## Supabase / works',
    '',
    '- Connection: ok',
    `- cover_url column presente: ${hasCoverUrlColumn ? 'sim' : 'nao'}`,
    `- content_warning column presente: ${hasContentWarningColumn ? 'sim' : 'nao'}`,
    `- Total rows (fetched): ${total}`,
    `- Rows with cover_url vazio: ${emptyCoverUrl}`,
    `- Rows with content_warning=true: ${warningTrueCount}`,
    `- Rows with content_warning preenchido (qualquer valor): ${warningAnyCount}`,
    `- Rows que caem no placeholder (cover_url + cover_image_url vazios): ${placeholderCount}`,
    `- Rows com cover em formato de caminho: ${pathLikeCount}`,
    `- Rows com cover em formato de URL: ${urlLikeCount}`,
    `- Sample HTTP status 200: ${sampleHttpOk}`,
    `- Sample HTTP status 404: ${sampleHttp404}`,
    `- Sample HTTP outros/erro: ${sampleHttpOther}`,
    '',
    '## Sample (10)',
    '',
    tableRow(['slug', 'title', 'cover_url (80)', 'cover_kind', 'content_warning', 'checked_url', 'http']),
    tableRow(['---', '---', '---', '---', '---', '---', '---']),
    ...sample.map((i) =>
      tableRow([
        `\`${String(i.slug).replace(/\|/g, '\\|')}\``,
        String(i.title || '').replace(/\|/g, '\\|'),
        `\`${String(i.cover).replace(/\|/g, '\\|')}\``,
        i.cover_kind,
        `\`${String(i.content_warning).replace(/\|/g, '\\|')}\``,
        `\`${String(i.checked_url).replace(/\|/g, '\\|')}\``,
        `\`${String(i.http_status).replace(/\|/g, '\\|')}\``
      ])
    ),
    '',
    '## Diagnostico do Placeholder',
    '',
    ...explanation
  ]

  await fs.writeFile(reportPath, `${reportLines.join('\n')}\n`, 'utf8')

  console.log('Doctor completed.')
  console.log(`Report: ${path.relative(ROOT, reportPath)}`)
  console.log(
    `Total=${total} empty_cover_url=${emptyCoverUrl} content_warning_true=${warningTrueCount} placeholder=${placeholderCount}`
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
