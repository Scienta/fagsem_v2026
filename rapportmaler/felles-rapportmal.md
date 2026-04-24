---
tema: ""
---

# Felles rapportmal

> **Til gruppen:** Velg tema og eksperiment fra filene i `/eksperimenter`. Fyll ut alle seksjoner. 

---

## Rapportmal

### 1. Gruppeinformasjon

| Felt | Verdi                                                          |
|---|----------------------------------------------------------------|
| Gruppenummer | 2.2                                                            |
| Deltakere | Espen Skjæran, Steinar Haug, Jan-Erik Bergmann                 |
| Tema | Tema 2 – AI assistert systemutvikling                          |
| Dato(er) for eksperiment | 24.4.2026                                                      |
| Verktøy/modeller brukt | Claude Code |
| Repo / kodebase / case brukt | *(lenke eller beskrivelse)*                                    |

---

### 2. Valgt problemstilling

**Forskningsspørsmål:**
Påvirker bruk av planning mode (Claude Code `/plan`) ressursbruk og kvalitet på den genererte løsningen sammenlignet med å la Claude jobbe uten eksplisitt planleggingsfase?

**Hypotese:**
Planning mode gir mer velstrukturert kode og bedre arkitekturvalgene, men bruker mer tokens og tar lengre tid. Uten planning vil Claude produsere funksjonell kode raskere, men med mer teknisk gjeld og inkonsistente valg.

---

### 3. Eksperimentoppsett

#### Hva ble testet
Alle tre betingelser fikk samme overordnede oppgave: *«Lag en web-applikasjon for vedlikehold av matoppskrifter»*. Betingelsene varierte i hvor mye kontekst og instruksjoner Claude fikk, og om planning mode ble brukt.

#### Betingelser

| Betingelse   | Beskrivelse                                                                                      |
|--------------|--------------------------------------------------------------------------------------------------|
| A – Baseline | Kort prompt, Claude bestemmer rammeverk, database, oppskriftstruktur og funksjonalitet selv      |
| B – Unplanned | Detaljert spesifikasjon med teknologivalg (Spring Boot, React, MySQL), ingen planning mode       |
| C – Planned  | Detaljert spesifikasjon med teknologivalg, eksplisitt planning mode aktivert før koding starter  |

#### Målemetoder
- Tidsbruk (veggklokke fra start til fungerende app)
- Token-forbruk og kostnad
- Kvalitativ kodegjennomgang: arkitektur, konsistens, testdekning, API-design

---

### 4. Resultater

#### Betingelse A – Baseline (kort prompt)

- Tid: 7m 57s
- Tokens: 33 800 (↓ input)
- Kostnad: *(ikke registrert)*
- Stack: Spring Boot + Java 23, H2-database (fil), Vanilla HTML/CSS/JS
- Funksjonalitet: CRUD for oppskrifter, kategorier, sanntidssøk, 5 forhåndslastede oppskrifter
- Kodestruktur: Enkel og flat — alt i få filer, ingen tester

#### Betingelse B – Unplanned (detaljert spek, ingen plan)

- Tid: 14m 45s
- Tokens: *(ikke registrert)*
- Stack: Spring Boot 3.3.4, MySQL, React med TypeScript (migrering pågår)
- API-design: Paginert (`PageResponse<T>`), versjonert prefix `/api/v1/`
- Bilder: Egne `RecipeImage`-entiteter med OneToMany (støtter flere bilder per oppskrift)
- Avhengigheter: Lombok, Flyway
- Frontend-tester: Ja — Vitest + React Testing Library + MSW (mock service worker)
- Kodestruktur: Mer kompleks; separate `RecipeSummaryResponse` og `RecipeResponse`-DTO-er

#### Betingelse C – Planned (detaljert spek + planning mode)

- Tid: 23m 31s
- Tokens: *(ikke registrert)*
- Stack: Spring Boot 3.4.4, MySQL, React med JavaScript (JSX)
- API-design: Flate lister (`List<RecipeDto>`), separate metadataendepunkter (`/categories`, `/cuisines`, `/flavors`)
- Bilder: Enkelt `imageFilename`-felt på Recipe-entiteten
- Avhengigheter: H2 for testdatabase, ingen Lombok/Flyway
- Frontend-tester: Ingen
- Kodestruktur: Enklere og mer konsistent; ett felles `RecipeDto` for alle svar

#### Sammenligning B vs. C

| Aspekt                  | B – Unplanned                          | C – Planned                              |
|-------------------------|----------------------------------------|------------------------------------------|
| Spring Boot-versjon     | 3.3.4                                  | 3.4.4 (nyere)                            |
| Frontendspråk           | TypeScript (migrering)                 | JavaScript (JSX)                         |
| Frontend-tester         | Ja (Vitest + RTL + MSW)                | Nei                                      |
| API-stil                | Paginert, versjonert `/api/v1/`        | Flate lister, metadataendepunkter        |
| Bildemodell             | Flere bilder per oppskrift (entitet)   | Ett filnavn per oppskrift (felt)         |
| Avhengigheter           | Lombok, Flyway                         | H2 test-DB, ingen Lombok/Flyway          |
| Testisolasjon (backend) | Nei                                    | Ja (H2 in-memory for tester)             |

---
(Vi spesifiserte TDD på planned)
### 5. Diskusjon

#### Hva funket

- Alle tre betingelser produserte fungerende applikasjoner.
- Planning mode (C) ga en enklere og mer konsistent arkitektur — ett DTO-lag, enklere bildehåndtering, og oppgraderte avhengigheter.
- Baseline (A) leverte overraskende raskt en brukbar app med minimal input.
- Betingelse B genererte mer sofistikerte funksjoner spontant (TypeScript, paginering, testsett) uten at dette var spesifisert.

#### Hva funket ikke

- Guiet på B var "penere" enn C, som feks hadde en ustylet bilde knapp
- B hadde en TypeScript-migrasjon som var halvferdig — et tegn på at Claude endret retning underveis uten å fullføre.
- C manglet frontend-tester til tross for at planning-fasen burde ha identifisert testbehov.
- Planned mode (C) ga oss mange lavnivå spørsmål, feks kjøre npm, men ingen om større arkitekturvalg
- Tokens og tid ble ikke konsekvent målt for B og C, noe som gjør direkte sammenligning vanskelig.

#### Begrensninger

- Kun én kjøring per betingelse — resultatene er ikke reproducerbare uten flere forsøk.
- Kvalitetsvurdering er gjort manuelt etter kodegjennomgang, ikke via automatiserte metrikker.
- Betingelsene ble ikke kjørt i isolasjon (ulike tidspunkter, mulig forskjellig kontekst i Claude).
- Alle betingelser ga tilfeldige forskjeller som vi ikke hadde bedt om, feks bruk av lombok
---

### 6. Konklusjon

Planning mode ga en mer konsistent og vedlikeholdbar kodebase med færre halvferdige løsninger, men gav ikke nødvendigvis mer funksjonalitet — betingelse B produserte spontant mer avanserte løsninger (TypeScript, tester, paginering) som ikke var spesifisert. Den viktigste læringen er at detaljert spesifikasjon har større effekt på resultatkvalitet enn planning mode alene, og at Claude uten planning kan ta overraskende gode arkitekturbeslutninger — men også introdusere inkonsistens ved kursendringer underveis.

---
