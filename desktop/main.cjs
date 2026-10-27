'use strict';
const {app,BrowserWindow,ipcMain,dialog,session}=require('electron');
const fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
const E=require('../src/engine.js');
let window;const smoke=process.argv.includes('--smoke-test');
if(smoke){if(!process.env.CALFIN_TEST_HOME)throw new Error('Smoke tests require an isolated data directory');app.setPath('userData',path.resolve(process.env.CALFIN_TEST_HOME));app.disableHardwareAcceleration();}
const index=path.join(__dirname,'../src/index.html'),trustedURL=pathToFileURL(index).href,MAX=5_000_000;
function valid(data){const raw=JSON.stringify(data);if(Buffer.byteLength(raw)>MAX)throw new Error('El archivo supera 5 MB');const issues=E.validate(data);if(issues.length)throw new Error(issues.slice(0,4).join('; '));return raw;}
function authorize(event){if(!window||event.sender!==window.webContents||event.senderFrame.url!==trustedURL)throw new Error('Solicitud no autorizada');}
const dataPath=()=>path.join(app.getPath('userData'),'workspace.calfin');
async function read(file){const stat=await fs.stat(file);if(stat.size>MAX)throw new Error('Archivo demasiado grande');const data=JSON.parse(await fs.readFile(file,'utf8'));valid(data);return data;}
async function load(){try{return await read(dataPath());}catch(e){if(e.code==='ENOENT')return null;try{const backup=await read(dataPath()+'.bak');if(!smoke)await dialog.showMessageBox(window,{type:'warning',message:'El guardado principal está dañado. Se recuperó la copia anterior; revísala antes de guardar.'});return backup;}catch{throw new Error('No se pudo abrir el guardado ni su copia anterior. Importa un respaldo válido.');}}}
async function save(data){const raw=valid(data),file=dataPath();await fs.mkdir(path.dirname(file),{recursive:true});try{await read(file);await fs.copyFile(file,file+'.bak');}catch(e){if(e.code!=='ENOENT'){/* Preserve any valid previous backup when primary is damaged. */}}
 const staging=file+'.tmp';await fs.writeFile(staging,raw,{encoding:'utf8',mode:0o600});await fs.rename(staging,file);return true;}
app.whenReady().then(async()=>{
 session.defaultSession.setPermissionRequestHandler((_w,_p,done)=>done(false));session.defaultSession.setPermissionCheckHandler(()=>false);
 window=new BrowserWindow({width:1440,height:1000,minWidth:900,minHeight:650,title:'Business Calfin',show:!smoke,backgroundColor:'#f5f6f0',icon:path.join(__dirname,'../assets/icon.png'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
 window.setMenuBarVisibility(false);window.webContents.setWindowOpenHandler(()=>({action:'deny'}));window.webContents.on('will-navigate',(e,url)=>{if(url!==trustedURL)e.preventDefault();});window.webContents.on('will-prevent-unload',e=>{if(dialog.showMessageBoxSync(window,{type:'question',buttons:['Continuar trabajando','Salir sin guardar'],defaultId:0,cancelId:0,message:'Hay cambios sin guardar. ¿Quieres salir?'})===1)e.preventDefault();});
 const handle=(name,fn)=>ipcMain.handle(name,async(event,...args)=>{authorize(event);return fn(...args);});
 handle('calfin:load',load);handle('calfin:save',save);
 handle('calfin:import',async()=>{const pick=await dialog.showOpenDialog(window,{properties:['openFile'],filters:[{name:'Respaldo Calfin',extensions:['calfin','json']}]});return pick.canceled?null:read(pick.filePaths[0]);});
 handle('calfin:export',async data=>{const raw=valid(data),pick=await dialog.showSaveDialog(window,{defaultPath:'business-calfin.calfin',filters:[{name:'Respaldo Calfin',extensions:['calfin']}]});if(!pick.canceled){await fs.writeFile(pick.filePath,raw,{encoding:'utf8',mode:0o600});return true;}return false;});
 handle('calfin:csv',async text=>{if(typeof text!=='string'||Buffer.byteLength(text)>MAX)throw new Error('Contenido de exportación no válido');const pick=await dialog.showSaveDialog(window,{defaultPath:'business-calfin-resultados.csv',filters:[{name:'Tabla CSV',extensions:['csv']}]});if(!pick.canceled){await fs.writeFile(pick.filePath,text,'utf8');return true;}return false;});
 const failures=[];window.webContents.on('console-message',(event,...args)=>{const level=event.details?.level??args[0],message=event.details?.message??args[1];if(level==='error'||level>=3)failures.push(message);});
 if(smoke){const timer=setTimeout(()=>app.exit(2),45000);window.webContents.on('did-fail-load',()=>app.exit(3));window.webContents.on('did-finish-load',async()=>{try{const result=await window.webContents.executeJavaScript(`({title:document.title,bridge:typeof window.calfinDesktop.save==='function',engine:Calfin.VERSION,privateRenderer:typeof require==='undefined',rendered:document.querySelector('#results').innerText.length>0})`);if(!result.bridge||!result.privateRenderer||!result.rendered||result.engine!==E.VERSION||failures.length)throw new Error(JSON.stringify({result,failures}));const D=require('../src/data.js'),sample=D.workspace();await save(sample);if((await load()).selectedId!==sample.selectedId)throw new Error('Storage mismatch');await fs.writeFile(path.join(app.getPath('userData'),'smoke-result.json'),JSON.stringify({passed:true,...result}));clearTimeout(timer);app.exit(0);}catch(e){console.error(e);app.exit(4);}});}
 await window.loadFile(index);
});
app.on('window-all-closed',()=>app.quit());
