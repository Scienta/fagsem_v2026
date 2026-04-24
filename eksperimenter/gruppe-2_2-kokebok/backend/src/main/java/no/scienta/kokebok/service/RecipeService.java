package no.scienta.kokebok.service;

import no.scienta.kokebok.domain.*;
import no.scienta.kokebok.dto.IngredientDto;
import no.scienta.kokebok.dto.RecipeDto;
import no.scienta.kokebok.dto.RecipeStepDto;
import no.scienta.kokebok.exception.ResourceNotFoundException;
import no.scienta.kokebok.repository.RecipeRepository;
import no.scienta.kokebok.repository.RecipeSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final ImageService imageService;

    public RecipeService(RecipeRepository recipeRepository, ImageService imageService) {
        this.recipeRepository = recipeRepository;
        this.imageService = imageService;
    }

    @Transactional(readOnly = true)
    public List<RecipeDto> findAll() {
        return recipeRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public RecipeDto findById(Long id) {
        return toDto(findRecipeById(id));
    }

    public RecipeDto create(RecipeDto dto) {
        Recipe recipe = new Recipe();
        mapDtoToEntity(dto, recipe);
        return toDto(recipeRepository.save(recipe));
    }

    public RecipeDto update(Long id, RecipeDto dto) {
        Recipe recipe = findRecipeById(id);
        mapDtoToEntity(dto, recipe);
        return toDto(recipeRepository.save(recipe));
    }

    public void delete(Long id) {
        Recipe recipe = findRecipeById(id);
        imageService.delete(recipe.getImageFilename());
        recipeRepository.delete(recipe);
    }

    @Transactional(readOnly = true)
    public List<RecipeDto> search(String q, String cuisine, String category, String ingredient, List<String> flavors) {
        Specification<Recipe> spec = Specification.where(null);

        if (q != null && !q.isBlank()) {
            spec = spec.and(RecipeSpecification.hasTitle(q));
        }
        if (cuisine != null && !cuisine.isBlank()) {
            spec = spec.and(RecipeSpecification.hasCuisine(cuisine));
        }
        if (category != null && !category.isBlank()) {
            RecipeCategory cat = RecipeCategory.valueOf(category.toUpperCase());
            spec = spec.and(RecipeSpecification.hasCategory(cat));
        }
        if (ingredient != null && !ingredient.isBlank()) {
            spec = spec.and(RecipeSpecification.hasIngredient(ingredient));
        }
        if (flavors != null && !flavors.isEmpty()) {
            Set<FlavorTag> tags = flavors.stream()
                    .map(f -> FlavorTag.valueOf(f.toUpperCase()))
                    .collect(Collectors.toSet());
            spec = spec.and(RecipeSpecification.hasFlavorTags(tags));
        }

        return recipeRepository.findAll(spec).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<String> findDistinctCuisines() {
        return recipeRepository.findDistinctCuisines();
    }

    @Transactional(readOnly = true)
    public List<String> findCategories() {
        return Arrays.stream(RecipeCategory.values()).map(Enum::name).toList();
    }

    @Transactional(readOnly = true)
    public List<String> findFlavorTags() {
        return Arrays.stream(FlavorTag.values()).map(Enum::name).toList();
    }

    @Transactional(readOnly = true)
    public List<RecipeDto> findByCategory(RecipeCategory category) {
        return recipeRepository.findByCategory(category).stream().map(this::toDto).toList();
    }

    private Recipe findRecipeById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe not found: " + id));
    }

    private void mapDtoToEntity(RecipeDto dto, Recipe recipe) {
        recipe.setTitle(dto.getTitle());
        recipe.setDescription(dto.getDescription());
        recipe.setCuisine(dto.getCuisine());
        recipe.setCategory(dto.getCategory());
        recipe.setFlavorTags(dto.getFlavorTags() != null ? dto.getFlavorTags() : Set.of());
        recipe.setPrepTimeMinutes(dto.getPrepTimeMinutes());
        recipe.setCookTimeMinutes(dto.getCookTimeMinutes());
        recipe.setServings(dto.getServings());
        if (dto.getImageFilename() != null) {
            recipe.setImageFilename(dto.getImageFilename());
        }

        recipe.getIngredients().clear();
        if (dto.getIngredients() != null) {
            dto.getIngredients().forEach(ingDto -> {
                Ingredient ing = new Ingredient();
                ing.setName(ingDto.getName());
                ing.setSortOrder(ingDto.getSortOrder());
                ing.setQuantity(ingDto.getQuantity());
                ing.setUnit(ingDto.getUnit());
                ing.setRecipe(recipe);
                recipe.getIngredients().add(ing);
            });
        }

        recipe.getSteps().clear();
        if (dto.getSteps() != null) {
            dto.getSteps().forEach(stepDto -> {
                RecipeStep step = new RecipeStep();
                step.setStepNumber(stepDto.getStepNumber());
                step.setInstruction(stepDto.getInstruction());
                step.setRecipe(recipe);
                recipe.getSteps().add(step);
            });
        }
    }

    RecipeDto toDto(Recipe recipe) {
        RecipeDto dto = new RecipeDto();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setDescription(recipe.getDescription());
        dto.setCuisine(recipe.getCuisine());
        dto.setCategory(recipe.getCategory());
        dto.setFlavorTags(recipe.getFlavorTags());
        dto.setPrepTimeMinutes(recipe.getPrepTimeMinutes());
        dto.setCookTimeMinutes(recipe.getCookTimeMinutes());
        dto.setServings(recipe.getServings());
        dto.setImageFilename(recipe.getImageFilename());
        if (recipe.getImageFilename() != null) {
            dto.setImageUrl("/images/" + recipe.getImageFilename());
        }
        dto.setCreatedAt(recipe.getCreatedAt());
        dto.setUpdatedAt(recipe.getUpdatedAt());

        dto.setIngredients(recipe.getIngredients().stream().map(ing -> {
            IngredientDto ingDto = new IngredientDto();
            ingDto.setId(ing.getId());
            ingDto.setName(ing.getName());
            ingDto.setSortOrder(ing.getSortOrder());
            ingDto.setQuantity(ing.getQuantity());
            ingDto.setUnit(ing.getUnit());
            return ingDto;
        }).toList());

        dto.setSteps(recipe.getSteps().stream().map(step -> {
            RecipeStepDto stepDto = new RecipeStepDto();
            stepDto.setId(step.getId());
            stepDto.setStepNumber(step.getStepNumber());
            stepDto.setInstruction(step.getInstruction());
            return stepDto;
        }).toList());

        return dto;
    }
}
