from .game import Game, MIN_BET


def main():
    game = Game()
    print("=== BLACKJACK ===")
    print(f"Du starter med {game.chips} chips.\n")

    while game.chips >= MIN_BET:
        print(f"Chips: {game.chips}")
        bet = _get_bet(game.chips)
        game.place_bet(bet)
        game.deal()

        print(f"\nDine kort:    {game.player_hand}  ({game.player_hand.value})")
        print(f"Dealer viser: {game.dealer_hand._cards[0]}  [skjult]")

        if game.player_hand.is_blackjack:
            print("BLACKJACK!")
        else:
            while not game.player_hand.is_bust:
                action = input("\n[h]it / [s]tand: ").strip().lower()
                if action == "h":
                    game.hit()
                    print(f"Dine kort: {game.player_hand}  ({game.player_hand.value})")
                elif action == "s":
                    break

        game.dealer_play()
        print(f"\nDine kort:    {game.player_hand}  ({game.player_hand.value})")
        print(f"Dealers kort: {game.dealer_hand}  ({game.dealer_hand.value})")

        winnings = game.settle()
        if game.player_hand.is_bust:
            print("Bust! Du tapte innsatsen.")
        elif winnings > 0:
            print(f"Du vant {winnings} chips!")
        elif game.player_hand.value == game.dealer_hand.value:
            print("Uavgjort.")
        else:
            print("Dealer vant.")
        print()

    print("Ikke nok chips til å fortsette. Spillet er over.")


def _get_bet(max_chips: int) -> int:
    while True:
        try:
            amount = int(input(f"Innsats ({MIN_BET}–{max_chips}): "))
            if MIN_BET <= amount <= max_chips:
                return amount
            print(f"Ugyldig beløp. Velg mellom {MIN_BET} og {max_chips}.")
        except ValueError:
            print("Skriv inn et heltall.")


if __name__ == "__main__":
    main()
