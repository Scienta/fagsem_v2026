# Eksperimentlogg

Bruk denne filen til korte notater underveis i eksperimentet.

## Oppstart

- Dato: 2026-04-23
- Oppgave: Legge til navn på Scienta-konsulenter i gruppeinndelingen (README.MD)
- Handling: 43 konsulenter fordelt alfabetisk på gr1–gr12 (~3–4 per gruppe, 7 grupper à 4 og 5 grupper à 3)
- Resultat: README.MD oppdatert med navn i alle 12 grupper

---

- Gruppe: 1.5
- Tema: 1 – Utvikler + agent i praksis
- Eksperiment: 3 – Feedback-loop vs. én stor bestilling
- Dato: 2026-04-24
- Deltakere: Julian Jark, Filip, Erlend Kraft
- Verktøy/modeller: Claude Code, Opus 4.7 (1M context)
- Repo / case: BlackJack, implementert i `eksperimenter/gruppe1.5/variant-a` og `variant-b`

**Hypotese:** En iterativ feedback-loop gir bedre resultat enn å gi én stor bestilling og vente på ferdig svar.

**Oppsett:**
- Variant A: én stor instruksjon, minimalt med inngripen (kjøres først for å unngå "smitte" fra læring i B)
- Variant B: flere korte iterasjoner med tilbakemelding underveis
- Samme case (BlackJack) i begge for å muliggjøre sammenligning

---

## Løpende logg

### Oppføring – Variant A start

- Tidspunkt: 2026-04-24 14:16
- Hva ble testet: Én stor bestilling til agenten for å implementere BlackJack
- Betingelse / variant: A – én stor instruksjon, minimalt inngripen
- Bestilling: Detaljert spec (terminal-basert Blackjack i TypeScript, Node 23.6+ native TS, ingen eksterne deps, type-stripping-kompatibel, `node:readline/promises`, full runde fra utdeling til resultat, h/s-meny, ess-logikk, dealer 17-regel, rent Ctrl+C-exit)
- Resultat / observasjon: (fylles inn etter kjøring)
- Måling / eksempel:
- Tolkning / usikkerhet:

---

### Oppføring – Variant A resultat

- Tidspunkt: 2026-04-24 14:18 (ca. 2 min fra bestilling til ferdig kode)
- Hva ble testet: Leveranse på én stor bestilling uten inngripen
- Betingelse / variant: A
- Resultat / observasjon:
  - Agent leverte `eksperimenter/gruppe1.5/variant-a/blackjack.ts` på ett forsøk, ingen oppfølgingsspørsmål
  - Syntaks validert med `node --experimental-strip-types --check` → OK
  - Funksjonell kjøring med `node blackjack.ts` krever Node 23.6+ (lokalt miljø har v22.12; ikke testet ende-til-ende her)
  - Implementert: 52-kort-stokk, stokking (Fisher–Yates), hit/stand-meny med input-validering, ess-logikk (11→1 ved bust), dealer 17-regel, blackjack-sjekk på to kort (slår vanlig 21), Ctrl+C-håndtering via SIGINT
- Måling / eksempel:
  - Filstørrelse: én fil, ~160 linjer
  - Antall inngripener fra team: 0
- Tolkning / usikkerhet:
  - Ikke kjørt interaktivt i denne økten – teamet må verifisere spillflyt lokalt
  - Spec var detaljert; gjenstår å se om det er edge-cases (f.eks. 21 på flere enn 2 kort, tom kortstokk) som ikke ble dekket uten feedback

---

### Oppføring – Variant B start

- Tidspunkt:
- Hva ble testet:
- Betingelse / variant: B – iterativ feedback-loop
- Resultat / observasjon:
- Måling / eksempel:
- Tolkning / usikkerhet:

---

### Oppføring – Variant B resultat

- Tidspunkt:
- Hva ble testet:
- Betingelse / variant: B
- Resultat / observasjon:
- Måling / eksempel:
- Tolkning / usikkerhet:
