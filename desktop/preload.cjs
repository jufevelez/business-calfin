'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('calfinDesktop',Object.freeze({
 load:()=>ipcRenderer.invoke('calfin:load'),
 save:data=>ipcRenderer.invoke('calfin:save',data),
 importBackup:()=>ipcRenderer.invoke('calfin:import'),
 exportBackup:data=>ipcRenderer.invoke('calfin:export',data),
 exportCsv:text=>ipcRenderer.invoke('calfin:csv',text)
}));
