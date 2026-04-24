import { useState } from 'react'
import { GENRES, GENRE_ORDER, type Genre } from './genres'
import type { GameState } from './party/types'

interface Props {
  gameState: GameState
  myId: string
  onStartGame: (genre: Genre) => void
  onLeave: () => void
}

export function WaitingRoomPage({ gameState, myId, onStartGame, onLeave }: Props) {
  const [selectedGenre, setSelectedGenre] = useState<Genre>('mixed')
  const isHost = gameState.hostId === myId
  const hostName = gameState.players.find(p => p.id === gameState.hostId)?.name ?? 'hosten'

  return (
    <main className="lobby">
      <div className="lobby-card">
        <div className="room-code-block">
          <p className="room-code-label">Romkode</p>
          <p className="room-code">{gameState.roomCode}</p>
        </div>

        <div className="waiting-players">
          <p className="lobby-genre-label">Spillere ({gameState.players.length}/5)</p>
          {gameState.players.map(player => (
            <div key={player.id} className="waiting-player">
              <span className="waiting-player-name">{player.name}</span>
              {player.id === gameState.hostId && <span className="host-badge">Host</span>}
            </div>
          ))}
        </div>

        {isHost ? (
          <>
            <p className="lobby-genre-label">Velg sjanger</p>
            <div className="genre-grid">
              {GENRE_ORDER.map(key => {
                const genre = GENRES[key]
                return (
                  <button
                    key={key}
                    type="button"
                    data-genre={key}
                    className={`genre-button${selectedGenre === key ? ' selected' : ''}`}
                    onClick={() => setSelectedGenre(key)}
                  >
                    <span className="genre-emoji">{genre.emoji}</span>
                    {genre.label}
                  </button>
                )
              })}
            </div>
            <button
              className="lobby-start"
              type="button"
              onClick={() => onStartGame(selectedGenre)}
            >
              Start quiz
            </button>
          </>
        ) : (
          <p className="waiting-message">Venter på at {hostName} starter...</p>
        )}

        <button className="quit-button" type="button" onClick={onLeave}>
          Forlat rom
        </button>
      </div>
    </main>
  )
}
