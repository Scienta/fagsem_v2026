package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Session
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class CreateSessionRequest(val groupId: String)
data class UpdateSessionRequest(val status: String)

@RestController
@RequestMapping("/sessions")
class SessionController {

    // POST /sessions - start a new session for a group
    @PostMapping
    fun createSession(@RequestBody request: CreateSessionRequest): Session {
        TODO("Not implemented")
    }

    // PATCH /sessions/{id} - update session status (e.g. mark done)
    @PatchMapping("/{id}")
    fun updateSession(
        @PathVariable id: String,
        @RequestBody request: UpdateSessionRequest,
    ): Session {
        TODO("Not implemented")
    }
}
