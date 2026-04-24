# Forskningsspørsmål og hypoteser til inspirasjon

---

## Tema 1 – Utvikler + agent i praksis

Velg én problemstilling, eller formuler en egen:

1. **Styringsmekanismer:** Hvilken kombinasjon av CLAUDE.md, egendefinerte slash-kommandoer og sub-agenter gir mest konsistent og forutsigbar agentatferd — og hvorfor? For eksempel: Gir det verdi å dokumentere koden kort og konsist i claude.md eller blir agenten forvirra siden dette også kan leses ut kode.
2. **Autonomi vs. kontroll:** Gir tett, iterativ styring (mange korte instruksjoner) bedre sluttresultat enn å la agenten jobbe autonomt med én lang spesifikasjon?
3. **CI/CD-integrasjon:** Øker integrasjon med linting, statisk analyse og testdekning (via pre-commit hooks eller MCP-verktøy) kvaliteten på AI-generert kode målbart?
4. **Arbeidsfordeling:** Finnes det en naturlig grense for hvilke oppgaver som bør delegeres til en agent vs. gjøres av utvikleren selv — og hva kjennetegner den grensen?
5. **Feilbeskyttelse:** Reduserer eksplisitte forbud i agents.md ("aldri endre migrasjonsfiler") antallet destruktive agentfeil i praksis?

---

## Tema 2 – AI-assistert systemutvikling

Velg én problemstilling, eller formuler en egen:

1. **Flyt fra behov til kode:** Kan en AI-assistert utviklingsflyt dekke hele kjeden fra brukerreise → spesifikasjon → implementasjon → test uten at kvaliteten faller sammenlignet med tradisjonell flyt?
2. **Spec-driven:** Gir det mening å bruke noen form for spec-rammeverk, eller holder det med github issues?
3. **Nye flaskehalser:** Når AI akselererer kodeskriving, oppstår det nye flaskehalser i review, kravstilling eller deploy — og hva er de?
4. **Krav-til-kode-sporbarhet:** Hvordan kan en AI-assistert flyt opprettholde sporbarhet mellom forretningskrav og implementasjon, og hva skjer hvis denne koblingen mangler?
5. **Teststrategier i AI-flyt:** Er testdekning et godt kvalitetsmål for AI-generert kode, eller er atferdsbaserte tester (BDD/Gherkin) mer meningsfulle?
6. **Produkteier-involvering:** Hvordan endres produkteierens rolle og innflytelse når utviklingshastigheten øker kraftig med AI-hjelp?

---

## Tema 3 – Lokal LLM i praksis

Velg én problemstilling, eller formuler en egen:

1. **Terskelen for "god nok":** For hvilke konkrete oppgavetyper (refaktorering, testskriving, dokumentasjon, bugfixing) er en lokal LLM god nok sammenlignet med en skybasert modell?
2. **Maskinvarekrav:** Hva er den laveste maskinvarekonfigurasjonen der en lokal modell gir akseptabel ytelse for utviklingsoppgaver — og hva er kompromissene?
3. **Personvern vs. kvalitet:** Gir behovet for å holde kode lokalt (personvern, forretningshemmeligheter) tilstrekkelig begrunnelse for å akseptere lavere modellkvalitet?
4. **Agentbruk lokalt:** Kan en lokal LLM brukes som agent (med verktøytilgang, filsystemoperasjoner) — og hva er de praktiske begrensningene?
5. **Offline og latens:** Hvilken praktisk fordel gir offline-tilgang og lavere latens i en utviklingsarbeidsflyt, og oppveier den kvalitetstapet?

---

## Tema 4 – Flere parallelle kodeagenter

Velg én problemstilling, eller formuler en egen:

1. **Koordinering:** Kan to eller flere kodeagenter som jobber parallelt på samme kodebase koordinere seg uten konflikter — og hvilke mekanismer krever det?
2. **Spesialisering:** Gir en arkitektur der én agent analyserer og detaljerer løsninger mens en annen implementerer dem, bedre resultater enn én generalist-agent?
3. **Merge-konflikter og dobbeltarbeid:** Hva skjer når parallelle agenter ikke er klar over hverandres arbeid — og hvordan kan det forhindres?
4. **Orkestrering:** Kan en overordnet "orkestrerings-agent" effektivt dele opp og delegere arbeid til sub-agenter, og hva er grensene for denne tilnærmingen?
5. **Kvalitetskontroll:** Kan én agent brukes som uavhengig reviewer av en annen agents kode — og er denne tilbakemeldingen nyttig i praksis?

---

## Tema 5 – Personlig assistent og automatisering av daglige oppgaver

Velg én problemstilling, eller formuler en egen:

1. **Funksjonell analyse:** Kan en språkmodell produsere brukbar funksjonell analyse (brukerhistorier, akseptansekriterier, domenekart) av tilstrekkelig kvalitet til at en utvikler kan bygge på den uten vesentlig omarbeid?
2. **Prosjektledelse:** Kan AI automatisere rutineoppgaver i prosjektledelse (statusrapporter, møtereferat, oppfølgingslister) — og hva er grensene for denne automatiseringen?
3. **Administrative oppgaver:** Hvilke administrative oppgaver (e-post, dokumentasjon, rapportering) egner seg best for automatisering med LLM, og hva kjennetegner dem?
4. **Konteksthåndtering:** Hvor mye kontekst må en personlig assistent ha for å gi nyttige svar over tid — og hvordan kan denne konteksten bygges opp og vedlikeholdes effektivt?
5. **Kvalitetsvurdering:** Hvordan vurderer brukerne kvaliteten på ikke-tekniske LLM-leveranser (tekst, analyse, planer) — og stemmer den subjektive opplevelsen med objektive mål?
