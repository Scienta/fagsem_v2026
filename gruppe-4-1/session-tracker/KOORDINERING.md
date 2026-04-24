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
