<#
  Creates budgy.lnk next to this script, pointing at the built exe — the same
  shortcut-in-the-repo-root pattern WolfStone Next uses.

    .\make-shortcut.ps1              # repo root only
    .\make-shortcut.ps1 -Desktop     # also on the Desktop
    .\make-shortcut.ps1 -StartMenu   # also in the Start Menu

  Run build.bat first; the shortcut points at the release exe.
#>
param(
  [switch] $Desktop,
  [switch] $StartMenu
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$exe = Join-Path $root 'src-tauri\target\release\budgy.exe'

if (-not (Test-Path $exe)) {
  Write-Host ""
  Write-Host "לא נמצא $exe" -ForegroundColor Yellow
  Write-Host "הרץ קודם build.bat." -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

$targets = @((Join-Path $root 'budgy.lnk'))
if ($Desktop)   { $targets += Join-Path ([Environment]::GetFolderPath('Desktop')) 'Budgy.lnk' }
if ($StartMenu) { $targets += Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs\Budgy.lnk' }

$shell = New-Object -ComObject WScript.Shell
foreach ($t in $targets) {
  $s = $shell.CreateShortcut($t)
  $s.TargetPath       = $exe
  $s.WorkingDirectory = Split-Path -Parent $exe
  $s.IconLocation     = "$exe,0"
  $s.Description      = 'Budgy — מעקב פיננסי'
  $s.Save()
  Write-Host "✓ $t" -ForegroundColor Green
}
Write-Host ""
