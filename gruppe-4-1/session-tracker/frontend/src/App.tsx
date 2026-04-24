import { Finding, Group, Session } from './types/api'

export default function App() {
  // TODO: fetch groups from /api/groups
  const groups: Group[] = []

  // TODO: fetch active sessions from /api/sessions (needs a GET endpoint)
  const activeSessions: Session[] = []

  // TODO: fetch live findings from /api/findings
  const findings: Finding[] = []

  return (
    <div>
      <h1>Fagdag Session Tracker</h1>

      <section>
        <h2>Active Sessions</h2>
        {activeSessions.length === 0 ? (
          <p>No active sessions.</p>
        ) : (
          <ul>
            {activeSessions.map((session) => (
              <li key={session.id}>
                {session.groupId} — started {session.startedAt}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Live Findings</h2>
        {findings.length === 0 ? (
          <p>No findings yet.</p>
        ) : (
          <ul>
            {findings.map((finding) => (
              <li key={finding.id}>
                [{finding.type}] {finding.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
