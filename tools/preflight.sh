#!/usr/bin/env bash
set -u

REPORT_FILE="tools/preflight-report.md"
EXECUTED_COMMANDS=()

log_cmd() {
  EXECUTED_COMMANDS+=("$*")
}

safe_run() {
  # Run a command; return exit code but don't print potential secrets.
  log_cmd "$*"
  eval "$@"
  return $?
}

detect_os() {
  unameStr=$(uname -s 2>/dev/null || echo Unknown)
  case "$unameStr" in
    Linux*) echo "linux" ;;
    Darwin*) echo "macos" ;;
    MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
    *) echo "unknown" ;;
  esac
}

check_version() {
  name=$1
  cmd=$2
  if command -v ${cmd%% *} >/dev/null 2>&1; then
    ver=$($cmd 2>&1 || true)
    echo "$name: $ver"
  else
    echo "$name: not found"
  fi
}

try_npm_global_install() {
  pkg=$1
  if command -v npm >/dev/null 2>&1; then
    if npm list -g --depth=0 "$pkg" >/dev/null 2>&1; then
      echo "$pkg: already installed (npm global)"
      return 0
    fi
    echo "Installing $pkg globally via npm..."
    if safe_run "npm install -g $pkg"; then
      echo "$pkg: installed"
      return 0
    else
      # try with sudo if available
      if command -v sudo >/dev/null 2>&1; then
        echo "Retrying with sudo for $pkg..."
        if safe_run "sudo npm install -g $pkg"; then
          echo "$pkg: installed with sudo"
          return 0
        fi
      fi
      echo "$pkg: failed to install via npm (see above). Please install manually."
      return 1
    fi
  else
    echo "npm not found; cannot install $pkg via npm"
    return 2
  fi
}

install_gh_cli() {
  os="$1"
  if command -v gh >/dev/null 2>&1; then
    echo "gh: already installed"
    return 0
  fi
  echo "Attempting to install gh (GitHub CLI) for $os..."
  if [ "$os" = "macos" ]; then
    if command -v brew >/dev/null 2>&1; then
      log_cmd "brew install gh"
      brew install gh || return 1
      return 0
    else
      echo "Homebrew not found. Install Homebrew or download gh from https://github.com/cli/cli/releases"
      return 2
    fi
  elif [ "$os" = "linux" ]; then
    if command -v apt-get >/dev/null 2>&1; then
      if command -v sudo >/dev/null 2>&1; then
        log_cmd "sudo apt update && sudo apt install -y gh"
        sudo apt update && sudo apt install -y gh || return 1
        return 0
      else
        echo "No sudo available. You can install gh via: https://github.com/cli/cli#installation or use a manual download."
        return 2
      fi
    elif command -v dnf >/dev/null 2>&1; then
      if command -v sudo >/dev/null 2>&1; then
        log_cmd "sudo dnf install -y gh"
        sudo dnf install -y gh || return 1
        return 0
      else
        echo "No sudo available. Please follow https://github.com/cli/cli#installation"
        return 2
      fi
    else
      echo "Could not detect package manager. See https://github.com/cli/cli#installation"
      return 2
    fi
  elif [ "$os" = "windows" ]; then
    if command -v winget >/dev/null 2>&1; then
      log_cmd "winget install --id GitHub.cli -e --source winget"
      winget install --id GitHub.cli -e --source winget || return 1
      return 0
    elif command -v choco >/dev/null 2>&1; then
      log_cmd "choco install gh -y"
      choco install gh -y || return 1
      return 0
    else
      echo "No winget/choco found. Please install GitHub CLI from https://github.com/cli/cli/releases"
      return 2
    fi
  else
    echo "Unsupported OS for automatic gh install; see https://github.com/cli/cli#installation"
    return 2
  fi
}

