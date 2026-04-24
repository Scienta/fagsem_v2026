package no.scienta.sessiontracker

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.scienta.sessiontracker.controller.FindingController
import no.scienta.sessiontracker.controller.GroupController
import no.scienta.sessiontracker.controller.SessionController
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class StatsControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var sessionController: SessionController

    @Autowired
    private lateinit var findingController: FindingController

    @Autowired
    private lateinit var groupController: GroupController

    private val mapper = jacksonObjectMapper()

    @BeforeEach
    fun clearState() {
        sessionController.sessions.clear()
        findingController.findings.clear()
    }

    private fun createSession(groupId: String): String {
        val result = mockMvc.post("/sessions") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"groupId": "$groupId"}"""
        }.andReturn()
        return mapper.readTree(result.response.contentAsString)["id"].asText()
    }

    private fun groupIdForTheme(theme: String): String =
        groupController.groups.values.first { it.theme == theme }.id

    @Test
    fun `GET stats returns 200 and list with 5 elements`() {
        mockMvc.get("/stats").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(5) }
        }
    }

    @Test
    fun `GET stats returns all themes with zero counters when no sessions or findings`() {
        mockMvc.get("/stats").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(5) }
            jsonPath("$[0].sessionsActive") { value(0) }
            jsonPath("$[0].sessionsDone") { value(0) }
            jsonPath("$[0].findingsObservation") { value(0) }
            jsonPath("$[0].findingsResult") { value(0) }
            jsonPath("$[0].findingsBlocker") { value(0) }
            jsonPath("$[4].sessionsActive") { value(0) }
            jsonPath("$[4].sessionsDone") { value(0) }
        }
    }

    @Test
    fun `GET stats with one ACTIVE session shows sessionsActive 1 and sessionsDone 0 for correct theme`() {
        val groupId = groupIdForTheme("Lokal LLM i praksis")
        createSession(groupId)

        mockMvc.get("/stats").andExpect {
            status { isOk() }
            jsonPath("$[2].theme") { value("Lokal LLM i praksis") }
            jsonPath("$[2].sessionsActive") { value(1) }
            jsonPath("$[2].sessionsDone") { value(0) }
        }
    }

    @Test
    fun `GET stats with one DONE session shows sessionsActive 0 and sessionsDone 1 for correct theme`() {
        val groupId = groupIdForTheme("Personlig assistent")
        val sessionId = createSession(groupId)

        mockMvc.patch("/sessions/$sessionId") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"status": "DONE"}"""
        }

        mockMvc.get("/stats").andExpect {
            status { isOk() }
            jsonPath("$[3].theme") { value("Personlig assistent") }
            jsonPath("$[3].sessionsActive") { value(0) }
            jsonPath("$[3].sessionsDone") { value(1) }
        }
    }

    @Test
    fun `GET stats with one BLOCKER finding shows findingsBlocker 1 and other finding counts 0`() {
        val groupId = groupIdForTheme("AI-assistert systemutvikling")
        val sessionId = createSession(groupId)

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "A blocker", "type": "BLOCKER"}"""
        }

        mockMvc.get("/stats").andExpect {
            status { isOk() }
            jsonPath("$[0].theme") { value("AI-assistert systemutvikling") }
            jsonPath("$[0].findingsBlocker") { value(1) }
            jsonPath("$[0].findingsObservation") { value(0) }
            jsonPath("$[0].findingsResult") { value(0) }
        }
    }

    @Test
    fun `GET stats result is sorted alphabetically by theme`() {
        mockMvc.get("/stats").andExpect {
            status { isOk() }
            jsonPath("$[0].theme") { value("AI-assistert systemutvikling") }
            jsonPath("$[1].theme") { value("Flere parallelle kodeagenter") }
            jsonPath("$[2].theme") { value("Lokal LLM i praksis") }
            jsonPath("$[3].theme") { value("Personlig assistent") }
            jsonPath("$[4].theme") { value("Utvikler + agent i praksis") }
        }
    }
}
