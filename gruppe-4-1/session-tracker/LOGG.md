# Prosjektlogg – Session Tracker (gruppe 4-1)

Løpende logg over beslutninger og arbeid i dette prosjektet.

---

## 2026-04-24 – Prosjektidé og oppsett

### Valgt prosjekt
Diskuterte ulike prosjektideer egnet for multi-agent-eksperimentet (tema 4).
Valgte **Fagdag Session Tracker** — en enkel fullstack-app for å spore hvilke grupper som er aktive og hvilke funn de logger under seminaret.

**Begrunnelse:** Codebasen deler seg naturlig i fire uavhengige agentspor (backend, frontend, tester, docs) med en ikke-triviell integrasjonsutfordring: frontend og tester er begge avhengige av API-kontrakten, så avvik mellom agenter blir synlige ved integrasjon.

### Teknologivalg
- **Backend:** Kotlin + Spring Boot 3 + Gradle
- **Frontend:** TypeScript + React + Vite
- **Tester:** JUnit 5 (backend), Vitest (frontend – ikke satt opp ennå)
- **API-docs:** springdoc-openapi (Swagger UI på `/swagger-ui`)

### Datamodell

```
Group   { id, name, theme, members[] }
Session { id, groupId, startedAt, status: ACTIVE|DONE }
Finding { id, sessionId, text, type: OBSERVATION|RESULT|BLOCKER }
```

### API-endepunkter

| Method | Endpoint                    | Beskrivelse                         |
|--------|-----------------------------|-------------------------------------|
| GET    | /groups                     | List alle grupper                   |
| POST   | /sessions                   | Start en sesjon for en gruppe       |
| PATCH  | /sessions/:id               | Oppdater sesjonstatus (f.eks. done) |
| POST   | /sessions/:id/findings      | Logg et funn i en sesjon            |
| GET    | /sessions/:id/findings      | Hent funn for en sesjon             |
| GET    | /findings?type=             | Søk på tvers av alle funn           |

### Opprettet scaffold

**Backend (`backend/`):**
- `build.gradle.kts` + `settings.gradle.kts` – Gradle-konfig med Spring Web + springdoc-openapi
- `model/Models.kt` – dataklasser og enums
- `controller/GroupController.kt` – stub for `GET /groups`
- `controller/SessionController.kt` – stubs for `POST /sessions` og `PATCH /sessions/:id`
- `controller/FindingController.kt` – stubs for alle findings-endepunkter
- `src/main/resources/application.yml` – port 8080, Swagger UI
- `src/test/.../ApplicationTests.kt` – kontekstlastingstest

**Frontend (`frontend/`):**
- `package.json`, `tsconfig.json`, `vite.config.ts` – prosjektkonfig
- `index.html` + `src/main.tsx` – inngangsunkt
- `src/types/api.ts` – TypeScript-typer som matcher backendmodellen
- `src/App.tsx` – komponentskjelett med TODO-markører

### Git
- Branch: `tema4/session-tracker`
- Pushet til: `git@github.com:Scienta/fagsem_v2026.git`
- PR: https://github.com/Scienta/fagsem_v2026/pull/new/tema4/session-tracker

---

<!-- Legg til nye oppføringer under her etter hvert som arbeidet skrider frem -->