check_auth() {
  cli=$1
  case "$cli" in
    supabase)
      if command -v supabase >/dev/null 2>&1; then
        if supabase projects list >/dev/null 2>&1; then
          echo "ok"
        else
          echo "nok"
        fi
      else
        echo "not_installed"
      fi
      ;;
    gh)
      if command -v gh >/dev/null 2>&1; then
        if gh auth status >/dev/null 2>&1; then
          echo "ok"
        else
          echo "nok"
        fi
      else
        echo "not_installed"
      fi
      ;;
    vercel)
      if command -v vercel >/dev/null 2>&1; then
        if vercel whoami >/dev/null 2>&1; then
          echo "ok"
        else
          echo "nok"
        fi
      else
        echo "not_installed"
      fi
      ;;
    *) echo "unknown" ;;
  esac
}

# Main
OS=$(detect_os)
mkdir -p tools

# Gather versions
VERSIONS=()
VERSIONS+=("$(check_version "node" "node -v")")
VERSIONS+=("$(check_version "npm" "npm -v")")
VERSIONS+=("$(check_version "git" "git --version")")
VERSIONS+=("$(check_version "supabase" "supabase --version")")
VERSIONS+=("$(check_version "vercel" "vercel --version")")
VERSIONS+=("$(check_version "gh" "gh --version")")

# Install/Update CLIs
# supabase
if command -v supabase >/dev/null 2>&1; then
  echo "supabase CLI present"
else
  try_npm_global_install "@supabase/cli" || true
fi

# vercel
if command -v vercel >/dev/null 2>&1; then
  echo "vercel CLI present"
else
  try_npm_global_install "vercel" || true
fi

# gh
if command -v gh >/dev/null 2>&1; then
  echo "gh CLI present"
else
  install_gh_cli "$OS" || true
fi

# Run interactive logins if needed
# supabase login
SUPA_STATUS=$(check_auth supabase)
if [ "$SUPA_STATUS" = "nok" ]; then
  echo "supabase: not authenticated — launching 'supabase login' (interactive)"
  log_cmd "supabase login"
  supabase login || echo "supabase login exited with non-zero status"
fi

# gh auth login
GH_STATUS=$(check_auth gh)
if [ "$GH_STATUS" = "nok" ]; then
  echo "gh: not authenticated — launching 'gh auth login' (interactive)"
  log_cmd "gh auth login"
  gh auth login || echo "gh auth login exited with non-zero status"
fi

# vercel login
VERCEL_STATUS=$(check_auth vercel)
if [ "$VERCEL_STATUS" = "nok" ]; then
  echo "vercel: not authenticated — launching 'vercel login' (interactive)"
  log_cmd "vercel login"
  vercel login || echo "vercel login exited with non-zero status"
fi

# Re-check versions and auth statuses
VERSIONS_FINAL=()
VERSIONS_FINAL+=("$(check_version "node" "node -v")")
VERSIONS_FINAL+=("$(check_version "npm" "npm -v")")
VERSIONS_FINAL+=("$(check_version "git" "git --version")")
VERSIONS_FINAL+=("$(check_version "supabase" "supabase --version")")
VERSIONS_FINAL+=("$(check_version "vercel" "vercel --version")")
VERSIONS_FINAL+=("$(check_version "gh" "gh --version")")

SUPA_STATUS_FINAL=$(check_auth supabase)
GH_STATUS_FINAL=$(check_auth gh)
VERCEL_STATUS_FINAL=$(check_auth vercel)

# Write report (without secrets)
{
  echo "# Preflight Report"
  echo "Generated: $(date -u +'%Y-%m-%d %H:%M:%SZ')"
  echo
  echo "## Versions"
  for v in "${VERSIONS_FINAL[@]}"; do
    echo "- $v"
  done
  echo
  echo "## Authentication Status"
  echo "- supabase: $SUPA_STATUS_FINAL"
  echo "- gh: $GH_STATUS_FINAL"
  echo "- vercel: $VERCEL_STATUS_FINAL"
  echo
  echo "## Commands Executed (no tokens/secrets)"
  for c in "${EXECUTED_COMMANDS[@]}"; do
    echo "- $c"
  done
} > "$REPORT_FILE"

# Final note
echo "Preflight finished. Report written to $REPORT_FILE"

exit 0
