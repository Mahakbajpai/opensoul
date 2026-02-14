param(
    [ValidateSet("Debug", "Release")]
    [string]$Configuration = "Release",
    [string]$InstallDir = "$env:LOCALAPPDATA\Programs\OpenSoul",
    [switch]$NoBuild,
    [switch]$NoDesktopShortcut
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$solutionPath = Join-Path $scriptRoot "OpenSoul.sln"
$publishDir = Join-Path $scriptRoot ("src\OpenSoul\bin\{0}\net8.0-windows10.0.19041.0\publish" -f $Configuration)
$exePath = Join-Path $publishDir "OpenSoul.exe"

Write-Host "[install] configuration: $Configuration"
Write-Host "[install] install dir:   $InstallDir"

if (-not $NoBuild) {
    Write-Host "[install] publishing desktop app..."
    dotnet publish $solutionPath -c $Configuration | Out-Host
}

if (-not (Test-Path $exePath)) {
    throw "Published exe not found: $exePath"
}

Write-Host "[install] copying files..."
if (-not (Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

# Mirror publish output into install folder.
robocopy $publishDir $InstallDir /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Host
$rc = $LASTEXITCODE
if ($rc -ge 8) {
    throw "robocopy failed with exit code $rc"
}

$installedExe = Join-Path $InstallDir "OpenSoul.exe"
if (-not (Test-Path $installedExe)) {
    throw "Installed exe not found: $installedExe"
}

$programsDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs"
$startMenuDir = Join-Path $programsDir "OpenSoul"
if (-not (Test-Path $startMenuDir)) {
    New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null
}

$wsh = New-Object -ComObject WScript.Shell

$startShortcut = Join-Path $startMenuDir "OpenSoul.lnk"
$startLink = $wsh.CreateShortcut($startShortcut)
$startLink.TargetPath = $installedExe
$startLink.WorkingDirectory = $InstallDir
$startLink.IconLocation = "$installedExe,0"
$startLink.Description = "OpenSoul Desktop"
$startLink.Save()

if (-not $NoDesktopShortcut) {
    $desktopDir = [Environment]::GetFolderPath("Desktop")
    $desktopShortcut = Join-Path $desktopDir "OpenSoul.lnk"
    $desktopLink = $wsh.CreateShortcut($desktopShortcut)
    $desktopLink.TargetPath = $installedExe
    $desktopLink.WorkingDirectory = $InstallDir
    $desktopLink.IconLocation = "$installedExe,0"
    $desktopLink.Description = "OpenSoul Desktop"
    $desktopLink.Save()
}

# Probe launch once to verify installed binary starts.
Write-Host "[install] probing launch..."
$proc = Start-Process -FilePath $installedExe -WorkingDirectory $InstallDir -PassThru
Start-Sleep -Seconds 6
if ($proc.HasExited) {
    Write-Warning "OpenSoul exited during launch probe (exit code: $($proc.ExitCode))."
} else {
    Stop-Process -Id $proc.Id -Force
    Write-Host "[install] launch probe passed"
}

Write-Host "[install] done"
Write-Host "[install] exe: $installedExe"
Write-Host "[install] start menu: $startShortcut"
if (-not $NoDesktopShortcut) {
    Write-Host "[install] desktop: $([Environment]::GetFolderPath("Desktop"))\\OpenSoul.lnk"
}
