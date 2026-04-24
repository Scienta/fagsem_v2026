package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Group
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/groups")
class GroupController {

    // GET /groups - list all groups
    @GetMapping
    fun listGroups(): List<Group> {
        TODO("Not implemented")
    }
}
