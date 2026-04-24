# Eksperiment 2: Hva skjer når produksjonshastigheten 10x-es?

**Dato:** Mars 2026
**Deltakere:** 6 utviklere, 1 tech lead, 1 produkteier
**Varighet:** 3 uker

---

## Problemstilling

Hvis AI gjør det mulig å produsere kode 10 ganger raskere per utvikler – hva skjer da? Trenger vi nye koordineringsmekanismer? Hva skjer med resten av organisasjonen? Og er utviklerne faktisk i stand til å "gå god" for koden de leverer?

---

## Eksperimentoppsett

### Fase 1 – Generering (dag 1–3)

Et team på tre utviklere fikk i oppdrag å generere en backend-plattform fra bunnen av ved hjelp av AI:

- **10 microservices** (auth, user, order, product, inventory, notification, payment, search, audit, analytics)
- Hver service med fullstendig REST API, datamodell, migrasjoner og OpenAPI-spec
- Totalt **~50 CRUD-endepunkter** fordelt på tjenestene

Verktøy: Claude Code, GitHub Copilot, egendefinerte skills fra eksperiment 1.

**Resultat:** Alle 10 tjenester var oppe og kjørende etter **2,5 dag**. Estimert manuell tidsbruk: 6–8 uker for samme team.

### Fase 2 – Parallell featureutvikling (dag 4–21)

Et nytt team på seks utviklere (som ikke hadde vært med på genereringen) fikk i oppdrag å jobbe som normalt:
- Legge til nye features i kodebasen
- Fikse bugs som dukket opp
- Følge eksisterende konvensjoner

De fikk ingen spesiell onboarding til den AI-genererte kodebasen utover standard README.

---

## Hva skjedde

### Koordinering brøt ned umiddelbart

Med 10 services som alle potensielt var relevante for en feature, visste ikke utviklerne **hvor kode skulle bo**. En enkel feature ("vis ordrehistorikk til bruker") berørte fire services og krevde avklaringer ingen hadde svar på – fordi ingen hadde skrevet koden med et bevisst designvalg i bunn.

Tre utviklere implementerte overlappende løsninger i parallell uten å vite om hverandre. En la logikk i `order-service`, en annen i `user-service`, en tredje laget en ny `history-service`. Alle tre løsningene ble merget i løpet av én dag.

### Ingen eide kodebasen

Koden var teknisk sett korrekt, men **ingen hadde mental modell** av den. Spørsmål som "hvorfor er dette løst slik?" hadde ikke noe svar. Det fantes ingen ADR-er (Architecture Decision Records), ingen kommentarer om intensjon – bare kode.

Utviklerne beskrev det som å arve et legacy-system fra dag én.

> *"Jeg stolte ikke på koden fordi jeg ikke forsto den. Og jeg hadde ikke tid til å forstå den fordi det var så mye av den."*
> — Utvikler, uke 2

### Sporbarhet til forretningsbehov forsvant

Ingen av de AI-genererte tjenestene var koblet til en spesifikk brukerhistorie, et krav eller en forretningsmessig begrunnelse. Produkteieren hadde ikke vært involvert i genereringsfasen og gjenkjente ikke kodebasen som noe hun hadde bestilt.

Da hun ba om en endring i betalingslogikken, tok det to dager å fastslå **om endringen allerede var implementert eller ikke**.

### Testdekning var høy, men meningsløs

AI-en hadde generert enhetstester med ~70 % coverage. Men testene verifiserte implementasjonen, ikke kravene. Da en bug ble rapportert i `payment-service`, passerte alle tester grønt. Ingen av testene beskrev *hva* tjenesten skulle gjøre fra et brukerperspektiv.

### Utviklerne klarte ikke å "gå god" for koden

På slutten av uke 2 ble utviklerne spurt: *"Ville du satt navn på denne koden i en produksjonssetting?"*

| Svar | Antall |
|---|---|
| Ja, uten forbehold | 0 |
| Ja, med forbehold | 2 |
| Nei / usikker | 4 |

Forbeholdene handlet primært om manglende forståelse av edge cases, ukjente avhengigheter mellom tjenester og usikkerhet rundt feilhåndtering under nettverkspartisjonering.

---

## Utfordringer identifisert

