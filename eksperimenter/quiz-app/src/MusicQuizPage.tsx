import { useState, useEffect, useRef } from 'react'
import { musicQuestions } from './quiz/musicQuestions'
import { fetchPreviewUrl } from './spotify/spotifyClient'
import './QuizPage.css'
import './MusicQuizPage.css'

interface Props {
  onFinish: (score: number) => void
}

export function MusicQuizPage({ onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(
    () => new Array(musicQuestions.length).fill(null)
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const question = musicQuestions[currentIndex]
  const selectedOption = answers[currentIndex]
  const isAnswered = selectedOption !== null
  const isLastQuestion = currentIndex === musicQuestions.length - 1

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setPreviewUrl(null)
    setIsPlaying(false)

    fetchPreviewUrl(question.spotifyTrackId)
      .then(url => {
        if (!cancelled) {
          setPreviewUrl(url)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [question.spotifyTrackId])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  function handleSelect(option: string) {
    if (isAnswered) return
    audioRef.current?.pause()
    setIsPlaying(false)
    setAnswers(prev => {
      const next = [...prev]
      next[currentIndex] = option
      return next
    })
  }

  function handleNext() {
    if (isLastQuestion) {
      const score = musicQuestions.filter((q, i) => answers[i] === q.correctArtist).length
      onFinish(score)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  function optionClass(option: string): string {
    if (!isAnswered) return 'option'
    if (option === question.correctArtist) return 'option correct'
    if (option === selectedOption) return 'option wrong'
    return 'option'
  }

  const progress = ((currentIndex + 1) / musicQuestions.length) * 100

  return (
    <main className="quiz">
      <div className="quiz-progress">
        <span className="quiz-counter">
          Spørsmål {currentIndex + 1} av {musicQuestions.length}
        </span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="quiz-content">
        <p className="question-text">Hvem er artisten?</p>

        <div className="audio-player">
          {isLoading && <p className="audio-status">Laster inn sang...</p>}
          {!isLoading && !previewUrl && (
            <p className="audio-status">Forhåndsvisning ikke tilgjengelig</p>
          )}
          {previewUrl && (
            <>
              <audio ref={audioRef} src={previewUrl} onEnded={() => setIsPlaying(false)} />
              <button
                type="button"
                className={`play-button${isPlaying ? ' playing' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Spill av'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </>
          )}
        </div>

        <div className="options">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              className={optionClass(option)}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
            >
              {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <button type="button" className="next-button" onClick={handleNext}>
            {isLastQuestion ? 'Se resultat' : 'Neste spørsmål'}
          </button>
        )}
      </div>
    </main>
  )
}
