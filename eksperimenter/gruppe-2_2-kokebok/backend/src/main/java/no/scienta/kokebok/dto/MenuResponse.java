package no.scienta.kokebok.dto;

import java.time.LocalDateTime;
import java.util.List;

public record MenuResponse(Long id, String name, String description, List<MenuCourseResponse> courses, LocalDateTime createdAt) {}
