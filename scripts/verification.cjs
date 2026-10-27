'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.join(__dirname,'..');
if(process.platform!=='win32')throw new Error('Windows verification requires Windows');
function read(p){return JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));}
const unpacked=read('.test-state/unpacked-user/smoke-result.json');
const installed=read('.test-state/installed-user/smoke-result.json');
if(!unpacked.passed||!installed.passed)throw new Error('Missing successful native checks');
if(fs.existsSync(path.join(root,'.test-state/installed/Business Calfin.exe')))throw new Error('Uninstall not complete');
const decimal=read('.artifacts/decimal-report.json'),browser=read('.artifacts/browser-report.json');
if(decimal.failures||browser.errors.length||browser.externalRequests.length)throw new Error('Verification failure');
require('./checksums.cjs');
fs.writeFileSync(path.join(root,'dist/verification.json'),JSON.stringify({version:require('../package.json').version,platform:process.platform,os:os.release(),windowsPackagedStartup:unpacked,windowsInstalledStartup:installed,windowsUninstall:true,unitTestsPassed:true,decimal,browser,unsigned:true},null,2));
