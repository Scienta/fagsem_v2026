package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Session
import no.scienta.sessiontracker.model.SessionStatus
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.concurrent.ConcurrentHashMap

data class CreateSessionRequest(val groupId: String)
data class UpdateSessionRequest(val status: String)

@RestController
@RequestMapping("/sessions")
class SessionController {

    val sessions: ConcurrentHashMap<String, Session> = ConcurrentHashMap()

    // GET /sessions?status= - list all sessions, optionally filtered by status
    @GetMapping
    fun listSessions(@RequestParam status: String?): List<Session> {
        val all = sessions.values.toList()
        return if (status != null) all.filter { it.status == SessionStatus.valueOf(status) } else all
    }

    // POST /sessions - start a new session for a group
    @PostMapping
    fun createSession(@RequestBody request: CreateSessionRequest): Session {
        val session = Session(groupId = request.groupId)
        sessions[session.id] = session
        return session
    }

    // PATCH /sessions/{id} - update session status (e.g. mark done)
    @PatchMapping("/{id}")
    fun updateSession(
        @PathVariable id: String,
        @RequestBody request: UpdateSessionRequest,
    ): Session {
        val session = sessions[id]
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Session $id not found")
        val updated = session.copy(status = SessionStatus.valueOf(request.status))
        sessions[id] = updated
        return updated
    }
}
