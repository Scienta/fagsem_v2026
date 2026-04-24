import { useState, useEffect, useRef } from 'react'
import { GENRES } from './genres'
import type { GameState } from './party/types'
import './QuizPage.css'
import './MusicQuizPage.css'

const TIMER_START = 30

interface Props {
  gameState: GameState
  myId: string
  onAnswer: (answer: string) => void
  onQuit: () => void
}

export function MusicQuizPage({ gameState, myId, onAnswer, onQuit }: Props) {
  const [myAnswer, setMyAnswer] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { phase, currentQuestion, timeLeft, correctAnswer, currentQuestionIndex, totalQuestions, players, genre } = gameState
  const { theme } = GENRES[genre]
  const themeClass = theme ? ` ${theme}` : ''
  const myPlayer = players.find(p => p.id === myId)
  const isUrgent = timeLeft <= 10 && phase === 'question' && myAnswer === null

  useEffect(() => {
    if (phase !== 'question') return
    setMyAnswer(null)

    const audio = audioRef.current
    if (!audio || !currentQuestion) return
    audio.pause()
    audio.load()
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }, [currentQuestionIndex, phase])

  useEffect(() => {
    if (phase === 'question-result' || phase === 'game-over') {
      audioRef.current?.pause()
      setIsPlaying(false)
    }
  }, [phase])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  function handleSelect(option: string) {
    if (myAnswer !== null || phase !== 'question') return
    audioRef.current?.pause()
    setIsPlaying(false)
    setMyAnswer(option)
    onAnswer(option)
  }

  function optionClass(option: string): string {
    if (phase === 'question') {
      if (myAnswer === null) return 'option'
      return option === myAnswer ? 'option selected' : 'option'
    }
    if (option === correctAnswer) return 'option correct'
    if (option === myAnswer && option !== correctAnswer) return 'option wrong'
    return 'option'
  }

  if (!currentQuestion) {
    return (
      <main className={`quiz generating${themeClass}`}>
        <p className="generating-text">Laster spørsmål...</p>
      </main>
    )
  }

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const unanswered = players.filter(p => !p.answered)

  if (phase === 'question-result') {
    return (
      <main className={`quiz${themeClass}`}>
        <div className="quiz-progress">
          <div className="quiz-progress-header">
            <span className="quiz-counter">Spørsmål {currentQuestionIndex + 1} av {totalQuestions}</span>
            <span className="quiz-score">{(myPlayer?.score ?? 0).toLocaleString('nb-NO')} poeng</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="quiz-content">
          <p className="question-text">
            Riktig svar: <strong>{correctAnswer}</strong>
          </p>

          {myPlayer && myPlayer.lastScore > 0 && (
            <p className="points-badge">+{myPlayer.lastScore.toLocaleString('nb-NO')} poeng</p>
          )}
          {myPlayer && myAnswer !== null && myPlayer.lastScore === 0 && (
            <p className="points-badge points-badge--zero">+0 poeng</p>
          )}

          <div className="mid-leaderboard">
            {sortedPlayers.map((player, i) => (
              <div
                key={player.id}
                className={`leaderboard-row${player.id === myId ? ' leaderboard-row--me' : ''}`}
              >
                <span className="leaderboard-rank">#{i + 1}</span>
                <span className="leaderboard-name">{player.name}</span>
                <span className="leaderboard-score">{player.score.toLocaleString('nb-NO')}</span>
                {player.lastScore > 0 && (
                  <span className="leaderboard-delta">+{player.lastScore.toLocaleString('nb-NO')}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`quiz${themeClass}`}>
      <div className="quiz-progress">
        <div className="quiz-progress-header">
          <span className="quiz-counter">Spørsmål {currentQuestionIndex + 1} av {totalQuestions}</span>
          <span className="quiz-score">{(myPlayer?.score ?? 0).toLocaleString('nb-NO')} poeng</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="timer-bar-track">
          <div
            className={`timer-bar${isUrgent ? ' timer-bar--urgent' : ''}`}
            style={{ width: `${(timeLeft / TIMER_START) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-content">
        <p className="question-text">Hvem er artisten?</p>

        <div className="audio-visual">
          <div
            key={currentQuestionIndex}
            className="album-cover-blur"
            style={{ backgroundImage: `url(${currentQuestion.artworkUrl})` }}
          />
          <div
            key={`sharp-${currentQuestionIndex}`}
            className={`album-cover-sharp${myAnswer !== null ? ' visible' : ''}`}
            style={{ backgroundImage: `url(${currentQuestion.artworkUrl})` }}
          />
          <div className="audio-overlay">
            <audio
              ref={audioRef}
              src={currentQuestion.previewUrl}
              onEnded={() => setIsPlaying(false)}
            />
            <button
              type="button"
              className={`play-button${isPlaying ? ' playing' : ''}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Spill av'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>

        <div className="options">
          {currentQuestion.options.map(option => (
            <button
              key={option}
              type="button"
              className={optionClass(option)}
              onClick={() => handleSelect(option)}
              disabled={myAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>

        {myAnswer !== null && (
          <p className="waiting-for-players">
            {unanswered.length > 0
              ? `Venter på ${unanswered.length} spiller${unanswered.length === 1 ? '' : 'e'}...`
              : 'Alle har svart!'}
          </p>
        )}

        <button type="button" className="quit-button" onClick={onQuit}>
          Avslutt quiz
        </button>
      </div>
    </main>
  )
}
