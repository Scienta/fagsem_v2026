import { useState } from 'react'
import { questions } from './quiz/questions'
import './QuizPage.css'

interface Props {
  onFinish: (score: number) => void
}

export function QuizPage({ onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null)
  )

  const question = questions[currentIndex]
  const selectedOption = answers[currentIndex]
  const isAnswered = selectedOption !== null
  const isLastQuestion = currentIndex === questions.length - 1

  function handleSelect(index: number) {
    if (isAnswered) return
    setAnswers(prev => {
      const next = [...prev]
      next[currentIndex] = index
      return next
    })
  }

  function handleNext() {
    if (isLastQuestion) {
      const score = questions.filter((q, i) => answers[i] === q.correctIndex).length
      onFinish(score)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }

  function optionClass(index: number): string {
    if (!isAnswered) return 'option'
    if (index === question.correctIndex) return 'option correct'
    if (index === selectedOption) return 'option wrong'
    return 'option'
  }

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <main className="quiz">
      <div className="quiz-progress">
        <span className="quiz-counter">
          Spørsmål {currentIndex + 1} av {questions.length}
        </span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="quiz-content">
        <p className="question-text">{question.text}</p>
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={optionClass(index)}
              onClick={() => handleSelect(index)}
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
