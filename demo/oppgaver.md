# Oppgaver – Blackjack demo

Bruk disse oppgavene til å teste lokal LLM i en agentarbeidsform.
Kjør agenten med modellen dere vil teste, og observer hva som skjer i hvert steg.

Start alltid med å kjøre testene for å bekrefte at alt er grønt:
```
cd demo/
python3 -m pytest -q
```

---

## Oppgave 1 – Enkel (anbefalt som første test)

**Legg til en `is_soft`-egenskap på `Hand`-klassen.**

En hånd er *soft* hvis den har minst ett ess som fortsatt teller som 11.
Eksempel: Ess + 6 = soft 17. Ess + Konge + 6 = 17, men ikke soft (esset teller som 1).

Forventet av agenten:
- Les og forstå `hand.py`
- Implementer `is_soft` som en `@property`
- Skriv minst to tester i `tests/test_hand.py`
- Kjør testene og bekreft at alt er grønt

**Hva dere observerer:**
- Forstår modellen håndens verdi-logikk?
- Skriver den riktig kant-case (to ess, ess + bust-situasjon)?
- Trenger den hjelp til å finne riktig fil?

---

## Oppgave 2 – Middels

**Legg til "double down".**

Spilleren skal kunne doble innsatsen etter første deal, men får da nøyaktig ett kort til og kan ikke velge hit igjen.

Regler:
- Kun tilgjengelig på de to første kortene
- Trekker penger fra `chips` (samme beløp som opprinnelig innsats)
- Spilleren får ett kort, deretter er det dealer sin tur
- Vinn/tap-logikk er ellers den samme

Forventet av agenten:
- Les og forstå `game.py` og `main.py`
- Legg til `double_down()`-metode i `Game`
- Oppdater CLI-løkken i `main.py` med `[d]ouble`-valg
- Skriv tester i `tests/test_game.py`
- Kjør testene og bekreft at alt er grønt

**Hva dere observerer:**
- Klarer den å holde oversikt over to filer samtidig?
- Håndterer den chip-logikken riktig?
- Blir CLI-koden ryddig eller rotete?

---

## Oppgave 3 – Kompleks

**Legg til en persistent high score-liste.**

Etter hvert spill skal resultatet lagres hvis det er blant de fem beste (flest chips).
High score-listen vises når spillet starter.

Krav:
- Lagres i `scores.json` i samme mappe som spillet kjøres fra
- Maks 5 oppføringer, sortert på chips (høyest øverst)
- Spilleren oppgir navn før første runde
- Etter at spilleren er tom for chips (eller avslutter), lagres resultatet hvis det kvalifiserer
- Filen opprettes automatisk hvis den ikke finnes

Forventet av agenten:
- Les og forstå hele kodebasen
- Planlegg hvor score-logikken hører hjemme (ny fil? i `game.py`? i `main.py`?)
- Implementer
- Skriv tester (hint: bruk `tmp_path`-fixture i pytest for å isolere fil-IO)
- Kjør testene og bekreft at alt er grønt

**Hva dere observerer:**
- Klarer den å planlegge arkitekturen selv?
- Holder den orden på fil-IO og testbarhet?
- Begynner flyten å svikte her? Hvor?

---

## Oppgave 4 – Åpen (real-world issue)

**Implementer Early Pruning-optimalisering for RAPTOR transfer relaxation i OpenTripPlanner.**

Issue: [opentripplanner/OpenTripPlanner#7470](https://github.com/opentripplanner/OpenTripPlanner/issues/7470)
Paper: https://arxiv.org/abs/2603.12592

RAPTOR itererer over alle utgående transfer-kanter fra hvert oppdatert stopp. Ved tette grafer (lang max transfer-tid) dominerer dette query-tiden. Early Pruning kutter unødvendige iterasjoner ved å sortere kanter etter varighet og avbryte tidlig.

**Hva som skal implementeres:**
- **Preprocessing:** Sorter utgående transfer-kanter per stopp i ikke-synkende rekkefølge på varighet (én gang ved graph build)
- **Query-time pruning:** Under transfer relaxation, avbryt loopen når `ankomsttid_ved_stopp + transfer_varighet ≥ beste_ankomsttid_til_destinasjon`
- Gjelder både Standard RAPTOR (ankomsttid) og McRAPTOR
- Systemparameter `otp.raptor.earlyPruning` (aktivert som standard)

**Forventet gevinst:** 14–21% raskere transit-spørringer ved 30–90 min max transfer.

Forventet av agenten:
- Les og forstå RAPTOR transfer relaxation-koden i OTP
- Foreslå hvor sortering og pruning skal legges til
- Implementer endringene
- Verifiser at eksisterende tester passerer

**Hva dere observerer:**
- Klarer modellen å navigere en stor, ukjent Java-kodebase?
- Forstår den algoritmen godt nok til å plassere endringene riktig?
- Hvor mye kontekst må gis manuelt?
- Begynner flyten å svikte — og hvor?

---

## Tips til gjennomføring

- Kjør én oppgave av gangen
- La agenten jobbe relativt fritt, og noter når dere griper inn
- Bruk `python3 -m pytest -q` etter hvert steg
- Logg observasjoner i `arbeidslogg/eksperimentlogg.md` underveis
