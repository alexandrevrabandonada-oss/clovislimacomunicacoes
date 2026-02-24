#!/usr/bin/env node
import { createHash } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SCRIPT_DIR, '..')
const PORTFOLIO_DIR = path.join(ROOT, 'public', 'portfolio')
const MANIFEST_PATH = path.join(PORTFOLIO_DIR, 'manifest.json')
const REPORT_PATH = path.join(ROOT, 'scripts', 'import-report.md')
const BUCKET = 'portfolio'
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const isDryRun = process.argv.includes('--dry-run')
const ALLOWED_DB_TYPES = new Set(['branding', 'social_media', 'website', 'video', 'other'])

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

function resolveDbType(rawType) {
  const normalized = String(rawType || '').trim().toLowerCase()
  if (ALLOWED_DB_TYPES.has(normalized)) return normalized
  if (normalized === 'charge') return 'other'
  return 'other'
}

function getManifestRecords(manifestItems) {
  const records = []
  for (const [key, rawValue] of Object.entries(manifestItems || {})) {
    const entry = rawValue && typeof rawValue === 'object' ? rawValue : {}
    const file = String(entry.file || key || '').trim()
    records.push({ key, file, entry })
  }
  return records
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

  console.log(`[import] mode=${isDryRun ? 'dry-run' : 'real'}`)
  console.log(`[import] cwd=${process.cwd()}`)
  console.log(`[import] root=${ROOT}`)
  console.log(`[import] portfolio_dir=${PORTFOLIO_DIR}`)
  console.log(`[import] manifest_path=${MANIFEST_PATH}`)

  let manifestLoadOk = false
  let manifest = {}
  let manifestRaw = ''
  try {
    manifestRaw = await fs.readFile(MANIFEST_PATH, 'utf8')
    manifest = JSON.parse(manifestRaw)
    manifestLoadOk = true
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`Falha ao carregar manifest.json em ${MANIFEST_PATH}: ${msg}`)
  }

  const manifestItems = manifest?.items || {}
  const manifestRecords = getManifestRecords(manifestItems)
  const defaultType = manifest?.defaultType || 'other'
  console.log(`[import] manifest_loaded=${manifestLoadOk}`)
  console.log(`[import] manifest_entries=${manifestRecords.length}`)

  const files = await walkFiles(PORTFOLIO_DIR)
  console.log(`[import] image_files_found=${files.length}`)
  const existingRelativeFiles = new Set(
    files.map((absPath) => normalizePath(path.relative(PORTFOLIO_DIR, absPath)))
  )
  const missingManifestFiles = manifestRecords
    .filter((record) => !!record.file && !existingRelativeFiles.has(record.file))
    .map((record) => record.file)

  if (missingManifestFiles.length > 0) {
    console.log('[import] manifest references missing files:')
    for (const file of missingManifestFiles) console.log(`  - ${file}`)
  }

  const results = []
  const stats = { created: 0, updated: 0, unchanged: 0, failed: 0, planned: 0 }

  if (files.length === 0) {
    console.log('[import] image_files_found=0')
    console.log('[import] Coloque arquivos em public/portfolio/01.jpg, 02.jpg...')
    console.log('[import] Depois rode npm run import:portfolio')
  }

  for (const absPath of files) {
    const relPath = normalizePath(path.relative(PORTFOLIO_DIR, absPath))
    const manifestItem = (manifestItems[relPath] && typeof manifestItems[relPath] === 'object')
      ? manifestItems[relPath]
      : {}
    const type = manifestItem.type || defaultType
    const title = manifestItem.title || titleFromFilename(relPath)
    const rawContentWarning = manifestItem.content_warning
    const contentWarning =
      rawContentWarning === undefined || rawContentWarning === null || rawContentWarning === ''
        ? null
        : String(rawContentWarning)
    const slug = manifestItem.slug || slugify(path.parse(relPath).name)
    const hash = await sha256(absPath)
    const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(relPath).data.publicUrl

    const dbType = resolveDbType(type)
    if (dbType !== type) {
      console.log(`[import] type '${type}' mapped to '${dbType}' for DB enum compatibility`)
    }

    const upsertPayload = {
      title,
      slug,
      type: dbType,
      cover_url: publicUrl,
      cover_image_url: publicUrl,
      content_warning: contentWarning || null,
      source_hash: hash,
      is_published: true
    }

    if (isDryRun) {
      stats.planned += 1
      results.push({
        file: relPath,
        slug,
        status: 'planned',
        detail: `type=${type} content_warning=${contentWarning || 'null'}`
      })
      console.log(`[dry-run] file=${relPath} slug=${slug} type=${type} content_warning=${contentWarning || 'null'}`)
      continue
    }

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
      upsertPayload,
      { onConflict: 'slug' }
    )

    if (write.error) {
      console.error('[import] upsert payload (safe):', {
        slug: upsertPayload.slug,
        title: upsertPayload.title,
        type: upsertPayload.type,
        content_warning: upsertPayload.content_warning,
        cover_url: upsertPayload.cover_url
      })
      console.error('[import] supabase upsert error:', {
        message: write.error.message,
        code: write.error.code,
        details: write.error.details,
        hint: write.error.hint
      })
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
    `- Resolved source path: \`${PORTFOLIO_DIR}\``,
    `- Bucket: \`${BUCKET}\``,
    `- Dry run: ${isDryRun ? 'yes' : 'no'}`,
    `- Manifest loaded: ${manifestLoadOk ? 'yes' : 'no'}`,
    `- Manifest entries: ${manifestRecords.length}`,
    `- Image files found: ${files.length}`,
    `- Manifest files missing on disk: ${missingManifestFiles.length}`,
    '',
    '## Summary',
    '',
    `- Created: ${stats.created}`,
    `- Updated: ${stats.updated}`,
    `- Unchanged: ${stats.unchanged}`,
    `- Failed: ${stats.failed}`,
    `- Planned (dry-run): ${stats.planned}`,
    '',
    '## Manifest Validation',
    '',
    ...(missingManifestFiles.length
      ? missingManifestFiles.map((file) => `- Missing file referenced in manifest: \`${file}\``)
      : ['- All manifest entries point to existing files.']),
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
    `Summary -> created:${stats.created} updated:${stats.updated} unchanged:${stats.unchanged} failed:${stats.failed} planned:${stats.planned}`
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
