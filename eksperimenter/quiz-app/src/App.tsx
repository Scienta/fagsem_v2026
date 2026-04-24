import { useState } from 'react'
import './App.css'
import { LobbyPage } from './LobbyPage'
import { MusicQuizPage } from './MusicQuizPage'
import { ResultsPage } from './ResultsPage'
import { GENRES, type Genre } from './genres'

type Page = 'lobby' | 'music-quiz' | 'results'

function App() {
  const [page, setPage] = useState<Page>('lobby')
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [genre, setGenre] = useState<Genre>('mixed')

  function handleFinish(finalScore: number, quizTotal: number) {
    setScore(finalScore)
    setTotal(quizTotal)
    setPage('results')
  }

  if (page === 'music-quiz') {
    return <MusicQuizPage genre={genre} onFinish={(s, t) => handleFinish(s, t)} />
  }
  if (page === 'results') {
    return (
      <ResultsPage
        score={score}
        total={total}
        theme={GENRES[genre].theme}
        onPlayAgain={() => setPage('lobby')}
      />
    )
  }
  return <LobbyPage onStart={g => { setGenre(g); setPage('music-quiz') }} />
}

export default App
