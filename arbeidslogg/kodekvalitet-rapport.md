# Rapport: Kodekvalitet Variant A vs. Variant B

*Generert ved å kjøre prompten i [kodekvalitet-prompt.md](kodekvalitet-prompt.md)
mot de to BlackJack-implementasjonene.*

**Verktøy prøvd:** `eslint`, `jscpd`, `tsc` — ingen installert i miljøet.
Manuell analyse brukt per promptens instruks.

---

## Sammendrag

**Variant B vinner klart på testbarhet, lavere kompleksitet og endringsdyktighet
for I/O-nivå endringer.** **Variant A vinner på regel-dekning, type-presisjon
på domenedata (kort), og enkelhet for små tilleggsregler.** De to filene
optimaliserer for ulike ting — dette er ikke et tilfelle der den ene dominerer
på alle akser.

## 1. Sammenlignings-tabell

| Metrikk | Variant A | Variant B | Vinner |
|---|---|---|---|
| Totale linjer | 182 | 122 | B |
| Linjer ekskl. blanke/kommentarer | 151 | 105 | B |
| Antall funksjoner | 10 | 12 | B (mer oppdelt) |
| Max cyclomatic complexity (manuelt estimat) | `main` ≈ 16 | `result` ≈ 5 | B |
| Gjennomsnittlig CC | ~4.1 | ~2.6 | B |
| Max nesting-dybde | 5 (try→while→if→if→...) | 3 | B |
| Antall `let` / mutasjoner på tvers av funksjoner | 4+ (main muterer player/dealer/deck) | 2 (kun lokal `let` i `total`) | B |
| Ikke-trivielle duplikasjoner | `showFinal(...)` + konstruksjon av sluttmelding gjentas 7 ganger i main | Minimal; `result()` har én switch-lignende struktur | B |
| tsc --strict (ikke kjørt) | Antageligvis OK (non-null `!` på `deck.pop()` mister info) | Antageligvis OK (readonly-typer tydelig) | – |
| Type-presisjon for domene | `type Rank = 'A'\|'2'\|...`, `type Suit = ...` | `type Card = { rank: string, value: number }` | **A** |
| Spec-dekning (blackjack-vs-21, suits, bust-stopper-dealer) | Komplett | Mangler | **A** |

## 2. Lesbarhet

**Variant A:**

