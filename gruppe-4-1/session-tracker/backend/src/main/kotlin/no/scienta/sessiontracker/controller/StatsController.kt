package no.scienta.sessiontracker.controller

import no.scienta.sessiontracker.model.FindingType
import no.scienta.sessiontracker.model.SessionStatus
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
    private val groupController: GroupController,
    private val sessionController: SessionController,
    private val findingController: FindingController,
) {

    @GetMapping
    fun getStats(): List<ThemeStats> {
        val groups = groupController.groups.values.toList()
        val sessions = sessionController.sessions.values.toList()
        val findings = findingController.findings.values.toList()

        val groupById = groups.associateBy { it.id }
        val themes = groups.map { it.theme }.toSortedSet()

        return themes.map { theme ->
            val themeGroups = groups.filter { it.theme == theme }
            val themeGroupIds = themeGroups.map { it.id }.toSet()
            val themeSessions = sessions.filter { it.groupId in themeGroupIds }
            val themeSessionIds = themeSessions.map { it.id }.toSet()
            val themeFindings = findings.filter { it.sessionId in themeSessionIds }

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
