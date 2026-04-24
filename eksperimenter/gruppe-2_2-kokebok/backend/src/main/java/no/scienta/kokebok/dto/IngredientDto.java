package no.scienta.kokebok.dto;

import java.math.BigDecimal;

public record IngredientDto(Long id, String name, BigDecimal amount, String unit, int sortOrder) {}
