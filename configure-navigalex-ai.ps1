$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Read the credentials JSON you downloaded and set Railway variables.
$config = Get-Content ".\navigalex-ai-credentials.json" -Raw | ConvertFrom-Json

if ($config.providers.ANTHROPIC_API_KEY) {
  railway variables --set "ANTHROPIC_API_KEY=$($config.providers.ANTHROPIC_API_KEY.row[-1])"
}
if ($config.providers.GEMINI_API_KEY) {
  railway variables --set "GEMINI_API_KEY=$($config.providers.GEMINI_API_KEY.row[-1])"
}

railway up --detach
railway variables
