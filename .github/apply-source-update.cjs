'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const root=process.cwd(),directory=path.join(root,'.github/source-update');
const bytes=Buffer.concat(Array.from({length:5},(_,i)=>fs.readFileSync(path.join(directory,'part'+i+'.br'))));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(hash(bytes)!=='f841b7a33c64fd7fbf3f8ff17e7429315212507e205808481f7368704251348a')throw Error('Source payload checksum mismatch');
const bundle=JSON.parse(zlib.brotliDecompressSync(bytes));
const allowed=new Set(['.github/workflows/windows.yml','README.md','desktop/main.cjs','desktop/preload.cjs','package-lock.json','package.json','scripts/release.ps1','scripts/verification.cjs','src/app.js','src/index.html','src/pricing-knowledge.js','src/ai-policy.js','src/ai-panel.js','src/report-stamp.js','src/report-print.css','desktop/ai-service.cjs','tests/ai.test.cjs','tests/report-stamp.test.cjs','tests/browser-extensions.cjs','scripts/verify-signatures.ps1','docs/AI.md']);
const planned=new Map();
for(const update of bundle.updates){if(!allowed.has(update.path))throw Error('Unexpected update path');const file=path.join(root,update.path);let text=fs.readFileSync(file,'utf8');if(hash(Buffer.from(text))===update.finalSha256){planned.set(update.path,text);continue;}if(hash(Buffer.from(text))!==update.sha256)throw Error('Base file changed: '+update.path);for(const edit of [...update.edits].reverse())text=text.slice(0,edit.start)+edit.text+text.slice(edit.end);if(hash(Buffer.from(text))!==update.finalSha256)throw Error('Result checksum mismatch: '+update.path);planned.set(update.path,text);}
for(const [file,text]of Object.entries(bundle.newFiles)){if(!allowed.has(file)||fs.existsSync(path.join(root,file))||planned.has(file))throw Error('Unexpected new file: '+file);planned.set(file,text);}
for(const [file,text]of planned){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);}
console.log('Applied verified source update:',planned.size,'files. No executable produced.');
