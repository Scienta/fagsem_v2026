package no.scienta.sessiontracker.repository

import no.scienta.sessiontracker.model.Finding
import no.scienta.sessiontracker.model.FindingType
import no.scienta.sessiontracker.model.Group
import no.scienta.sessiontracker.model.Session
import no.scienta.sessiontracker.model.SessionStatus
import org.springframework.data.jpa.repository.JpaRepository

interface GroupRepository : JpaRepository<Group, String>

interface SessionRepository : JpaRepository<Session, String> {
    fun findByStatus(status: SessionStatus): List<Session>
    fun findByGroupIdIn(groupIds: Collection<String>): List<Session>
}

interface FindingRepository : JpaRepository<Finding, String> {
    fun findBySessionId(sessionId: String): List<Finding>
    fun findByType(type: FindingType): List<Finding>
    fun findBySessionIdIn(sessionIds: Collection<String>): List<Finding>
}
