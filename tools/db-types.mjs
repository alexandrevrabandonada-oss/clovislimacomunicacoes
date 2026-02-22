#!/usr/bin/env node
import { spawnSync } from 'child_process'
function run(cmd,args){ console.log('>',cmd,args.join(' ')); const r=spawnSync(cmd,args,{stdio:'inherit'}); if(r.error) throw r.error; return r.status }

console.log('Generating db types via supabase CLI')
run('supabase',['gen','types','typescript','--local','--file','src/lib/database.types.ts'])
