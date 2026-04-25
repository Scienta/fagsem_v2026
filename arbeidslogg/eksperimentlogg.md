# Eksperimentlogg

Bruk denne filen til korte notater underveis i eksperimentet.

## Oppstart

- Dato: 2026-04-23
- Oppgave: Legge til navn på Scienta-konsulenter i gruppeinndelingen (README.MD)
- Handling: 43 konsulenter fordelt alfabetisk på gr1–gr12 (~3–4 per gruppe, 7 grupper à 4 og 5 grupper à 3)
- Resultat: README.MD oppdatert med navn i alle 12 grupper

---

- Gruppe: 31
- Tema: Tema 4 – Flere parallelle kodeagenter
- Eksperiment: Implementere terminalbasert Snake-spill fra ferdig plan
- Dato: 2026-04-24
- Verktøy/modeller: Claude Code (Sonnet 4.6, skymodell) vs OpenCode (Gemma4, lokal modell)
- Repo / case: SNAKE-PLAN.md i eksperimenter/gruppe31/

---

## Løpende logg

### Oppføring 1 — Oppsett og plangrunnlag

- Tidspunkt: 2026-04-24
- Hva ble testet: Generering av implementasjonsplan for Snake i Java 25
- Betingelse / variant: Forberedelse (felles for begge betingelser)
- Resultat / observasjon: Detaljert plan lagret i SNAKE-PLAN.md — Maven-prosjekt med Lanterna 3 for terminal-UI, JUnit 5 for tester, Java 25-features (records, sealed interfaces, pattern matching)
- Måling / eksempel: Planen dekker model-, engine- og UI-lag, samt fullstendig testplan
- Tolkning / usikkerhet: Planen var veldefinert — begge agenter fikk identisk utgangspunkt

---

### Oppføring 2 — Implementasjon med Claude Code (Sonnet 4.6)

- Tidspunkt: 2026-04-24
- Hva ble testet: Implementasjon av Snake fra SNAKE-PLAN.md med skybasert modell
- Betingelse / variant: A — Claude Code med Sonnet 4.6
- Resultat / observasjon: Kompilerte på første forsøk. Trengte 4 bugfixer for å fungere som forventet. Kom i mål med et spillbart spill.
- Måling / eksempel: Totaltid: 13 minutter
- Tolkning / usikkerhet: Skymodellen fulgte planen tett og produserte kompilerbar kode, men hadde logiske feil som krevde iterasjon. Bugfix nr. 2 introduserte 2 nye feil — de siste 2 av totalt 4 fixes var altså regresjoner fra en tidligere retting

---

### Oppføring 3 — Implementasjon med OpenCode (Gemma4, lokal)

- Tidspunkt: 2026-04-24
- Hva ble testet: Implementasjon av Snake fra SNAKE-PLAN.md med lokal modell
- Betingelse / variant: B — OpenCode med Gemma4
- Resultat / observasjon: Kompilerte ikke på første forsøk. Vedvarende kompileringsfeil og høyt tidsforbruk. Kom ikke i mål — spillet ble ikke spillbart.
- Måling / eksempel: Ukjent totaltid (avbrutt), men vesentlig høyere enn 13 min
- Tolkning / usikkerhet: Lokal modell hadde klart svakere evne til å følge en kompleks, flerlags implementasjonsplan. Usikkert om mer tid ville gitt fungerende resultat.
