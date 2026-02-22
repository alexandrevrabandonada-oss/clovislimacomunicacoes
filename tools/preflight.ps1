# PowerShell preflight script (Windows native)
Param()
$reportFile = "tools/preflight-report.md"
$executed = @()
function Log-Cmd { param($c) ; $script:executed += $c }
function Safe-Run { param($c) ; Log-Cmd $c ; Invoke-Expression $c }

function Check-Version($name, $cmd) {
  try {
    $out = & $cmd 2>&1
    return "$name: $out"
  } catch {
    return "$name: not found"
  }
}

function Install-Gh {
  if (Get-Command gh -ErrorAction SilentlyContinue) { Write-Output "gh: already installed"; return 0 }
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    Log-Cmd "winget install --id GitHub.cli -e --source winget"
    winget install --id GitHub.cli -e --source winget
    return $LASTEXITCODE
  } elseif (Get-Command choco -ErrorAction SilentlyContinue) {
    Log-Cmd "choco install gh -y"
    choco install gh -y
    return $LASTEXITCODE
  } else {
    Write-Output "No winget/choco found. Please install gh from https://github.com/cli/cli/releases"
    return 2
  }
}

function Check-Auth($cli) {
  switch ($cli) {
    'supabase' {
      if (Get-Command supabase -ErrorAction SilentlyContinue) {
        try { supabase projects list >/dev/null 2>&1 ; if ($LASTEXITCODE -eq 0) { 'ok' } else { 'nok' } } catch { 'nok' }
      } else { 'not_installed' }
    }
    'gh' {
      if (Get-Command gh -ErrorAction SilentlyContinue) {
        try { gh auth status >/dev/null 2>&1 ; if ($LASTEXITCODE -eq 0) { 'ok' } else { 'nok' } } catch { 'nok' }
      } else { 'not_installed' }
    }
    'vercel' {
      if (Get-Command vercel -ErrorAction SilentlyContinue) {
        try { vercel whoami >/dev/null 2>&1 ; if ($LASTEXITCODE -eq 0) { 'ok' } else { 'nok' } } catch { 'nok' }
      } else { 'not_installed' }
    }
  }
}

# Ensure tools folder
New-Item -ItemType Directory -Path tools -Force | Out-Null

$versions = @()
$versions += (Check-Version 'node' 'node -v')
$versions += (Check-Version 'npm' 'npm -v')
$versions += (Check-Version 'git' 'git --version')
$versions += (Check-Version 'supabase' 'supabase --version')
$versions += (Check-Version 'vercel' 'vercel --version')
$versions += (Check-Version 'gh' 'gh --version')

# Install via npm: supabase and vercel
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    Safe-Run 'npm install -g @supabase/cli'
  } else { Write-Output 'npm not found; cannot install supabase via npm' }
}
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    Safe-Run 'npm install -g vercel'
  } else { Write-Output 'npm not found; cannot install vercel via npm' }
}

# gh install
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Install-Gh | Out-Null
}

# Interactive logins if needed
if ((Check-Auth 'supabase') -eq 'nok') {
  Write-Output "supabase: not authenticated — launching 'supabase login' (interactive)"
  Log-Cmd 'supabase login'
  try { supabase login } catch { Write-Output 'supabase login exited with non-zero status' }
}
if ((Check-Auth 'gh') -eq 'nok') {
  Write-Output "gh: not authenticated — launching 'gh auth login' (interactive)"
  Log-Cmd 'gh auth login'
  try { gh auth login } catch { Write-Output 'gh auth login exited with non-zero status' }
}
if ((Check-Auth 'vercel') -eq 'nok') {
  Write-Output "vercel: not authenticated — launching 'vercel login' (interactive)"
  Log-Cmd 'vercel login'
  try { vercel login } catch { Write-Output 'vercel login exited with non-zero status' }
}

# Re-check versions and auth
$versions_final = @()
$versions_final += (Check-Version 'node' 'node -v')
$versions_final += (Check-Version 'npm' 'npm -v')
$versions_final += (Check-Version 'git' 'git --version')
$versions_final += (Check-Version 'supabase' 'supabase --version')
$versions_final += (Check-Version 'vercel' 'vercel --version')
$versions_final += (Check-Version 'gh' 'gh --version')

$supa_status = Check-Auth 'supabase'
$gh_status = Check-Auth 'gh'
$vercel_status = Check-Auth 'vercel'

# Write report
@("# Preflight Report", "Generated: $(Get-Date -Format u)", "", '## Versions') +
  $versions_final +
  "", '## Authentication Status',
  "- supabase: $supa_status",
  "- gh: $gh_status",
  "- vercel: $vercel_status",
  "", '## Commands Executed (no tokens/secrets)' | Out-File -FilePath $reportFile -Encoding utf8

foreach ($c in $executed) { "- $c" | Out-File -FilePath $reportFile -Append -Encoding utf8 }

Write-Output "Preflight finished. Report written to $reportFile"