| Utfordring | Beskrivelse |
|---|---|
| **Koordineringssvikt** | Ingen tydelig eierskap til domener; parallell implementasjon av overlappende løsninger |
| **Kognitiv gjeld** | Kodebasen vokste raskere enn teamets forståelse av den |
| **Sporbarhetstap** | Kobling mellom kode og forretningsbehov finnes ikke |
| **Tillitsunderskudd** | Utviklerne stolte ikke på koden de ikke hadde skrevet |
| **Onboarding-kollaps** | Ingen naturlig måte å lære seg systemet på – ingen "war stories" bak designvalgene |
| **Produkteier-kobling** | PO mistet innflytelse over hva som ble bygget og i hvilken rekkefølge |
| **Testillusjon** | Høy coverage uten reell beskyttelse mot funksjonelle feil |

---

## Mulige løsninger

### 1. Generer arkitektur, ikke kode – som første steg

Før noen kode skrives, bruk AI til å produsere **ADR-er og domenekart** som teamet gjennomgår og godkjenner. Dette forankrer designvalg i menneskelig beslutning og gir sporbarhet bakover.

### 2. Domene-eierskap som eksplisitt koordineringsmekanisme

Selv med AI-generert kode må hvert domene ha én navngitt person som *eier* forståelsen. Ikke nødvendigvis koden – men konsekvensene av endringer i den.

### 3. Krav-til-kode-sporing fra starten

Hvert endepunkt og hver service bør tagges med ID-en til brukerhistorien eller kravet som genererte den. Dette kan gjøres som en del av AI-prompten: *"Generer denne tjenesten og dokumenter at den er implementert for krav #42."*

### 4. Atferdsbaserte tester som kontrakt, ikke coverage-mål

Erstatt coverage som kvalitetsmål med **antall scenarioer beskrevet i naturlig språk** (Gherkin/BDD). AI kan hjelpe til med å generere disse – men PO og utvikler må godkjenne dem før implementasjonen starter.

### 5. "Forståelsessprinten" etter generering

Sett av dedikert tid (f.eks. to dager) der teamet som skal jobbe i kodebasen går gjennom den AI-genererte koden *uten å skrive ny kode*. Målet er å identifisere hull i forståelsen, lage spørsmål og bygge mental modell før featureutviklingen starter.

### 6. Gradvis overlevering, ikke big bang

I stedet for å generere hele plattformen og så "overlevere" den, bør man generere én tjeneste om gangen – med en onboarding-runde mellom hver. Dette bremser hastigheten noe, men bevarer forståelse og eierskap.

---

## Bredere implikasjoner

### Resten av organisasjonen hengte ikke med

Juridisk, sikkerhet og compliance hadde ikke kapasitet til å følge tempoet. Én tjeneste (`payment-service`) ble deployet til staging uten at noen hadde vurdert PCI-DSS-implikasjonene.

Produktorganisasjonen, designere og andre stakeholders opplevde at teknologi beveget seg uten dem – ikke med dem.

### Koordineringsmekanismer som ikke skalerer

Tradisjonelle mekanismer som PR-review, sprint-planlegging og daglig standup er designet for en hastighet der ett menneske produserer X linjer kode per dag. Når X ganges med 10, kollapser disse rituene under volumet.

Teamet brukte mer tid på PR-review i uke 2 enn på selve utviklingen.

---

## Konklusjon

10x produksjonshastighet per utvikler er teknisk mulig med AI. Men organisasjonens evne til å **absorbere, forstå og koordinere** rundt kode skalerer ikke automatisk.

De kritiske flaskehalsene er ikke lenger tekniske – de er menneskelige og organisatoriske:

- **Forståelse** må bygges aktivt, det akkumuleres ikke automatisk
- **Sporbarhet** må designes inn fra starten, ikke etterinstalleres
- **Koordinering** krever eksplisitt domene-eierskap, ikke bare prosesser
- **Tillit til kode** er ikke gitt av testdekning – den kommer av at noen faktisk har lest og forstått koden

> Utfordringen er ikke å skrive mer kode. Utfordringen er å bygge en organisasjon som kan leve i den.

---

## Vedlegg

- `repos/10x-experiment/` – generert kodebase (alle 10 services)
- `retro-uke2.md` – retrospektiv med teamet etter fase 2
- `adr/` – ADR-er skrevet i etterkant som remedieringstiltak
