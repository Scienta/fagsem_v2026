package no.scienta.kokebok.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.scienta.kokebok.domain.RecipeCategory;
import no.scienta.kokebok.dto.MenuRequest;
import no.scienta.kokebok.dto.MenuResponse;
import no.scienta.kokebok.dto.RecipeDto;
import no.scienta.kokebok.service.RecipeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MenuController.class)
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RecipeService recipeService;

    @Test
    void suggest_returnsOneRecipePerCategory() throws Exception {
        RecipeDto forrett = buildDto(1L, "Bruschetta", RecipeCategory.FORRETT, 10);
        RecipeDto hovedrett = buildDto(2L, "Pasta", RecipeCategory.HOVEDRETT, 30);

        when(recipeService.findCategories()).thenReturn(List.of("FORRETT", "HOVEDRETT"));
        when(recipeService.findByCategory(RecipeCategory.FORRETT)).thenReturn(List.of(forrett));
        when(recipeService.findByCategory(RecipeCategory.HOVEDRETT)).thenReturn(List.of(hovedrett));

        mockMvc.perform(get("/api/menu/suggest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.FORRETT.title").value("Bruschetta"))
                .andExpect(jsonPath("$.HOVEDRETT.title").value("Pasta"));
    }

    @Test
    void build_withCategorySelections_returnsMenuResponse() throws Exception {
        RecipeDto forrett = buildDto(1L, "Bruschetta", RecipeCategory.FORRETT, 10);
        RecipeDto hovedrett = buildDto(2L, "Pasta", RecipeCategory.HOVEDRETT, 30);

        when(recipeService.findById(1L)).thenReturn(forrett);
        when(recipeService.findById(2L)).thenReturn(hovedrett);

        MenuRequest request = new MenuRequest();
        request.setCategorySelections(Map.of("FORRETT", 1L, "HOVEDRETT", 2L));

        mockMvc.perform(post("/api/menu/build")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dishes.length()").value(2))
                .andExpect(jsonPath("$.totalTimeMinutes").value(40));
    }

    private RecipeDto buildDto(Long id, String title, RecipeCategory category, int totalTime) {
        RecipeDto dto = new RecipeDto();
        dto.setId(id);
        dto.setTitle(title);
        dto.setCategory(category);
        dto.setPrepTimeMinutes(totalTime / 2);
        dto.setCookTimeMinutes(totalTime / 2);
        return dto;
    }
}
