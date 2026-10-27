'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const P=require('../src/ai-policy.js'),K=require('../src/pricing-knowledge.js');
const PROVIDERS=Object.freeze({openai:{url:'https://api.openai.com/v1/responses',model:'gpt-4.1-mini'},anthropic:{url:'https://api.anthropic.com/v1/messages',model:'claude-sonnet-4-6'}});
function createAIService({directory,safeStorage,confirm,fetchImpl=globalThis.fetch,now=()=>Date.now()}){
 let pending=null,active=null,busy=false,configQueue=Promise.resolve();
 const file=path.join(directory,'ai-settings.enc.json'),usageFile=path.join(directory,'ai-usage.json');
 async function read(p,fallback){try{return JSON.parse(await fs.readFile(p,'utf8'));}catch(e){if(e.code==='ENOENT')return fallback;throw new Error('No se pudo leer la configuración local de IA');}}
 async function write(p,value){await fs.mkdir(directory,{recursive:true});const temp=p+'.tmp';await fs.writeFile(temp,JSON.stringify(value),{mode:0o600});await fs.rename(temp,p);}
 async function secure(){const available=safeStorage.isAsyncEncryptionAvailable?await safeStorage.isAsyncEncryptionAvailable():safeStorage.isEncryptionAvailable();if(!available||safeStorage.getSelectedStorageBackend?.()==='basic_text')throw new Error('No hay almacenamiento protegido para la clave. No se guardará en texto plano.');}
 async function encrypt(key){await secure();return (safeStorage.encryptStringAsync?await safeStorage.encryptStringAsync(key):safeStorage.encryptString(key)).toString('base64');}
 async function decrypt(key){await secure();const value=Buffer.from(key,'base64');return safeStorage.decryptStringAsync?await safeStorage.decryptStringAsync(value):safeStorage.decryptString(value);}
 async function status(){const c=await read(file,null),u=await usage();return {configured:!!c,provider:c?.provider||'openai',model:c?.model||PROVIDERS.openai.model,dailyLimit:c?.dailyLimit||5,usedToday:u.attempts,providers:Object.keys(PROVIDERS)};}
 async function usage(){const day=new Date(now()).toISOString().slice(0,10),u=await read(usageFile,null);if(u&&u.day===day){if(!Number.isInteger(u.attempts)||u.attempts<0)throw new Error('Registro de consumo inválido');return u;}return {day,attempts:0};}
 function configure(input){const task=configQueue.then(async()=>{if(busy)throw new Error('Espera o cancela el análisis antes de cambiar la conexión');if(!input||!Object.hasOwn(PROVIDERS,input.provider)||typeof input.model!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,63}$/.test(input.model)||!Number.isInteger(input.dailyLimit)||input.dailyLimit<1||input.dailyLimit>50)throw new Error('Proveedor, modelo o límite no válidos');const old=await read(file,null);let encrypted;if(input.key===''){if(!old||old.provider!==input.provider)throw new Error('Introduce la clave del proveedor seleccionado');encrypted=old.encrypted;}else{if(typeof input.key!=='string'||input.key.length<8||input.key.length>1024||/[\s\u0000]/.test(input.key))throw new Error('Formato de clave inválido');encrypted=await encrypt(input.key);}await write(file,{provider:input.provider,model:input.model,dailyLimit:input.dailyLimit,encrypted});pending=null;return status();});configQueue=task.catch(()=>{});return task;}
 async function forget(){await configQueue;if(busy)throw new Error('Espera a que termine la cancelación');await fs.rm(file,{force:true});pending=null;return status();}
 async function prepare(workspace,reportIndex){await configQueue;if(busy)throw new Error('Ya hay un análisis en curso');const c=await read(file,null);if(!c)throw new Error('Configura tu proveedor de IA primero');const summary=P.buildSummary(workspace,reportIndex),ticket=crypto.randomUUID();if(summary.metrics.sales===null&&summary.metrics.forecastFinalCash===null&&summary.metrics.evaluatedOffers===0)throw new Error('Completa al menos un informe, una oferta o una proyección antes de usar IA');pending={ticket,summary,provider:c.provider,model:c.model,created:now()};return {ticket,summary,provider:c.provider,model:c.model,knowledgeVersion:K.version,maxOutputTokens:1500,expiresAt:pending.created+600000};}
 async function analyze({ticket,consent}={}){
  if(busy)throw new Error('Ya hay un análisis en curso');if(consent!==true||!pending||ticket!==pending.ticket||now()-pending.created>600000)throw new Error('Previsualiza el resumen y autoriza un nuevo envío');
  busy=true;active=new AbortController();const p=pending;pending=null;let timer;
  try{
   await configQueue;const c=await read(file,null);if(!c||c.provider!==p.provider||c.model!==p.model)throw new Error('La conexión cambió: prepara otro resumen');
   const decision=await confirm({provider:c.provider,model:c.model,summary:p.summary});if(!decision)throw new Error('Envío no autorizado');if(active.signal.aborted)throw new Error('Cancelado');
   const u=await usage();if(u.attempts>=c.dailyLimit)throw new Error('Límite diario alcanzado; no se hizo otra solicitud');
   const key=await decrypt(c.encrypted);timer=setTimeout(()=>active?.abort(),60000);
   await write(usageFile,{day:u.day,attempts:u.attempts+1});
   const prompt=P.requestBody(p.summary),system='Eres un asistente de análisis de Calfin. Explica solo los datos proporcionados y las limitaciones. Devuelve JSON, sin herramientas, enlaces externos ni cifras en los textos. Nunca suplantes una aprobación humana.';
   const body=c.provider==='openai'?{model:c.model,store:false,instructions:system,input:prompt,max_output_tokens:1500}:{model:c.model,system,messages:[{role:'user',content:prompt}],max_tokens:1500};
   const headers=c.provider==='openai'?{'Authorization':'Bearer '+key,'Content-Type':'application/json'}:{'x-api-key':key,'anthropic-version':'2023-06-01','Content-Type':'application/json'};
   const response=await fetchImpl(PROVIDERS[c.provider].url,{method:'POST',headers,body:JSON.stringify(body),signal:active.signal,redirect:'error'});
   if(!response.ok)throw new Error(response.status===401||response.status===403?'El proveedor rechazó la conexión. Revisa la clave y sus permisos.':response.status===429?'El proveedor indicó un límite de consumo o disponibilidad. No se reintentó.':'El proveedor no pudo completar el análisis. No se reintentó.');
   const reader=response.body.getReader();let size=0,chunks=[];try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>200000){await reader.cancel();throw new Error('Respuesta demasiado grande');}chunks.push(Buffer.from(value));}}finally{reader.releaseLock();}
   const raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));
   if((c.provider==='openai'&&raw.status!=='completed')||(c.provider==='anthropic'&&raw.stop_reason!=='end_turn'))throw new Error('Respuesta incompleta; no se emitió una recomendación');
   const text=c.provider==='openai'?(raw.output||[]).filter(x=>x.type==='message').flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join(''):(raw.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('');
   let decoded;try{decoded=JSON.parse(text);}catch{throw new Error('La IA no devolvió un formato verificable; no se reintentó');}
   return {analysis:P.validateResponse(decoded,p.summary),summary:p.summary,provider:c.provider,model:c.model,generatedAt:new Date(now()).toISOString(),knowledgeVersion:K.version,engineVersion:p.summary.engineVersion,reviewRequired:true};
  }catch(e){if(active?.signal.aborted)throw new Error('Análisis cancelado o tiempo agotado. El proveedor puede cobrar el trabajo ya realizado.');if(e instanceof SyntaxError||e instanceof TypeError)throw new Error('Respuesta o conexión no válida; no se reintentó');throw e;}
  finally{clearTimeout(timer);active=null;busy=false;}
 }
 function cancel(){active?.abort();pending=null;return true;}
 return {status,configure,forget,prepare,analyze,cancel};
}
module.exports={createAIService,PROVIDERS};
