# Tema 1 – Utvikler + agent i praksis

Dette er **forslag til eksperimenter** for tema 1. Gruppen står fritt til å velge ett av forslagene under, tilpasse dem, eller definere **sitt eget eksperiment** innenfor temaet.

Målet er å få hands-on erfaring med hvordan man best kan jobbe sammen med en AI-agent i det daglige utviklingsarbeidet.

## Eksperiment 1 – Samme oppgave, ulike styringsnivåer
**Hypotese:** Mer kontekst, tydeligere føringer og repo-spesifikke regler gir bedre resultat enn en løs bestilling.

**Gjennomføring:**  
Velg en liten oppgave i demo-repoet og løs den i 2–3 varianter:
- minimal instruksjon
- mer kontekst og tydeligere mål
- med `Claude.md`, repo-guide eller eksplisitte regler for struktur, test og kvalitet

**Observer:**  
- kvalitet på resultatet
- hvor mye oppfølging som trengs
- om agenten følger eksisterende mønstre
- hvor lett det er å stole på endringene

## Eksperiment 2 – Test først vs. kode først
**Hypotese:** Når agenten starter med tester eller akseptansekriterier, blir implementasjonen mer presis og lettere å kvalitetssikre.

**Gjennomføring:**  
Velg en liten feature og løs den i to varianter:
- agenten går rett til implementasjon
- agenten starter med tester, akseptansekriterier eller testbar spesifikasjon

**Observer:**  
- om resultatet blir mer korrekt
- om review blir enklere
- om testene hjelper agenten å holde retning
- total tidsbruk

## Eksperiment 3 – Feedback-loop vs. én stor bestilling
**Hypotese:** En iterativ feedback-loop gir bedre resultat enn å gi én stor bestilling og vente på ferdig svar.

**Gjennomføring:**  
Velg en liten oppgave og løs den i to varianter:
- én stor instruksjon, minimalt med inngripen
- flere korte iterasjoner med tilbakemelding underveis

**Observer:**  
- hvor mye kvaliteten forbedres av iterasjon
- hvor ofte agenten bommer første gang
- hvor mye styring som faktisk trengs
- om teamet får bedre forståelse underveis

## Eksperiment 4 – Bygge med ukjent teknologi
**Hypotese:** AI-agenter senker terskelen for å jobbe i språk, biblioteker eller rammeverk utvikleren ikke kan fra før, men ikke uten risiko.

**Gjennomføring:**  
Velg en liten oppgave som skal løses i:
- et språk gruppen ikke kjenner godt
- et ukjent bibliotek eller rammeverk
- eller et nytt verktøy i eksisterende stack

Bruk agent CLI til å komme i gang og gjennomføre så langt dere rekker.

**Observer:**  
- hvor langt dere kommer
- hvor mye dere forstår av det som produseres
- hva agenten hjelper mest med
- hvor det blir risikabelt å stole på agenten

## Eksperiment 5 – Lage en skill eller MCP for bedre agentflyt
**Hypotese:** Det kan gi verdi å utvide agentarbeidsflyten med en gjenbrukbar skill eller MCP for bestemte typer oppgaver.

**Gjennomføring:**  
Velg en liten, konkret oppgave dere ofte kunne hatt nytte av, og test enten:
- å lage en enkel skill/workflow-beskrivelse
- å lage eller koble på en enkel MCP/integrasjon

**Observer:**  
- om dette faktisk forbedrer agentens nytte
- om gevinsten kommer raskt nok til å være verdt innsatsen
- hvilke oppgaver som egner seg best
