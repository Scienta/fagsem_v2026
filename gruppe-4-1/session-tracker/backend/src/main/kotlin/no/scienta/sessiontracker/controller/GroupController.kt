package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.Group
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.concurrent.ConcurrentHashMap

@RestController
@RequestMapping("/groups")
class GroupController {

    val groups: ConcurrentHashMap<String, Group> = ConcurrentHashMap<String, Group>().also { map ->
        listOf(
            Group(name = "Gruppe 1", theme = "AI-assistenter i utvikling", members = listOf("Alice", "Bob", "Charlie")),
            Group(name = "Gruppe 2", theme = "Testautomatisering", members = listOf("Diana", "Erik")),
            Group(name = "Gruppe 3", theme = "Sikkerhet og sårbarhet", members = listOf("Fatima", "Gustav", "Hana")),
        ).forEach { map[it.id] = it }
    }

    // GET /groups - list all groups
    @GetMapping
    fun listGroups(): List<Group> = groups.values.toList()
}
