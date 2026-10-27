'use strict';
const fs=require('node:fs'),cp=require('node:child_process');
if(process.env.GITHUB_REF!=='refs/heads/main'||process.env.GITHUB_EVENT_NAME!=='push')throw Error('Source commit restricted to main push');
fs.rmSync('.github/source-update',{recursive:true});
fs.rmSync('.github/apply-source-update.cjs');
fs.rmSync('.github/publish-source.cjs');
function git(...args){return cp.execFileSync('git',args,{stdio:'inherit'});}
git('config','user.name','github-actions[bot]');git('config','user.email','41898282+github-actions[bot]@users.noreply.github.com');git('restore','--','.github/workflows');git('add','-A');git('commit','-m','Publish tested Calfin 0.2.0 source: optional AI, privacy controls and dated reports; no installer');git('push','origin','HEAD:main');
