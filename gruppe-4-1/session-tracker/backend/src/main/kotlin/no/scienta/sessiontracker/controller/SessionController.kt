package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Session
import no.scienta.sessiontracker.model.SessionStatus
import no.scienta.sessiontracker.repository.SessionRepository
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

data class CreateSessionRequest(val groupId: String)
data class UpdateSessionRequest(val status: String)

@RestController
@RequestMapping("/sessions")
class SessionController(private val sessionRepository: SessionRepository) {

    // GET /sessions?status= - list all sessions, optionally filtered by status
    @GetMapping
    fun listSessions(@RequestParam status: String?): List<Session> =
        if (status != null) sessionRepository.findByStatus(SessionStatus.valueOf(status))
        else sessionRepository.findAll()

    // POST /sessions - start a new session for a group
    @PostMapping
    fun createSession(@RequestBody request: CreateSessionRequest): Session =
        sessionRepository.save(Session(groupId = request.groupId))

    // PATCH /sessions/{id} - update session status (e.g. mark done)
    @PatchMapping("/{id}")
    fun updateSession(@PathVariable id: String, @RequestBody request: UpdateSessionRequest): Session {
        val session = sessionRepository.findById(id).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "Session $id not found")
        }
        return sessionRepository.save(session.copy(status = SessionStatus.valueOf(request.status)))
    }
}
