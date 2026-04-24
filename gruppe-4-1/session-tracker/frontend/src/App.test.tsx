import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { api } from './api'

vi.mock('./api', () => ({
  api: {
    getGroups: vi.fn(),
    getFindings: vi.fn(),
    getSessions: vi.fn(),
    startSession: vi.fn(),
    endSession: vi.fn(),
    logFinding: vi.fn(),
    getStats: vi.fn(),
  },
}))

const mockApi = vi.mocked(api)

describe('App', () => {
  beforeEach(() => {
    mockApi.getGroups.mockResolvedValue([])
    mockApi.getFindings.mockResolvedValue([])
    mockApi.getSessions.mockResolvedValue([])
    mockApi.getStats.mockResolvedValue([])
  })

  it('viser "Ingen aktive sesjoner." når sesjons-listen er tom', async () => {
    render(<App />)
    expect(await screen.findByText('Ingen aktive sesjoner.')).toBeInTheDocument()
  })

  it('rendrer gruppenavn når grupper er lastet', async () => {
    mockApi.getGroups.mockResolvedValue([
      { id: 'g1', name: 'Testgruppe Alpha', theme: 'AI', members: ['Alice'] },
      { id: 'g2', name: 'Testgruppe Beta', theme: 'Testing', members: ['Bob'] },
    ])

    render(<App />)

    expect(await screen.findByText('Testgruppe Alpha')).toBeInTheDocument()
    expect(await screen.findByText('Testgruppe Beta')).toBeInTheDocument()
  })

  it('viser funn-label og tekst i feed', async () => {
    mockApi.getFindings.mockResolvedValue([
      { id: 'f1', sessionId: 's1', text: 'Dette er et viktig funn', type: 'BLOCKER' },
      { id: 'f2', sessionId: 's1', text: 'En observasjon', type: 'OBSERVATION' },
    ])

    render(<App />)

    expect(await screen.findByText('Dette er et viktig funn')).toBeInTheDocument()
    expect(await screen.findByText('Blocker')).toBeInTheDocument()
    expect(await screen.findByText('En observasjon')).toBeInTheDocument()
    expect(await screen.findByText('Observasjon')).toBeInTheDocument()
  })

  it('"✓ Aktiv"-knapp er disabled for gruppe med aktiv sesjon', async () => {
    mockApi.getGroups.mockResolvedValue([
      { id: 'g1', name: 'Gruppe Alpha', theme: 'Utvikler + agent i praksis', members: ['Alice'] },
    ])
    mockApi.getSessions.mockResolvedValue([
      { id: 's1', groupId: 'g1', startedAt: '2026-01-01T00:00:00Z', status: 'ACTIVE' },
    ])

    render(<App />)

    const button = await screen.findByRole('button', { name: '✓ Aktiv' })
    expect(button).toBeDisabled()
  })

  it('viser feilmelding når getGroups feiler', async () => {
    mockApi.getGroups.mockRejectedValue(new Error('Network error'))

    render(<App />)

    expect(await screen.findByText('Klarte ikke hente grupper fra backend')).toBeInTheDocument()
  })

  it('statistikk-seksjon rendres med heading "Statistikk per tema"', async () => {
    render(<App />)
    expect(await screen.findByText('Statistikk per tema')).toBeInTheDocument()
  })

  it('statistikk tom tilstand viser "Ingen statistikk ennå — start en sesjon."', async () => {
    mockApi.getStats.mockResolvedValue([])
    render(<App />)
    expect(await screen.findByText('Ingen statistikk ennå — start en sesjon.')).toBeInTheDocument()
  })

  it('statistikk viser temanavnet når data er tilgjengelig', async () => {
    mockApi.getStats.mockResolvedValue([
      {
        theme: 'AI-assistert systemutvikling',
        groups: 3,
        sessionsActive: 1,
        sessionsDone: 0,
        findingsObservation: 2,
        findingsResult: 1,
        findingsBlocker: 0,
      },
    ])
    render(<App />)
    expect(await screen.findByText('AI-assistert systemutvikling')).toBeInTheDocument()
  })
})
