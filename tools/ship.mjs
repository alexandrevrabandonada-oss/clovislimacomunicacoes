#!/usr/bin/env node
import { spawnSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

const ROOT = process.cwd()
const REPORTS_DIR = path.join(ROOT, 'reports')
const isDryRun = process.argv.includes('--dry-run')

const ESSENTIAL_ENVS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

function timestamp() {
  const now = new Date()
  const yyyy = String(now.getFullYear())
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  return `${yyyy}${mm}${dd}-${hh}${mi}`
}

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
    // optional file
  }
}

function run(command, { allowFailure = false } = {}) {
  if (isDryRun) {
    return {
      ok: true,
      code: 0,
      stdout: '',
      stderr: '',
      skipped: true,
      durationMs: 0,
      command
    }
  }
  const startedAt = Date.now()
  const res = spawnSync(command, {
    cwd: ROOT,
    shell: true,
    encoding: 'utf8',
    env: process.env
  })
  const endedAt = Date.now()
  const code = typeof res.status === 'number' ? res.status : 1
  const ok = code === 0 || allowFailure
  return {
    ok,
    code,
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    durationMs: endedAt - startedAt,
    command
  }
}

function tail(text, maxLines = 40) {
  const lines = String(text || '').split(/\r?\n/).filter(Boolean)
  return lines.slice(-maxLines).join('\n')
}

