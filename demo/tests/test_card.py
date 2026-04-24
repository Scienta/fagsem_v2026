import pytest
from blackjack.card import Card, Deck, Rank, Suit


def test_card_str():
    card = Card(Rank.ACE, Suit.SPADES)
    assert str(card) == "A♠"


def test_face_card_points_is_10():
    assert Card(Rank.KING, Suit.HEARTS).rank.points == 10
    assert Card(Rank.QUEEN, Suit.DIAMONDS).rank.points == 10
    assert Card(Rank.JACK, Suit.CLUBS).rank.points == 10


def test_deck_has_52_cards():
    assert len(Deck()) == 52


def test_deck_deal_reduces_size():
    deck = Deck()
    deck.deal()
    assert len(deck) == 51


def test_deck_raises_when_empty():
    deck = Deck()
    for _ in range(52):
        deck.deal()
    with pytest.raises(ValueError):
        deck.deal()
