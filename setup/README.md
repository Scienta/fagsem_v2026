# Oppsett av Claude Code

Disse skriptene installerer Claude Code CLI og kan i tillegg lagre `ANTHROPIC_API_KEY`.
Nokkelen lagres utenfor repoet:
- pa macOS i shell-profilen i hjemmekatalogen, for eksempel `~/.zshrc`
- pa Windows som bruker-miljovariabel

Ikke legg API-nokler i filer i dette repoet.

## macOS

Kjor:

```bash
bash setup/install-claude-code-macos.sh
```

## Windows PowerShell

Kjor:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup\install-claude-code-windows.ps1
```

Windows-skriptet sjekker om Git for Windows finnes.
Hvis det mangler, tilbyr skriptet a installere det med `winget`.

Hvis maskinen ikke har `winget`, kan deltakeren enten:
- installere Git for Windows manuelt fra `https://git-scm.com/download/win`
- bruke WSL i stedet, siden Claude Code docs oppgir at WSL ikke trenger Git for Windows

## Viktig om API-nokkel

Hvis `ANTHROPIC_API_KEY` er satt, vil Claude Code bruke den i stedet for vanlig Claude-login.

Hvis du heller vil bruke Claude-abonnement og browser-login, lar du API-nokkelen vare tom og kjorer bare:

```bash
claude
```

Offisiell dokumentasjon:
- https://code.claude.com/docs/en/quickstart
- https://code.claude.com/docs/en/authentication
- https://code.claude.com/docs/en/env-vars
