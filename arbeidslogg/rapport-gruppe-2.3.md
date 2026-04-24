---
tema: "Tema 2 – AI-assistert systemutvikling"
---

# Rapport: PO-drevet spesifikasjon og utvikling med AI-agent

## 1. Gruppeinformasjon

| Felt | Verdi |
|---|---|
| Gruppenummer | 2.3 |
| Deltakere | Haakon, Nils-Christian, Tobias |
| Tema | Tema 2 – AI-assistert systemutvikling |
| Dato(er) for eksperiment | 2026-04-24 |
| Verktøy/modeller brukt | Claude Code (Claude Opus 4.6), superpowers-skills for brainstorming, plan og subagent-drevet utvikling |
| Repo / kodebase / case brukt | [stein-griller](https://github.com/Scienta/stein-griller) – Instagram-innholdsverktøy for konro-grilling |

---

## 2. Valgt problemstilling

**Forskningsspørsmål:**
Kan en produkteier uten teknisk bakgrunn eller erfaring med AI-verktøy drive kravspesifikasjon og produktutvikling effektivt gjennom strukturert dialog med en AI-agent (Claude Code)?

**Hypotese:**
En strukturert samtaleprosess — der agenten stiller ett spørsmål om gangen med flervalgsalternativer — gjør at en ikke-teknisk PO kan styre utviklingen av en komplett applikasjon uten å måtte ta tekniske beslutninger direkte, og at resultatet bedre reflekterer det PO faktisk ønsker enn om en utvikler hadde tolket kravene alene.

---

## 3. Eksperimentoppsett

### Hva ble testet
Vi bygget en komplett nettapplikasjon ("Konro Content Tool") fra idé til fungerende produkt i én sesjon. Appen lar brukeren laste inn en Instagram-dataeksport, bla gjennom og velge innlegg, omskrive bildetekster til engasjerende engelsk via Claude API, og eksportere alt som en ZIP klar for manuell posting.

PO (steingriller-eieren) hadde et reelt behov: hente ut konro-grilling-poster fra sin norske Instagram-konto for å fylle en ny internasjonal konto. PO hadde ingen erfaring med AI-assistert utvikling eller Claude Code.

### Betingelser

| Betingelse | Beskrivelse |
|---|---|
| A - Strukturert dialog | Claude drev brainstorming med flervalg og ett spørsmål om gangen. PO tok alle produktbeslutninger. Designspec og plan ble validert før implementering. |
| B - Iterasjon med ekte data | PO testet appen med sin faktiske Instagram-eksport og ga direkte feedback. Endringer ble implementert umiddelbart i sanntid. |

Vi hadde ikke en baseline-variant (f.eks. "PO skriver kravdokument, utvikler implementerer alene"), men observasjonene gir likevel innsikt i prosessen.

### Målemetoder
- **Tidsbruk:** Tidsstempler fra git-historikk
- **Produktbeslutninger:** Antall og type beslutninger tatt av PO vs. agent
- **Kvalitet:** Antall bugs funnet med ekte data vs. antatt format
- **Iterasjonshastighet:** Tid fra PO-feedback til implementert endring

---

## 4. Resultater

### Tidsforbruk

| Fase | Tid | Varighet |
|---|---|---|
| Brainstorming (idé → godkjent design) | 13:35 – 14:13 | ~38 min |
| Implementeringsplan | 14:13 – 14:22 | ~9 min |
| Implementering (12 oppgaver, 15 filer, 29 tester) | 14:22 – 14:44 | ~22 min |
| Testing med ekte data + bugfiks | 14:44 – 15:10 | ~26 min |
| PO-drevne iterasjoner | 15:10 – 15:38 | ~28 min |
| **Totalt: idé til ferdig, testet app** | | **~2 timer** |

### Produktbeslutninger tatt av PO

PO tok alle vesentlige produktbeslutninger gjennom dialogen:

| Beslutning | POs valg |
|---|---|
| Datakilde | Instagram data-eksport (ZIP), ikke API eller scraping |
| Hva skal hentes ut | Bilder, tekster, hashtags, dato, post-type (ikke likes/kommentarer) |
| Scope | Uthenting + utvelgelse + omskriving (ikke automatisk posting) |
| Eksportformat | Én mappe per post (POs eget forslag, endret fra flat struktur) |
| Teksttone | "Kort og classy" — ikke direkte oversettelse, men kreativ omskriving |
| Musikksjangre | Stemningsfull, rap, punk rock i nouvelle vague-stil |
| UI-type | Nettapp i nettleseren |
| Lenker | PO påpekte at lenker fra originalpost må bevares |

### Bugs funnet med ekte data

| Bug | Årsak | Tid til fiks |
|---|---|---|
| `json.map is not a function` | Instagram-eksportens mappestruktur hadde dynamisk prefix og annen sti enn antatt. Parseren fant feil JSON-fil. | ~15 min |
| Norske tegn vises feil (Ã¸ → ø) | Instagram eksporterer UTF-8 som Latin-1 byte-sekvenser | Fikset samtidig |
| CORS-feil ved Claude API-kall | Nettleser-request krever spesiell header | ~2 min |
| Safari viser gammel kode etter fix | Aggressiv browser-caching av JavaScript | ~5 min |
| API-nøkkel ikke tilgjengelig på eksportside | Feltet fantes kun på opplastingssiden, ingen navigasjon tilbake | ~3 min |

### PO-drevne iterasjoner etter første versjon

| Feedback fra PO | Endring | Tid |
|---|---|---|
| "Teksten blir for lang. Kort og classy." | Omskrev system-prompt: maks 2-3 setninger, confident tone | ~2 min |
| "Vi trenger forslag til tre musikksjangre" | Tre forslag per post: mood, rap, nouvelle vague | ~3 min |
| "Kan vi få en play-knapp som spiller sangen?" | Spotify-søk per forslag | ~3 min |
| "Kan vi spille direkte?" | Inline 30s forhåndsvisning via iTunes API | ~4 min |

### Leveranse

- 15 kildefiler (4 biblioteksmoduler + 8 React-komponenter + 3 konfig/entry)
- 29 enhetstester (alle grønne)
- Produksjonsbygg: 310 KB JavaScript, 16 KB CSS
- 24 rene git-commits med beskrivende meldinger

---

## 5. Diskusjon

### Hva funket

**Flervalg senket terskelen dramatisk.** PO trengte null opplæring. Spørsmål som "Hva er scopet? A) Bare uthenting, B) Uthenting + oversettelse, C) Hele løypa" ga PO kontroll uten å kreve teknisk vokabular. PO svarte ofte med bare en bokstav ("b", "c") eller korte setninger.

**PO tok beslutninger agenten ikke kunne tatt.** Tone ("kort og classy"), musikksjangre ("nouvelle vague-stil"), eksportformat ("én mappe per post") — dette er produktvalg som krever domenekunnskap og smak. Agenten foreslo alternativer, PO valgte.

**Ekte data avslørte alt.** Ingen av de 5 bugene ville blitt funnet med syntetiske testdata. Instagram-eksportens faktiske format (dynamisk mappeprefix, feil sti, ødelagt encoding) var umulig å forutsi.

**Iterasjonshastigheten matchet samtaletempoet.** PO sa "for lang tekst", og 2 minutter senere var prompten endret og ny output klar. Dette er raskere enn en tradisjonell utvikler-PO-syklus med JIRA-tickets.

**Strukturert plan ga kontroll.** Designspec og implementeringsplan fungerte som en kontrakt mellom PO og agent. PO godkjente designet seksjon for seksjon. Implementeringen fulgte planen mekanisk (subagent per oppgave med TDD).

### Hva funket ikke

**Antakelser om dataformat var feil.** Vi brukte tid på brainstorming og design, men antok Instagram-eksportformatet uten å verifisere. Hadde vi hatt ZIP-filen tilgjengelig under designfasen, kunne vi spart ~20 min bugfiks.

**Caching-problemer var frustrerende.** Safari cachet gammel JavaScript aggressivt. PO opplevde at "fiksen ikke virket" flere ganger. Dette er et verktøy-/miljøproblem, ikke et AI-problem, men det brøt flyten.

**Bare 9 av ~280 poster i eksporten.** PO hadde sannsynligvis valgt en begrenset tidsperiode i Instagram. Vi oppdaget dette først etter at appen var ferdig. Burde vært avklart tidligere.

**Ingen baseline for sammenligning.** Vi testet kun den strukturerte varianten. Uten en "PO skriver fritekst-krav, utvikler tolker alene"-variant kan vi ikke kvantifisere forbedringen.

### Begrensninger

- N=1: Én PO, én app, én sesjon. Resultatene er anekdotiske.
- PO satt ved siden av utvikleren — ingen kommunikasjonskostnad utover selve samtalen.
- Appen er relativt enkel (SPA, ingen backend, ingen database). Mer komplekse systemer ville gitt andre utfordringer.
- Vi målte ikke hva som ville skjedd uten den strukturerte prosessen.

---

## 6. Konklusjon

En ikke-teknisk PO kan effektivt styre spesifikasjon og utvikling av en komplett applikasjon gjennom strukturert dialog med Claude Code — fra idé til fungerende produkt på ~2 timer. Nøklene er flervalg-spørsmål som senker terskelen, seksjonvis validering som gir kontroll, og rask iterasjon på ekte data som avslører reelle problemer. Den største risikoen er antakelser som ikke verifiseres mot virkeligheten (i vårt tilfelle: dataformatet).
