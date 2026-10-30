[CmdletBinding()]
param([string]$EnvFile = ".env", [string]$HealthUrl = "")
$ErrorActionPreference = "Stop"
function Stop-WithMessage([string]$Message) { Write-Error $Message; exit 1 }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Stop-WithMessage "Node.js 22 is required." }
$nodeVersion = (& node -p "process.versions.node").Trim()
if (-not $nodeVersion.StartsWith("22.")) { Stop-WithMessage "Node.js 22 is required; detected $nodeVersion." }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Stop-WithMessage "npm was not found." }
if (-not (Test-Path $EnvFile)) { Stop-WithMessage "Local .env file not found. Copy .env.example to .env and fill values locally." }
$gitignore = if (Test-Path ".gitignore") { Get-Content ".gitignore" -Raw } else { "" }
if ($gitignore -notmatch '(?m)^\.env$') { Add-Content ".gitignore" ".env" }
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) { npm install --global @railway/cli; if ($LASTEXITCODE -ne 0) { Stop-WithMessage "Railway CLI installation failed." } }
railway login
if ($LASTEXITCODE -ne 0) { Stop-WithMessage "Railway login failed." }
railway link
if ($LASTEXITCODE -ne 0) { Stop-WithMessage "Railway project linking failed." }
$allowed = @("GEMINI_API_KEY","GEMINI_MODEL","ANTHROPIC_API_KEY","ANTHROPIC_MODEL","GOOGLE_CLOUD_PROJECT","GOOGLE_CLOUD_LOCATION","VERTEX_MODEL","APP_URL","RESEND_API_KEY","RESEND_FROM_EMAIL","INQUIRY_TO_EMAIL","ADMIN_USERNAME","ADMIN_EMAIL","ADMIN_PASSWORD","CASHFREE_APP_ID","CASHFREE_SECRET_KEY","CASHFREE_ENV","NAVIGALEX_DATA_DIR","MSMED_BANK_RATE")
$values = @{}
foreach ($line in Get-Content $EnvFile) {
  if ($line -match '^\s*#' -or $line -notmatch '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') { continue }
  $key = $Matches[1]; $value = $Matches[2].Trim()
  if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'")))) { $value = $value.Substring(1,$value.Length-2) }
  if ($allowed -contains $key -and $value) { $values[$key] = $value }
}
foreach ($key in $allowed) {
  if (-not $values.ContainsKey($key)) { Write-Warning "Missing $key in .env; it will not be changed."; continue }
  $values[$key] | railway variable set $key --stdin
  if ($LASTEXITCODE -ne 0) { Stop-WithMessage "Setting Railway variable failed for $key. Value not printed." }
  Write-Host "Set Railway variable: $key"
}
Write-Host "MANUAL: Attach a Railway volume and set NAVIGALEX_DATA_DIR to its mount path."
npm run ci
if ($LASTEXITCODE -ne 0) { Stop-WithMessage "npm run ci failed; deployment stopped." }
railway up
if ($LASTEXITCODE -ne 0) { Stop-WithMessage "railway up failed." }
if (-not $HealthUrl -and $values.ContainsKey("APP_URL")) { $HealthUrl = $values["APP_URL"] }
if (-not $HealthUrl) { Write-Warning "Deployment submitted. Pass -HealthUrl https://your-domain to verify /api/health."; exit 0 }
if ($HealthUrl -notmatch '^https?://') { $HealthUrl = "https://$HealthUrl" }
$health = $HealthUrl.TrimEnd('/') + "/api/health"
try { $response = Invoke-RestMethod -Uri $health -TimeoutSec 20; if (-not $response.success) { Stop-WithMessage "Health endpoint did not report success." }; Write-Host "Health check passed: $health" }
catch { Stop-WithMessage "Health check failed. Check Railway deployment logs." }
