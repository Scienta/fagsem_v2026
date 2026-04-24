# Kokebok

Full-stack kokebok-applikasjon med Spring Boot backend og React frontend.

## Forutsetninger

- Java 21+
- Maven 3.9+
- Node.js 20+
- MySQL 8+

## Database-oppsett

```sql
CREATE DATABASE kokebok CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kokebok'@'localhost' IDENTIFIED BY 'kokebok';
GRANT ALL PRIVILEGES ON kokebok.* TO 'kokebok'@'localhost';
FLUSH PRIVILEGES;
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

API-et kjører på http://localhost:8080

Flyway oppretter tabellene automatisk ved første oppstart.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Appen kjører på http://localhost:5173

Vite proxy-er `/api` og `/uploads` til backend, så CORS er ikke noe problem i utvikling.

## API-endepunkter

| Metode | Sti | Beskrivelse |
|--------|-----|-------------|
| GET | /api/v1/recipes | Søk/list oppskrifter |
| POST | /api/v1/recipes | Opprett oppskrift |
| GET | /api/v1/recipes/{id} | Hent én oppskrift |
| PUT | /api/v1/recipes/{id} | Oppdater oppskrift |
| DELETE | /api/v1/recipes/{id} | Slett oppskrift |
| POST | /api/v1/recipes/{id}/images | Last opp bilde |
| DELETE | /api/v1/recipes/{id}/images/{imageId} | Slett bilde |
| GET | /api/v1/menus | List menyer |
| POST | /api/v1/menus | Opprett meny |
| GET | /api/v1/menus/{id} | Hent én meny |
| PUT | /api/v1/menus/{id} | Oppdater meny |
| DELETE | /api/v1/menus/{id} | Slett meny |
| GET | /api/v1/meta/categories | Kategorier |
| GET | /api/v1/meta/cuisines | Kjøkken |
| GET | /api/v1/meta/flavors | Smaksprofiler |

## Søkeparametere (GET /api/v1/recipes)

- `q` – fritekst i tittel og beskrivelse
- `category` – f.eks. `MAIN_COURSE`
- `cuisine` – f.eks. `ITALIAN`
- `flavor` – kan repeteres: `?flavor=SPICY&flavor=UMAMI`
- `ingredient` – ingrediensnavn (substring-søk)
- `page`, `size`, `sortBy`, `sortDir`
