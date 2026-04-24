import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'

describe('api module', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('alle fetch-kall bruker /api-prefiks, ikke hardkodet port', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response)

    await api.getGroups()
    await api.getFindings()

    fetchSpy.mock.calls.forEach(([url]) => {
      expect(url as string).toMatch(/^\/api\//)
      expect(url as string).not.toMatch(/localhost:\d+/)
    })
  })

  it('POST sessions body inneholder ikke id eller startedAt', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'x', groupId: 'g1', startedAt: '2026-01-01T00:00:00Z', status: 'ACTIVE' }),
    } as Response)

    await api.startSession('group-1')

    const callBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string)
    expect(callBody).not.toHaveProperty('id')
    expect(callBody).not.toHaveProperty('startedAt')
    expect(callBody).toHaveProperty('groupId', 'group-1')
  })
})
