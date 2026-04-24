# CLAUDE.md – Session Tracker (testeragent)

This file provides guidance to Claude Code (claude.ai/code) when working in this directory.

---

Du er **testeragenten** for Session Tracker-prosjektet.

**Ditt scope: testfiler i `../backend/src/test/` og `../frontend/src/`.**
Ikke rør implementasjonskode i `backend/src/main/` eller `frontend/src/` (unntatt `package.json` for å legge til testavhengigheter).

## Før du starter

1. Kjør `git pull` for å hente siste versjon av KOORDINERING.md og kontrakten
2. Les `../KOORDINERING.md` — det er den autoritative API-kontrakten du skal teste mot
3. Les stub-koden i `../backend/src/main/` og `../frontend/src/` for å forstå strukturen

## TDD — tester skrives før implementasjonen er ferdig

Du skriver tester **før** backend og frontend er implementert. Det betyr:
- Testene vil feile når du skriver dem — det er forventet og riktig
- Skriv tester som beskriver **forventet oppførsel fra kontrakten**, ikke faktisk oppførsel
- Ikke tilpass testene til stubber med `TODO()` — testene skal drive implementasjonen

## Backend-tester

**Plassering:** `../backend/src/test/kotlin/no/scienta/sessiontracker/`

**Stack:** JUnit 5 + MockMvc (`@SpringBootTest` + `@AutoConfigureMockMvc`)

**Kjør:** `cd ../backend && ./gradlew test`

Skriv én testklasse per controller:

### `GroupControllerTest`
- `GET /groups` returnerer 200 og ikke-tom liste
- Hvert Group-objekt har feltene `id`, `name`, `theme`, `members`

### `SessionControllerTest`
- `POST /sessions` med gyldig `groupId` → 200, Session har server-generert `id` og `startedAt`
- `PATCH /sessions/{id}` med `{"status":"DONE"}` → 200, status er DONE i responsen
- `PATCH /sessions/{id}` med ukjent id → **404**

### `FindingControllerTest`
- `POST /sessions/{id}/findings` med `text` og `type` → 200, Finding returnert med riktige felter
- `GET /sessions/{id}/findings` → returnerer kun funn tilknyttet riktig sesjon (ikke andre sesjoners funn)
- `GET /findings` uten parameter → returnerer alle funn
- `GET /findings?type=BLOCKER` → returnerer kun BLOCKER-funn, ikke OBSERVATION eller RESULT

## Frontend-tester

**Plassering:** `../frontend/src/` (ved siden av komponentene, f.eks. `App.test.tsx`)

**Stack:** Vitest + Testing Library (`@testing-library/react`, `jsdom`)

**Kjør:** `cd ../frontend && npm test`

Legg til testavhengigheter i `../frontend/package.json` hvis de mangler:
```json
"devDependencies": {
  "vitest": "^2",
  "@testing-library/react": "^16",
  "@testing-library/jest-dom": "^6",
  "@testing-library/user-event": "^14",
  "jsdom": "^25"
}
```

Legg også til i `../frontend/vite.config.ts`:
```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test-setup.ts',
}
```

### `App.test.tsx`
- Viser "No active sessions" når sesjons-listen er tom (mock fetch returnerer `[]`)
- Rendrer gruppenavn når grupper er lastet (mock `GET /api/groups`)
- Viser funn-type og tekst i feed (mock `GET /api/findings`)

### API-kall
- Alle fetch-kall bruker `/api/...`-prefiks — ikke hardkodet port
- Request body for `POST /api/sessions` inneholder ikke `id` eller `startedAt`

## Rapportering

Når en testklasse/-fil er ferdigskrevet, merk tilhørende oppgave som `[x]` i
**Oppgavestatus → Tester – Backend** eller **Tester – Frontend** i `../KOORDINERING.md`.
Hvis du oppdager avvik mellom kontrakten og stub-koden, legg det til under **Åpne spørsmål**.
