import { useState } from 'react'
import './App.css'
import { LobbyPage } from './LobbyPage'
import { QuizPage } from './QuizPage'
import { MusicQuizPage } from './MusicQuizPage'
import { ResultsPage } from './ResultsPage'
import { questions } from './quiz/questions'

type Page = 'lobby' | 'general-quiz' | 'music-quiz' | 'results'
type QuizMode = 'points' | 'count'

function App() {
  const [page, setPage] = useState<Page>('lobby')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [quizMode, setQuizMode] = useState<QuizMode>('count')

  function handleFinish(finalScore: number, quizTotal: number) {
    setScore(finalScore)
    setTotal(quizTotal)
    setPage('results')
  }

  if (page === 'general-quiz') {
    return (
      <QuizPage onFinish={(s) => handleFinish(s, questions.length)} />
    )
  }
  if (page === 'music-quiz') {
    return (
      <MusicQuizPage onFinish={(s, total) => handleFinish(s, total)} />
    )
  }
  if (page === 'results') {
    return (
      <ResultsPage score={score} total={total} mode={quizMode} onPlayAgain={() => setPage('lobby')} />
    )
  }
  return (
    <LobbyPage
      onStartGeneral={() => { setQuizMode('count'); setPage('general-quiz') }}
      onStartMusic={() => { setQuizMode('points'); setPage('music-quiz') }}
    />
  )
}

export default App
