import { useState, useEffect } from 'react'
import PartySocket from 'partysocket'
import './App.css'
import { LobbyPage } from './LobbyPage'
import { WaitingRoomPage } from './WaitingRoomPage'
import { MusicQuizPage } from './MusicQuizPage'
import { LeaderboardPage } from './LeaderboardPage'
import type { GameState, ServerMessage, ClientMessage } from './party/types'
import type { Genre } from './genres'

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999'

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function App() {
  const [socket, setSocket] = useState<PartySocket | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [myId, setMyId] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => { socket?.close() }
  }, [socket])

  function connect(roomCode: string, playerName: string) {
    const ws = new PartySocket({ host: PARTYKIT_HOST, room: roomCode.toLowerCase() })

    ws.addEventListener('open', () => {
      setMyId(ws.id)
      sendMsg(ws, { type: 'join', name: playerName })
    })

    ws.addEventListener('message', (event: MessageEvent) => {
      const msg = JSON.parse(event.data as string) as ServerMessage
      if (msg.type === 'game-state') {
        setGameState(msg.state)
        setError(null)
      } else if (msg.type === 'error') {
        setError(msg.message)
      }
    })

    setSocket(ws)
  }

  function sendMsg(ws: PartySocket, msg: ClientMessage) {
    ws.send(JSON.stringify(msg))
  }

  function handleCreateRoom(playerName: string) {
    connect(generateRoomCode(), playerName)
  }

  function handleJoinRoom(roomCode: string, playerName: string) {
    connect(roomCode, playerName)
  }

  function handleStartGame(genre: Genre) {
    if (!socket) return
    sendMsg(socket, { type: 'start-game', genre })
  }

  function handleAnswer(answer: string) {
    if (!socket) return
    sendMsg(socket, { type: 'answer', answer })
  }

  function handleLeave() {
    socket?.close()
    setSocket(null)
    setGameState(null)
    setError(null)
  }

  if (!socket || !gameState) {
    return <LobbyPage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} error={error} />
  }

  if (gameState.phase === 'lobby') {
    return (
      <WaitingRoomPage
        gameState={gameState}
        myId={myId}
        onStartGame={handleStartGame}
        onLeave={handleLeave}
      />
    )
  }

  if (gameState.phase === 'game-over') {
    return <LeaderboardPage gameState={gameState} onPlayAgain={handleLeave} />
  }

  return (
    <MusicQuizPage
      gameState={gameState}
      myId={myId}
      onAnswer={handleAnswer}
      onQuit={handleLeave}
    />
  )
}

export default App
