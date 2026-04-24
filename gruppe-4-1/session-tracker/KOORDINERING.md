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
- [ ] `GroupController` – `GET /groups` med seed-data (hardkod 2–3 grupper ved oppstart)
- [ ] `SessionController` – `POST /sessions`, `PATCH /sessions/:id`
- [ ] `FindingController` – `POST /sessions/:id/findings`, `GET /sessions/:id/findings`, `GET /findings`
- [ ] In-memory storage (ConcurrentHashMap per ressurstype)
- [ ] Returnerer 404 med beskjed ved ukjent id

### Frontend
- [ ] Hent og vis grupper fra `GET /api/groups`
- [ ] Hent og vis aktive sesjoner
- [ ] Hent og vis live funn-feed fra `GET /api/findings`
- [ ] Mulighet til å starte sesjon for en gruppe (POST)
- [ ] Mulighet til å logge funn i en sesjon (POST)
- [ ] Mulighet til å markere sesjon som done (PATCH)

### Tester – Backend (JUnit 5 + MockMvc)
- [ ] `GroupControllerTest` – `GET /groups` returnerer 200 og ikke-tom liste med gyldige felter
- [ ] `SessionControllerTest` – `POST /sessions` returnerer Session med server-generert `id` og `startedAt`
- [ ] `SessionControllerTest` – `PATCH /sessions/{id}` oppdaterer status til DONE
- [ ] `SessionControllerTest` – `PATCH /sessions/{id}` med ukjent id returnerer 404
- [ ] `FindingControllerTest` – `POST /sessions/{id}/findings` returnerer Finding
- [ ] `FindingControllerTest` – `GET /sessions/{id}/findings` returnerer funn for riktig sesjon
- [ ] `FindingControllerTest` – `GET /findings` uten parameter returnerer alle funn
- [ ] `FindingControllerTest` – `GET /findings?type=BLOCKER` returnerer kun BLOCKER-funn

### Tester – Frontend (Vitest + Testing Library)
- [ ] `App.test.tsx` – viser "No active sessions" når listen er tom
- [ ] `App.test.tsx` – rendrer gruppenavn når grupper er lastet
- [ ] `App.test.tsx` – viser funn-type og tekst i feed
- [ ] API-kall bruker `/api/...`-prefiks (ikke hardkodet port)
- [ ] Request body for POST inneholder ikke `id` eller `startedAt`

---

## Beslutningslogg

| Dato       | Beslutning                                                              | Begrunnelse                              |
|------------|-------------------------------------------------------------------------|------------------------------------------|
| 2026-04-24 | In-memory storage, ingen database                                       | Holder det enkelt for seminar-kontekst   |
| 2026-04-24 | Server genererer id og startedAt, sendes ikke fra klient                | Unngår synkroniseringsproblemer          |
| 2026-04-24 | Frontend proxier /api til backend, ikke hardkodet URL                   | Fungerer uten CORS-konfig                |

---

## Åpne spørsmål

*(Agenter: legg til spørsmål her dersom noe er uklart — ikke anta, ikke gjett)*

- [ ] *(ingen åpne spørsmål ennå)*

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
