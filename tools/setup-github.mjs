#!/usr/bin/env node
import { spawnSync } from 'child_process'
function run(cmd,args){ console.log('>',cmd,args.join(' ')); const r=spawnSync(cmd,args,{stdio:'inherit'}); if(r.error) throw r.error; return r.status }

run('git',['init'])
run('git',['add','.'])
run('git',['commit','-m','Initial commit'])
console.log('Creating GitHub repo (requires gh CLI)')
run('gh',['repo','create','--public','--source=.','--remote=origin','--push'])
