package no.scienta.kokebok.dto;

import no.scienta.kokebok.domain.Category;

public record MenuCourseRequest(Long recipeId, Category courseCategory, int courseOrder) {}
