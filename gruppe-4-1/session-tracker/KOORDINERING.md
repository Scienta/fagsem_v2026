# Koordineringsdokument – Session Tracker

Dette dokumentet er den autoritative kilden for API-kontrakt, oppgavestatus og beslutninger.
Alle agenter skal lese dette før de starter. Koordinatoragenten er ansvarlig for å holde det oppdatert.

---

## API-kontrakt

### Datamodell

```
Group {
  id:      String   (UUID, generert av server)
  name:    String
  theme:   String
  members: String[]
}

Session {
  id:        String          (UUID, generert av server)
  groupId:   String
  startedAt: String          (ISO 8601, satt av server)
  status:    "ACTIVE" | "DONE"
}

Finding {
  id:        String                             (UUID, generert av server)
  sessionId: String
  text:      String
  type:      "OBSERVATION" | "RESULT" | "BLOCKER"
}
```

### Endepunkter

| Method | Path                       | Request body                        | Response         |
|--------|----------------------------|-------------------------------------|------------------|
| GET    | /groups                    | –                                   | Group[]          |
| POST   | /sessions                  | `{ groupId: String }`               | Session          |
| PATCH  | /sessions/:id              | `{ status: "ACTIVE" \| "DONE" }`    | Session          |
| POST   | /sessions/:id/findings     | `{ text: String, type: FindingType}`| Finding          |
| GET    | /sessions/:id/findings     | –                                   | Finding[]        |
| GET    | /findings?type=            | –  (type er optional query param)   | Finding[]        |

### Regler
- Server genererer alle `id`-felter og `startedAt` — klient sender dem aldri
- `GET /findings` uten `?type=` returnerer alle funn
- `PATCH /sessions/:id` med ukjent id returnerer 404
- Backend kjører på port **8080**, frontend proxier `/api` → `http://localhost:8080`

---

## Oppgavestatus

### Backend
- [x] `GroupController` – `GET /groups` med seed-data (hardkod 2–3 grupper ved oppstart)
- [x] `SessionController` – `POST /sessions`, `PATCH /sessions/:id`
- [x] `FindingController` – `POST /sessions/:id/findings`, `GET /sessions/:id/findings`, `GET /findings`
- [x] In-memory storage (ConcurrentHashMap per ressurstype)
- [x] Returnerer 404 med beskjed ved ukjent id

### Frontend
- [x] Hent og vis grupper fra `GET /api/groups`
- [x] Hent og vis aktive sesjoner (lokal state — se åpne spørsmål)
- [x] Hent og vis live funn-feed fra `GET /api/findings` (polling hvert 5s)
- [x] Mulighet til å starte sesjon for en gruppe (POST)
- [x] Mulighet til å logge funn i en sesjon (POST)
- [x] Mulighet til å markere sesjon som done (PATCH)

### Tester – Backend (JUnit 5 + MockMvc)
- [x] `GroupControllerTest` – `GET /groups` returnerer 200 og ikke-tom liste med gyldige felter
- [x] `SessionControllerTest` – `POST /sessions` returnerer Session med server-generert `id` og `startedAt`
- [x] `SessionControllerTest` – `PATCH /sessions/{id}` oppdaterer status til DONE
- [x] `SessionControllerTest` – `PATCH /sessions/{id}` med ukjent id returnerer 404
- [x] `FindingControllerTest` – `POST /sessions/{id}/findings` returnerer Finding
- [x] `FindingControllerTest` – `GET /sessions/{id}/findings` returnerer funn for riktig sesjon
- [x] `FindingControllerTest` – `GET /findings` uten parameter returnerer alle funn
- [x] `FindingControllerTest` – `GET /findings?type=BLOCKER` returnerer kun BLOCKER-funn

### Tester – Frontend (Vitest + Testing Library)
- [x] `App.test.tsx` – viser "Ingen aktive sesjoner." når listen er tom
- [x] `App.test.tsx` – rendrer gruppenavn når grupper er lastet
- [x] `App.test.tsx` – viser funn-type og tekst i feed
- [x] API-kall bruker `/api/...`-prefiks (ikke hardkodet port) — `api.test.ts`
- [x] Request body for POST inneholder ikke `id` eller `startedAt` — `api.test.ts`

---

## Beslutningslogg

| Dato       | Beslutning                                                              | Begrunnelse                              |
|------------|-------------------------------------------------------------------------|------------------------------------------|
| 2026-04-24 | In-memory storage, ingen database                                       | Holder det enkelt for seminar-kontekst   |
| 2026-04-24 | Server genererer id og startedAt, sendes ikke fra klient                | Unngår synkroniseringsproblemer          |
| 2026-04-24 | Frontend proxier /api til backend, ikke hardkodet URL                   | Fungerer uten CORS-konfig                |
| 2026-04-24 | Seed-data i GroupController oppdateres til faktiske seminargrupper (13 grupper, 5 temaer) fra README.MD | Applikasjonen skal reflektere virkeligheten |

---

## Åpne spørsmål

*(Agenter: legg til spørsmål her dersom noe er uklart — ikke anta, ikke gjett)*

- [ ] **Mangler `GET /sessions`** — Frontend trenger dette for å vise sesjoner som andre brukere har startet (og ved refresh). Nåværende løsning: sesjoner holdes i lokal React-state etter `POST /sessions`. Bør backend legge til `GET /sessions` (evt. med `?status=ACTIVE`)? — *Lagt til av frontendagent 2026-04-24*

---

## Mal for koordinatoroppdatering

Bruk denne malen når koordinator pusher endringer og mennesker skal videreformidle til rett agent:

```
**Koordinatoroppdatering – [dato/tidspunkt]**

**Til:** [backend-agent | frontend-agent | begge]

**Hva er nytt:**
- [kort beskrivelse av endring i KOORDINERING.md]

**Du må gjøre:**
- [ ] [konkret handling]
- [ ] [konkret handling]

**Ikke gjør noe med:**
- [evt. ting som er uendret eller håndteres av den andre agenten]

**Åpne spørsmål til deg:**
- [evt. spørsmål koordinator trenger svar på]
```
