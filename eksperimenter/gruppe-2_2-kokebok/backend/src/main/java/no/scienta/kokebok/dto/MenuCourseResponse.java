package no.scienta.kokebok.dto;

import no.scienta.kokebok.domain.Category;

public record MenuCourseResponse(Long id, Category courseCategory, int courseOrder, RecipeSummaryResponse recipe) {}
