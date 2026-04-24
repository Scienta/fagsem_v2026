import { useState } from 'react'

interface Props {
  onCreateRoom: (playerName: string) => void
  onJoinRoom: (roomCode: string, playerName: string) => void
  error: string | null
}

type Mode = 'home' | 'create' | 'join'

export function LobbyPage({ onCreateRoom, onJoinRoom, error }: Props) {
  const [mode, setMode] = useState<Mode>('home')
  const [playerName, setPlayerName] = useState('')
  const [roomCode, setRoomCode] = useState('')

  if (mode === 'create') {
    return (
      <main className="lobby">
        <div className="lobby-card">
          <span className="lobby-icon" aria-hidden="true">⚡</span>
          <h1 className="lobby-title">Øreprøven</h1>
          <p className="lobby-tagline">Opprett et nytt rom</p>
          <input
            className="lobby-input"
            type="text"
            placeholder="Ditt navn"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && playerName.trim()) onCreateRoom(playerName.trim()) }}
            maxLength={20}
            autoFocus
          />
          {error && <p className="lobby-error">{error}</p>}
          <button
            className="lobby-start"
            type="button"
            onClick={() => onCreateRoom(playerName.trim())}
            disabled={!playerName.trim()}
          >
            Opprett rom
          </button>
          <button className="lobby-back" type="button" onClick={() => setMode('home')}>
            Tilbake
          </button>
        </div>
      </main>
    )
  }

  if (mode === 'join') {
    return (
      <main className="lobby">
        <div className="lobby-card">
          <span className="lobby-icon" aria-hidden="true">⚡</span>
          <h1 className="lobby-title">Øreprøven</h1>
          <p className="lobby-tagline">Bli med i et rom</p>
          <input
            className="lobby-input"
            type="text"
            placeholder="Ditt navn"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <input
            className="lobby-input lobby-input--code"
            type="text"
            placeholder="Romkode (f.eks. ABCD)"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
            onKeyDown={e => {
              if (e.key === 'Enter' && playerName.trim() && roomCode.length === 4)
                onJoinRoom(roomCode, playerName.trim())
            }}
            maxLength={4}
          />
          {error && <p className="lobby-error">{error}</p>}
          <button
            className="lobby-start"
            type="button"
            onClick={() => onJoinRoom(roomCode, playerName.trim())}
            disabled={!playerName.trim() || roomCode.length !== 4}
          >
            Bli med
          </button>
          <button className="lobby-back" type="button" onClick={() => setMode('home')}>
            Tilbake
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="lobby">
      <div className="lobby-card">
        <span className="lobby-icon" aria-hidden="true">⚡</span>
        <h1 className="lobby-title">Øreprøven</h1>
        <p className="lobby-tagline">Test your knowledge. Prove your mastery.</p>
        <div className="lobby-buttons">
          <button className="lobby-start" type="button" onClick={() => setMode('create')}>
            Opprett rom
          </button>
          <button className="lobby-start secondary" type="button" onClick={() => setMode('join')}>
            Bli med i rom
          </button>
        </div>
      </div>
    </main>
  )
}
