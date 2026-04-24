package no.scienta.kokebok.dto;

import jakarta.validation.constraints.NotBlank;
import no.scienta.kokebok.domain.Category;
import no.scienta.kokebok.domain.Cuisine;
import no.scienta.kokebok.domain.FlavorTag;

import java.util.List;
import java.util.Set;

public record RecipeRequest(
        @NotBlank String title,
        String description,
        Integer prepTimeMinutes,
        Integer cookTimeMinutes,
        Category category,
        Cuisine cuisine,
        Set<FlavorTag> flavorTags,
        List<IngredientDto> ingredients,
        List<InstructionStepDto> steps
) {}
