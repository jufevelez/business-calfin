/* Report issuance metadata. Uses the device clock, not a trusted timestamp authority. MIT. */
(function(root){'use strict';
function buildStamp({now=new Date(),timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone,company='',report='',period='',version='',saveStatus=''}={}){
 if(!(now instanceof Date)||!Number.isFinite(now.getTime()))throw new Error('Fecha de emisión inválida');
 const emittedAt=now.toISOString();
 const local=new Intl.DateTimeFormat('es-CO',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(now);
 return {emittedAt,timeZone,lines:[
  ['Aplicación','Business Calfin '+version],['Empresa',String(company)],['Reporte',String(report)],
  ['Período / alcance',String(period)||'Sección visible; sin período único'],
  ['Emitido el',local+' · '+timeZone],['Timestamp UTC',emittedAt],
  ['Estado del guardado',String(saveStatus)||'No informado'],
  ['Origen del sello','Reloj del equipo. No es un sello de tiempo certificado ni una auditoría de los datos.']
 ]};
}
if(typeof module==='object'&&module.exports){module.exports={buildStamp};return;}
root.CalfinReportStamp=Object.freeze({buildStamp});
if(!root.document)return;
const byId=id=>document.getElementById(id);
function prepare(){
 const select=byId('company'),month=byId('reportSelect');
 const horizon=document.querySelector('[data-path="forecast.months"]');
 const metadata=buildStamp({company:select?.selectedOptions[0]?.textContent||'',report:byId('title')?.textContent||'',period:month?.selectedOptions[0]?.textContent||(horizon?'Escenario de '+horizon.value+' meses':''),version:byId('version')?.textContent||'',saveStatus:byId('saveStatus')?.textContent||''});
 let box=byId('reportStamp');
 if(!box){box=document.createElement('section');box.id='reportStamp';box.className='report-stamp';box.setAttribute('aria-label','Datos de emisión del reporte');byId('results').before(box);}
 box.replaceChildren();box.dataset.emittedAt=metadata.emittedAt;
 for(const [label,value]of metadata.lines){const row=document.createElement('p'),name=document.createElement('strong');name.textContent=label+': ';row.append(name,document.createTextNode(value));box.append(row);}
}
function clear(){byId('reportStamp')?.remove();}
root.addEventListener('beforeprint',prepare);
root.addEventListener('afterprint',clear);
})(globalThis);
