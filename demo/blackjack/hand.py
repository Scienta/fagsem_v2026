from .card import Card, Rank


class Hand:
    def __init__(self):
        self._cards: list[Card] = []

    def add(self, card: Card) -> None:
        self._cards.append(card)

    @property
    def value(self) -> int:
        total = sum(card.rank.points for card in self._cards)
        aces = sum(1 for card in self._cards if card.rank == Rank.ACE)
        while total > 21 and aces:
            total -= 10
            aces -= 1
        return total

    @property
    def is_bust(self) -> bool:
        return self.value > 21

    @property
    def is_blackjack(self) -> bool:
        return len(self._cards) == 2 and self.value == 21

    def __str__(self) -> str:
        return "  ".join(str(card) for card in self._cards)

    def __len__(self) -> int:
        return len(self._cards)
