#!/usr/bin/env node
import { spawnSync } from 'child_process'
function run(cmd,args){ console.log('>',cmd,args.join(' ')); const r=spawnSync(cmd,args,{stdio:'inherit'}); if(r.error) throw r.error; return r.status }

console.log('Creating/verifying Vercel project (requires vercel CLI)')
run('vercel',['whoami'])
run('vercel',['init'])
console.log('Use `vercel` interactive flow to connect git and add env vars')
