# Manglende Super Mario Bros-features

Basert på nåværende implementasjon – hva som gjenstår for å ligne original Super Mario Bros.

## Høy prioritet (kjerne-mekanikk)

- [x] **Spørsmålsblokker (? blokker)** – slås fra under, gir mynt eller power-up
- [ ] **Mursteinsblokker** – kan knuses av stor Mario, bumpes av liten
- [x] **Rør (grønne pipes)** – hindringer og plattformer
- [ ] **Koopa Troopa** – skilpadde-fiende som kan trampes til skall og sparkes
- [ ] **Ildblomst (fire flower)** – andre power-up, gir evne til å skyte ildkuler
- [x] **Livssystem** – 3 liv, game over-skjerm ved tap av alle
- [x] **Nedtellingstimer** – per brett, tidsbonus ved flagg

## Middels prioritet (autentisitet)

- [ ] **Flaggstang-animasjon** – Mario glir ned stangen i stedet for å bare treffe flagget
- [ ] **Dødsanimasjon** – Mario spinner og faller ved treff
- [ ] **Løpeknapp** – hold knapp for høyere fart og lengre hopp
- [ ] **100 mynter = ekstra liv** – klassisk regel
- [ ] **Kombinasjonsbonus** – flerdreping gir 100 → 200 → 400 → 800 poeng
- [ ] **Piraña-planter** – popper opp fra rør
- [ ] **Stjerne (Starman)** – midlertidig uovervinnelighet + fiendedreping ved berøring

## Lav prioritet (polish)

- [ ] **Bevegelige plattformer** – horisontalt eller vertikalt
- [ ] **Bakgrunnsmusikk** – prosedyralt generert overworld-tema
- [ ] **Tidbonus-animasjon** – poengtelling etter flagg basert på gjenværende tid
- [ ] **Fyrverkeri ved brett-slutt** – basert på siste siffer i timer
- [ ] **Warp zones** – skjulte passasjer for å hoppe brett
- [ ] **Underground/castle-tema** – alternative visuelle stiler per brett

## Allerede implementert

- [x] Løp og hopp
- [x] 5 brett med progressiv vanskelighetsgrad
- [x] Goombas med patrol-AI
- [x] Mynter (22 per brett, synkronisert)
- [x] Sopp (power-up, dobbel størrelse)
- [x] Flagg med brett-overgang
- [x] Pixel-art grafikk (prosedyral)
- [x] 8-bit lyd (prosedyral, 7 lydeffekter)
- [x] Animasjons-state machine (idle/gå/hopp)
- [x] Leaderboard i sanntid
- [x] Multiplayer 2–4 spillere
- [x] Deploy på Railway
