package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Finding
import no.scienta.sessiontracker.model.FindingType
import no.scienta.sessiontracker.repository.FindingRepository
import no.scienta.sessiontracker.repository.SessionRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

data class CreateFindingRequest(val text: String, val type: FindingType)

@RestController
class FindingController(
    private val sessionRepository: SessionRepository,
    private val findingRepository: FindingRepository,
) {

    // POST /sessions/{id}/findings - log a finding during a session
    @PostMapping("/sessions/{id}/findings")
    fun addFinding(@PathVariable id: String, @RequestBody request: CreateFindingRequest): Finding {
        if (!sessionRepository.existsById(id)) throw ResponseStatusException(HttpStatus.NOT_FOUND, "Session $id not found")
        return findingRepository.save(Finding(sessionId = id, text = request.text, type = request.type))
    }

    // GET /sessions/{id}/findings - get all findings for a session
    @GetMapping("/sessions/{id}/findings")
    fun getFindingsForSession(@PathVariable id: String): List<Finding> {
        if (!sessionRepository.existsById(id)) throw ResponseStatusException(HttpStatus.NOT_FOUND, "Session $id not found")
        return findingRepository.findBySessionId(id)
    }

    // GET /findings?type=RESULT - query all findings, optionally filtered by type
    @GetMapping("/findings")
    fun getAllFindings(@RequestParam(required = false) type: FindingType?): List<Finding> =
        if (type == null) findingRepository.findAll() else findingRepository.findByType(type)
}
