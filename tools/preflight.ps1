# PowerShell preflight script (Windows native)
Param()
$reportFile = "tools/preflight-report.md"
$executed = @()
function Log-Cmd { param($c) ; $script:executed += $c }
function Safe-Run { param($c) ; Log-Cmd $c ; Invoke-Expression $c }

function Check-Version($name, $cmd) {
  try {
    $out = & $cmd 2>&1
    return "${name}: $out"
  } catch {
    return "${name}: not found"
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
  }
}

# Ensure tools folder
New-Item -ItemType Directory -Path tools -Force | Out-Null

$versions = @()
$versions += (Check-Version 'node' 'node -v')
$versions += (Check-Version 'npm' 'npm -v')
$versions += (Check-Version 'git' 'git --version')
$versions += (Check-Version 'supabase' 'supabase --version')
$versions += (Check-Version 'gh' 'gh --version')

# Install via npm: supabase
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  if (Get-Command npm -ErrorAction SilentlyContinue) {
    Safe-Run 'npm install -g @supabase/cli'
  } else { Write-Output 'npm not found; cannot install supabase via npm' }
}

# gh install
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Install-Gh | Out-Null
}

# No interactive logins in preflight; just report current auth status.

# Re-check versions and auth
$versions_final = @()
$versions_final += (Check-Version 'node' 'node -v')
$versions_final += (Check-Version 'npm' 'npm -v')
$versions_final += (Check-Version 'git' 'git --version')
$versions_final += (Check-Version 'supabase' 'supabase --version')
$versions_final += (Check-Version 'gh' 'gh --version')

$supa_status = Check-Auth 'supabase'
$gh_status = Check-Auth 'gh'

# Write report
@("# Preflight Report", "Generated: $(Get-Date -Format u)", "", '## Versions') +
  $versions_final +
  "", '## Authentication Status',
  "- supabase: $supa_status",
  "- gh: $gh_status",
  "- Vercel deploy via GitHub: Vercel CLI não é necessária.",
  "", '## Commands Executed (no tokens/secrets)' | Out-File -FilePath $reportFile -Encoding utf8

foreach ($c in $executed) { "- $c" | Out-File -FilePath $reportFile -Append -Encoding utf8 }

Write-Output "Preflight finished. Report written to $reportFile"
