$env:CALFIN_TEST_HOME = Join-Path $env:GITHUB_WORKSPACE '.test-state/unpacked-user'
$p = Start-Process -FilePath 'dist/win-unpacked/Business Calfin.exe' -ArgumentList '--smoke-test' -Wait -PassThru
if ($p.ExitCode -ne 0) { throw "Packaged startup failed: $($p.ExitCode)" }
$installDir = Join-Path $env:GITHUB_WORKSPACE '.test-state/installed'
$setup = (Get-ChildItem dist/*Setup.exe | Select-Object -First 1).FullName
$p = Start-Process -FilePath $setup -ArgumentList '/S',"/D=$installDir" -Wait -PassThru
if ($p.ExitCode -ne 0) { throw "Installer failed: $($p.ExitCode)" }
$env:CALFIN_TEST_HOME = Join-Path $env:GITHUB_WORKSPACE '.test-state/installed-user'
$p = Start-Process -FilePath (Join-Path $installDir 'Business Calfin.exe') -ArgumentList '--smoke-test' -Wait -PassThru
if ($p.ExitCode -ne 0) { throw "Installed startup failed: $($p.ExitCode)" }
if (!(Test-Path (Join-Path $env:CALFIN_TEST_HOME 'smoke-result.json'))) { throw 'Missing native verification' }
$p = Start-Process -FilePath (Join-Path $installDir 'Uninstall Business Calfin.exe') -ArgumentList '/S' -Wait -PassThru
if ($p.ExitCode -ne 0) { throw "Uninstaller failed: $($p.ExitCode)" }
$deadline = (Get-Date).AddSeconds(30)
while ((Test-Path (Join-Path $installDir 'Business Calfin.exe')) -and ((Get-Date) -lt $deadline)) { Start-Sleep -Milliseconds 500 }
if (Test-Path (Join-Path $installDir 'Business Calfin.exe')) { throw 'Uninstall did not remove the application' }
