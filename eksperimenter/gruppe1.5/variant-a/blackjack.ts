import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

type Card = {
  rank: Rank;
  suit: Suit;
};

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

function shuffle(deck: Card[]): Card[] {
  const copy = deck.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function cardLabel(card: Card): string {
  return `${card.rank}${card.suit}`;
}

function handValue(hand: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 'A') {
      aces += 1;
      total += 11;
    } else if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') {
      total += 10;
    } else {
      total += parseInt(card.rank, 10);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && handValue(hand) === 21;
}

function renderHand(hand: Card[]): string {
  return hand.map(cardLabel).join(' ');
}

function showPlayerTurn(player: Card[], dealer: Card[]): void {
  console.log('\n-- Din tur --');
  console.log(`Dealer viser: ${cardLabel(dealer[0])} [skjult]`);
  console.log(`Din hånd:    ${renderHand(player)}  (sum: ${handValue(player)})`);
}

function showFinal(player: Card[], dealer: Card[], message: string): void {
  console.log('\n-- Sluttstilling --');
  console.log(`Dealer: ${renderHand(dealer)}  (sum: ${handValue(dealer)})`);
  console.log(`Spiller: ${renderHand(player)}  (sum: ${handValue(player)})`);
  console.log(`\n${message}\n`);
}

async function askAction(rl: readline.Interface): Promise<'h' | 's'> {
  while (true) {
    const raw = await rl.question('Velg handling [h]it / [s]tand: ');
    const answer = raw.trim().toLowerCase();
    if (answer === 'h' || answer === 'hit') return 'h';
    if (answer === 's' || answer === 'stand') return 's';
    console.log('Ugyldig valg. Skriv "h" for hit eller "s" for stand.');
  }
}

async function main(): Promise<void> {
  const rl = readline.createInterface({ input, output });

  // Håndter Ctrl+C pent
  rl.on('close', () => {
    // no-op; ensure process can exit
  });
  process.on('SIGINT', () => {
    console.log('\nAvslutter. Ha det!');
    rl.close();
    process.exit(0);
  });

  try {
    const deck = shuffle(buildDeck());
    const player: Card[] = [deck.pop()!, deck.pop()!];
    const dealer: Card[] = [deck.pop()!, deck.pop()!];

    console.log('=== BLACKJACK ===');

    // Sjekk blackjack med en gang
    const playerBJ = isBlackjack(player);
    const dealerBJ = isBlackjack(dealer);

    if (playerBJ || dealerBJ) {
      if (playerBJ && dealerBJ) {
        showFinal(player, dealer, 'Begge har blackjack – uavgjort (push).');
      } else if (playerBJ) {
        showFinal(player, dealer, 'BLACKJACK! Du vinner.');
      } else {
        showFinal(player, dealer, 'Dealer har blackjack. Du taper.');
      }
      rl.close();
      return;
    }

    // Spiller-tur
    let playerStands = false;
    while (!playerStands) {
      showPlayerTurn(player, dealer);
      const action = await askAction(rl);
      if (action === 'h') {
        const card = deck.pop()!;
        player.push(card);
        console.log(`Du trakk: ${cardLabel(card)}`);
        const total = handValue(player);
        if (total > 21) {
          showFinal(player, dealer, `Bust! Du gikk over 21 (sum: ${total}). Du taper.`);
          rl.close();
          return;
        }
        if (total === 21) {
          playerStands = true; // tvunget stand på 21
        }
      } else {
        playerStands = true;
      }
    }

    // Dealer-tur
    console.log('\n-- Dealers tur --');
    console.log(`Dealer snur: ${renderHand(dealer)}  (sum: ${handValue(dealer)})`);
    while (handValue(dealer) < 17) {
      const card = deck.pop()!;
      dealer.push(card);
      console.log(`Dealer trekker: ${cardLabel(card)}  (sum: ${handValue(dealer)})`);
    }

    // Avgjør
    const playerTotal = handValue(player);
    const dealerTotal = handValue(dealer);

    if (dealerTotal > 21) {
      showFinal(player, dealer, `Dealer bust (sum: ${dealerTotal}). Du vinner!`);
    } else if (dealerTotal > playerTotal) {
      showFinal(player, dealer, `Dealer vinner (${dealerTotal} mot ${playerTotal}).`);
    } else if (dealerTotal < playerTotal) {
      showFinal(player, dealer, `Du vinner (${playerTotal} mot ${dealerTotal})!`);
    } else {
      showFinal(player, dealer, `Uavgjort (push) – begge har ${playerTotal}.`);
    }

    rl.close();
  } catch (err) {
    // readline kan kaste ved Ctrl+C; avslutt pent
    rl.close();
    if ((err as NodeJS.ErrnoException)?.code === 'ERR_USE_AFTER_CLOSE') {
      process.exit(0);
    }
    throw err;
  }
}

main();
