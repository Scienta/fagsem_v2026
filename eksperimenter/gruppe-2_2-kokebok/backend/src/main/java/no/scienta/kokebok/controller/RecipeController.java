package no.scienta.kokebok.controller;

import no.scienta.kokebok.dto.RecipeDto;
import no.scienta.kokebok.service.RecipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public List<RecipeDto> getAll() {
        return recipeService.findAll();
    }

    @GetMapping("/{id}")
    public RecipeDto getById(@PathVariable Long id) {
        return recipeService.findById(id);
    }

    @PostMapping
    public ResponseEntity<RecipeDto> create(@RequestBody RecipeDto dto) {
        RecipeDto created = recipeService.create(dto);
        return ResponseEntity.created(URI.create("/api/recipes/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public RecipeDto update(@PathVariable Long id, @RequestBody RecipeDto dto) {
        return recipeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recipeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<RecipeDto> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String ingredient,
            @RequestParam(required = false) List<String> flavors) {
        return recipeService.search(q, cuisine, category, ingredient, flavors);
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return recipeService.findCategories();
    }

    @GetMapping("/flavors")
    public List<String> getFlavors() {
        return recipeService.findFlavorTags();
    }

    @GetMapping("/cuisines")
    public List<String> getCuisines() {
        return recipeService.findDistinctCuisines();
    }
}
