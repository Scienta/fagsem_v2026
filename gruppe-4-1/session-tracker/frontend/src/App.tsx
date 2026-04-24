import { useEffect, useRef, useState } from 'react'
import { api } from './api'
import { Finding, FindingType, Group, Session, ThemeStats } from './types/api'

const FINDING_TYPES: FindingType[] = ['OBSERVATION', 'RESULT', 'BLOCKER']
const POLL_INTERVAL_MS = 5000

const THEME_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
  'Utvikler + agent i praksis':   { bg: '#eff6ff', border: '#3b82f6', badge: '#3b82f6' },
  'AI-assistert systemutvikling': { bg: '#f0fdf4', border: '#22c55e', badge: '#22c55e' },
  'Lokal LLM i praksis':          { bg: '#fdf4ff', border: '#a855f7', badge: '#a855f7' },
  'Flere parallelle kodeagenter': { bg: '#fff7ed', border: '#f97316', badge: '#f97316' },
  'Personlig assistent':          { bg: '#fff1f2', border: '#f43f5e', badge: '#f43f5e' },
}

const FINDING_STYLES: Record<FindingType, { bg: string; color: string; label: string }> = {
  OBSERVATION: { bg: '#dbeafe', color: '#1d4ed8', label: 'Observasjon' },
  RESULT:      { bg: '#dcfce7', color: '#15803d', label: 'Resultat'    },
  BLOCKER:     { bg: '#fee2e2', color: '#b91c1c', label: 'Blocker'     },
}

const s = {
  page: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    minHeight: '100vh',
    background: '#f8fafc',
    color: '#1e293b',
  } as React.CSSProperties,
  header: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    padding: '1.5rem 2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  } as React.CSSProperties,
  headerTitle: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
  } as React.CSSProperties,
  headerSub: {
    margin: '0.25rem 0 0',
    opacity: 0.8,
    fontSize: '0.9rem',
  } as React.CSSProperties,
  content: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '0 1.5rem 3rem',
  } as React.CSSProperties,
  error: {
    background: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#b91c1c',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '1rem',
    marginTop: 0,
  } as React.CSSProperties,
  card: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    padding: '1.25rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  themeHeader: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  } as React.CSSProperties),
  themeDot: (color: string) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  } as React.CSSProperties),
  themeLabel: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#334155',
  } as React.CSSProperties,
  groupRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.4rem 0',
    borderBottom: '1px solid #f1f5f9',
  } as React.CSSProperties,
  groupName: {
    fontWeight: 600,
    minWidth: 100,
    fontSize: '0.9rem',
  } as React.CSSProperties,
  groupMembers: {
    color: '#64748b',
    fontSize: '0.82rem',
    flex: 1,
  } as React.CSSProperties,
  btnPrimary: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '0.35rem 0.85rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  btnDisabled: {
    background: '#e2e8f0',
    color: '#94a3b8',
    border: 'none',
    borderRadius: 6,
    padding: '0.35rem 0.85rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'default',
  } as React.CSSProperties,
  btnDanger: {
    background: '#f43f5e',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '0.35rem 0.85rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  btnSecondary: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '0.35rem 0.75rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  sessionCard: (borderColor: string) => ({
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    borderLeft: `4px solid ${borderColor}`,
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
  } as React.CSSProperties),
  sessionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  sessionTitle: {
    fontWeight: 700,
    fontSize: '1rem',
  } as React.CSSProperties,
  sessionTime: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    marginLeft: '0.5rem',
  } as React.CSSProperties,
  findingInput: {
    flex: 1,
    padding: '0.4rem 0.75rem',
    borderRadius: 6,
    border: '1px solid #e2e8f0',
    fontSize: '0.85rem',
    outline: 'none',
  } as React.CSSProperties,
  findingSelect: {
    padding: '0.4rem 0.5rem',
    borderRadius: 6,
    border: '1px solid #e2e8f0',
    fontSize: '0.82rem',
    background: '#f8fafc',
  } as React.CSSProperties,
  badge: (type: FindingType) => ({
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.15rem 0.5rem',
    borderRadius: 20,
    marginRight: '0.5rem',
    background: FINDING_STYLES[type].bg,
    color: FINDING_STYLES[type].color,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  } as React.CSSProperties),
  feedItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0.6rem 0',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.9rem',
  } as React.CSSProperties,
  emptyState: {
    color: '#94a3b8',
    fontStyle: 'italic',
    fontSize: '0.9rem',
  } as React.CSSProperties,
}

