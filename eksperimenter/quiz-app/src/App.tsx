import { useState } from 'react'
import './App.css'
import { LobbyPage } from './LobbyPage'
import { QuizPage } from './QuizPage'

type Page = 'lobby' | 'quiz'

function App() {
  const [page, setPage] = useState<Page>('lobby')

  if (page === 'quiz') {
    return <QuizPage onFinish={() => setPage('lobby')} />
  }
  return <LobbyPage onStart={() => setPage('quiz')} />
}

export default App
