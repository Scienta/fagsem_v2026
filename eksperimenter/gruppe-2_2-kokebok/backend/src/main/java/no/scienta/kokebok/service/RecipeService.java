package no.scienta.kokebok.service;

import no.scienta.kokebok.domain.*;
import no.scienta.kokebok.dto.*;
import no.scienta.kokebok.repository.RecipeRepository;
import no.scienta.kokebok.repository.RecipeSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

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
    public PageResponse<RecipeSummaryResponse> search(
            String q, Category category, Cuisine cuisine,
            Set<FlavorTag> flavors, String ingredient, Pageable pageable) {

        Specification<Recipe> spec = RecipeSpecification.withFilters(q, category, cuisine, flavors, ingredient);
        Page<Recipe> page = recipeRepository.findAll(spec, pageable);

        List<RecipeSummaryResponse> content = page.getContent().stream()
                .map(this::toSummary)
                .toList();

        return new PageResponse<>(content, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    @Transactional(readOnly = true)
    public RecipeResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public RecipeResponse create(RecipeRequest request) {
        Recipe recipe = new Recipe();
        applyRequest(recipe, request);
        return toResponse(recipeRepository.save(recipe));
    }

    public RecipeResponse update(Long id, RecipeRequest request) {
        Recipe recipe = findOrThrow(id);
        recipe.getIngredients().clear();
        recipe.getSteps().clear();
        applyRequest(recipe, request);
        return toResponse(recipeRepository.save(recipe));
    }

    public void delete(Long id) {
        Recipe recipe = findOrThrow(id);
        recipe.getImages().forEach(img -> imageService.deleteFile(img.getFilePath()));
        recipeRepository.delete(recipe);
    }

    private void applyRequest(Recipe recipe, RecipeRequest req) {
        recipe.setTitle(req.title());
        recipe.setDescription(req.description());
        recipe.setPrepTimeMinutes(req.prepTimeMinutes());
        recipe.setCookTimeMinutes(req.cookTimeMinutes());
        recipe.setCategory(req.category());
        recipe.setCuisine(req.cuisine());
        recipe.setFlavorTags(req.flavorTags() != null ? req.flavorTags() : Set.of());

        if (req.ingredients() != null) {
            req.ingredients().forEach(dto -> {
                Ingredient ing = new Ingredient();
                ing.setRecipe(recipe);
                ing.setName(dto.name());
                ing.setAmount(dto.amount());
                ing.setUnit(dto.unit());
                ing.setSortOrder(dto.sortOrder());
                recipe.getIngredients().add(ing);
            });
        }

        if (req.steps() != null) {
            req.steps().forEach(dto -> {
                InstructionStep step = new InstructionStep();
                step.setRecipe(recipe);
                step.setStepNumber(dto.stepNumber());
                step.setDescription(dto.description());
                recipe.getSteps().add(step);
            });
        }
    }

    private Recipe findOrThrow(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found: " + id));
    }

    private RecipeSummaryResponse toSummary(Recipe r) {
        String thumbnail = r.getImages().isEmpty() ? null
                : "/uploads/images/" + r.getImages().get(0).getFilePath().replace("uploads/images/", "");
        return new RecipeSummaryResponse(r.getId(), r.getTitle(), r.getDescription(),
                r.getCategory(), r.getCuisine(), r.getPrepTimeMinutes(), r.getCookTimeMinutes(),
                r.getFlavorTags(), thumbnail);
    }

    public RecipeResponse toResponse(Recipe r) {
        List<IngredientDto> ingredients = r.getIngredients().stream()
                .map(i -> new IngredientDto(i.getId(), i.getName(), i.getAmount(), i.getUnit(), i.getSortOrder()))
                .toList();

        List<InstructionStepDto> steps = r.getSteps().stream()
                .map(s -> new InstructionStepDto(s.getId(), s.getStepNumber(), s.getDescription()))
                .toList();

        List<RecipeImageDto> images = r.getImages().stream()
                .map(img -> new RecipeImageDto(img.getId(), "/uploads/images/" + img.getFilePath().replace("uploads/images/", ""), img.getSortOrder()))
                .toList();

        return new RecipeResponse(r.getId(), r.getTitle(), r.getDescription(),
                r.getCategory(), r.getCuisine(), r.getPrepTimeMinutes(), r.getCookTimeMinutes(),
                r.getFlavorTags(), ingredients, steps, images, r.getCreatedAt(), r.getUpdatedAt());
    }
}