- `type Suit = '♠' | '♥' | '♦' | '♣'` ([variant-a/blackjack.ts:4](../eksperimenter/gruppe1.5/variant-a/blackjack.ts#L4)) — selvforklarende literal-union. B har mistet denne informasjonen.
- `main` fra [variant-a/blackjack.ts:89-180](../eksperimenter/gruppe1.5/variant-a/blackjack.ts#L89-L180) er en 90-linjers historie. Kommentarene (`// Spiller-tur`, `// Dealer-tur`, `// Avgjør`) brukes fordi strukturen ikke forteller selv.
- `parseInt(card.rank, 10)` på [variant-a/blackjack.ts:48](../eksperimenter/gruppe1.5/variant-a/blackjack.ts#L48) er uskjønt: Rank er en literal-union, så parseInt er en hack for tall-rangene. En `value`-lookup ville vært renere (slik B gjør).
- Repetert "sum:"-mønster 7 ganger i ulike utskrifter.

**Variant B:**

- `main` på [variant-b/blackjack.ts:107-120](../eksperimenter/gruppe1.5/variant-b/blackjack.ts#L107-L120) er 14 linjer. Formen forteller direkte: opprett rl, kjør spill, håndter feil.
- `runGame → newGame → playerTurn → dealerTurn → result` ([variant-b/blackjack.ts:86-104](../eksperimenter/gruppe1.5/variant-b/blackjack.ts#L86-L104)) leses som en pipeline.
- Navn som `afterPlayer`, `final`, `dealt` beskriver *tilstand*, ikke *handling* — tydeligere for rent-funksjonell stil.
- `type Card = { rank: string; value: number }` på [variant-b/blackjack.ts:4](../eksperimenter/gruppe1.5/variant-b/blackjack.ts#L4) er derimot *mindre* presis enn A. `rank: string` betyr at `{rank: "ZZZ", value: 5}` kompilerer. A ville flagget det.
- Rekursjon i `deal` ([variant-b/blackjack.ts:48-53](../eksperimenter/gruppe1.5/variant-b/blackjack.ts#L48-L53)) og `playerTurn` krever mer lese-arbeid enn en while-loop for en Java-/C#-vant leser.

**Vinner: B på makrostruktur, A på domenetyper.**

## 3. Endringsdyktighet

| Endring | Variant A | Variant B | Vinner |
|---|---|---|---|
| (a) Flere runder på rad | Refactor av `main`: flytt tråden i try-block inn i en løkke. Mange tidlige `return` inne må byttes mot `continue`/brudd. ~25-40 linjer endret. | Wrap `runGame` i `while (keepPlaying)` og gjør `newGame()` per runde. Eller endre så den gjenbruker deck. ~5-10 linjer. | **B** klart |
| (b) Double-Down | Legg til `'d'` i `askAction` (+2 linjer), og en if-gren i main's hit-håndtering (+5 linjer). Passer den imperative stilen. | Endre action-typen til `'h'\|'s'\|'d'`, oppdater `playerTurn`-signatur og callback-signatur. Mer overflate å endre. | **A** marginalt |
| (c) Bytt til web-UI | I/O gjennomsyrer `main` via `console.log` og `rl.question`. Må rippes ut fra ~15 steder. | Bytt ut `askAction` callback + endre `console.log` i `runGame`. Spill-logikken (`playerTurn`/`dealerTurn`/`result`) er I/O-fri og trenger ikke endring. | **B** klart |
| (d) Enhetstester for `handValue`/`total` | Rett fram: funksjonen er pure i begge varianter. | Samme. | – likt |
| (e) To spillere | `player: Card[]` → `players: Card[][]`. Main's spiller-tur-blokk må løpe per spiller. | `GameState.player: Hand` → `players: readonly Hand[]`. `playerTurn` må ta indeks. `result(state)` må oppdateres. Både har reelt arbeid å gjøre. | – likt, B litt lettere starting point |

**Vinner: B for strukturelle endringer (rekkefølge, UI, runde-logikk); like for regel-tillegg.**

## 4. Testbarhet

**Pure functions (testbare uten mock):**

Variant A:
- ✅ `buildDeck`, `cardLabel`, `handValue`, `isBlackjack`, `renderHand`
- ⚠️ `shuffle` — deterministisk hvis Math.random mockes
- ❌ Spiller-tur-logikk, dealer-tur-logikk, og resultat-bestemmelse er begravd i `main`. **Ingen mulighet til å enhetsteste dealerens 17-regel uten å starte hele spillet og mocke stdin.**

Variant B:
- ✅ `total`, `show`, `draw`, `deal`, `result`
- ⚠️ `newDeck`, `newGame` — trenger Math.random-mock
- ✅ `dealerTurn(state: GameState)` — ren funksjon. Du kan skrive `assertEq(dealerTurn({deck: [...], dealer: [kort1, kort2], player: []}).dealer.length, forventet)` uten mocking.
- ✅ `playerTurn(state, askAction)` — callback-injeksjon gjør det trivielt å teste: `await playerTurn(state, () => Promise.resolve('s'))`.

**Konkret test jeg ville skrevet:**

For dealer 17-regel (B):
```ts
const forced: GameState = {
  deck: [{rank:'5',value:5}, {rank:'6',value:6}],
  player: [],
  dealer: [{rank:'10',value:10},{rank:'6',value:6}] // sum 16
};
const after = dealerTurn(forced);
assert.equal(total(after.dealer), 21);  // trakk ett 5er
```
~5 linjer.

For samme regel (A): må refaktorere først — dealer-tur-løkken på [variant-a/blackjack.ts:151-155](../eksperimenter/gruppe1.5/variant-a/blackjack.ts#L151-L155) er inline i main. Ingen direkte entry-point. Må ekstrahere til funksjon før du kan teste.

**Vinner: B klart og betydelig.**

## Konklusjon

- **Designkvalitet (kompleksitet, struktur, separasjon, testbarhet): B vinner tydelig.** Lavere CC, ingen blandet mutability, rene funksjoner, I/O-isolert til `runGame`. Dette er *direkte* resultat av at teamet iterativt dyttet B mot immutability og separasjon — det skjedde ikke av seg selv.
- **Korrekthet og regel-detalj: A vinner tydelig.** A har blackjack-vs-21-skille, kulører, input-støtte for hele ord ("hit"/"stand"), header, og en tydelig `isBlackjack`-sjekk før spiller-tur. B mangler disse. Dette er *direkte* resultat av at speccen til A var detaljert, mens B ble bygget ut fra "lag en enkel blackjack".
- **Type-presisjon på domenedata: A vinner.** Literal-typer for `Rank`/`Suit` gir gratis valideringer som B har forkastet ved å bruke `string`.

## Ting som overrasket

1. **Linjetallet:** B er 33 % kortere enn A. Forventet motsatt, siden B har flere typer og rekursive helpere. Men A bruker mye plass på utskriftsvarianter (`showFinal(...)` kalt 7 ganger med tilpassede tekster).
2. **CC-forskjellen er størst i `main`, ikke i spill-logikken.** A's `main` har CC ≈ 16 mot B's CC ≈ 4, fordi hele orchestreringen ligger i A's main. Dette er ren arkitektur-gevinst, ikke fordi A har "mer logikk".
3. **B har en regel-regresjon.** `result()` på [variant-b/blackjack.ts:78-84](../eksperimenter/gruppe1.5/variant-b/blackjack.ts#L78-L84) behandler 21-fra-blackjack og 21-fra-trekk identisk. I A håndteres dette eksplisitt på [variant-a/blackjack.ts:110-123](../eksperimenter/gruppe1.5/variant-a/blackjack.ts#L110-L123). Dette er *ikke* et kodekvalitets-problem i klassisk forstand — men det viser at "bedre kode" (B) kan inneholde verre *oppførsel* enn "dårligere kode" (A).
4. **B mistet `type Rank`-literalen.** Da teamet fokuserte på strukturelle forbedringer, ble det ikke lagt merke til at domenetypene var slappere enn A's. Typene ble aldri en iterasjonstema.
5. **A's Ctrl+C-håndtering er (etter alt å dømme) ikke testet.** Teamet testet B og oppdaget at SIGINT-handler ikke fanger readline's AbortError — nøyaktig samme bug finnes sannsynligvis i A, på [variant-a/blackjack.ts:96-100](../eksperimenter/gruppe1.5/variant-a/blackjack.ts#L96-L100). Men A ble aldri runtime-testet her.
6. **Confirmation bias-varsel:** Agenten som genererte denne rapporten skrev B iterativt. Forsøk på å være objektiv har sannsynligvis ikke fullstendig unnsluppet bias. Det sterkeste motgift ville vært å gi prompten til en uavhengig agent som ikke har sett historikken.
