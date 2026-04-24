package no.scienta.kokebok.service;

import no.scienta.kokebok.domain.*;
import no.scienta.kokebok.dto.IngredientDto;
import no.scienta.kokebok.dto.RecipeDto;
import no.scienta.kokebok.dto.RecipeStepDto;
import no.scienta.kokebok.exception.ResourceNotFoundException;
import no.scienta.kokebok.repository.RecipeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private RecipeService recipeService;

    private Recipe sampleRecipe;

    @BeforeEach
    void setUp() {
        sampleRecipe = new Recipe();
        sampleRecipe.setId(1L);
        sampleRecipe.setTitle("Pasta");
        sampleRecipe.setDescription("Italian pasta");
        sampleRecipe.setCuisine("Italiensk");
        sampleRecipe.setCategory(RecipeCategory.HOVEDRETT);
        sampleRecipe.setFlavorTags(Set.of(FlavorTag.SALTY));
        sampleRecipe.setPrepTimeMinutes(10);
        sampleRecipe.setCookTimeMinutes(20);
        sampleRecipe.setServings(4);

        Ingredient ing = new Ingredient();
        ing.setId(10L);
        ing.setName("Spaghetti");
        ing.setSortOrder(0);
        ing.setQuantity(new BigDecimal("200"));
        ing.setUnit("gram");
        ing.setRecipe(sampleRecipe);
        sampleRecipe.getIngredients().add(ing);

        RecipeStep step = new RecipeStep();
        step.setId(20L);
        step.setStepNumber(1);
        step.setInstruction("Kok pastaen");
        step.setRecipe(sampleRecipe);
        sampleRecipe.getSteps().add(step);
    }

    @Test
    void findAll_delegatesToRepository() {
        when(recipeRepository.findAll()).thenReturn(List.of(sampleRecipe));
        List<RecipeDto> result = recipeService.findAll();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Pasta");
    }

    @Test
    void findById_existingId_returnsDto() {
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(sampleRecipe));
        RecipeDto dto = recipeService.findById(1L);
        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getTitle()).isEqualTo("Pasta");
    }

    @Test
    void findById_nonExistingId_throwsResourceNotFoundException() {
        when(recipeRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> recipeService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_validDto_savesAndReturnsDto() {
        RecipeDto input = buildSampleDto();
        when(recipeRepository.save(any(Recipe.class))).thenAnswer(inv -> {
            Recipe r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });

        RecipeDto result = recipeService.create(input);
        assertThat(result.getTitle()).isEqualTo("Pasta");
        assertThat(result.getIngredients()).hasSize(1);
        assertThat(result.getSteps()).hasSize(1);
        verify(recipeRepository).save(any(Recipe.class));
    }

    @Test
    void update_existingRecipe_updatesFields() {
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(sampleRecipe));
        when(recipeRepository.save(any(Recipe.class))).thenAnswer(inv -> inv.getArgument(0));

        RecipeDto input = buildSampleDto();
        input.setTitle("Updated Pasta");

        RecipeDto result = recipeService.update(1L, input);
        assertThat(result.getTitle()).isEqualTo("Updated Pasta");
    }

    @Test
    void update_replacesChildCollections() {
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(sampleRecipe));
        when(recipeRepository.save(any(Recipe.class))).thenAnswer(inv -> inv.getArgument(0));

        RecipeDto input = buildSampleDto();
        IngredientDto newIng = new IngredientDto();
        newIng.setName("Parmesan");
        newIng.setSortOrder(0);
        input.setIngredients(List.of(newIng));

        RecipeDto result = recipeService.update(1L, input);
        assertThat(result.getIngredients()).hasSize(1);
        assertThat(result.getIngredients().get(0).getName()).isEqualTo("Parmesan");
    }

    @Test
    void delete_existingRecipe_deletesImageAndRecipe() {
        sampleRecipe.setImageFilename("photo.jpg");
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(sampleRecipe));

        recipeService.delete(1L);

        verify(imageService).delete("photo.jpg");
        verify(recipeRepository).delete(sampleRecipe);
    }

    @Test
    void delete_nonExistingId_throwsResourceNotFoundException() {
        when(recipeRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> recipeService.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void toDto_mapsImageUrl_whenImageFilenamePresent() {
        sampleRecipe.setImageFilename("abc.jpg");
        when(recipeRepository.findAll()).thenReturn(List.of(sampleRecipe));

        RecipeDto dto = recipeService.findAll().get(0);
        assertThat(dto.getImageUrl()).isEqualTo("/images/abc.jpg");
    }

    @Test
    void toDto_imageUrlIsNull_whenNoImageFilename() {
        sampleRecipe.setImageFilename(null);
        when(recipeRepository.findAll()).thenReturn(List.of(sampleRecipe));

        RecipeDto dto = recipeService.findAll().get(0);
        assertThat(dto.getImageUrl()).isNull();
    }

    @Test
    void search_delegatesToRepositoryWithSpecification() {
        when(recipeRepository.findAll(any(Specification.class))).thenReturn(List.of(sampleRecipe));
        List<RecipeDto> result = recipeService.search("pasta", null, null, null, null);
        assertThat(result).hasSize(1);
    }

    @Test
    void findDistinctCuisines_delegatesToRepository() {
        when(recipeRepository.findDistinctCuisines()).thenReturn(List.of("Italiensk", "Norsk"));
        List<String> cuisines = recipeService.findDistinctCuisines();
        assertThat(cuisines).containsExactly("Italiensk", "Norsk");
    }

    private RecipeDto buildSampleDto() {
        RecipeDto dto = new RecipeDto();
        dto.setTitle("Pasta");
        dto.setDescription("Italian pasta");
        dto.setCuisine("Italiensk");
        dto.setCategory(RecipeCategory.HOVEDRETT);
        dto.setFlavorTags(Set.of(FlavorTag.SALTY));
        dto.setPrepTimeMinutes(10);
        dto.setCookTimeMinutes(20);
        dto.setServings(4);

        IngredientDto ing = new IngredientDto();
        ing.setName("Spaghetti");
        ing.setSortOrder(0);
        ing.setQuantity(new BigDecimal("200"));
        ing.setUnit("gram");
        dto.setIngredients(List.of(ing));

        RecipeStepDto step = new RecipeStepDto();
        step.setStepNumber(1);
        step.setInstruction("Kok pastaen");
        dto.setSteps(List.of(step));

        return dto;
    }
}