async function main() {
  await loadDotEnvLocal()
  await fs.mkdir(REPORTS_DIR, { recursive: true })

  const reportPath = path.join(REPORTS_DIR, `ship-${timestamp()}.md`)
  const steps = []

  const packageJsonPath = path.join(ROOT, 'package.json')
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  const scripts = packageJson.scripts || {}

  const missingEnv = ESSENTIAL_ENVS.filter((key) => !String(process.env[key] || '').trim())
  if (missingEnv.length) {
    steps.push({
      name: 'env-check',
      status: 'failed',
      details: `Missing env(s): ${missingEnv.join(', ')}`
    })
    await writeReport(reportPath, steps)
    console.error(`Ship aborted. Missing env(s): ${missingEnv.join(', ')}`)
    process.exit(1)
  } else {
    steps.push({
      name: 'env-check',
      status: 'ok',
      details: `Essential envs present: ${ESSENTIAL_ENVS.join(', ')}`
    })
  }

  if (scripts.doctor) {
    const doctor = run('npm run doctor')
    steps.push({
      name: 'doctor',
      status: doctor.skipped ? 'skipped' : doctor.ok ? 'ok' : 'failed',
      command: doctor.command,
      code: doctor.code,
      details: doctor.skipped ? 'dry-run: comando não executado.' : undefined,
      output: `${tail(doctor.stdout)}\n${tail(doctor.stderr)}`.trim()
    })
    if (!doctor.ok) {
      await writeReport(reportPath, steps)
      console.error('Ship aborted at doctor step.')
      process.exit(1)
    }
  } else {
    steps.push({ name: 'doctor', status: 'skipped', details: 'Script not found in package.json.' })
  }

  const importPortfolio = run('npm run import:portfolio')
  steps.push({
    name: 'import-portfolio',
    status: importPortfolio.skipped ? 'skipped' : importPortfolio.ok ? 'ok' : 'failed',
    command: importPortfolio.command,
    code: importPortfolio.code,
    details: importPortfolio.skipped ? 'dry-run: comando não executado.' : undefined,
    output: `${tail(importPortfolio.stdout)}\n${tail(importPortfolio.stderr)}`.trim()
  })
  if (!importPortfolio.ok) {
    await writeReport(reportPath, steps)
    console.error('Ship aborted at import:portfolio step.')
    process.exit(1)
  }

  const lint = run('npm run lint')
  steps.push({
    name: 'lint',
    status: lint.skipped ? 'skipped' : lint.ok ? 'ok' : 'failed',
    command: lint.command,
    code: lint.code,
    details: lint.skipped ? 'dry-run: comando não executado.' : undefined,
    output: `${tail(lint.stdout)}\n${tail(lint.stderr)}`.trim()
  })
  if (!lint.ok) {
    await writeReport(reportPath, steps)
    console.error('Ship aborted at lint step.')
    process.exit(1)
  }

  const build = run('npm run build')
  steps.push({
    name: 'build',
    status: build.skipped ? 'skipped' : build.ok ? 'ok' : 'failed',
    command: build.command,
    code: build.code,
    details: build.skipped ? 'dry-run: comando não executado.' : undefined,
    output: `${tail(build.stdout)}\n${tail(build.stderr)}`.trim()
  })
  if (!build.ok) {
    await writeReport(reportPath, steps)
    console.error('Ship aborted at build step.')
    process.exit(1)
  }

  const gitStatus = run('git status --porcelain')
  const dirty = Boolean((gitStatus.stdout || '').trim())
  steps.push({
    name: 'git-status',
    status: gitStatus.skipped ? 'skipped' : dirty ? 'dirty' : 'clean',
    command: gitStatus.command,
    details: gitStatus.skipped ? 'dry-run: comando não executado.' : undefined,
    output: tail(gitStatus.stdout)
  })

  if (dirty) {
    if (String(process.env.SHIP_AUTOCOMMIT || '') === '1') {
      const add = run('git add -A')
      steps.push({
        name: 'git-add',
        status: add.ok ? 'ok' : 'failed',
        command: add.command,
        code: add.code,
        output: `${tail(add.stdout)}\n${tail(add.stderr)}`.trim()
      })
      if (!add.ok) {
        await writeReport(reportPath, steps)
        console.error('Ship aborted at git add.')
        process.exit(1)
      }

      const commit = run('git commit -m "chore: ship"', { allowFailure: true })
      const commitOutput = `${tail(commit.stdout)}\n${tail(commit.stderr)}`.trim()
      const commitFailed = commit.code !== 0 && !/nothing to commit/i.test(commitOutput)
      steps.push({
        name: 'git-commit',
        status: commitFailed ? 'failed' : 'ok',
        command: commit.command,
        code: commit.code,
        output: commitOutput
      })
      if (commitFailed) {
        await writeReport(reportPath, steps)
        console.error('Ship aborted at git commit.')
        process.exit(1)
      }
    } else {
      steps.push({
        name: 'git-autocommit',
        status: 'failed',
        details:
          'Working tree is dirty. Commit manually or rerun with SHIP_AUTOCOMMIT=1.'
      })
      await writeReport(reportPath, steps)
      console.error('Ship aborted: dirty git status.')
      process.exit(1)
    }
  }

  const branch = run('git branch --show-current')
  const detectedBranch = (branch.stdout || 'main').trim() || 'main'
  const pushBranch = 'main'
  steps.push({
    name: 'git-branch',
    status: branch.skipped ? 'skipped' : branch.ok ? 'ok' : 'failed',
    command: branch.command,
    details: branch.skipped ? 'dry-run: comando não executado.' : undefined,
    output: `detected=${detectedBranch}, push=${pushBranch}`
  })
  if (!branch.ok) {
    await writeReport(reportPath, steps)
    console.error('Ship aborted: unable to resolve git branch.')
    process.exit(1)
  }

  const push = run(`git push origin ${pushBranch}`)
  steps.push({
    name: 'git-push',
    status: push.skipped ? 'skipped' : push.ok ? 'ok' : 'failed',
    command: push.command,
    code: push.code,
    details: push.skipped ? 'dry-run: comando não executado.' : undefined,
    output: `${tail(push.stdout)}\n${tail(push.stderr)}`.trim()
  })
  if (!push.ok) {
    await writeReport(reportPath, steps)
    console.error('Ship aborted at git push.')
    process.exit(1)
  }

  steps.push({
    name: 'deploy',
    status: push.skipped ? 'skipped' : 'ok',
    details: push.skipped
      ? 'dry-run: deploy automático não foi disparado.'
      : 'Deploy é automático via GitHub→Vercel: push para o branch dispara build/deploy na Vercel.'
  })

  await writeReport(reportPath, steps)
  console.log(`Ship completed. Report: ${path.relative(ROOT, reportPath)}`)
}

async function writeReport(reportPath, steps) {
  const now = new Date().toISOString()
  const lines = [
    '# Ship Report',
    '',
    `- Generated at: ${now}`,
    `- Dry run: ${isDryRun ? 'yes' : 'no'}`,
    '- Deploy: GitHub→Vercel (auto on push)',
    '',
    '## Steps',
    ''
  ]

  for (const step of steps) {
    lines.push(`### ${step.name}`)
    lines.push(`- Status: ${step.status}`)
    if (step.command) lines.push(`- Command: \`${step.command}\``)
    if (step.code !== undefined) lines.push(`- Exit code: ${step.code}`)
    if (step.details) lines.push(`- Details: ${step.details}`)
    if (step.output) {
      lines.push('- Output:')
      lines.push('```txt')
      lines.push(step.output)
      lines.push('```')
    }
    lines.push('')
  }

  await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8')
}

main().catch(async (error) => {
  const reportPath = path.join(REPORTS_DIR, `ship-${timestamp()}.md`)
  await fs.mkdir(REPORTS_DIR, { recursive: true })
  await fs.writeFile(
    reportPath,
    `# Ship Report\n\n- Generated at: ${new Date().toISOString()}\n- Status: failed\n- Error: ${error instanceof Error ? error.message : String(error)}\n`,
    'utf8'
  )
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
