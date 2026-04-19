# Tema 3 – Lokal LLM i praksis

Dette er **forslag til eksperimenter** for tema 3. Gruppen står fritt til å velge ett av forslagene under, tilpasse dem, eller definere **sitt eget eksperiment** innenfor temaet.

Målet er å få praktisk erfaring med når lokal LLM fungerer godt nok, og hva man vinner eller taper sammenlignet med skybaserte modeller.

## Eksperiment 1 – Samme oppgave, lokal vs. sky
**Hypotese:** Lokal LLM kan være god nok til noen utviklingsoppgaver, men har tydelige begrensninger sammenlignet med skybaserte modeller.

**Gjennomføring:**  
Velg en liten oppgave i demo-repoet og løs den med:
- lokal modell via agent CLI
- skybasert modell via agent CLI

**Observer:**  
- kvalitet på kode og forslag
- tid til brukbart resultat
- stabilitet og presisjon
- hvor mye ekstra styring lokal modell trenger

## Eksperiment 2 – Hvilke oppgaver duger lokal LLM til?
**Hypotese:** Lokal LLM fungerer bedre på noen oppgavetyper enn andre.

**Gjennomføring:**  
Test lokal modell på 2–3 ulike typer oppgaver, for eksempel:
- forklare eksisterende kode
- skrive tester
- implementere en liten feature
- foreslå refaktorering
- lage dokumentasjon

**Observer:**  
- hvilke oppgaver den håndterer godt
- hvor den blir for svak eller upresis
- om den fortsatt er nyttig som støtte

## Eksperiment 3 – Kan struktur kompensere for svakere modell?
**Hypotese:** En svakere lokal modell fungerer bedre når oppgaven brytes ned og gis tydeligere kontekst.

**Gjennomføring:**  
Løs én liten oppgave med lokal modell i to varianter:
- løs og generell instruksjon
- tydelig oppdelt oppgave med avgrensning, kontekst og kvalitetskrav

**Observer:**  
- om struktur løfter kvaliteten
- hvor mye ekstra arbeid brukeren må gjøre
- om det gjør lokal bruk praktisk nok

## Eksperiment 4 – Lokal LLM med agentarbeidsform
**Hypotese:** Lokal modell fungerer på mindre og tydeligere agentoppgaver, men møter raskt grenser når flyten blir mer kompleks.

**Gjennomføring:**  
Velg en oppgave med flere steg, for eksempel:
- forstå kode
- foreslå plan
- implementere
- teste

Kjør den med lokal modell og se hvor flyten begynner å svikte.

**Observer:**  
- hvor robust agentflyten føles
- hvilke steg som fungerer dårligst
- hvor mye oppfølging som trengs
- om lokal modell egner seg best som delassistent

## Eksperiment 5 – Hvilken lokal modell gir best trade-off?
**Hypotese:** Ulike lokale modeller har tydelig ulike styrker, og “god nok” avhenger av oppgave og maskinvare.

**Gjennomføring:**  
Sammenlign 2–3 lokale modeller på samme lille oppgave eller oppgavesett.

**Observer:**  
- kvalitet vs. responstid
- ressursbruk
- styrbarhet
- hvilken modell som gir mest praktisk nytte
