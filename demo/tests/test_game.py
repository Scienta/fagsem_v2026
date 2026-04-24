import pytest
from blackjack.card import Card, Rank, Suit
from blackjack.game import Game, MIN_BET, STARTING_CHIPS
from blackjack.hand import Hand


def _make_hand(*ranks: Rank) -> Hand:
    hand = Hand()
    for rank in ranks:
        hand.add(Card(rank, Suit.SPADES))
    return hand


def test_game_starts_with_correct_chips():
    assert Game().chips == STARTING_CHIPS


def test_place_bet_deducts_chips():
    game = Game()
    game.place_bet(20)
    assert game.chips == STARTING_CHIPS - 20


def test_place_bet_below_minimum_raises():
    with pytest.raises(ValueError):
        Game().place_bet(MIN_BET - 1)


def test_place_bet_above_chips_raises():
    game = Game()
    with pytest.raises(ValueError):
        game.place_bet(game.chips + 1)


def test_deal_gives_two_cards_each():
    game = Game()
    game.place_bet(MIN_BET)
    game.deal()
    assert len(game.player_hand) == 2
    assert len(game.dealer_hand) == 2


def test_hit_adds_card_to_player():
    game = Game()
    game.place_bet(MIN_BET)
    game.deal()
    before = len(game.player_hand)
    game.hit()
    assert len(game.player_hand) == before + 1


def test_dealer_plays_until_17():
    game = Game()
    game.place_bet(MIN_BET)
    game.deal()
    game.dealer_play()
    assert game.dealer_hand.value >= 17


def test_player_bust_returns_no_winnings():
    game = Game()
    game.place_bet(MIN_BET)
    game.deal()
    game.player_hand = _make_hand(Rank.KING, Rank.QUEEN, Rank.THREE)
    game.dealer_hand = _make_hand(Rank.SEVEN, Rank.EIGHT)
    assert game.settle() == 0


def test_player_wins_returns_double_bet():
    game = Game()
    bet = 20
    game.place_bet(bet)
    game.deal()
    game.player_hand = _make_hand(Rank.KING, Rank.NINE)
    game.dealer_hand = _make_hand(Rank.SEVEN, Rank.EIGHT)
    winnings = game.settle()
    assert winnings == bet * 2


def test_blackjack_pays_2_5x():
    game = Game()
    bet = 20
    game.place_bet(bet)
    game.deal()
    game.player_hand = _make_hand(Rank.ACE, Rank.KING)
    game.dealer_hand = _make_hand(Rank.SEVEN, Rank.EIGHT)
    winnings = game.settle()
    assert winnings == int(bet * 2.5)


def test_push_returns_bet():
    game = Game()
    bet = 20
    chips_before = game.chips - bet
    game.place_bet(bet)
    game.deal()
    game.player_hand = _make_hand(Rank.KING, Rank.EIGHT)
    game.dealer_hand = _make_hand(Rank.KING, Rank.EIGHT)
    game.settle()
    assert game.chips == chips_before + bet
