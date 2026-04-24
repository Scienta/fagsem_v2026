# Prompt: Sammenlign kodekvalitet mellom Variant A og Variant B

Utkast til en prompt som kan gis til en agent (eller brukes som sjekkliste
manuelt) for å vurdere kodekvalitet mellom de to BlackJack-implementasjonene
i Eksperiment 3.

---

```
Du skal sammenligne to TypeScript-implementasjoner av samme BlackJack-spill
og gi en ærlig, begrunnet vurdering av kodekvalitet.

KONTEKST
--------
To filer i samme repo:
- eksperimenter/gruppe1.5/variant-a/blackjack.ts
  – skrevet på én stor bestilling med detaljert spec (ingen iterativ feedback).
- eksperimenter/gruppe1.5/variant-b/blackjack.ts
  – skrevet gjennom 11 runder med feedback underveis fra team.

Begge skal kjøre med `node blackjack.ts` på Node 23.6+ (type-stripping,
ingen bygg-steg). Begge dekker samme kjerneflyt: én runde Blackjack med
hit/stand og dealer 17-regel. Men de har gjort ulike design-valg.

OPPGAVE
-------
Sammenlign variantene langs fire dimensjoner. Vær konkret – referer
fil:linje og identifikatorer, ikke generiske begreper.

1. KODEMETRIKKER (kvantitativt)
   Kjør relevante analyseverktøy. For TS er nærmeste PMD-ekvivalenter:
   - eslint + @typescript-eslint (complexity, max-depth, max-lines-per-function)
   - eslint-plugin-sonarjs (cognitive-complexity, no-duplicate-string)
   - jscpd (duplikasjon)
   - tsc --noEmit --strict (type-strenghet)
   - cloc eller wc -l (rå linjer)

   Rapporter for hver fil:
   - LOC (ekskl. blanke/kommentarer)
   - Cyclomatic complexity per funksjon (maks + gjennomsnitt)
   - Cognitive complexity per funksjon (maks + gjennomsnitt)
   - Maks nesting-dybde
   - Duplikasjon (% eller antall blokker)
   - Kompilerer under tsc --strict? Hvilke flagg feiler eventuelt?

   Hvis et verktøy ikke er installert: si det eksplisitt og gi et manuelt
   estimat, ikke fabrikker tall.

2. LESBARHET
   - Navngivning: er identifikatorer selvforklarende eller må leseren
     huske kontekst fra tidligere linjer?
   - Flyt: er det åpenbart hva main/runGame gjør ved første lesning?
   - Signal vs. støy: hvor mye destructuring/plumbing må leseren holde i
     hodet samtidig?
   - Typer: hjelper de lesingen eller øker de kompleksiteten?
   - Kommentarer: brukt der det gir verdi, eller manglende der det trengs?

3. ENDRINGSDYKTIGHET
   For hver av disse hypotetiske endringene, estimer for begge varianter:
   (a) Støtt flere runder på rad med samme kortstokk.
   (b) Legg til Double-Down (spiller dobler innsats, får ett kort, står).
   (c) Bytt UI fra terminal til web (HTML/DOM), behold spill-logikken.
   (d) Legg til enhetstester for total()-funksjonen uten å endre prod-kode.
   (e) Støtt 2 spillere mot samme dealer.

   For hver: hvor mange steder må endres? Hvilke design-valg hjelper/
   hindrer? Hvor stor regresjonsrisiko?

4. TESTBARHET
   - Hvor stor andel av logikken er pure functions (ingen I/O, ingen
     randomness, deterministisk)?
   - Hva avhenger av process/readline/Math.random?
   - Skisser konkrete unit-tester du ville skrevet for hver variant
     (uten å kjøre dem) og vurder vanskelighetsgrad:
     * total() med blandede hender (inkl. flere ess)
     * dealerTurn/dealerPlay (trekker til 17)
     * result() / resultat-bestemmelse ved push, bust, blackjack
     * Player-tur uten å mocke stdin

OUTPUT-FORMAT
-------------
1. Kort sammendrag (2–3 setninger).
2. Sammenlignings-tabell med metrikkene fra seksjon 1.
3. Én seksjon per dimensjon (2–4) med konkrete observasjoner.
   Referer fil:linje. Minst to konkrete eksempler per dimensjon.
4. Ærlig konklusjon: hvilken variant er bedre på hvilken akse, og hvorfor.
   Ikke bruk "begge har styrker" hvis den ene åpenbart vinner.
5. Liste over ting som overrasket deg underveis.

KRAV
----
- Ikke vær diplomatisk. Si det rett ut hvis én variant taper på en akse.
- Ikke beskriv hva Blackjack er eller hva speccen sa.
- Ikke foreslå fiks – målet er å sammenligne, ikke å forbedre.
- Hvis et verktøy ikke er tilgjengelig: si "ikke kjørt fordi X", ikke gjett.
- Merk: du vet hvilken variant som var iterativ. Være oppmerksom på
  confirmation bias – det er ikke gitt at iterativ alltid er bedre.
```

---

## Varianter å vurdere senere

- **Blind-evaluering:** kopier filene til `impl-1/impl-2` uten å røpe
  hvilken som er iterativ. Fjerner bias, men må settes opp.
- **Parallell kjøring:** la to uavhengige agenter vurdere, sammenlign svar.
- **Score per dimensjon (1–5):** mer strukturert, men fare for falsk presisjon.
