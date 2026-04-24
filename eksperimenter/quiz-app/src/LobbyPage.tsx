interface Props {
  onStartGeneral: () => void
  onStartMusic: () => void
}

export function LobbyPage({ onStartGeneral, onStartMusic }: Props) {
  return (
    <main className="lobby">
      <div className="lobby-card">
        <span className="lobby-icon" aria-hidden="true">⚡</span>
        <h1 className="lobby-title">Quizzard</h1>
        <p className="lobby-tagline">Test your knowledge. Prove your mastery.</p>
        <div className="lobby-buttons">
          <button className="lobby-start" type="button" onClick={onStartGeneral}>
            Vanlig quiz
          </button>
          <button className="lobby-start secondary" type="button" onClick={onStartMusic}>
            Musikk-quiz
          </button>
        </div>
      </div>
    </main>
  )
}
