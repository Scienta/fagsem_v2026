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

## 2026-04-24 – Build-oppsett og kompatibilitetsproblemer

### Problem: Gradle + Java 25
- Gradle 8.8 støtter ikke Java 25 — måtte installere Gradle 9.4.1 og oppdatere wrapperen
- Kotlin 2.0.21 krasjet på Java 25 (`JavaVersion.parse("25.0.2")`) — løst ved å oppgradere til Kotlin 2.3.21
- Spring Boot 3.4.3 sin innebygde ASM kan ikke lese Java 25 bytekode — løst ved å sette bytekode-target til Java 21 (`jvmTarget = JVM_21`) mens JDK forblir Java 25

### Endelig byggkonfigurasjon
- **JDK:** Java 25 (Temurin 25.0.2, via Gradle toolchain)
- **Kotlin:** 2.3.21 (kompilerer på Java 25 uten problemer)
- **Bytekode-target:** Java 21 (kompatibelt med Spring Boot 3.4.x sin ASM)
- **Gradle:** 9.4.1
- **Spring Boot:** 3.4.3

### Andre endringer
- `springBoot { mainClass }` satt eksplisitt — omgår `resolveMainClassName`-scanning av Java 25 klasser
- `.gitignore` lagt til i `gruppe-4-1/session-tracker/` for å holde build-output ute av repoet
- `./gradlew clean build` kjører grønt

## 2026-04-24 – GroupController implementert

- Implementerte `GET /groups` i `GroupController.kt`
- Bruker `ConcurrentHashMap<String, Group>` som in-memory store, initialisert med 3 hardkodede grupper ved oppstart
- Grupper seed-es i en `also`-blokk på map-initialiseringen
- Kompilering OK med `./gradlew compileKotlin`
- Oppgave markert som `[x]` i KOORDINERING.md

## 2026-04-24 – SessionController implementert

- Implementerte `POST /sessions` — oppretter ny sesjon med UUID og `startedAt` satt av server, lagrer i `ConcurrentHashMap`
- Implementerte `PATCH /sessions/:id` — oppdaterer status med `session.copy()`; kaster `ResponseStatusException(404)` ved ukjent id
- `SessionStatus.valueOf(request.status)` brukes for å parse status-streng til enum — kaster `IllegalArgumentException` ved ugyldig verdi (Spring returnerer 500, akseptabelt for nå)
- Kompilering OK

## 2026-04-24 – FindingController implementert

- Implementerte alle tre endepunkter: `POST /sessions/:id/findings`, `GET /sessions/:id/findings`, `GET /findings?type=`
- `FindingController` injecter `SessionController` for å validere at sesjon eksisterer — returnerer 404 ved ukjent id
- `GET /findings` uten `?type=` returnerer alle funn; med `?type=` filtreres på `FindingType`-enum
- `FindingType` parses direkte av Spring fra query-param til enum — ugyldig verdi gir 400 automatisk
- Alle backend-oppgaver ferdig, kompilering OK

<!-- Legg til nye oppføringer under her etter hvert som arbeidet skrider frem -->
