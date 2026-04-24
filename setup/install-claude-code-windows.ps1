$ErrorActionPreference = "Stop"

function Write-Info($Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-WarnMsg($Message) {
    Write-Host ""
    Write-Host "[OBS] $Message" -ForegroundColor Yellow
}

function Read-Secret($Prompt) {
    $secure = Read-Host $Prompt -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        if ($bstr -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
        }
    }
}

function Add-GitToCurrentPath {
    $gitCmdDir = "C:\Program Files\Git\cmd"
    $gitBinDir = "C:\Program Files\Git\bin"

    if (Test-Path (Join-Path $gitCmdDir "git.exe")) {
        if (-not ($env:PATH -split ';' | Where-Object { $_ -eq $gitCmdDir })) {
            $env:PATH = "$gitCmdDir;$env:PATH"
        }
    }

    if (Test-Path (Join-Path $gitBinDir "bash.exe")) {
        if (-not ($env:PATH -split ';' | Where-Object { $_ -eq $gitBinDir })) {
            $env:PATH = "$gitBinDir;$env:PATH"
        }
    }
}

function Ensure-GitForWindows {
    Add-GitToCurrentPath

    if (Get-Command git.exe -ErrorAction SilentlyContinue) {
        return
    }

    Write-WarnMsg "Git for Windows ser ikke ut til å være installert. Claude Code native install på Windows trenger Git for Windows."

    if (Get-Command winget.exe -ErrorAction SilentlyContinue) {
        $installGit = Read-Host "Vil du installere Git for Windows med winget? [y/N]"
        if ($installGit -match '^(y|yes)$') {
            winget install --id Git.Git --exact --source winget
            Add-GitToCurrentPath

            if (-not (Get-Command git.exe -ErrorAction SilentlyContinue)) {
                throw "Git ble installert, men er ikke tilgjengelig i denne terminalen ennå. Start PowerShell på nytt og kjør skriptet igjen."
            }
        }
        else {
            throw "Avbrutt. Installer Git for Windows og kjør skriptet på nytt."
        }
    }
    else {
        throw "Fant ikke winget. Installer Git for Windows manuelt fra https://git-scm.com/download/win eller bruk WSL, og kjør skriptet på nytt."
    }
}

Write-Info "Sjekker Git for Windows"
Ensure-GitForWindows

Write-Info "Installerer Claude Code via offisiell Windows-installasjon"

if (Get-Command claude -ErrorAction SilentlyContinue) {
    claude --version
}
else {
    irm https://claude.ai/install.ps1 | iex
}

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    throw "Fant ikke 'claude' etter installasjon."
}

Write-Info "Claude Code er tilgjengelig"
claude --version

$shouldSetKey = Read-Host "Vil du lagre ANTHROPIC_API_KEY som bruker-miljøvariabel? [y/N]"

if ($shouldSetKey -match '^(y|yes)$') {
    $apiKey = Read-Secret "Lim inn ANTHROPIC_API_KEY"

    if ([string]::IsNullOrWhiteSpace($apiKey)) {
        Write-WarnMsg "Ingen API-nokkel oppgitt. Hopper over lagring."
    }
    else {
        [Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", $apiKey, "User")
        $env:ANTHROPIC_API_KEY = $apiKey

        Write-Info "Lagret ANTHROPIC_API_KEY som bruker-miljøvariabel"
        Write-Host "Nøkkelen er lagret utenfor repoet, i brukerprofilen din."
        Write-WarnMsg "ANTHROPIC_API_KEY overstyrer vanlig Claude-login når den er aktiv."
        Write-Host "Start PowerShell på nytt for at variabelen skal være tilgjengelig i nye terminaler."
    }
}
else {
    Write-WarnMsg "API-nøkkel ble ikke lagret. Du kan fortsatt logge inn ved å kjøre 'claude'."
}

Write-Info "Ferdig"
Write-Host "Neste steg:"
Write-Host "1. Gå til prosjektmappen din"
Write-Host "2. Kjør 'claude'"
Write-Host "3. Hvis du bruker API-nøkkel, godkjenn 'Use custom API key' ved behov"
Write-Host ""
Write-WarnMsg "Ikke lagre API-nøkler i filer i dette repoet, for eksempel .env, settings-filer eller notater."
