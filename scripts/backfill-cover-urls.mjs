#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const ROOT = process.cwd()
const REPORT_PATH = path.join(ROOT, 'reports', 'backfill-cover-urls.md')

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

function isHttpUrl(value) {
  return /^https?:\/\//i.test((value || '').trim())
}

function toStoragePath(raw) {
  const input = (raw || '').trim().replace(/^\/+/, '')
  if (!input) return ''
  if (/^portfolio\//i.test(input)) return input.replace(/^portfolio\//i, '')
  return input
}

function tableRow(cells) {
  return `| ${cells.join(' | ')} |`
}

async function main() {
  await loadDotEnvLocal()
  await fs.mkdir(path.join(ROOT, 'reports'), { recursive: true })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    const content = [
      '# Backfill Cover URLs Report',
      '',
      `- Generated at: ${new Date().toISOString()}`,
      '- Status: failed',
      '- Reason: missing SUPABASE url or service role key env vars.'
    ].join('\n')
    await fs.writeFile(REPORT_PATH, `${content}\n`, 'utf8')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
  const list = await supabase
    .from('works')
    .select('id,slug,title,cover_url')
    .order('created_at', { ascending: false })
    .limit(10000)

  if (list.error) {
    const missingCoverColumn = /cover_url/i.test(list.error.message || '')
    if (missingCoverColumn) {
      const content = [
        '# Backfill Cover URLs Report',
        '',
        `- Generated at: ${new Date().toISOString()}`,
        '- Status: skipped',
        '- Reason: column `cover_url` does not exist in `works`.',
        '- Action: apply the migration that adds `cover_url` and run this script again.'
      ].join('\n')
      await fs.writeFile(REPORT_PATH, `${content}\n`, 'utf8')
      console.log('Backfill skipped: cover_url column not found.')
      console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`)
      return
    }

    const content = [
      '# Backfill Cover URLs Report',
      '',
      `- Generated at: ${new Date().toISOString()}`,
      '- Status: failed',
      `- Query error: ${list.error.message}`
    ].join('\n')
    await fs.writeFile(REPORT_PATH, `${content}\n`, 'utf8')
    throw new Error(list.error.message)
  }

  const rows = list.data || []
  const candidates = rows.filter((row) => {
    const value = (row.cover_url || '').trim()
    return value && !isHttpUrl(value)
  })

  let updated = 0
  let failed = 0
  const examples = []
  const failures = []

  for (const row of candidates) {
    const before = (row.cover_url || '').trim()
    const storagePath = toStoragePath(before)
    if (!storagePath) continue

    const finalUrl = `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/portfolio/${storagePath}`
    const update = await supabase.from('works').update({ cover_url: finalUrl }).eq('id', row.id)

    if (update.error) {
      failed += 1
      failures.push({
        slug: row.slug || '',
        before,
        error: update.error.message
      })
      continue
    }

    updated += 1
    if (examples.length < 10) {
      examples.push({
        slug: row.slug || '',
        title: row.title || '',
        before,
        after: finalUrl
      })
    }
  }

  const lines = [
    '# Backfill Cover URLs Report',
    '',
    `- Generated at: ${new Date().toISOString()}`,
    `- Total rows scanned: ${rows.length}`,
    `- Candidates (cover_url path-like): ${candidates.length}`,
    `- Updated: ${updated}`,
    `- Failed: ${failed}`,
    '',
    '## Updated Examples',
    '',
    tableRow(['slug', 'title', 'before', 'after']),
    tableRow(['---', '---', '---', '---']),
    ...examples.map((item) =>
      tableRow([
        `\`${String(item.slug).replace(/\|/g, '\\|')}\``,
        String(item.title).replace(/\|/g, '\\|'),
        `\`${String(item.before).replace(/\|/g, '\\|')}\``,
        `\`${String(item.after).replace(/\|/g, '\\|')}\``
      ])
    )
  ]

  if (failures.length) {
    lines.push('', '## Failures', '', tableRow(['slug', 'before', 'error']), tableRow(['---', '---', '---']))
    for (const item of failures.slice(0, 10)) {
      lines.push(
        tableRow([
          `\`${String(item.slug).replace(/\|/g, '\\|')}\``,
          `\`${String(item.before).replace(/\|/g, '\\|')}\``,
          String(item.error).replace(/\|/g, '\\|')
        ])
      )
    }
  }

  await fs.writeFile(REPORT_PATH, `${lines.join('\n')}\n`, 'utf8')
  console.log(`Backfill complete. Updated=${updated}, Failed=${failed}`)
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`)
}

main().catch(async (error) => {
  const msg = error instanceof Error ? error.message : String(error)
  console.error(msg)
  process.exit(1)
})
