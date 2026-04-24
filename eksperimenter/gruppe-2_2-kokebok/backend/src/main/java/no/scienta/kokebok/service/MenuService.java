package no.scienta.kokebok.service;

import no.scienta.kokebok.domain.Menu;
import no.scienta.kokebok.domain.MenuCourse;
import no.scienta.kokebok.domain.Recipe;
import no.scienta.kokebok.dto.*;
import no.scienta.kokebok.repository.MenuRepository;
import no.scienta.kokebok.repository.RecipeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;
    private final RecipeRepository recipeRepository;
    private final RecipeService recipeService;

    public MenuService(MenuRepository menuRepository, RecipeRepository recipeRepository, RecipeService recipeService) {
        this.menuRepository = menuRepository;
        this.recipeRepository = recipeRepository;
        this.recipeService = recipeService;
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getAll() {
        return menuRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public MenuResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public MenuResponse create(MenuRequest request) {
        Menu menu = new Menu();
        applyRequest(menu, request);
        return toResponse(menuRepository.save(menu));
    }

    public MenuResponse update(Long id, MenuRequest request) {
        Menu menu = findOrThrow(id);
        menu.getCourses().clear();
        applyRequest(menu, request);
        return toResponse(menuRepository.save(menu));
    }

    public void delete(Long id) {
        menuRepository.delete(findOrThrow(id));
    }

    private void applyRequest(Menu menu, MenuRequest req) {
        menu.setName(req.name());
        menu.setDescription(req.description());

        if (req.courses() != null) {
            req.courses().forEach(dto -> {
                Recipe recipe = recipeRepository.findById(dto.recipeId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Recipe not found: " + dto.recipeId()));
                MenuCourse course = new MenuCourse();
                course.setMenu(menu);
                course.setRecipe(recipe);
                course.setCourseCategory(dto.courseCategory());
                course.setCourseOrder(dto.courseOrder());
                menu.getCourses().add(course);
            });
        }
    }

    private Menu findOrThrow(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu not found: " + id));
    }

    private MenuResponse toResponse(Menu m) {
        List<MenuCourseResponse> courses = m.getCourses().stream()
                .map(c -> new MenuCourseResponse(c.getId(), c.getCourseCategory(), c.getCourseOrder(),
                        toRecipeSummary(c.getRecipe())))
                .toList();
        return new MenuResponse(m.getId(), m.getName(), m.getDescription(), courses, m.getCreatedAt());
    }

    private RecipeSummaryResponse toRecipeSummary(Recipe r) {
        String thumbnail = r.getImages().isEmpty() ? null
                : "/uploads/images/" + r.getImages().get(0).getFilePath().replace("uploads/images/", "");
        return new RecipeSummaryResponse(r.getId(), r.getTitle(), r.getDescription(),
                r.getCategory(), r.getCuisine(), r.getPrepTimeMinutes(), r.getCookTimeMinutes(),
                r.getFlavorTags(), thumbnail);
    }
}
