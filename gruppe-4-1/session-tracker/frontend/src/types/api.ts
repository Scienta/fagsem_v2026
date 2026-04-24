export interface Group {
  id: string
  name: string
  theme: string
  members: string[]
}

export type SessionStatus = 'ACTIVE' | 'DONE'

export interface Session {
  id: string
  groupId: string
  startedAt: string // ISO 8601
  status: SessionStatus
}

export type FindingType = 'OBSERVATION' | 'RESULT' | 'BLOCKER'

export interface Finding {
  id: string
  sessionId: string
  text: string
  type: FindingType
}
