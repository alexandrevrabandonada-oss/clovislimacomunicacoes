#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(SCRIPT_DIR, '..')
const DROP_DIR = path.join(ROOT, '_drop')
const IMPORTED_DIR = path.join(DROP_DIR, '_imported')
const PORTFOLIO_DIR = path.join(ROOT, 'public', 'portfolio')
const MANIFEST_PATH = path.join(PORTFOLIO_DIR, 'manifest.json')
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/')
}

function titleFromNumber(num) {
  return `Obra ${String(num).padStart(2, '0')}`
}

function parseNumFromFilename(fileName) {
  const stem = path.parse(fileName).name
  if (!/^\d+$/.test(stem)) return null
  return Number.parseInt(stem, 10)
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function readManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      defaultType: parsed?.defaultType || 'charge',
      items: parsed?.items && typeof parsed.items === 'object' ? parsed.items : {}
    }
  } catch {
    return { defaultType: 'charge', items: {} }
  }
}

async function listDropImages() {
  try {
    const entries = await fs.readdir(DROP_DIR, { withFileTypes: true })
    return entries
      .filter((entry) => entry.isFile())
      .filter((entry) => IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b))
  } catch {
    return []
  }
}

async function listPortfolioNumbers() {
  const nums = []
  try {
    const entries = await fs.readdir(PORTFOLIO_DIR, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile()) continue
      const ext = path.extname(entry.name).toLowerCase()
      if (!IMAGE_EXTENSIONS.has(ext)) continue
      const num = parseNumFromFilename(entry.name)
      if (num !== null) nums.push(num)
    }
  } catch {
    // folder may not exist yet
  }
  return nums
}

async function main() {
  await ensureDir(DROP_DIR)
  await ensureDir(IMPORTED_DIR)
  await ensureDir(PORTFOLIO_DIR)

  const manifest = await readManifest()
  const dropImages = await listDropImages()

  console.log(`[ingest] root=${ROOT}`)
  console.log(`[ingest] drop_dir=${DROP_DIR}`)
  console.log(`[ingest] images_in_drop=${dropImages.length}`)

  if (dropImages.length === 0) {
    console.log('[ingest] _drop está vazio. Nada para ingerir.')
    return
  }

  const usedNumbers = new Set(await listPortfolioNumbers())
  const items = { ...manifest.items }
  const ingested = []

  let nextNumber = 1
  for (const sourceFile of dropImages) {
    while (usedNumbers.has(nextNumber)) nextNumber += 1
    usedNumbers.add(nextNumber)

    const ext = path.extname(sourceFile).toLowerCase()
    const targetBase = String(nextNumber).padStart(2, '0')
    const targetFile = `${targetBase}${ext}`

    const sourcePath = path.join(DROP_DIR, sourceFile)
    const targetPath = path.join(PORTFOLIO_DIR, targetFile)
    const importedPath = path.join(IMPORTED_DIR, sourceFile)

    await fs.copyFile(sourcePath, targetPath)
    await fs.rename(sourcePath, importedPath)

    const manifestKey = normalizePath(targetFile)
    items[manifestKey] = {
      file: manifestKey,
      title: titleFromNumber(nextNumber),
      type: 'charge',
      content_warning: false
    }

    ingested.push({ from: sourceFile, to: targetFile })
    nextNumber += 1
  }

  const manifestOut = {
    defaultType: manifest.defaultType || 'charge',
    items
  }
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifestOut, null, 2)}\n`, 'utf8')

  console.log(`[ingest] imported=${ingested.length}`)
  for (const row of ingested) {
    console.log(`[ingest] ${row.from} -> public/portfolio/${row.to}`)
  }
  console.log('[ingest] manifest.json atualizado.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
