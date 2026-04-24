import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'

describe('api module', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mockFetch(responseBody: unknown) {
    return vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => responseBody,
    } as Response)
  }

  it('alle fetch-kall bruker /api-prefiks, ikke hardkodet port', async () => {
    const fetchSpy = mockFetch([])

    await api.getGroups()
    await api.getFindings()
    await api.getSessions()

    fetchSpy.mock.calls.forEach(([url]) => {
      expect(url as string).toMatch(/^\/api\//)
      expect(url as string).not.toMatch(/localhost:\d+/)
    })
  })

  it('POST sessions body inneholder ikke id eller startedAt', async () => {
    const fetchSpy = mockFetch({ id: 'x', groupId: 'g1', startedAt: '2026-01-01T00:00:00Z', status: 'ACTIVE' })

    await api.startSession('group-1')

    const callBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string)
    expect(callBody).not.toHaveProperty('id')
    expect(callBody).not.toHaveProperty('startedAt')
    expect(callBody).toHaveProperty('groupId', 'group-1')
  })

  it('endSession sender PATCH til riktig URL med status DONE', async () => {
    const fetchSpy = mockFetch({ id: 's1', groupId: 'g1', startedAt: '2026-01-01T00:00:00Z', status: 'DONE' })

    await api.endSession('session-123')

    const [url, init] = fetchSpy.mock.calls[0]
    expect(url as string).toBe('/api/sessions/session-123')
    expect(init?.method).toBe('PATCH')
    expect(JSON.parse(init?.body as string)).toEqual({ status: 'DONE' })
  })

  it('logFinding sender POST med text og type til riktig URL', async () => {
    const fetchSpy = mockFetch({ id: 'f1', sessionId: 's1', text: 'test', type: 'OBSERVATION' })

    await api.logFinding('session-123', 'test observasjon', 'OBSERVATION')

    const [url, init] = fetchSpy.mock.calls[0]
    expect(url as string).toBe('/api/sessions/session-123/findings')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(init?.body as string)).toEqual({ text: 'test observasjon', type: 'OBSERVATION' })
  })

  it('getSessions sender ?status=ACTIVE når status er spesifisert', async () => {
    const fetchSpy = mockFetch([])

    await api.getSessions('ACTIVE')

    expect(fetchSpy.mock.calls[0][0] as string).toBe('/api/sessions?status=ACTIVE')
  })
})