export default function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [findings, setFindings] = useState<Finding[]>([])
  const [stats, setStats] = useState<ThemeStats[]>([])
  const [error, setError] = useState<string | null>(null)

  const [findingText, setFindingText] = useState<Record<string, string>>({})
  const [findingType, setFindingType] = useState<Record<string, FindingType>>({})

  const sessionsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const findingsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const statsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    api.getGroups()
      .then(setGroups)
      .catch(() => setError('Klarte ikke hente grupper fra backend'))
  }, [])

  const fetchSessions = () => {
    api.getSessions('ACTIVE').then(setSessions).catch(() => {})
  }

  useEffect(() => {
    fetchSessions()
    sessionsIntervalRef.current = setInterval(fetchSessions, POLL_INTERVAL_MS)
    return () => { if (sessionsIntervalRef.current) clearInterval(sessionsIntervalRef.current) }
  }, [])

  useEffect(() => {
    const fetchFindings = () => {
      api.getFindings().then(setFindings).catch(() => {})
    }
    fetchFindings()
    findingsIntervalRef.current = setInterval(fetchFindings, POLL_INTERVAL_MS)
    return () => { if (findingsIntervalRef.current) clearInterval(findingsIntervalRef.current) }
  }, [])

  useEffect(() => {
    const fetchStats = () => {
      api.getStats().then(setStats).catch(() => {})
    }
    fetchStats()
    statsIntervalRef.current = setInterval(fetchStats, POLL_INTERVAL_MS)
    return () => { if (statsIntervalRef.current) clearInterval(statsIntervalRef.current) }
  }, [])

  const activeSessions = sessions.filter(s => s.status === 'ACTIVE')

  async function handleStartSession(groupId: string) {
    try {
      await api.startSession(groupId)
      fetchSessions()
    } catch {
      setError(`Klarte ikke starte sesjon for gruppe ${groupId}`)
    }
  }

  async function handleEndSession(id: string) {
    try {
      await api.endSession(id)
      fetchSessions()
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
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h1 style={s.headerTitle}>Fagdag Session Tracker</h1>
          <p style={s.headerSub}>Scienta Fagseminar 2026 · live oppdatering hvert {POLL_INTERVAL_MS / 1000}s</p>
        </div>
      </header>

      <div style={s.content}>
        {error && (
          <div style={s.error}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontSize: '1.1rem' }}>×</button>
          </div>
        )}

        {/* Groups by theme */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={s.sectionTitle}>Grupper</h2>
          {groups.length === 0 ? (
            <p style={s.emptyState}>Ingen grupper lastet — er backend oppe?</p>
          ) : (
            Object.entries(groupsByTheme).map(([theme, themeGroups]) => {
              const colors = THEME_COLORS[theme] ?? { bg: '#f8fafc', border: '#94a3b8', badge: '#94a3b8' }
              return (
                <div key={theme} style={{ ...s.card, background: colors.bg, borderTop: `3px solid ${colors.border}` }}>
                  <div style={s.themeHeader(colors.border)}>
                    <div style={s.themeDot(colors.border)} />
                    <span style={s.themeLabel}>{theme}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {themeGroups.map((group, i) => {
                      const alreadyActive = activeSessions.some(s => s.groupId === group.id)
                      return (
                        <li key={group.id} style={{ ...s.groupRow, borderBottom: i === themeGroups.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                          <span style={s.groupName}>{group.name}</span>
                          <span style={s.groupMembers}>{group.members.join(', ')}</span>
                          <button
                            onClick={() => handleStartSession(group.id)}
                            disabled={alreadyActive}
                            style={alreadyActive ? s.btnDisabled : { ...s.btnPrimary, background: colors.badge }}
                          >
                            {alreadyActive ? '✓ Aktiv' : 'Start sesjon'}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })
          )}
        </section>

        {/* Active Sessions */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={s.sectionTitle}>Aktive sesjoner ({activeSessions.length})</h2>
          {activeSessions.length === 0 ? (
            <p style={s.emptyState}>Ingen aktive sesjoner.</p>
          ) : (
            activeSessions.map(session => {
              const group = groupById[session.groupId]
              const colors = group ? (THEME_COLORS[group.theme] ?? { border: '#6366f1' }) : { border: '#6366f1' }
              return (
                <div key={session.id} style={s.sessionCard(colors.border)}>
                  <div style={s.sessionHeader}>
                    <div>
                      <span style={s.sessionTitle}>{group?.name ?? session.groupId}</span>
                      <span style={s.sessionTime}>startet {new Date(session.startedAt).toLocaleTimeString('no-NO')}</span>
                    </div>
                    <button onClick={() => handleEndSession(session.id)} style={s.btnDanger}>
                      Merk som ferdig
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Logg et funn..."
                      value={findingText[session.id] ?? ''}
                      onChange={e => setFindingText(prev => ({ ...prev, [session.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') handleLogFinding(session.id) }}
                      style={s.findingInput}
                    />
                    <select
                      value={findingType[session.id] ?? 'OBSERVATION'}
                      onChange={e => setFindingType(prev => ({ ...prev, [session.id]: e.target.value as FindingType }))}
                      style={s.findingSelect}
                    >
                      {FINDING_TYPES.map(t => <option key={t} value={t}>{FINDING_STYLES[t].label}</option>)}
                    </select>
                    <button onClick={() => handleLogFinding(session.id)} style={s.btnSecondary}>Logg</button>
                  </div>
                </div>
              )
            })
          )}
        </section>

        {/* Stats */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={s.sectionTitle}>Statistikk per tema</h2>
          {stats.length === 0 ? (
            <p style={s.emptyState}>Ingen statistikk ennå — start en sesjon.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {stats.map(t => {
                const colors = THEME_COLORS[t.theme] ?? { bg: '#f8fafc', border: '#94a3b8', badge: '#94a3b8' }
                return (
                  <div key={t.theme} style={{ ...s.card, background: colors.bg, borderTop: `3px solid ${colors.border}`, marginBottom: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>{t.theme}</div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem 0.5rem' }}>
                      <span>Grupper</span>       <span style={{ fontWeight: 600 }}>{t.groups}</span>
                      <span>Aktive</span>         <span style={{ fontWeight: 600, color: '#22c55e' }}>{t.sessionsActive}</span>
                      <span>Fullførte</span>      <span style={{ fontWeight: 600 }}>{t.sessionsDone}</span>
                      <span>Observasjoner</span>  <span style={{ fontWeight: 600, color: '#1d4ed8' }}>{t.findingsObservation}</span>
                      <span>Resultater</span>     <span style={{ fontWeight: 600, color: '#15803d' }}>{t.findingsResult}</span>
                      <span>Blockere</span>       <span style={{ fontWeight: 600, color: '#b91c1c' }}>{t.findingsBlocker}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Live Findings Feed */}
        <section>
          <h2 style={s.sectionTitle}>Live funn-feed ({findings.length})</h2>
          <div style={s.card}>
            {findings.length === 0 ? (
              <p style={{ ...s.emptyState, margin: 0 }}>Ingen funn ennå.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {findings.map((finding, i) => (
                  <li key={finding.id} style={{ ...s.feedItem, borderBottom: i === findings.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                    <span style={s.badge(finding.type)}>{FINDING_STYLES[finding.type].label}</span>
                    <span>{finding.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
