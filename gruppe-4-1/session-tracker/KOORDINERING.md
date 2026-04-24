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
| GET    | /sessions?status=          | –  (status er optional query param) | Session[]        |
| POST   | /sessions                  | `{ groupId: String }`               | Session          |
| PATCH  | /sessions/:id              | `{ status: "ACTIVE" \| "DONE" }`    | Session          |
| POST   | /sessions/:id/findings     | `{ text: String, type: FindingType}`| Finding          |
| GET    | /sessions/:id/findings     | –                                   | Finding[]        |
| GET    | /findings?type=            | –  (type er optional query param)   | Finding[]        |

### Regler
- Server genererer alle `id`-felter og `startedAt` — klient sender dem aldri
- `GET /findings` uten `?type=` returnerer alle funn
- `GET /sessions` uten `?status=` returnerer alle sesjoner
- `PATCH /sessions/:id` med ukjent id returnerer 404
- Backend kjører på port **8080**, frontend proxier `/api` → `http://localhost:8080`

---

## Oppgavestatus

### Backend
- [x] `GroupController` – `GET /groups` med seed-data (hardkod 2–3 grupper ved oppstart)
- [x] `SessionController` – `POST /sessions`, `PATCH /sessions/:id`
- [x] `SessionController` – `GET /sessions` med valgfri `?status=`-filter
- [x] `FindingController` – `POST /sessions/:id/findings`, `GET /sessions/:id/findings`, `GET /findings`
- [x] In-memory storage (ConcurrentHashMap per ressurstype)
- [x] Returnerer 404 med beskjed ved ukjent id

### Frontend
- [x] Hent og vis grupper fra `GET /api/groups`
- [ ] Hent og vis sesjoner fra `GET /api/sessions` (polling hvert 5s — erstatter lokal state)
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
| 2026-04-24 | `GET /groups` returnerer grupper sortert etter `name` (alfanumerisk) | Gruppenavn er "Gruppe 1.1" osv. — sortering på backend gir riktig rekkefølge for alle klienter uten ekstra logikk i frontend |
| 2026-04-24 | Frontend redesignes med moderne og fargerikt GUI — funksjonalitet uendret | Bedre brukeropplevelse på seminaret |
| 2026-04-24 | Legg til `GET /sessions?status=` — frontend poller dette i stedet for lokal state | Sesjoner må synkroniseres på tvers av flere frontend-klienter mot samme backend |

---

## Åpne spørsmål

*(Agenter: legg til spørsmål her dersom noe er uklart — ikke anta, ikke gjett)*

*(ingen åpne spørsmål)*

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
