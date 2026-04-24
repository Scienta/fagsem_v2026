package no.scienta.sessiontracker

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.scienta.sessiontracker.controller.SessionController
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.patch
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class SessionControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var sessionController: SessionController

    private val mapper = jacksonObjectMapper()

    @BeforeEach
    fun clearSessions() {
        sessionController.sessions.clear()
    }

    @Test
    fun `POST sessions with groupId returns 200 with server-generated id and startedAt`() {
        mockMvc.post("/sessions") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"groupId": "some-group-id"}"""
        }.andExpect {
            status { isOk() }
            jsonPath("$.id") { isString() }
            jsonPath("$.startedAt") { isString() }
            jsonPath("$.groupId") { value("some-group-id") }
            jsonPath("$.status") { value("ACTIVE") }
        }
    }

    @Test
    fun `PATCH sessions id with DONE status updates session to DONE`() {
        val result = mockMvc.post("/sessions") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"groupId": "group-1"}"""
        }.andReturn()

        val sessionId = mapper.readTree(result.response.contentAsString)["id"].asText()

        mockMvc.patch("/sessions/$sessionId") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"status": "DONE"}"""
        }.andExpect {
            status { isOk() }
            jsonPath("$.status") { value("DONE") }
            jsonPath("$.id") { value(sessionId) }
        }
    }

    @Test
    fun `PATCH sessions with unknown id returns 404`() {
        mockMvc.patch("/sessions/non-existent-id") {
            contentType = MediaType.APPLICATION_JSON
            content = """{"status": "DONE"}"""
        }.andExpect {
            status { isNotFound() }
        }
    }
}
