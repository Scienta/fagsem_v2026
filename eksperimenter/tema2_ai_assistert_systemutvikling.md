# Tema 2 – AI-assistert systemutvikling

Dette er **forslag til eksperimenter** for tema 2. Gruppen står fritt til å velge ett av forslagene under, tilpasse dem, eller definere **sitt eget eksperiment** innenfor temaet.

Det er ønskelig at grupper på dette sporet består av minst én med PO-/forretningsperspektiv og én eller to utviklere.

## Eksperiment 1 – Ad hoc behov vs. strukturert behov
**Hypotese:** Når AI-agenter brukes i utvikling, blir kvaliteten på behovsbeskrivelsen viktigere enn før.

**Gjennomføring:**  
Velg en liten feature og løs den i to varianter:
- PO beskriver behovet kort og løst
- PO og utvikler lager en tydeligere beskrivelse med mål, avgrensning og akseptansekriterier

Bruk agent CLI til implementasjon i begge variantene.

**Observer:**  
- forskjell i resultat
- hvor mye omarbeid som skyldes uklar behovsbeskrivelse
- om review blir enklere
- hva som burde vært tydeligere fra starten

## Eksperiment 2 – Plan først vs. kode først
**Hypotese:** Når agenten må lage en plan før den koder, får teamet bedre kontroll og fanger opp flere uklarheter tidlig.

**Gjennomføring:**  
Løs samme oppgave i to varianter:
- agenten går rett til implementasjon
- agenten lager først plan, deloppgaver, åpne spørsmål og testtilnærming

PO og utvikler vurderer planen før implementasjon.

**Observer:**  
- om planfasen avdekker behov for produktavklaringer
- om det blir færre feilspor
- om teamet opplever mer kontroll
- om planfasen fungerer som lettvekts produktstyring

## Eksperiment 3 – Kontinuerlig produktstyring vs. batching
**Hypotese:** Når utviklingstempoet øker med AI-agenter, fungerer hyppigere og tettere produktstyring bedre enn større batcher med avklaringer.

**Gjennomføring:**  
Velg en feature eller et lite sett med relaterte endringer og test:
- kontinuerlig styring: PO er tett på og gir små, hyppige avklaringer
- batching: PO gir en større bestilling i starten og er mindre tilgjengelig underveis

**Observer:**  
- hvor ofte det oppstår behov for nye avklaringer
- om PO blir en flaskehals
- om utviklerne begynner å ta produktvalg selv
- om batching fører til mer omarbeid

## Eksperiment 4 – Avklaringslogg underveis
**Hypotese:** I agentdrevet utvikling oppstår det flere små produkt- og løsningsbeslutninger underveis enn man kanskje tror.

**Gjennomføring:**  
Løs en konkret feature med agent CLI som normalt, men før en enkel logg hver gang det oppstår et valg eller en avklaring om for eksempel:
- funksjonell tolkning
- prioritering
- UX-valg
- avgrensning
- begreper
- unntakstilfeller

Etterpå kategoriserer gruppen hva som:
- burde vært spesifisert
- kunne vært besluttet av teamet
- burde vært en PO-beslutning
- ble antatt av agenten

**Observer:**  
- hvor mange produktnære valg som faktisk tas
- hvem som tar dem
- hvor agenten gjetter
- hvor nye flaskehalser oppstår

## Eksperiment 5 – Spec’ing med og uten rammeverk
**Hypotese:** En mer strukturert måte å skrive spec for agenter på, for eksempel med OpenSpec eller lignende, gir mer forutsigbare resultater enn frihåndsspesifisering.

**Gjennomføring:**  
Velg en liten feature og løs den i to varianter:
- vanlig oppgavebeskrivelse i fri form
- spesifikasjon laget med OpenSpec eller lignende rammeverk

Bruk deretter agent CLI til implementasjon.

**Observer:**  
- om det blir lettere å skrive god spec med rammeverk
- om agenten tolker oppgaven mer presist
- om review og kvalitetssikring blir enklere
- om rammeverket hjelper teamet å oppdage mangler tidligere
