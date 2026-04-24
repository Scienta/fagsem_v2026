# CLAUDE.md – Session Tracker (backendagent)

This file provides guidance to Claude Code (claude.ai/code) when working in this directory.

---

Du er **backendagenten** for Session Tracker-prosjektet.

**Ditt scope: kun `backend/`-mappen. Ikke rør `frontend/`.**

## Før du starter

Les `../KOORDINERING.md` — det er den autoritative API-kontrakten du skal implementere mot.
Hvis noe er uklart eller kontrakten mangler noe du trenger, legg det til under **Åpne spørsmål** i `KOORDINERING.md` i stedet for å anta.

## Stack

- Kotlin + Spring Boot 3.5.3
- Gradle 9.4.1, Java 25 JDK
- Bygg: `./gradlew build` | Kjør: `./gradlew bootRun`
- API-docs: http://localhost:8080/swagger-ui

## Hva du skal implementere

Alle endepunkter er stubbede med `TODO()` i `src/main/kotlin/no/scienta/sessiontracker/controller/`.
Erstatt `TODO()` med ekte logikk:

- **Storage:** Bruk én `ConcurrentHashMap` per ressurstype som in-memory store, initialisert ved oppstart
- **GroupController:** Seed 2–3 grupper ved oppstart (hardkod dem i en init-blokk)
- **SessionController:** Opprett sesjon, oppdater status — returner 404 med melding ved ukjent id
- **FindingController:** Legg til funn, hent per sesjon, hent alle med optional type-filter

## Regler fra kontrakten

- Server genererer `id` (UUID) og `startedAt` — klient sender dem aldri
- `PATCH /sessions/:id` med ukjent id → HTTP 404
- `GET /findings` uten `?type=` returnerer alle funn

## Tester

Skriv integrasjonstester i `src/test/kotlin/no/scienta/sessiontracker/` med `@SpringBootTest` og MockMvc.
Én testklasse per controller. Kjør med `./gradlew test`.

**`GroupControllerTest`**
- `GET /groups` returnerer 200 og ikke-tom liste
- Hvert Group-objekt har `id`, `name`, `theme`, `members`

**`SessionControllerTest`**
- `POST /sessions` med gyldig `groupId` → 200, Session har server-generert `id` og `startedAt`
- `PATCH /sessions/{id}` med `{"status":"DONE"}` → 200, status er DONE
- `PATCH /sessions/{id}` med ukjent id → **404**

**`FindingControllerTest`**
- `POST /sessions/{id}/findings` med `text` og `type` → 200, Finding returnert
- `GET /sessions/{id}/findings` → returnerer kun funn tilknyttet riktig sesjon
- `GET /findings` uten parameter → returnerer alle funn
- `GET /findings?type=BLOCKER` → returnerer kun BLOCKER-funn (ikke andre typer)

## Rapportering

Når du er ferdig med en oppgave, merk den som `[x]` i **Oppgavestatus → Backend** i `../KOORDINERING.md`.
Merk tilsvarende under **Tester – Backend** når testene er skrevet.
Hvis du tar en beslutning som påvirker API-kontrakten, legg den til i **Beslutningslogg**.
