package no.scienta.kokebok.dto;

import no.scienta.kokebok.domain.Category;
import no.scienta.kokebok.domain.Cuisine;
import no.scienta.kokebok.domain.FlavorTag;

import java.util.Set;

public record RecipeSummaryResponse(
        Long id,
        String title,
        String description,
        Category category,
        Cuisine cuisine,
        Integer prepTimeMinutes,
        Integer cookTimeMinutes,
        Set<FlavorTag> flavorTags,
        String thumbnailUrl
) {}
