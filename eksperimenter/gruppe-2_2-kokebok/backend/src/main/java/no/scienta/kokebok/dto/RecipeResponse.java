package no.scienta.kokebok.dto;

import no.scienta.kokebok.domain.Category;
import no.scienta.kokebok.domain.Cuisine;
import no.scienta.kokebok.domain.FlavorTag;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record RecipeResponse(
        Long id,
        String title,
        String description,
        Category category,
        Cuisine cuisine,
        Integer prepTimeMinutes,
        Integer cookTimeMinutes,
        Set<FlavorTag> flavorTags,
        List<IngredientDto> ingredients,
        List<InstructionStepDto> steps,
        List<RecipeImageDto> images,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
