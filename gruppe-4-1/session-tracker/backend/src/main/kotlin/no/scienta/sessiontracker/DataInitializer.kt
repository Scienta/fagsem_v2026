package no.scienta.sessiontracker

import jakarta.annotation.PostConstruct
import no.scienta.sessiontracker.model.Group
import no.scienta.sessiontracker.repository.GroupRepository
import org.springframework.stereotype.Component

@Component
class DataInitializer(private val groupRepository: GroupRepository) {

    @PostConstruct
    fun seed() {
        if (groupRepository.count() > 0) return
        groupRepository.saveAll(listOf(
            // Utvikler + agent i praksis
            Group(name = "Gruppe 1.1", theme = "Utvikler + agent i praksis", members = mutableListOf("Christian Darre-Winsnes", "Oskar Otterskog", "Knut-Helge Vik", "Sindre Mehus")),
            Group(name = "Gruppe 1.2", theme = "Utvikler + agent i praksis", members = mutableListOf("Runar Opsahl", "Espen Myklevoll", "Fred Inge Henden", "Per Spilling")),
            Group(name = "Gruppe 1.3", theme = "Utvikler + agent i praksis", members = mutableListOf("Vegard Angell", "Felix Rabe", "Rune Storløpa", "Rafael Winterhalter")),
            Group(name = "Gruppe 1.4", theme = "Utvikler + agent i praksis", members = mutableListOf("Roy Grønmo", "André Aubert", "Eirik Maus", "Are Gravbrøt")),
            Group(name = "Gruppe 1.5", theme = "Utvikler + agent i praksis", members = mutableListOf("Erlend Kraft", "Filip Egge", "Asbjørn Willersrud", "Julian Jark")),
            // AI-assistert systemutvikling
            Group(name = "Gruppe 2.1", theme = "AI-assistert systemutvikling", members = mutableListOf("Fredrik Meyer", "Ingvild Hardeng", "Stein Grimstad")),
            Group(name = "Gruppe 2.2", theme = "AI-assistert systemutvikling", members = mutableListOf("Steinar Johan Haug", "Jan-Erik Bergmann")),
            Group(name = "Gruppe 2.3", theme = "AI-assistert systemutvikling", members = mutableListOf("Haakon", "Nils-Christian", "tobiast")),
            // Lokal LLM i praksis
            Group(name = "Gruppe 3.1", theme = "Lokal LLM i praksis", members = mutableListOf("Trygve Laugstøl", "Marius Krabset", "Erlend Nossum", "Georg F. Persen")),
            Group(name = "Gruppe 3.2", theme = "Lokal LLM i praksis", members = mutableListOf("Daniel Bakkelund", "kjetil", "Johan Hauan", "Hakon Kvernes")),
            Group(name = "Gruppe 3.3", theme = "Lokal LLM i praksis", members = mutableListOf("Thomas Gran", "Anders Kvernberg", "Bartas Venckus")),
            // Flere parallelle kodeagenter
            Group(name = "Gruppe 4.1", theme = "Flere parallelle kodeagenter", members = mutableListOf("Are Fossli Viberg", "Maria Selivanova")),
            // Personlig assistent
            Group(name = "Gruppe 5.1", theme = "Personlig assistent", members = mutableListOf("Nina Olsen", "Vibeke Corneliussen", "Stian Meuche", "Cathrine Dannevig")),
        ))
    }
}
