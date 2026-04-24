# Oppsett av Claude Code

Disse skriptene installerer Claude Code CLI og kan i tillegg lagre `ANTHROPIC_API_KEY`.
Nøkkelen lagres utenfor repoet:
- på macOS i shell-profilen i hjemmekatalogen, for eksempel `~/.zshrc`
- på Windows som bruker-miljøvariabel

Ikke legg API-nøkler i filer i dette repoet.

## macOS

Kjør:

```bash
bash setup/install-claude-code-macos.sh
```

## Windows PowerShell

Kjør:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup\install-claude-code-windows.ps1
```

Windows-skriptet sjekker om Git for Windows finnes.
Hvis det mangler, tilbyr skriptet å installere det med `winget`.

Hvis maskinen ikke har `winget`, kan deltakeren enten:
- installere Git for Windows manuelt fra `https://git-scm.com/download/win`
- bruke WSL i stedet, siden Claude Code docs oppgir at WSL ikke trenger Git for Windows

## Viktig om API-nøkkel

Hvis `ANTHROPIC_API_KEY` er satt, vil Claude Code bruke den i stedet for vanlig Claude-login.

Hvis du heller vil bruke Claude-abonnement og browser-login, lar du API-nøkkelen være tom og kjører bare:

```bash
claude
```

Offisiell dokumentasjon:
- https://code.claude.com/docs/en/quickstart
- https://code.claude.com/docs/en/authentication
- https://code.claude.com/docs/en/env-vars
