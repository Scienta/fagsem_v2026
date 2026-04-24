package no.scienta.kokebok.controller;

import no.scienta.kokebok.domain.RecipeCategory;
import no.scienta.kokebok.dto.MenuRequest;
import no.scienta.kokebok.dto.MenuResponse;
import no.scienta.kokebok.dto.RecipeDto;
import no.scienta.kokebok.service.RecipeService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final RecipeService recipeService;

    public MenuController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping("/suggest")
    public Map<String, RecipeDto> suggest() {
        Map<String, RecipeDto> suggestion = new LinkedHashMap<>();
        for (String categoryName : recipeService.findCategories()) {
            RecipeCategory category = RecipeCategory.valueOf(categoryName);
            List<RecipeDto> recipes = recipeService.findByCategory(category);
            if (!recipes.isEmpty()) {
                List<RecipeDto> shuffled = new ArrayList<>(recipes);
                Collections.shuffle(shuffled);
                suggestion.put(categoryName, shuffled.get(0));
            }
        }
        return suggestion;
    }

    @PostMapping("/build")
    public MenuResponse build(@RequestBody MenuRequest request) {
        List<RecipeDto> dishes = request.getCategorySelections().values().stream()
                .map(recipeService::findById)
                .toList();

        int totalTime = dishes.stream()
                .mapToInt(d -> {
                    int prep = d.getPrepTimeMinutes() != null ? d.getPrepTimeMinutes() : 0;
                    int cook = d.getCookTimeMinutes() != null ? d.getCookTimeMinutes() : 0;
                    return prep + cook;
                })
                .sum();

        return new MenuResponse(dishes, totalTime);
    }
}
