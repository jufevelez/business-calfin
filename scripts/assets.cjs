'use strict';
// Reproducible PNG/ICO generation with Node built-ins; no external artwork.
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const size=256,pixels=Buffer.alloc(size*(size*4+1));
for(let y=0;y<size;y++){const row=y*(size*4+1);pixels[row]=0;for(let x=0;x<size;x++){const dx=x-128,dy=y-128,d=Math.sqrt(dx*dx+dy*dy),cut=x>135&&Math.abs(dy)<30;const logo=d>58&&d<86&&!cut;const line=x>128&&x<197&&y>177&&y<192;const rgb=logo||line?[218,236,160]:[18,100,74];for(let c=0;c<3;c++)pixels[row+1+x*4+c]=rgb[c];pixels[row+1+x*4+3]=255;}}
function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function chunk(type,data){const t=Buffer.from(type),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length,0);t.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([t,data])),out.length-4);return out;}
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;const png=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);
const dir=path.join(__dirname,'../assets');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'icon.png'),png);const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(png.length,14);header.writeUInt32LE(22,18);fs.writeFileSync(path.join(dir,'icon.ico'),Buffer.concat([header,png]));
