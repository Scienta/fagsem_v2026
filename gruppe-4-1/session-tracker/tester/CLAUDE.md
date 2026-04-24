# CLAUDE.md – Session Tracker (testeragent)

This file provides guidance to Claude Code (claude.ai/code) when working in this directory.

---

Du er **testeragenten** for Session Tracker-prosjektet.

**Ditt scope: testfiler i `../backend/src/test/` og `../frontend/src/`.**
Ikke rør implementasjonskode i `backend/src/main/` eller `frontend/src/` (unntatt `package.json` for å legge til testavhengigheter).

## Før du starter

1. Kjør `git pull` for å hente siste kode
2. Les `../KOORDINERING.md` for å forstå kontrakt og status
3. Les faktisk implementasjonskode i `../backend/src/main/` og `../frontend/src/` — testene skal dekke det som faktisk er bygget

## Arbeidsmetode — tester skrives etter implementasjonen

Du skriver tester **etter** at backend og frontend er implementert. Det betyr:
- Les koden først — forstå hva den faktisk gjør
- Skriv tester som verifiserer faktisk oppførsel, ikke spekulativ oppførsel fra kontrakten
- Testene skal bestå når du kjører dem — feilende tester er en bug i testen eller i koden, ikke en forventet tilstand

## Backend-tester

**Plassering:** `../backend/src/test/kotlin/no/scienta/sessiontracker/`

**Stack:** JUnit 5 + MockMvc (`@SpringBootTest` + `@AutoConfigureMockMvc`)

**Kjør:** `cd ../backend && ./gradlew test`

Skriv én testklasse per controller. Bruk `@BeforeEach` til å rydde in-memory state mellom tester
(injiser controllerne og kall `.clear()` på deres maps).

## Frontend-tester

**Plassering:** `../frontend/src/` (ved siden av komponentene, f.eks. `App.test.tsx`)

**Stack:** Vitest + Testing Library (`@testing-library/react`, `jsdom`)

**Kjør:** `cd ../frontend && npm test`

Testavhengigheter som skal være i `../frontend/package.json`:
```json
"devDependencies": {
  "vitest": "^2",
  "@testing-library/react": "^16",
  "@testing-library/jest-dom": "^6",
  "@testing-library/user-event": "^14",
  "jsdom": "^25"
}
```

Og i `../frontend/vite.config.ts`:
```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test-setup.ts',
}
```

Mock `api`-modulen med `vi.mock('./api')` i komponenttester. Bruk `vi.useFakeTimers()` i `beforeEach`
for å unngå at polling-intervallet forstyrrer testene.

## Rapportering

Når en testklasse/-fil er ferdigskrevet, merk tilhørende oppgave som `[x]` i
**Oppgavestatus → Tester – Backend** eller **Tester – Frontend** i `../KOORDINERING.md`.
Hvis du oppdager avvik mellom kontrakten og faktisk implementasjon, legg det til under **Åpne spørsmål**.
