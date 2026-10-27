$ErrorActionPreference = 'Stop'
# This validates real Windows trust. It never installs certificates or changes OS protection.
if ([string]::IsNullOrWhiteSpace($env:CALFIN_EXPECTED_SIGNER)) {
  throw 'Set CALFIN_EXPECTED_SIGNER to the verified publisher certificate subject before release.'
}
$installer = @(Get-ChildItem "$PSScriptRoot/../dist/*Setup.exe")
if ($installer.Count -ne 1) { throw 'Exactly one installer is required.' }
$targets = @($installer[0].FullName, (Join-Path $PSScriptRoot '../dist/win-unpacked/Business Calfin.exe'))
$records = @()
foreach ($file in $targets) {
  $signature = Get-AuthenticodeSignature -LiteralPath $file
  if ($signature.Status -ne 'Valid') { throw "Windows does not validate the signature: $file ($($signature.Status))" }
  if ($signature.SignerCertificate.Subject -ne $env:CALFIN_EXPECTED_SIGNER) { throw "Unexpected publisher: $file" }
  if ($null -eq $signature.TimeStamperCertificate) { throw "A trusted signing timestamp is required: $file" }
  $records += [ordered]@{
    file = [IO.Path]::GetFileName($file)
    status = [string]$signature.Status
    publisher = $signature.SignerCertificate.Subject
    issuer = $signature.SignerCertificate.Issuer
    certificateThumbprint = $signature.SignerCertificate.Thumbprint
    timestampAuthority = $signature.TimeStamperCertificate.Subject
    sha256 = (Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash.ToLowerInvariant()
  }
}
$proof = [ordered]@{ verifiedAtUtc = (Get-Date).ToUniversalTime().ToString('o'); files = $records; smartScreenClearanceGuaranteed = $false }
$proof | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath "$PSScriptRoot/../dist/signatures.json" -Encoding utf8
