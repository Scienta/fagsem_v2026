package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Finding
import no.scienta.sessiontracker.model.FindingType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

data class CreateFindingRequest(val text: String, val type: FindingType)

@RestController
class FindingController {

    // POST /sessions/{id}/findings - log a finding during a session
    @PostMapping("/sessions/{id}/findings")
    fun addFinding(
        @PathVariable id: String,
        @RequestBody request: CreateFindingRequest,
    ): Finding {
        TODO("Not implemented")
    }

    // GET /sessions/{id}/findings - get all findings for a session
    @GetMapping("/sessions/{id}/findings")
    fun getFindingsForSession(@PathVariable id: String): List<Finding> {
        TODO("Not implemented")
    }

    // GET /findings?type=RESULT - query all findings, optionally filtered by type
    @GetMapping("/findings")
    fun getAllFindings(@RequestParam(required = false) type: FindingType?): List<Finding> {
        TODO("Not implemented")
    }
}
