package no.scienta.sessiontracker

import org.hamcrest.Matchers.greaterThan
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@SpringBootTest
@AutoConfigureMockMvc
class GroupControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    fun `GET groups returns 200 and non-empty list`() {
        mockMvc.get("/groups").andExpect {
            status { isOk() }
            jsonPath("$") { isArray() }
            jsonPath("$.length()") { value(greaterThan(0)) }
        }
    }

    @Test
    fun `GET groups returns Group objects with id, name, theme and members`() {
        mockMvc.get("/groups").andExpect {
            status { isOk() }
            jsonPath("$[0].id") { isString() }
            jsonPath("$[0].name") { isString() }
            jsonPath("$[0].theme") { isString() }
            jsonPath("$[0].members") { isArray() }
        }
    }

    @Test
    fun `GET groups returns all 13 seminar groups sorted by name`() {
        val expectedOrder = listOf(
            "Gruppe 1.1", "Gruppe 1.2", "Gruppe 1.3", "Gruppe 1.4", "Gruppe 1.5",
            "Gruppe 2.1", "Gruppe 2.2", "Gruppe 2.3",
            "Gruppe 3.1", "Gruppe 3.2", "Gruppe 3.3",
            "Gruppe 4.1",
            "Gruppe 5.1",
        )

        mockMvc.get("/groups").andExpect {
            status { isOk() }
            jsonPath("$.length()") { value(13) }
            expectedOrder.forEachIndexed { index, name ->
                jsonPath("$[$index].name") { value(name) }
            }
        }
    }
}
