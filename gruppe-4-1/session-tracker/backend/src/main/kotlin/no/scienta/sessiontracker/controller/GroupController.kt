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
            // Utvikler + agent i praksis
            Group(name = "Gruppe 1.1", theme = "Utvikler + agent i praksis", members = listOf("Christian Darre-Winsnes", "Oskar Otterskog", "Knut-Helge Vik", "Sindre Mehus")),
            Group(name = "Gruppe 1.2", theme = "Utvikler + agent i praksis", members = listOf("Runar Opsahl", "Espen Myklevoll", "Fred Inge Henden", "Per Spilling")),
            Group(name = "Gruppe 1.3", theme = "Utvikler + agent i praksis", members = listOf("Vegard Angell", "Felix Rabe", "Rune Storløpa", "Rafael Winterhalter")),
            Group(name = "Gruppe 1.4", theme = "Utvikler + agent i praksis", members = listOf("Roy Grønmo", "André Aubert", "Eirik Maus", "Are Gravbrøt")),
            Group(name = "Gruppe 1.5", theme = "Utvikler + agent i praksis", members = listOf("Erlend Kraft", "Filip Egge", "Asbjørn Willersrud", "Julian Jark")),
            // AI-assistert systemutvikling
            Group(name = "Gruppe 2.1", theme = "AI-assistert systemutvikling", members = listOf("Fredrik Meyer", "Ingvild Hardeng", "Stein Grimstad")),
            Group(name = "Gruppe 2.2", theme = "AI-assistert systemutvikling", members = listOf("Steinar Johan Haug", "Jan-Erik Bergmann")),
            Group(name = "Gruppe 2.3", theme = "AI-assistert systemutvikling", members = listOf("Haakon", "Nils-Christian", "tobiast")),
            // Lokal LLM i praksis
            Group(name = "Gruppe 3.1", theme = "Lokal LLM i praksis", members = listOf("Trygve Laugstøl", "Marius Krabset", "Erlend Nossum", "Georg F. Persen")),
            Group(name = "Gruppe 3.2", theme = "Lokal LLM i praksis", members = listOf("Daniel Bakkelund", "kjetil", "Johan Hauan", "Hakon Kvernes")),
            Group(name = "Gruppe 3.3", theme = "Lokal LLM i praksis", members = listOf("Thomas Gran", "Anders Kvernberg", "Bartas Venckus")),
            // Flere parallelle kodeagenter
            Group(name = "Gruppe 4.1", theme = "Flere parallelle kodeagenter", members = listOf("Are Fossli Viberg", "Maria Selivanova")),
            // Personlig assistent
            Group(name = "Gruppe 5.1", theme = "Personlig assistent", members = listOf("Nina Olsen", "Vibeke Corneliussen", "Stian Meuche", "Cathrine Dannevig")),
        ).forEach { map[it.id] = it }
    }

    // GET /groups - list all groups
    @GetMapping
    fun listGroups(): List<Group> = groups.values.toList()
}
