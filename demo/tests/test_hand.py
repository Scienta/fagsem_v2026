from blackjack.card import Card, Rank, Suit
from blackjack.hand import Hand


def _card(rank: Rank, suit: Suit = Suit.SPADES) -> Card:
    return Card(rank, suit)


def test_hand_value_two_cards():
    hand = Hand()
    hand.add(_card(Rank.KING))
    hand.add(_card(Rank.SEVEN))
    assert hand.value == 17


def test_ace_counts_as_11_by_default():
    hand = Hand()
    hand.add(_card(Rank.ACE))
    hand.add(_card(Rank.NINE))
    assert hand.value == 20


def test_ace_drops_to_1_to_avoid_bust():
    hand = Hand()
    hand.add(_card(Rank.ACE))
    hand.add(_card(Rank.KING))
    hand.add(_card(Rank.FIVE))
    assert hand.value == 16


def test_two_aces_adjusts_correctly():
    hand = Hand()
    hand.add(_card(Rank.ACE))
    hand.add(_card(Rank.ACE, Suit.HEARTS))
    assert hand.value == 12


def test_is_bust():
    hand = Hand()
    hand.add(_card(Rank.KING))
    hand.add(_card(Rank.QUEEN))
    hand.add(_card(Rank.THREE))
    assert hand.is_bust


def test_is_not_bust_at_21():
    hand = Hand()
    hand.add(_card(Rank.KING))
    hand.add(_card(Rank.ACE))
    assert not hand.is_bust


def test_is_blackjack():
    hand = Hand()
    hand.add(_card(Rank.ACE))
    hand.add(_card(Rank.KING))
    assert hand.is_blackjack


def test_not_blackjack_with_three_cards():
    hand = Hand()
    hand.add(_card(Rank.ACE))
    hand.add(_card(Rank.FIVE))
    hand.add(_card(Rank.FIVE))
    assert not hand.is_blackjack
