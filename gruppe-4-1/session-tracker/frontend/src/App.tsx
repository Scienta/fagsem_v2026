import { useEffect, useRef, useState } from 'react'
import { api } from './api'
import { Finding, FindingType, Group, Session } from './types/api'

const FINDING_TYPES: FindingType[] = ['OBSERVATION', 'RESULT', 'BLOCKER']
const POLL_INTERVAL_MS = 5000

export default function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [findings, setFindings] = useState<Finding[]>([])
  const [error, setError] = useState<string | null>(null)

  // Per-session finding form state
  const [findingText, setFindingText] = useState<Record<string, string>>({})
  const [findingType, setFindingType] = useState<Record<string, FindingType>>({})

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    api.getGroups()
      .then(setGroups)
      .catch(() => setError('Klarte ikke hente grupper fra backend'))
  }, [])

  useEffect(() => {
    const fetchFindings = () => {
      api.getFindings().then(setFindings).catch(() => {})
    }
    fetchFindings()
    pollRef.current = setInterval(fetchFindings, POLL_INTERVAL_MS)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const activeSessions = sessions.filter(s => s.status === 'ACTIVE')

  async function handleStartSession(groupId: string) {
    try {
      const session = await api.startSession(groupId)
      setSessions(prev => [...prev, session])
    } catch {
      setError(`Klarte ikke starte sesjon for gruppe ${groupId}`)
    }
  }

  async function handleEndSession(id: string) {
    try {
      const updated = await api.endSession(id)
      setSessions(prev => prev.map(s => s.id === id ? updated : s))
    } catch {
      setError(`Klarte ikke avslutte sesjon ${id}`)
    }
  }

  async function handleLogFinding(sessionId: string) {
    const text = findingText[sessionId]?.trim()
    const type = findingType[sessionId] ?? 'OBSERVATION'
    if (!text) return
    try {
      const finding = await api.logFinding(sessionId, text, type)
      setFindings(prev => [finding, ...prev])
      setFindingText(prev => ({ ...prev, [sessionId]: '' }))
    } catch {
      setError(`Klarte ikke logge funn for sesjon ${sessionId}`)
    }
  }

  const groupById = Object.fromEntries(groups.map(g => [g.id, g]))

  const groupsByTheme = groups.reduce<Record<string, Group[]>>((acc, group) => {
    ;(acc[group.theme] ??= []).push(group)
    return acc
  }, {})

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h1>Fagdag Session Tracker</h1>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #f00', padding: '0.5rem', marginBottom: '1rem' }}>
          {error} <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Groups by theme */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Grupper</h2>
        {groups.length === 0 ? (
          <p>Ingen grupper lastet (backend oppe?)</p>
        ) : (
          Object.entries(groupsByTheme).map(([theme, themeGroups]) => (
            <div key={theme} style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', color: '#555' }}>{theme}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {themeGroups.map(group => {
                  const alreadyActive = activeSessions.some(s => s.groupId === group.id)
                  return (
                    <li key={group.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                      <span style={{ minWidth: 100 }}><strong>{group.name}</strong></span>
                      <span style={{ color: '#777', fontSize: '0.85rem' }}>{group.members.join(', ')}</span>
                      <button
                        onClick={() => handleStartSession(group.id)}
                        disabled={alreadyActive}
                        style={{ marginLeft: 'auto' }}
                      >
                        {alreadyActive ? 'Aktiv' : 'Start sesjon'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </section>

      {/* Active Sessions */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Aktive sesjoner</h2>
        {activeSessions.length === 0 ? (
          <p>Ingen aktive sesjoner.</p>
        ) : (
          activeSessions.map(session => {
            const group = groupById[session.groupId]
            return (
              <div key={session.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: 4 }}>
                <strong>{group?.name ?? session.groupId}</strong>
                {' — startet '}
                {new Date(session.startedAt).toLocaleTimeString('no-NO')}
                <button
                  onClick={() => handleEndSession(session.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Merk som ferdig
                </button>

                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Logg et funn..."
                    value={findingText[session.id] ?? ''}
                    onChange={e => setFindingText(prev => ({ ...prev, [session.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') handleLogFinding(session.id) }}
                    style={{ flex: 1, padding: '0.25rem' }}
                  />
                  <select
                    value={findingType[session.id] ?? 'OBSERVATION'}
                    onChange={e => setFindingType(prev => ({ ...prev, [session.id]: e.target.value as FindingType }))}
                  >
                    {FINDING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button onClick={() => handleLogFinding(session.id)}>Logg</button>
                </div>
              </div>
            )
          })
        )}
      </section>

      {/* Live Findings Feed */}
      <section>
        <h2>Live funn-feed</h2>
        <p style={{ color: '#666', fontSize: '0.85rem' }}>Oppdateres hvert {POLL_INTERVAL_MS / 1000}. sekund</p>
        {findings.length === 0 ? (
          <p>Ingen funn ennå.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {findings.map(finding => (
              <li key={finding.id} style={{ marginBottom: '0.4rem' }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 3,
                  marginRight: '0.5rem',
                  background: finding.type === 'BLOCKER' ? '#fdd' : finding.type === 'RESULT' ? '#dfd' : '#ddf',
                }}>
                  {finding.type}
                </span>
                {finding.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
