import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

type Card = { rank: string; value: number };
type Hand = readonly Card[];
type Deck = readonly Card[];
type GameState = {
  readonly deck: Deck;
  readonly player: Hand;
  readonly dealer: Hand;
};

const RANKS: readonly Card[] = [
  { rank: '2', value: 2 }, { rank: '3', value: 3 }, { rank: '4', value: 4 },
  { rank: '5', value: 5 }, { rank: '6', value: 6 }, { rank: '7', value: 7 },
  { rank: '8', value: 8 }, { rank: '9', value: 9 }, { rank: '10', value: 10 },
  { rank: 'J', value: 10 }, { rank: 'Q', value: 10 }, { rank: 'K', value: 10 },
  { rank: 'A', value: 11 },
];

function newDeck(): Deck {
  const deck: Card[] = [];
  for (let s = 0; s < 4; s++) {
    for (const r of RANKS) deck.push({ ...r });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function total(hand: Hand): number {
  let sum = hand.reduce((a, c) => a + c.value, 0);
  let aces = hand.filter(c => c.rank === 'A').length;
  while (sum > 21 && aces > 0) { sum -= 10; aces--; }
  return sum;
}

function show(hand: Hand): string {
  return hand.map(c => c.rank).join(' ');
}

function draw(deck: Deck): { card: Card; deck: Deck } {
  return { card: deck[deck.length - 1], deck: deck.slice(0, -1) };
}

function deal(deck: Deck, n: number): { hand: Hand; deck: Deck } {
  if (n === 0) return { hand: [], deck };
  const { card, deck: rest } = draw(deck);
  const next = deal(rest, n - 1);
  return { hand: [card, ...next.hand], deck: next.deck };
}

function newGame(): GameState {
  const { hand: player, deck: afterPlayerDeal } = deal(newDeck(), 2);
  const { hand: dealer, deck } = deal(afterPlayerDeal, 2);
  return { deck, player, dealer };
}

async function playerTurn(
  state: GameState,
  askAction: (current: Hand) => Promise<'h' | 's'>,
): Promise<GameState> {
  if (total(state.player) >= 21) return state;
  const action = await askAction(state.player);
  if (action === 's') return state;
  const { card, deck } = draw(state.deck);
  return playerTurn({ ...state, deck, player: [...state.player, card] }, askAction);
}

function dealerTurn(state: GameState): GameState {
  if (total(state.dealer) >= 17) return state;
  const { card, deck } = draw(state.deck);
  return dealerTurn({ ...state, deck, dealer: [...state.dealer, card] });
}

function result(state: GameState): string {
  const p = total(state.player), d = total(state.dealer);
  if (p > 21) return 'Bust – du taper.';
  if (d > 21 || p > d) return 'Du vinner!';
  if (p === d) return 'Uavgjort.';
  return 'Dealer vinner.';
}

async function runGame(rl: readline.Interface): Promise<void> {
  const dealt = newGame();

  async function askAction(current: Hand): Promise<'h' | 's'> {
    while (true) {
      console.log(`\nDealer viser: ${dealt.dealer[0].rank}`);
      console.log(`Din hånd: ${show(current)} (${total(current)})`);
      const answer = (await rl.question('(h)it eller (s)tand? ')).trim().toLowerCase();
      if (answer === 'h') return 'h';
      if (answer === 's') return 's';
    }
  }

  const afterPlayer = await playerTurn(dealt, askAction);
  const final = dealerTurn(afterPlayer);

  console.log(`\nDealer: ${show(final.dealer)} (${total(final.dealer)})`);
  console.log(`Du:     ${show(final.player)} (${total(final.player)})`);
  console.log(result(final));
}

async function main() {
  const rl = readline.createInterface({ input, output });
  try {
    await runGame(rl);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.log('\nAvbrutt. Ha det!');
    } else {
      throw err;
    }
  } finally {
    rl.close();
  }
}

main();
