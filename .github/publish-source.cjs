'use strict';
const fs=require('node:fs'),cp=require('node:child_process');
if(process.env.GITHUB_REF!=='refs/heads/main'||process.env.GITHUB_EVENT_NAME!=='push')throw Error('Source commit restricted to main push');
fs.rmSync('.github/source-update',{recursive:true});
fs.rmSync('.github/apply-source-update.cjs');
fs.rmSync('.github/publish-source.cjs');
const workflow='.github/workflows/verify-source.yml';fs.writeFileSync(workflow,fs.readFileSync(workflow,'utf8').replace(/^      # bootstrap-start[\s\S]*?^      # bootstrap-end\n/gm,'').replace('contents: write','contents: read'));
function git(...args){return cp.execFileSync('git',args,{stdio:'inherit'});}
git('config','user.name','github-actions[bot]');git('config','user.email','41898282+github-actions[bot]@users.noreply.github.com');git('add','-A');git('commit','-m','Publish tested Calfin 0.2.0 source: optional AI, privacy controls and dated reports; no installer');git('push','origin','HEAD:main');
