# Eksperimentlogg

Bruk denne filen til korte notater underveis i eksperimentet.

## Oppstart

- Dato: 2026-04-23
- Oppgave: Legge til navn på Scienta-konsulenter i gruppeinndelingen (README.MD)
- Handling: 43 konsulenter fordelt alfabetisk på gr1–gr12 (~3–4 per gruppe, 7 grupper à 4 og 5 grupper à 3)
- Resultat: README.MD oppdatert med navn i alle 12 grupper

---

- Gruppe:
- Tema:
- Eksperiment:
- Dato:
- Deltakere:
- Verktøy/modeller:
- Repo / case:

---

## Løpende logg

### Oppføring – gruppe-4-1, frontend-implementasjon

- Tidspunkt: 2026-04-24
- Hva ble testet: Parallell multi-agent utvikling — frontendagent implementerer React-UI mens backendagent arbeider i parallell
- Betingelse / variant: Frontendagent (Claude Sonnet 4.6) med eksisterende scaffold (App.tsx med TODOs, typer i api.ts)
- Resultat / observasjon:
  - Opprettet `src/api.ts` med typesikre API-kall for alle endepunkter
  - Implementert `src/App.tsx` med full funksjonalitet: grupper, sesjoner, funn-logging, live feed (polling 5s)
  - Avdekket manglende `GET /sessions`-endepunkt i API-kontrakten — løst med lokal state som workaround
  - Flagget åpent spørsmål i KOORDINERING.md for koordinatoragenten
- Måling / eksempel: All frontend-funksjonalitet implementert i 2 filer (~120 linjer App.tsx, ~35 linjer api.ts)
- Tolkning / usikkerhet:
  - Lokal session-state betyr at refreshing taper sesjoner — avhenger av at backend legger til `GET /sessions`
  - Interessant funn: API-kontrakten var ufullstendig (manglende GET /sessions) — ble oppdaget ved implementering, ikke ved planlegging
