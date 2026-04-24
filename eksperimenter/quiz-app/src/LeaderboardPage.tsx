import type { GameState } from './party/types'
import { GENRES } from './genres'
import './ResultsPage.css'

interface Props {
  gameState: GameState
  onPlayAgain: () => void
}

const MEDALS = ['🥇', '🥈', '🥉']

export function LeaderboardPage({ gameState, onPlayAgain }: Props) {
  const { theme } = GENRES[gameState.genre]
  const themeClass = theme ? ` ${theme}` : ''
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)

  return (
    <main className={`results${themeClass}`}>
      <div className="results-card">
        <span className="results-icon" aria-hidden="true">🏆</span>
        <h1 className="results-title">Resultater</h1>

        <div className="final-leaderboard">
          {sortedPlayers.map((player, i) => (
            <div
              key={player.id}
              className={`leaderboard-row${i === 0 ? ' leaderboard-row--winner' : ''}`}
            >
              <span className="leaderboard-rank">{MEDALS[i] ?? `#${i + 1}`}</span>
              <span className="leaderboard-name">{player.name}</span>
              <span className="leaderboard-score">{player.score.toLocaleString('nb-NO')}</span>
            </div>
          ))}
        </div>

        <button className="play-again-button" type="button" onClick={onPlayAgain}>
          Spill igjen
        </button>
      </div>
    </main>
  )
}
