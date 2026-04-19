# Tema 4 – Flere parallelle kodeagenter

Dette er **forslag til eksperimenter** for tema 4. Gruppen står fritt til å velge ett av forslagene under, tilpasse dem, eller definere **sitt eget eksperiment** innenfor temaet.

Målet er å utforske hvordan flere kodeagenter kan samarbeide om utvikling av et system eller en større feature.

## Eksperiment 1 – Del opp en feature i flere agentspor
**Hypotese:** En større feature kan utvikles raskere med flere parallelle agentspor, men bare hvis oppdelingen er god.

**Gjennomføring:**  
Velg en litt større feature og del den opp i for eksempel:
- backend
- frontend
- tester
- dokumentasjon

La separate agentøkter jobbe parallelt, og integrer resultatet til slutt.

**Observer:**  
- om oppdelingen fungerte
- hvor mye koordinering som måtte til
- hvor lett det var å integrere delene
- om parallellisering faktisk sparte tid

## Eksperiment 2 – Én orkestrerende utvikler, flere agenter
**Hypotese:** En menneskelig orkestrator gjør fleragent-flyten mer håndterbar og gir bedre helhet.

**Gjennomføring:**  
La én person være koordinator og delegere deloppgaver til flere agentøkter, for eksempel:
- én agent for kode
- én agent for tester
- én agent for analyse/review
- én agent for dokumentasjon

**Observer:**  
- hvor mye koordinering som kreves
- om én tydelig orkestrator hjelper
- hvor lett det er å miste oversikten
- om arbeidsformen skalerer

## Eksperiment 3 – Analyseagent + implementasjonsagent
**Hypotese:** Det kan gi bedre resultat å bruke én agent til analyse og detaljering, og en annen til implementasjon.

**Gjennomføring:**  
Bruk:
- én agent til å forstå oppgaven, foreslå løsning og bryte ned arbeidet
- én eller flere andre agenter til å implementere delene

**Observer:**  
- om arbeidsdelingen gir bedre kvalitet
- om det blir lettere å holde retning
- om analysearbeidet faktisk hjelper implementasjonen
- hvor misforståelser oppstår

## Eksperiment 4 – Parallelle agenter på samme område
**Hypotese:** Når flere agenter jobber i samme del av kodebasen, øker risikoen for konflikt og inkonsistens raskt.

**Gjennomføring:**  
La to eller flere agentspor gjøre endringer i samme område av kodebasen med litt ulikt mandat. Sammenlign og forsøk å integrere resultatene.

**Observer:**  
- hvor mye konflikt som oppstår
- om agentene drar i ulike retninger
- hvor mye samordning som trengs
- om dette er håndterbart i større skala

## Eksperiment 5 – Planlegg en større endring, gjennomfør med agenter: klarer vi å henge med?
**Hypotese:** Når flere agenter planlegger og implementerer større endringer raskt, kan menneskenes evne til å holde oversikt bli den nye flaskehalsen.

**Gjennomføring:**  
Velg en litt større endring eller feature. La agentene:
- foreslå oppdeling
- lage delplaner
- implementere parallelt

Teamet skal underveis forsøke å holde oversikt over:
- helhet
- avhengigheter
- kvalitet
- fremdrift

**Observer:**  
- hvor teamet mister oversikt
- hva som må koordineres eksplisitt
- om gevinsten i tempo oppveies av økt kompleksitet
- hvilke styringsmekanismer som virker nødvendige
