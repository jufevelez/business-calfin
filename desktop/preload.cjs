'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('calfinDesktop',Object.freeze({
 load:()=>ipcRenderer.invoke('calfin:load'),
 save:data=>ipcRenderer.invoke('calfin:save',data),
 importBackup:()=>ipcRenderer.invoke('calfin:import'),
 exportBackup:data=>ipcRenderer.invoke('calfin:export',data),
 exportCsv:text=>ipcRenderer.invoke('calfin:csv',text),
 aiStatus:()=>ipcRenderer.invoke('calfin:ai-status'),
 aiConfigure:settings=>ipcRenderer.invoke('calfin:ai-configure',settings),
 aiForget:()=>ipcRenderer.invoke('calfin:ai-forget'),
 aiPrepare:(workspace,reportIndex)=>ipcRenderer.invoke('calfin:ai-prepare',workspace,reportIndex),
 aiAnalyze:request=>ipcRenderer.invoke('calfin:ai-analyze',request),
 aiCancel:()=>ipcRenderer.invoke('calfin:ai-cancel')
}));
