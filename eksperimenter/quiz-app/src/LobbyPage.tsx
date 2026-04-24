interface Props {
  onStart: () => void
}

export function LobbyPage({ onStart }: Props) {
  return (
    <main className="lobby">
      <div className="lobby-card">
        <span className="lobby-icon" aria-hidden="true">⚡</span>
        <h1 className="lobby-title">Quizzard</h1>
        <p className="lobby-tagline">Test your knowledge. Prove your mastery.</p>
        <button className="lobby-start" type="button" onClick={onStart}>
          Start Quiz
        </button>
      </div>
    </main>
  )
}
