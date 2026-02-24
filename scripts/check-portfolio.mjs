#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SCRIPT_DIR, '..')
const PORTFOLIO_DIR = path.join(ROOT, 'public', 'portfolio')
const MANIFEST_PATH = path.join(PORTFOLIO_DIR, 'manifest.json')
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s/-]/g, '')
    .replace(/[\/\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
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

function getManifestRecords(manifestItems) {
  const records = []
  for (const [key, rawValue] of Object.entries(manifestItems || {})) {
    const entry = rawValue && typeof rawValue === 'object' ? rawValue : {}
    const file = String(entry.file || key || '').trim()
    const slug = String(entry.slug || slugify(path.parse(file).name))
    const type = String(entry.type || 'other')
    const warning = entry.content_warning === undefined ? null : entry.content_warning
    records.push({ file, slug, type, warning })
  }
  return records
}

async function main() {
  let manifest
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8')
    manifest = JSON.parse(raw)
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error(`Falha ao carregar manifest.json: ${msg}`)
    process.exit(1)
  }

  const files = await walkFiles(PORTFOLIO_DIR)
  const relFiles = files.map((f) => normalizePath(path.relative(PORTFOLIO_DIR, f)))
  const fileSet = new Set(relFiles)

  const records = getManifestRecords(manifest?.items || {})
  const missing = records.filter((record) => !record.file || !fileSet.has(record.file))

  console.log(`[portfolio:check] root=${ROOT}`)
  console.log(`[portfolio:check] folder=${PORTFOLIO_DIR}`)
  console.log(`[portfolio:check] images_found=${relFiles.length}`)
  console.log(`[portfolio:check] manifest_entries=${records.length}`)

  if (relFiles.length < 1) {
    console.error('Erro: nenhum arquivo de imagem encontrado em public/portfolio.')
    process.exit(1)
  }

  if (missing.length > 0) {
    console.error('Erro: manifest.json aponta para arquivos inexistentes:')
    for (const item of missing) {
      console.error(`- ${item.file || '(file vazio)'}`)
    }
    process.exit(1)
  }

  console.log('Lista final (file -> slug -> type -> warning):')
  for (const item of records) {
    console.log(`- ${item.file} -> ${item.slug} -> ${item.type} -> ${item.warning === null ? 'null' : String(item.warning)}`)
  }

  console.log('portfolio:check OK')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
