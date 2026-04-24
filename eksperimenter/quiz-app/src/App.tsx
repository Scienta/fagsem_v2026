import { useState } from 'react'
import './App.css'
import { LobbyPage } from './LobbyPage'
import { MusicQuizPage } from './MusicQuizPage'
import { ResultsPage } from './ResultsPage'

type Page = 'lobby' | 'music-quiz' | 'results'

function App() {
  const [page, setPage] = useState<Page>('lobby')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  function handleFinish(finalScore: number, quizTotal: number) {
    setScore(finalScore)
    setTotal(quizTotal)
    setPage('results')
  }

  if (page === 'music-quiz') {
    return <MusicQuizPage onFinish={(s, t) => handleFinish(s, t)} />
  }
  if (page === 'results') {
    return <ResultsPage score={score} total={total} onPlayAgain={() => setPage('lobby')} />
  }
  return <LobbyPage onStart={() => setPage('music-quiz')} />
}

export default App
