package no.scienta.kokebok.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.scienta.kokebok.domain.FlavorTag;
import no.scienta.kokebok.domain.RecipeCategory;
import no.scienta.kokebok.dto.RecipeDto;
import no.scienta.kokebok.exception.ResourceNotFoundException;
import no.scienta.kokebok.service.RecipeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecipeController.class)
class RecipeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RecipeService recipeService;

    @Test
    void getAll_returnsListOfRecipes() throws Exception {
        RecipeDto dto = buildDto(1L, "Pasta");
        when(recipeService.findAll()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/recipes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Pasta"));
    }

    @Test
    void getById_existingId_returnsRecipe() throws Exception {
        RecipeDto dto = buildDto(1L, "Pasta");
        when(recipeService.findById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/recipes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Pasta"));
    }

    @Test
    void getById_nonExistingId_returns404() throws Exception {
        when(recipeService.findById(99L)).thenThrow(new ResourceNotFoundException("Not found"));

        mockMvc.perform(get("/api/recipes/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_validDto_returns201WithLocation() throws Exception {
        RecipeDto input = buildDto(null, "Ny rett");
        RecipeDto saved = buildDto(5L, "Ny rett");
        when(recipeService.create(any(RecipeDto.class))).thenReturn(saved);

        mockMvc.perform(post("/api/recipes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5));
    }

    @Test
    void update_existingId_returns200() throws Exception {
        RecipeDto input = buildDto(null, "Updated");
        RecipeDto updated = buildDto(1L, "Updated");
        when(recipeService.update(eq(1L), any(RecipeDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/recipes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"));
    }

    @Test
    void delete_existingId_returns204() throws Exception {
        doNothing().when(recipeService).delete(1L);

        mockMvc.perform(delete("/api/recipes/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_nonExistingId_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Not found")).when(recipeService).delete(99L);

        mockMvc.perform(delete("/api/recipes/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void search_withQueryParam_returnsFilteredResults() throws Exception {
        RecipeDto dto = buildDto(1L, "Pasta");
        when(recipeService.search(eq("pasta"), isNull(), isNull(), isNull(), isNull()))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/recipes/search").param("q", "pasta"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Pasta"));
    }

    @Test
    void getCategories_returnsEnumValues() throws Exception {
        when(recipeService.findCategories()).thenReturn(List.of("FORRETT", "HOVEDRETT", "DESSERT"));

        mockMvc.perform(get("/api/recipes/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("FORRETT"));
    }

    @Test
    void getFlavorTags_returnsEnumValues() throws Exception {
        when(recipeService.findFlavorTags()).thenReturn(List.of("SPICY", "SWEET"));

        mockMvc.perform(get("/api/recipes/flavors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("SPICY"));
    }

    @Test
    void getCuisines_returnsDistinctValues() throws Exception {
        when(recipeService.findDistinctCuisines()).thenReturn(List.of("Italiensk", "Norsk"));

        mockMvc.perform(get("/api/recipes/cuisines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Italiensk"));
    }

    private RecipeDto buildDto(Long id, String title) {
        RecipeDto dto = new RecipeDto();
        dto.setId(id);
        dto.setTitle(title);
        dto.setCategory(RecipeCategory.HOVEDRETT);
        dto.setFlavorTags(Set.of(FlavorTag.SALTY));
        return dto;
    }
}
