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
$files = @(Get-ChildItem dist/*Setup.exe | ForEach-Object { $_.FullName }) + @('dist/SHA256SUMS.txt','dist/verification.json')
gh release create "v$version" @files --target $sha --title "Business Calfin $version - Windows x64" --notes 'MIT local-first pricing tool. Unsigned Windows x64 installer. Financial, browser, packaged startup, silent installation and uninstall checks passed on Windows Server 2022 CI. See verification.json and SHA256SUMS.txt. Not a manual compatibility test on every Windows 10/11 device. No private company data included; no financial or tax guarantees.'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
