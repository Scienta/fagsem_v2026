package no.scienta.sessiontracker

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.scienta.sessiontracker.controller.FindingController
import no.scienta.sessiontracker.controller.SessionController
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class FindingControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var sessionController: SessionController

    @Autowired
    private lateinit var findingController: FindingController

    private val mapper = jacksonObjectMapper()

    @BeforeEach
    fun clearState() {
        sessionController.sessions.clear()
        findingController.findings.clear()
    }

    private fun createSession(groupId: String = "group-1"): String {
        val result = mockMvc.post("/sessions") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"groupId": "$groupId"}"""
        }.andReturn()
        return mapper.readTree(result.response.contentAsString)["id"].asText()
    }

    @Test
    fun `POST findings for session returns 200 with correct fields`() {
        val sessionId = createSession()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "Something observed", "type": "OBSERVATION"}"""
        }.andExpect {
            status { isOk() }
            jsonPath("$.id") { isString() }
            jsonPath("$.sessionId") { value(sessionId) }
            jsonPath("$.text") { value("Something observed") }
            jsonPath("$.type") { value("OBSERVATION") }
        }
    }

    @Test
    fun `GET findings for session returns only that session's findings`() {
        val sessionA = createSession("group-A")
        val sessionB = createSession("group-B")

        mockMvc.post("/sessions/$sessionA/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "Finding for A", "type": "RESULT"}"""
        }.andReturn()

        mockMvc.post("/sessions/$sessionB/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "Finding for B", "type": "BLOCKER"}"""
        }.andReturn()

        mockMvc.get("/sessions/$sessionA/findings").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(1) }
            jsonPath("$[0].text") { value("Finding for A") }
            jsonPath("$[0].sessionId") { value(sessionA) }
        }
    }

    @Test
    fun `GET findings without parameter returns all findings`() {
        val sessionId = createSession()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "First finding", "type": "OBSERVATION"}"""
        }.andReturn()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "Second finding", "type": "RESULT"}"""
        }.andReturn()

        mockMvc.get("/findings").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(2) }
        }
    }

    @Test
    fun `POST findings for unknown session returns 404`() {
        mockMvc.post("/sessions/non-existent-id/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "some finding", "type": "OBSERVATION"}"""
        }.andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `GET findings for unknown session returns 404`() {
        mockMvc.get("/sessions/non-existent-id/findings").andExpect {
            status { isNotFound() }
        }
    }

    @Test
    fun `GET findings with type OBSERVATION returns only OBSERVATION findings`() {
        val sessionId = createSession()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "An observation", "type": "OBSERVATION"}"""
        }.andReturn()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "A blocker", "type": "BLOCKER"}"""
        }.andReturn()

        mockMvc.get("/findings?type=OBSERVATION").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(1) }
            jsonPath("$[0].type") { value("OBSERVATION") }
        }
    }

    @Test
    fun `GET findings with type RESULT returns only RESULT findings`() {
        val sessionId = createSession()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "A result", "type": "RESULT"}"""
        }.andReturn()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "An observation", "type": "OBSERVATION"}"""
        }.andReturn()

        mockMvc.get("/findings?type=RESULT").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(1) }
            jsonPath("$[0].type") { value("RESULT") }
        }
    }

    @Test
    fun `GET findings with type BLOCKER returns only BLOCKER findings`() {
        val sessionId = createSession()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "Observation", "type": "OBSERVATION"}"""
        }.andReturn()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "Result", "type": "RESULT"}"""
        }.andReturn()

        mockMvc.post("/sessions/$sessionId/findings") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"text": "Blocker!", "type": "BLOCKER"}"""
        }.andReturn()

        mockMvc.get("/findings?type=BLOCKER").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(1) }
            jsonPath("$[0].type") { value("BLOCKER") }
            jsonPath("$[0].text") { value("Blocker!") }
        }
    }
}
