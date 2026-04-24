import { useState, useEffect, useRef } from 'react'
import { generateQuizQuestions } from './spotify/musicClient'
import type { QuizQuestion } from './spotify/musicClient'
import './QuizPage.css'
import './MusicQuizPage.css'

const TIMER_START = 30
const URGENCY_THRESHOLD = 10

interface Props {
  onFinish: (score: number, total: number) => void
}

export function MusicQuizPage({ onFinish }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [roundScores, setRoundScores] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_START)
  const [timedOut, setTimedOut] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    generateQuizQuestions().then(qs => {
      setQuestions(qs)
      setAnswers(new Array(qs.length).fill(null))
      setRoundScores(new Array(qs.length).fill(0))
      setIsGenerating(false)
    })
  }, [])

  const question = questions[currentIndex]
  const selectedOption = answers[currentIndex]
  const isAnswered = selectedOption !== null
  const isLastQuestion = currentIndex === questions.length - 1
  const isUrgent = timeLeft <= URGENCY_THRESHOLD && !isAnswered

  // Autoplay and reset timer when question changes
  useEffect(() => {
    if (!question) return
    setIsPlaying(false)
    setTimeLeft(TIMER_START)
    setTimedOut(false)
    audioRef.current?.pause()

    const audio = audioRef.current
    if (!audio) return
    audio.play().catch(() => {})
    setIsPlaying(true)
  }, [currentIndex, question])

  useEffect(() => {
    if (isAnswered || timedOut || timeLeft <= 0) return
    const tick = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearTimeout(tick)
  }, [timeLeft, isAnswered, timedOut])

  useEffect(() => {
    if (timeLeft !== 0 || timedOut || isAnswered) return
    setTimedOut(true)
    setAnswers(prev => {
      const next = [...prev]
      next[currentIndex] = ''
      return next
    })
  }, [timeLeft, timedOut, isAnswered, currentIndex])

  useEffect(() => {
    if (!timedOut) return
    const advance = setTimeout(() => {
      if (isLastQuestion) {
        const totalPoints = roundScores.reduce((a, b) => a + b, 0)
        onFinish(totalPoints, questions.length * 30000)
      } else {
        setCurrentIndex(prev => prev + 1)
      }
    }, 1500)
    return () => clearTimeout(advance)
  }, [timedOut, isLastQuestion, questions, roundScores, onFinish])

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
    const points = option === question.correctArtist
      ? Math.round(1000 + (timeLeft / TIMER_START) * 29000)
      : 0
    setRoundScores(prev => {
      const next = [...prev]
      next[currentIndex] = points
      return next
    })
    setAnswers(prev => {
      const next = [...prev]
      next[currentIndex] = option
      return next
    })
  }

  function handleNext() {
    if (isLastQuestion) {
      const totalPoints = roundScores.reduce((a, b) => a + b, 0)
      onFinish(totalPoints, questions.length * 30000)
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

  if (isGenerating) {
    return (
      <main className="quiz generating">
        <p className="generating-text">Genererer quiz...</p>
      </main>
    )
  }

  const progress = ((currentIndex + 1) / questions.length) * 100
  const currentTotal = roundScores.reduce((a, b) => a + b, 0)

  return (
    <main className="quiz">
      <div className="quiz-progress">
        <div className="quiz-progress-header">
          <span className="quiz-counter">
            Spørsmål {currentIndex + 1} av {questions.length}
          </span>
          <span className="quiz-score">
            {currentTotal.toLocaleString('nb-NO')} poeng
          </span>
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
            key={currentIndex}
            className="album-cover-blur"
            style={{ backgroundImage: `url(${question.artworkUrl})` }}
          />
          <div className="audio-overlay">
            <audio
              ref={audioRef}
              src={question.previewUrl}
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

        {isAnswered && !timedOut && (
          <button type="button" className="next-button" onClick={handleNext}>
            {isLastQuestion ? 'Se resultat' : 'Neste spørsmål'}
          </button>
        )}
      </div>
    </main>
  )
}
