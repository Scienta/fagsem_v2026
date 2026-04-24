import './ResultsPage.css'

interface Props {
  score: number
  total: number
  onPlayAgain: () => void
}

function feedbackMessage(score: number, total: number): string {
  const ratio = score / total
  if (ratio === 1) return 'Perfekt! Du er en ekte Quizzard!'
  if (ratio >= 0.8) return 'Imponerende! Du kan fagene dine.'
  if (ratio >= 0.6) return 'Bra jobbet! Litt mer øving, så er du der.'
  if (ratio >= 0.4) return 'Ikke verst! Prøv igjen for en bedre score.'
  return 'Bedre lykke neste gang!'
}

export function ResultsPage({ score, total, onPlayAgain }: Props) {
  return (
    <main className="results">
      <div className="results-card">
        <span className="results-icon" aria-hidden="true">🏆</span>
        <h1 className="results-title">Quiz fullført!</h1>
        <div className="score-display">
          <span className="score-number">{score.toLocaleString('nb-NO')}</span>
          <span className="score-total">poeng</span>
        </div>
        <p className="results-feedback">{feedbackMessage(score, total)}</p>
        <button className="play-again-button" type="button" onClick={onPlayAgain}>
          Spill igjen
        </button>
      </div>
    </main>
  )
}
