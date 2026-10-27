$ErrorActionPreference = 'Stop'
& "$PSScriptRoot/verify-signatures.ps1"
node -e "const fs=require('node:fs');const p='dist/verification.json';const v=JSON.parse(fs.readFileSync(p,'utf8'));v.signatureVerification=JSON.parse(fs.readFileSync('dist/signatures.json','utf8').replace(/^\uFEFF/,''));v.unsigned=false;fs.writeFileSync(p,JSON.stringify(v,null,2));"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git add package-lock.json
git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
  git commit -m 'Lock dependencies verified by Windows build'
  git push origin HEAD:main
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
$version = node -p "require('./package.json').version"
$sha = git rev-parse HEAD
$files = @(Get-ChildItem dist/*Setup.exe | ForEach-Object { $_.FullName }) + @('dist/SHA256SUMS.txt','dist/verification.json','dist/signatures.json')
gh release create "v$version" @files --target $sha --title "Business Calfin $version - Windows x64" --notes 'MIT local-first pricing tool. Windows signatures and signing timestamps verified for installer and application; see signatures.json. SmartScreen can still warn based on reputation. Financial, browser, packaged startup, installation and uninstall checks passed on Windows Server 2022 CI. Report printouts include the local device time, timezone and UTC timestamp, not a certified financial attestation. See verification.json and SHA256SUMS.txt. Not a manual compatibility test on every Windows 10/11 device. No private company data included; no financial or tax guarantees.'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
