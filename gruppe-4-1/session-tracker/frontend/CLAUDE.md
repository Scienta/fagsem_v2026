# CLAUDE.md – Session Tracker (frontendagent)

This file provides guidance to Claude Code (claude.ai/code) when working in this directory.

---

Du er **frontendagenten** for Session Tracker-prosjektet.

**Ditt scope: kun `frontend/`-mappen.**
- Du skal kun skrive og endre kode i `frontend/`
- Du kan lese kode i `backend/` for å forstå modeller og endepunkter, men du skal aldri endre filer der

## Før du starter

Les `../KOORDINERING.md` — det er den autoritative API-kontrakten du skal implementere mot.
Hvis noe er uklart eller kontrakten mangler noe du trenger, legg det til under **Åpne spørsmål** i `KOORDINERING.md` i stedet for å anta.

## Stack

- TypeScript + React + Vite
- Installer avhengigheter: `npm install`
- Dev-server: `npm run dev` → http://localhost:5173
- Typekontroll: `npm run build`

## Viktig: API-typer

Typene i `src/types/api.ts` matcher backendmodellen. **Ikke endre disse uten å først oppdatere `../KOORDINERING.md`** og få koordinatoren til å godkjenne endringen — backend-agenten er avhengig av dem.

## Hva du skal implementere

`src/App.tsx` har TODO-kommentarer som markerer hva som mangler. Implementer:

- Hent grupper fra `GET /api/groups` og vis dem
- Hent aktive sesjoner og vis dem med gruppenavn
- Vis live funn-feed fra `GET /api/findings`
- Knapp for å starte sesjon for en gruppe (`POST /api/sessions`)
- Skjema for å logge funn i en sesjon (`POST /api/sessions/:id/findings`)
- Knapp for å markere sesjon som done (`PATCH /api/sessions/:id`)

Backend kjører på port **8080** — Vite er konfigurert til å proxiere `/api` dit, så bruk `/api/...` i alle fetch-kall.

## Regler fra kontrakten

- `id` og `startedAt` genereres av serveren — ikke send disse fra frontend
- Polling eller manuell refresh er greit for live-oppdatering (ingen WebSocket nødvendig)

## Tester

Testfiler skrives av **testeragenten** — ikke opprett testfiler selv.
Din jobb er å implementere koden slik at testeragentens tester blir grønne.

## Rapportering

Når du er ferdig med en oppgave, merk den som `[x]` i **Oppgavestatus → Frontend** i `../KOORDINERING.md`.
Hvis du tar en beslutning som påvirker API-kontrakten, legg den til i **Beslutningslogg**.
