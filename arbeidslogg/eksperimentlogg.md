# Eksperimentlogg

Bruk denne filen til korte notater underveis i eksperimentet.

## Oppstart

- Dato: 2026-04-24
- Oppgave: Lag en kokebok web applikasjon 
- Handling: 
- Resultat: Front- og backend applikasjoner

---

- Gruppe: 2.2
- Tema: kokebok
- Eksperiment: Spesifiser den innledende prompten
- Dato: 2026-04-24
- Deltakere: Jan-Erik, Steinar og Espen S
- Verktøy/modeller: Claude
- Repo / case:

---


## Løpende logg

### Oppføring

- Tidspunkt: 14:15
- Hva ble testet: Feeder kravspekk til Claude - genererer app
- Betingelse / variant: Uten plan
- Resultat / observasjon: Claude genererte komplett kodebase (74 filer) i én sekvens uten steg-for-steg-bekreftelser
- Måling / eksempel: Backend: Spring Boot 3.3 + Flyway + JPA Specification. Frontend: React 19 + Vite + Tailwind. Full CRUD + bildeupload + menybygger + søk med debounce.
- Tolkning / usikkerhet: Koden er ikke kjørt ennå – krever MySQL og `mvn`/`npm install`. Mulig det dukker opp kompileringsfeil ved første oppstart.
- Brukte 14m 45s på oppgaven,  3703 lines, 2.84$

---

### Oppføring

- Tidspunkt: 15:15
- Hva ble testet: Kjørte web appen
- Betingelse / variant: uten plan
- Resultat / observasjon:
  - bug funnet: Kan ikke skrive ingrediensnavn. Bare å si fra så fikset claude det.
  - Mangler dialog for å legge til bilde - som det sto i prompten. Det ble også addressert.
- Måling / eksempel:
- Tolkning / usikkerhet:

- Tidspunkt: 16:50
- Hva ble testet: Review egen kode
- Betingelse / variant: uten plan
- Resultat / observasjon:
  - Mer interessante feil i denne?
  ┌─────────────────────────────────────────┬─────────────────────┬────────────────────────────────────────┐
  │                  Issue                  │      Severity       │                  File                  │                             
  ├─────────────────────────────────────────┼─────────────────────┼────────────────────────────────────────┤
  │ Inconsistent thumbnail URL construction │ Medium (latent bug) │ RecipeService:110,126 / MenuService:91 │                             
  ├─────────────────────────────────────────┼─────────────────────┼────────────────────────────────────────┤
  │ Silent file deletion failure            │ Low                 │ ImageService:84                        │                             
  ├─────────────────────────────────────────┼─────────────────────┼────────────────────────────────────────┤
  │ Unvalidated sortBy param                │ Medium              │ RecipeController:40                    │                             
  ├─────────────────────────────────────────┼─────────────────────┼────────────────────────────────────────┤                             
  │ Extension not derived from content type │ Low                 │ ImageService:92                        │
  ├─────────────────────────────────────────┼─────────────────────┼────────────────────────────────────────┤                             
  │ AbortController signal not forwarded    │ Medium              │ useRecipes.js:14, client.js:19         │
  ├─────────────────────────────────────────┼─────────────────────┼────────────────────────────────────────┤                             
  │ JSON.stringify dependency               │ Low                 │ useRecipes.js:29                       │
  └─────────────────────────────────────────┴─────────────────────┴────────────────────────────────────────┘   