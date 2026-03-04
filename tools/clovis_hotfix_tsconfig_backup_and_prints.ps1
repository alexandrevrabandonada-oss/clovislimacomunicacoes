param([switch]$NoVerify)
$ErrorActionPreference = "Stop"
function EnsureDir([string]$p){ if(-not (Test-Path $p)){ New-Item -ItemType Directory -Force -Path $p | Out-Null } }
function ReadUtf8([string]$p){ Get-Content -Raw -Encoding UTF8 $p }
function WriteUtf8NoBom([string]$p,[string]$t){ $utf8=New-Object System.Text.UTF8Encoding($false); [IO.File]::WriteAllText($p,$t,$utf8) }
function BackupText([string]$src,[string]$dstDir,[string]$name){ EnsureDir $dstDir; Copy-Item -Force $src (Join-Path $dstDir $name) }
function Info([string]$m){ Write-Host $m }
function Fail([string]$m){ throw $m }

if(-not (Test-Path "package.json")){ Fail "Rode na raiz do projeto (onde tem package.json)." }
$ts = Get-Date -Format "yyyyMMdd-HHmmss"

# 0) Hotfix: impedir TS/Next de typecheckar backups em tools/_patch_backup
$tsconfig = "tsconfig.json"
if(Test-Path $tsconfig){
  $raw = ReadUtf8 $tsconfig
  $bdir = Join-Path "tools/_patch_backup" ("tsconfig-hotfix-" + $ts)
  EnsureDir $bdir
  BackupText $tsconfig $bdir "tsconfig.json.bak"

  $need1 = "tools/_patch_backup/**"
  $need2 = "tools/**"

  if($raw -match "\"exclude\"\\s*:\\s*\\["){
    if($raw -notmatch [regex]::Escape($need1) -or $raw -notmatch [regex]::Escape($need2)){
      $m = [regex]::Match($raw, "(\"exclude\"\\s*:\\s*\\[)([\\s\\S]*?)(\\])")
      if(-not $m.Success){ Fail "tsconfig: falha ao localizar bloco exclude." }
      $inside = $m.Groups[2].Value
      $insTrim = $inside.Trim()
      $hasAny = ($insTrim.Length -gt 0)
      $suffix = $m.Groups[3].Value

      $add = @()
      if($raw -notmatch [regex]::Escape($need1)){ $add += ("\"" + $need1 + "\"") }
      if($raw -notmatch [regex]::Escape($need2)){ $add += ("\"" + $need2 + "\"") }

      if($add.Count -gt 0){
        $sep = ""
        if($hasAny -and ($insTrim -notmatch ",\\s*$")){ $sep = "," }
        $newInside = $inside
        if($hasAny){
          $newInside = $inside.TrimEnd() + $sep + "`n  " + ($add -join ",`n  ") + "`n"
        } else {
          $newInside = "`n  " + ($add -join ",`n  ") + "`n"
        }
        $raw2 = $raw.Substring(0,$m.Index) + $m.Groups[1].Value + $newInside + $suffix + $raw.Substring($m.Index + $m.Length)
        WriteUtf8NoBom $tsconfig $raw2
        Info "tsconfig: exclude atualizado (tools/_patch_backup + tools)."
      } else { Info "tsconfig: exclude já contém entradas necessárias." }
    } else { Info "tsconfig: exclude já OK." }
  } else {
    # cria exclude novo no final do json (simples e seguro)
    $insert = "`n  ,""exclude"": [`n    ""tools/_patch_backup/**"",`n    ""tools/**""`n  ]`n"
    $raw2 = [regex]::Replace($raw, "}\s*$", $insert + "}`n", 1)
    WriteUtf8NoBom $tsconfig $raw2
    Info "tsconfig: exclude criado (tools/_patch_backup + tools)."
  }
} else { Info "tsconfig.json não encontrado — pulando hotfix tsconfig." }

# 1) Renomear backups TS/JS dentro de tools/_patch_backup para .bak (cinto+alça)
if(Test-Path "tools/_patch_backup"){
  $files = Get-ChildItem "tools/_patch_backup" -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx -ErrorAction SilentlyContinue
  foreach($f in $files){
    if($f.FullName -notmatch "\.bak$"){
      Rename-Item -Force $f.FullName ($f.FullName + ".bak")
    }
  }
  if($files.Count -gt 0){ Info ("Backups renomeados para .bak: " + $files.Count) } else { Info "Nenhum backup .ts/.tsx/.js/.jsx encontrado para renomear." }
}

# 2) Patch PrintsTeaser: normalizar wrapper para não sobrepor a galeria
$printsPath = "src/components/PrintsTeaser.tsx"
if(Test-Path $printsPath){
  $praw = ReadUtf8 $printsPath
  $bdir2 = Join-Path "tools/_patch_backup" ("prints-hotfix-" + $ts)
  EnsureDir $bdir2
  BackupText $printsPath $bdir2 "PrintsTeaser.tsx.bak"

  $root = [regex]::Match($praw, "return\\s*\\(\\s*<(?<tag>section|div|main)\\b(?<attrs>[^>]*)>", "Singleline")
  if($root.Success){
    $full = $root.Value
    $attrs = $root.Groups["attrs"].Value

    function NormalizeClasses([string]$cls){
      $t = $cls -split "\\s+" | Where-Object { $_ -and $_.Trim().Length -gt 0 }
      $t = $t | Where-Object {
        ($_ -notmatch "(^|:)absolute$") -and
        ($_ -notmatch "(^|:)sticky$") -and
        ($_ -notmatch "(^|:)top-") -and
        ($_ -notmatch "(^|:)-top-") -and
        ($_ -notmatch "(^|:)-mt-") -and
        ($_ -notmatch "(^|:)z-\\d+$") -and
        ($_ -notmatch "(^|:)z-\\[")
      }
      if($t -notcontains "relative"){ $t = @("relative") + $t }
      if($t -notcontains "z-0"){ $t += "z-0" }
      if($t -notcontains "mt-10"){ $t += "mt-10" }
      if($t -notcontains "md:mt-14"){ $t += "md:mt-14" }
      return ($t -join " ")
    }

    $newFull = $full
    if($full -match "className\\s*=\\s*\\{\\s*cn\\(\\s*\"([^\"]*)\""){
      $old = $Matches[1]
      $new = NormalizeClasses $old
      $newFull = [regex]::Replace($newFull, "className\\s*=\\s*\\{\\s*cn\\(\\s*\"([^\"]*)\"", ("className={cn(\"" + $new + "\"")), 1)
      Info "PrintsTeaser: className via cn() ajustado."
    } elseif($full -match "className\\s*=\\s*\"([^\"]*)\""){
      $old = $Matches[1]
      $new = NormalizeClasses $old
      $newFull = [regex]::Replace($newFull, "className\\s*=\\s*\"([^\"]*)\"", ("className=\"" + $new + "\""), 1)
      Info "PrintsTeaser: className literal ajustado."
    } elseif($full -match "className\\s*=\\s*\\{\\s*`([^`]*)`\\s*\\}"){
      $old = $Matches[1]
      $new = NormalizeClasses $old
      $newFull = [regex]::Replace($newFull, "className\\s*=\\s*\\{\\s*`([^`]*)`\\s*\\}", ("className={`" + $new + "`}"), 1)
      Info "PrintsTeaser: className template ajustado."
    } else {
      # sem className no wrapper: adiciona
      $newFull = $full.TrimEnd(">") + " className=\"" + (NormalizeClasses "") + "\">"
      Info "PrintsTeaser: wrapper sem className — adicionado."
    }

    if($newFull -ne $full){
      $praw2 = $praw.Substring(0, $root.Index) + $newFull + $praw.Substring($root.Index + $root.Length)
      WriteUtf8NoBom $printsPath $praw2
      Info "PrintsTeaser: wrapper normalizado (sem overlay)."
    } else { Info "PrintsTeaser: nada para alterar no wrapper." }
  } else { Info "PrintsTeaser: não achei wrapper após return(...). Pulando." }
} else { Info "PrintsTeaser.tsx não encontrado — pulando." }

# 3) Verify
if(-not $NoVerify){
  Info "Rodando npm run lint + npm run build..."
  npm run lint
  npm run build
}

Info ""
Info "✅ Hotfix aplicado."
