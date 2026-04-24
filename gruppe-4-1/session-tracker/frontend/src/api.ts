import { Finding, FindingType, Group, Session } from './types/api'

const BASE = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init)
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`)
  return res.json()
}

export const api = {
  getGroups: (): Promise<Group[]> =>
    request('/groups'),

  startSession: (groupId: string): Promise<Session> =>
    request('/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId }),
    }),

  endSession: (id: string): Promise<Session> =>
    request(`/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DONE' }),
    }),

  logFinding: (sessionId: string, text: string, type: FindingType): Promise<Finding> =>
    request(`/sessions/${sessionId}/findings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, type }),
    }),

  getSessions: (status?: 'ACTIVE' | 'DONE'): Promise<Session[]> => {
    const query = status ? `?status=${status}` : ''
    return request(`/sessions${query}`)
  },

  getFindings: (type?: FindingType): Promise<Finding[]> => {
    const query = type ? `?type=${type}` : ''
    return request(`/findings${query}`)
  },
}
