---
tema: "1 – Utvikler + agent i praksis"
---

# Tema 1 – Utvikler + agent i praksis

> **Til gruppen:** Fyll ut alle seksjoner. Det strukturerte sammendraget nederst (YAML-blokken) behandles av en språkmodell for å lage felles presentasjon — vær presis og kortfattet der.

---

## Forskningsspørsmål og hypoteser til inspirasjon

Velg én problemstilling, eller formuler en egen:

1. **Styringsmekanismer:** Hvilken kombinasjon av CLAUDE.md, egendefinerte slash-kommandoer og sub-agenter gir mest konsistent og forutsigbar agentatferd — og hvorfor? For eksempel: Gir det verdi å dokumentere koden kort og konsist i claude.md eller blir agenten forvirra siden dette også kan leses ut kode. 
2. **Autonomi vs. kontroll:** Gir tett, iterativ styring (mange korte instruksjoner) bedre sluttresultat enn å la agenten jobbe autonomt med én lang spesifikasjon?
3. **CI/CD-integrasjon:** Øker integrasjon med linting, statisk analyse og testdekning (via pre-commit hooks eller MCP-verktøy) kvaliteten på AI-generert kode målbart?
4. **Arbeidsfordeling:** Finnes det en naturlig grense for hvilke oppgaver som bør delegeres til en agent vs. gjøres av utvikleren selv — og hva kjennetegner den grensen?
5. **Feilbeskyttelse:** Reduserer eksplisitte forbud i agents.md ("aldri endre migrasjonsfiler") antallet destruktive agentfeil i praksis?

---

## Rapportmal

### 1. Gruppeinformasjon

| Felt | Verdi |
|---|---|
| Gruppenummer | *(nummer)* |
| Deltakere | *(navn)* |
| Dato(er) for eksperiment | *(dato)* |
| Verktøy/modeller brukt | *(f.eks. Claude Code, Copilot, Cursor, modellversjon)* |
| Repo / kodebase brukt | *(lenke eller beskrivelse)* |

---

### 2. Valgt problemstilling

**Forskningsspørsmål:**
*(Skriv inn det dere undersøker)*

**Hypotese:**
*(Hva tror dere svaret er — før dere begynner?)*

---

### 3. Eksperimentoppsett

#### Hva ble testet
*(Beskriv konkret oppgaven/featuren som ble implementert eller undersøkt)*

#### Betingelser
*(Minst to betingelser for sammenligning)*

| Betingelse | Beskrivelse |
|---|---|
| A – Baseline | *(beskriv)* |
| B – *(navn)* | *(beskriv)* |

#### Målemetoder
*(Hvordan vurderte dere resultater? Testdekning, manuell review, antall feil, tidsbruk, o.l.)*

---

### 4. Resultater

*(Presenter funn med tabeller, kodeeksempler eller sitater der det er nyttig)*

---

### 5. Diskusjon

#### Hva funket
*(Hva ga gode resultater og hvorfor?)*

#### Hva funket ikke
*(Utfordringer, overraskelser, avvik fra hypotesen)*

#### Begrensninger
*(Hva begrenser gyldigheten av funnene?)*

---

### 6. Konklusjon

*(1–3 setninger: hva er det viktigste dere lærte?)*

