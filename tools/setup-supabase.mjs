#!/usr/bin/env node
import { spawnSync } from 'child_process'

function run(cmd, args){
  console.log('> ', cmd, args.join(' '))
  const r = spawnSync(cmd, args, { stdio: 'inherit' })
  if(r.error) { console.error(r.error); process.exit(1) }
  return r.status
}

// Check for supabase CLI availability
const check = spawnSync('supabase', ['--version'], { stdio: 'pipe' })
if(check.error){
  console.error('Supabase CLI not found. Install it first: https://supabase.com/docs/guides/cli')
  process.exit(2)
}

console.log('Launching supabase login (interactive). Follow prompts in the terminal.')
run('supabase', ['login'])

console.log('Linking project (you may be prompted). If you have a project ref, you can run `supabase link --project-ref <ref>` later.')
try { run('supabase', ['link']) } catch(e) { /* continue */ }

console.log('Applying local migrations to remote DB (if any)')
try { run('supabase', ['db', 'push']) } catch(e) { /* continue */ }

console.log('Creating storage bucket "portfolio" (no-op if exists)')
try { run('supabase', ['storage', 'create-bucket', 'portfolio', '--public']) } catch(e) { /* continue */ }

console.log('Generating TypeScript types into src/lib/database.types.ts')
try { run('supabase', ['gen', 'types', 'typescript', '--local', '--file', 'src/lib/database.types.ts']) } catch(e) { /* continue */ }

console.log('Supabase setup script finished. Review output for errors and set env vars as needed.')
