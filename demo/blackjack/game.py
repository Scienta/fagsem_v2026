from .card import Deck
from .hand import Hand

STARTING_CHIPS = 100
MIN_BET = 10


class Game:
    def __init__(self):
        self.chips = STARTING_CHIPS
        self._deck = Deck()
        self.player_hand: Hand | None = None
        self.dealer_hand: Hand | None = None
        self._bet = 0

    def place_bet(self, amount: int) -> None:
        if amount < MIN_BET:
            raise ValueError(f"Minimum bet is {MIN_BET}")
        if amount > self.chips:
            raise ValueError("Not enough chips")
        self._bet = amount
        self.chips -= amount

    def deal(self) -> None:
        if len(self._deck) < 10:
            self._deck = Deck()
        self.player_hand = Hand()
        self.dealer_hand = Hand()
        for _ in range(2):
            self.player_hand.add(self._deck.deal())
            self.dealer_hand.add(self._deck.deal())

    def hit(self) -> None:
        self.player_hand.add(self._deck.deal())

    def dealer_play(self) -> None:
        while self.dealer_hand.value < 17:
            self.dealer_hand.add(self._deck.deal())

    def settle(self) -> int:
        """Returns winnings (net gain). 0 means push or loss."""
        player = self.player_hand.value
        dealer = self.dealer_hand.value

        if self.player_hand.is_bust:
            return 0

        if self.dealer_hand.is_bust or player > dealer:
            winnings = int(self._bet * 2.5) if self.player_hand.is_blackjack else self._bet * 2
            self.chips += winnings
            return winnings

        if player == dealer:
            self.chips += self._bet
            return 0

        return 0
