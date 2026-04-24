package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Group
import no.scienta.sessiontracker.repository.GroupRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/groups")
class GroupController(private val groupRepository: GroupRepository) {

    @GetMapping
    fun listGroups(): List<Group> = groupRepository.findAll().sortedBy { it.name }
}
