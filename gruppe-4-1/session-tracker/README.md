# Session Tracker

Fagdag V2026 – Tema 4: Flere parallelle kodeagenter

A simple full-stack app for tracking what groups are working on during the seminar — which sessions are active, and what findings have been logged.

## Stack

- **Backend:** Kotlin + Spring Boot 3 + Gradle
- **Frontend:** TypeScript + React + Vite

## Running locally

### Backend

```bash
cd backend
./gradlew bootRun
```

- API: http://localhost:8080
- OpenAPI docs: http://localhost:8080/swagger-ui

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173 (proxies `/api` to the backend)

## API

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | /groups                     | List all groups                      |
| POST   | /sessions                   | Start a session for a group          |
| PATCH  | /sessions/:id               | Update session status (e.g. mark done)|
| POST   | /sessions/:id/findings      | Log a finding during a session       |
| GET    | /sessions/:id/findings      | Get all findings for a session       |
| GET    | /findings?type=             | Query all findings (optional filter) |

## Data model

```
Group   { id, name, theme, members[] }
Session { id, groupId, startedAt, status: ACTIVE|DONE }
Finding { id, sessionId, text, type: OBSERVATION|RESULT|BLOCKER }
```
