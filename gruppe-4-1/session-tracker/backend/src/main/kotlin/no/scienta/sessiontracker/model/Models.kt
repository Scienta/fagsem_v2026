package no.scienta.sessiontracker.model

import java.time.Instant
import java.util.UUID

data class Group(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val theme: String,
    val members: List<String>,
)

enum class SessionStatus { ACTIVE, DONE }

data class Session(
    val id: String = UUID.randomUUID().toString(),
    val groupId: String,
    val startedAt: Instant = Instant.now(),
    val status: SessionStatus = SessionStatus.ACTIVE,
)

enum class FindingType { OBSERVATION, RESULT, BLOCKER }

data class Finding(
    val id: String = UUID.randomUUID().toString(),
    val sessionId: String,
    val text: String,
    val type: FindingType,
)
