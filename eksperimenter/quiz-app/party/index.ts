import type * as Party from 'partykit/server'
import { generateQuizQuestions } from '../src/spotify/musicClient'
import { GENRES } from '../src/genres'
import type { ClientMessage, GameState, Player, ClientQuestion } from '../src/party/types'
import type { Genre } from '../src/genres'
import type { QuizQuestion } from '../src/spotify/musicClient'

const TIMER_DURATION = 30
const QUESTION_RESULT_DURATION = 4000
const MAX_QUESTION_SCORE = 30000
const MIN_QUESTION_SCORE = 1000
const MAX_PLAYERS = 5
const QUESTIONS_COUNT = 10

export default class QuizRoom implements Party.Server {
  private questions: QuizQuestion[] = []
  private questionStartTime = 0
  private timerInterval: ReturnType<typeof setInterval> | null = null
  private state: GameState

  constructor(private readonly room: Party.Room) {
    this.state = {
      phase: 'lobby',
      players: [],
      hostId: '',
      genre: 'mixed',
      currentQuestionIndex: 0,
      totalQuestions: QUESTIONS_COUNT,
      currentQuestion: null,
      timeLeft: TIMER_DURATION,
      correctAnswer: null,
      roomCode: this.room.id.toUpperCase(),
    }
  }

  onConnect(conn: Party.Connection) {
    conn.send(JSON.stringify({ type: 'game-state', state: this.state }))
  }

  onClose(conn: Party.Connection) {
    const remaining = this.state.players.filter(p => p.id !== conn.id)
    const newHostId =
      this.state.hostId === conn.id && remaining.length > 0
        ? remaining[0].id
        : this.state.hostId

    this.state = { ...this.state, players: remaining, hostId: newHostId }
    this.broadcast()
  }

  async onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message) as ClientMessage

    if (msg.type === 'join') {
      this.handleJoin(msg.name, sender)
    } else if (msg.type === 'start-game') {
      await this.handleStartGame(msg.genre, sender)
    } else if (msg.type === 'answer') {
      this.handleAnswer(msg.answer, sender)
    }
  }

  private handleJoin(name: string, conn: Party.Connection) {
    if (this.state.phase !== 'lobby') {
      conn.send(JSON.stringify({ type: 'error', message: 'Spillet er allerede i gang' }))
      return
    }
    if (this.state.players.length >= MAX_PLAYERS) {
      conn.send(JSON.stringify({ type: 'error', message: 'Rommet er fullt (maks 5 spillere)' }))
      return
    }
    if (this.state.players.some(p => p.id === conn.id)) return

    const isFirst = this.state.players.length === 0
    const player: Player = { id: conn.id, name, score: 0, answered: false, lastScore: 0 }

    this.state = {
      ...this.state,
      players: [...this.state.players, player],
      hostId: isFirst ? conn.id : this.state.hostId,
    }
    this.broadcast()
  }

  private async handleStartGame(genre: Genre, conn: Party.Connection) {
    if (conn.id !== this.state.hostId) return
    if (this.state.phase !== 'lobby') return

    this.questions = await generateQuizQuestions(GENRES[genre].terms, QUESTIONS_COUNT)

    this.state = {
      ...this.state,
      genre,
      currentQuestionIndex: 0,
      players: this.state.players.map(p => ({ ...p, score: 0, answered: false, lastScore: 0 })),
    }

    this.startQuestion()
  }

  private startQuestion() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }

    const q = this.questions[this.state.currentQuestionIndex]
    this.questionStartTime = Date.now()

    const clientQuestion: ClientQuestion = {
      options: q.options,
      previewUrl: q.previewUrl,
      artworkUrl: q.artworkUrl,
    }

    this.state = {
      ...this.state,
      phase: 'question',
      currentQuestion: clientQuestion,
      timeLeft: TIMER_DURATION,
      correctAnswer: null,
      players: this.state.players.map(p => ({ ...p, answered: false, lastScore: 0 })),
    }
    this.broadcast()

    this.timerInterval = setInterval(() => {
      this.state = { ...this.state, timeLeft: Math.max(0, this.state.timeLeft - 1) }
      this.broadcast()

      if (this.state.timeLeft <= 0) {
        clearInterval(this.timerInterval!)
        this.timerInterval = null
        this.endQuestion()
      }
    }, 1000)
  }

  private endQuestion() {
    const q = this.questions[this.state.currentQuestionIndex]
    this.state = { ...this.state, phase: 'question-result', correctAnswer: q.correctArtist }
    this.broadcast()

    setTimeout(() => {
      const isLast = this.state.currentQuestionIndex >= this.questions.length - 1
      if (isLast) {
        this.state = { ...this.state, phase: 'game-over' }
        this.broadcast()
      } else {
        this.state = { ...this.state, currentQuestionIndex: this.state.currentQuestionIndex + 1 }
        this.startQuestion()
      }
    }, QUESTION_RESULT_DURATION)
  }

  private handleAnswer(answer: string, conn: Party.Connection) {
    if (this.state.phase !== 'question') return

    const idx = this.state.players.findIndex(p => p.id === conn.id)
    if (idx === -1 || this.state.players[idx].answered) return

    const q = this.questions[this.state.currentQuestionIndex]
    const elapsed = (Date.now() - this.questionStartTime) / 1000
    const timeLeft = Math.max(0, TIMER_DURATION - elapsed)
    const points =
      answer === q.correctArtist
        ? Math.round(MIN_QUESTION_SCORE + (timeLeft / TIMER_DURATION) * (MAX_QUESTION_SCORE - MIN_QUESTION_SCORE))
        : 0

    const updatedPlayers = this.state.players.map((p, i) =>
      i === idx ? { ...p, answered: true, score: p.score + points, lastScore: points } : p
    )
    this.state = { ...this.state, players: updatedPlayers }
    this.broadcast()

    if (updatedPlayers.every(p => p.answered)) {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      setTimeout(() => this.endQuestion(), 500)
    }
  }

  private broadcast() {
    this.room.broadcast(JSON.stringify({ type: 'game-state', state: this.state }))
  }
}
