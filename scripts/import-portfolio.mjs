#!/usr/bin/env node
import { createHash } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const ROOT = process.cwd()
const PORTFOLIO_DIR = path.join(ROOT, 'public', 'portfolio')
const MANIFEST_PATH = path.join(PORTFOLIO_DIR, 'manifest.json')
const REPORT_PATH = path.join(ROOT, 'scripts', 'import-report.md')
const BUCKET = 'portfolio'
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'])

function parseEnvFile(content) {
  const entries = {}
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
    entries[key] = value
  }
  return entries
}

async function loadLocalEnv() {
  const envPath = path.join(ROOT, '.env.local')
  try {
    const envText = await fs.readFile(envPath, 'utf8')
    const parsed = parseEnvFile(envText)
    for (const [key, value] of Object.entries(parsed)) {
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // Optional file. Script also supports envs already set in shell.
  }
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s/-]/g, '')
    .replace(/[\/\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function titleFromFilename(filePath) {
  const stem = path.basename(filePath, path.extname(filePath))
  if (!stem) return 'Sem titulo'
  return stem
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (s) => s.toUpperCase())
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/')
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walkFiles(fullPath)))
      continue
    }
    if (entry.name.toLowerCase() === 'manifest.json') continue
    const ext = path.extname(entry.name).toLowerCase()
    if (IMAGE_EXTENSIONS.has(ext)) out.push(fullPath)
  }
  return out.sort((a, b) => a.localeCompare(b))
}

async function sha256(filePath) {
  const data = await fs.readFile(filePath)
  return createHash('sha256').update(data).digest('hex')
}

function formatRow(cells) {
  return `| ${cells.join(' | ')} |`
}

async function main() {
  await loadLocalEnv()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      'Variaveis ausentes. Defina NEXT_PUBLIC_SUPABASE_URL (ou SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const manifestRaw = await fs.readFile(MANIFEST_PATH, 'utf8')
  const manifest = JSON.parse(manifestRaw)
  const manifestItems = manifest?.items || {}
  const defaultType = manifest?.defaultType || 'other'

  const files = await walkFiles(PORTFOLIO_DIR)
  const results = []
  const stats = { created: 0, updated: 0, unchanged: 0, failed: 0 }

  for (const absPath of files) {
    const relPath = normalizePath(path.relative(PORTFOLIO_DIR, absPath))
    const manifestItem = manifestItems[relPath] || {}
    const type = manifestItem.type || defaultType
    const title = manifestItem.title || titleFromFilename(relPath)
    const contentWarning =
      manifestItem.content_warning === undefined ? null : String(manifestItem.content_warning || '')
    const slug = manifestItem.slug || slugify(path.parse(relPath).name)
    const hash = await sha256(absPath)
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(relPath).data.publicUrl

    let existing = null
    const existingQuery = await supabase
      .from('works')
      .select('id,slug,title,type,content_warning,cover_url,source_hash')
      .eq('slug', slug)
      .maybeSingle()
    if (existingQuery.error) {
      stats.failed += 1
      results.push({
        file: relPath,
        slug,
        status: 'failed',
        detail: `erro ao consultar works: ${existingQuery.error.message}`
      })
      continue
    }
    existing = existingQuery.data

    const unchanged =
      !!existing &&
      existing.source_hash === hash &&
      existing.title === title &&
      existing.type === type &&
      (existing.content_warning || null) === (contentWarning || null) &&
      (existing.cover_url || null) === (publicUrl || null)

    if (unchanged) {
      stats.unchanged += 1
      results.push({ file: relPath, slug, status: 'unchanged', detail: 'sem alteracoes detectadas' })
      continue
    }

    const fileBuffer = await fs.readFile(absPath)
    const ext = path.extname(relPath).toLowerCase()
    const contentType =
      ext === '.png'
        ? 'image/png'
        : ext === '.webp'
          ? 'image/webp'
          : ext === '.gif'
            ? 'image/gif'
            : ext === '.avif'
              ? 'image/avif'
              : 'image/jpeg'

    const upload = await supabase.storage.from(BUCKET).upload(relPath, fileBuffer, {
      upsert: true,
      contentType,
      cacheControl: '3600'
    })
    if (upload.error) {
      stats.failed += 1
      results.push({
        file: relPath,
        slug,
        status: 'failed',
        detail: `erro no upload: ${upload.error.message}`
      })
      continue
    }

    const write = await supabase.from('works').upsert(
      {
        title,
        slug,
        type,
        cover_url: publicUrl,
        cover_image_url: publicUrl,
        content_warning: contentWarning || null,
        source_hash: hash,
        is_published: true
      },
      { onConflict: 'slug' }
    )

    if (write.error) {
      stats.failed += 1
      results.push({
        file: relPath,
        slug,
        status: 'failed',
        detail: `erro ao gravar works: ${write.error.message}`
      })
      continue
    }

    if (existing) {
      stats.updated += 1
      results.push({ file: relPath, slug, status: 'updated', detail: 'arquivo/metadata atualizados' })
    } else {
      stats.created += 1
      results.push({ file: relPath, slug, status: 'created', detail: 'novo registro criado' })
    }
  }

  const now = new Date().toISOString()
  const reportLines = [
    '# Portfolio Import Report',
    '',
    `- Generated at: ${now}`,
    `- Source folder: \`public/portfolio\``,
    `- Bucket: \`${BUCKET}\``,
    '',
    '## Summary',
    '',
    `- Created: ${stats.created}`,
    `- Updated: ${stats.updated}`,
    `- Unchanged: ${stats.unchanged}`,
    `- Failed: ${stats.failed}`,
    '',
    '## Files',
    '',
    formatRow(['File', 'Slug', 'Status', 'Detail']),
    formatRow(['---', '---', '---', '---']),
    ...results.map((item) =>
      formatRow([
        `\`${item.file}\``,
        `\`${item.slug}\``,
        item.status,
        item.detail.replace(/\|/g, '\\|')
      ])
    )
  ]

  await fs.writeFile(REPORT_PATH, `${reportLines.join('\n')}\n`, 'utf8')
  console.log(`Import finished. Report: ${path.relative(ROOT, REPORT_PATH)}`)
  console.log(
    `Summary -> created:${stats.created} updated:${stats.updated} unchanged:${stats.unchanged} failed:${stats.failed}`
  )

  if (stats.failed > 0) process.exitCode = 1
}

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error)
  const now = new Date().toISOString()
  await fs.writeFile(
    REPORT_PATH,
    `# Portfolio Import Report\n\n- Generated at: ${now}\n- Status: failed\n- Error: ${message}\n`,
    'utf8'
  )
  console.error(message)
  process.exit(1)
})
