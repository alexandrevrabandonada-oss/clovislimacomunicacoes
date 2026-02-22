#!/usr/bin/env node
import { spawnSync } from 'child_process'
function run(cmd,args){ console.log('>',cmd,args.join(' ')); const r=spawnSync(cmd,args,{stdio:'inherit'}); if(r.error) throw r.error; return r.status }

console.log('Running supabase setup')
run('node',['tools/setup-supabase.mjs'])
console.log('Running github setup')
run('node',['tools/setup-github.mjs'])
console.log('Running vercel setup')
run('node',['tools/setup-vercel.mjs'])
