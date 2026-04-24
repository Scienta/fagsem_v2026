import { useState } from 'react'
import './App.css'
import { LobbyPage } from './LobbyPage'
import { QuizPage } from './QuizPage'
import { ResultsPage } from './ResultsPage'
import { questions } from './quiz/questions'

type Page = 'lobby' | 'quiz' | 'results'

function App() {
  const [page, setPage] = useState<Page>('lobby')
  const [score, setScore] = useState(0)

  if (page === 'quiz') {
    return (
      <QuizPage
        onFinish={(finalScore) => {
          setScore(finalScore)
          setPage('results')
        }}
      />
    )
  }
  if (page === 'results') {
    return (
      <ResultsPage
        score={score}
        total={questions.length}
        onPlayAgain={() => setPage('lobby')}
      />
    )
  }
  return <LobbyPage onStart={() => setPage('quiz')} />
}

export default App
