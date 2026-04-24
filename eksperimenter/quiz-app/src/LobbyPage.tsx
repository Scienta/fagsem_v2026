import { useState } from 'react'
import { GENRES, GENRE_ORDER, type Genre } from './genres'

interface Props {
  onStart: (genre: Genre) => void
}

export function LobbyPage({ onStart }: Props) {
  const [selectedGenre, setSelectedGenre] = useState<Genre>('mixed')

  return (
    <main className="lobby">
      <div className="lobby-card">
        <span className="lobby-icon" aria-hidden="true">⚡</span>
        <h1 className="lobby-title">Øreprøven</h1>
        <p className="lobby-tagline">Test your knowledge. Prove your mastery.</p>
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
        <button className="lobby-start" type="button" onClick={() => onStart(selectedGenre)}>
          Start quiz
        </button>
      </div>
    </main>
  )
}
