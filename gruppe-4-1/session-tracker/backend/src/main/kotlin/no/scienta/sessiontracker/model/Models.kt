package no.scienta.sessiontracker.model

import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "groups")
data class Group(
    @Id val id: String = UUID.randomUUID().toString(),
    val name: String = "",
    val theme: String = "",
    @ElementCollection(fetch = FetchType.EAGER)
    var members: MutableList<String> = mutableListOf(),
)

enum class SessionStatus { ACTIVE, DONE }

@Entity
data class Session(
    @Id val id: String = UUID.randomUUID().toString(),
    val groupId: String = "",
    val startedAt: Instant = Instant.now(),
    @Enumerated(EnumType.STRING)
    val status: SessionStatus = SessionStatus.ACTIVE,
)

enum class FindingType { OBSERVATION, RESULT, BLOCKER }

@Entity
data class Finding(
    @Id val id: String = UUID.randomUUID().toString(),
    val sessionId: String = "",
    val text: String = "",
    @Enumerated(EnumType.STRING)
    val type: FindingType = FindingType.OBSERVATION,
)
