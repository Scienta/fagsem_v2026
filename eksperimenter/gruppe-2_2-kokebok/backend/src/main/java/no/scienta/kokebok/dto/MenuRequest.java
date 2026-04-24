package no.scienta.kokebok.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record MenuRequest(@NotBlank String name, String description, List<MenuCourseRequest> courses) {}
