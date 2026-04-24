import type { Genre } from '../genres'

export interface Player {
  id: string
  name: string
  score: number
  answered: boolean
  lastScore: number
}

export interface ClientQuestion {
  options: string[]
  previewUrl: string
  artworkUrl: string
}

export type GamePhase = 'lobby' | 'question' | 'question-result' | 'game-over'

export interface GameState {
  phase: GamePhase
  players: Player[]
  hostId: string
  genre: Genre
  currentQuestionIndex: number
  totalQuestions: number
  currentQuestion: ClientQuestion | null
  timeLeft: number
  correctAnswer: string | null
  roomCode: string
}

export type ClientMessage =
  | { type: 'join'; name: string }
  | { type: 'start-game'; genre: Genre }
  | { type: 'answer'; answer: string }

export type ServerMessage =
  | { type: 'game-state'; state: GameState }
  | { type: 'error'; message: string }
