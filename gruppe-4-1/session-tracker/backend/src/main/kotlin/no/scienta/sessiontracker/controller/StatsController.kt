package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.FindingType
import no.scienta.sessiontracker.model.SessionStatus
import no.scienta.sessiontracker.repository.FindingRepository
import no.scienta.sessiontracker.repository.GroupRepository
import no.scienta.sessiontracker.repository.SessionRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class ThemeStats(
    val theme: String,
    val groups: Int,
    val sessionsActive: Int,
    val sessionsDone: Int,
    val findingsObservation: Int,
    val findingsResult: Int,
    val findingsBlocker: Int,
)

@RestController
@RequestMapping("/stats")
class StatsController(
    private val groupRepository: GroupRepository,
    private val sessionRepository: SessionRepository,
    private val findingRepository: FindingRepository,
) {

    @GetMapping
    fun getStats(): List<ThemeStats> {
        val groups = groupRepository.findAll()
        val themes = groups.map { it.theme }.toSortedSet()

        return themes.map { theme ->
            val themeGroups = groups.filter { it.theme == theme }
            val themeGroupIds = themeGroups.map { it.id }.toSet()
            val themeSessions = sessionRepository.findByGroupIdIn(themeGroupIds)
            val themeSessionIds = themeSessions.map { it.id }.toSet()
            val themeFindings = findingRepository.findBySessionIdIn(themeSessionIds)

            ThemeStats(
                theme = theme,
                groups = themeGroups.size,
                sessionsActive = themeSessions.count { it.status == SessionStatus.ACTIVE },
                sessionsDone = themeSessions.count { it.status == SessionStatus.DONE },
                findingsObservation = themeFindings.count { it.type == FindingType.OBSERVATION },
                findingsResult = themeFindings.count { it.type == FindingType.RESULT },
                findingsBlocker = themeFindings.count { it.type == FindingType.BLOCKER },
            )
        }
    }
}
