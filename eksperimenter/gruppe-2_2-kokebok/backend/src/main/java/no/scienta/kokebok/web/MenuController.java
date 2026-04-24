package no.scienta.kokebok.web;

import jakarta.validation.Valid;
import no.scienta.kokebok.dto.MenuRequest;
import no.scienta.kokebok.dto.MenuResponse;
import no.scienta.kokebok.service.MenuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public List<MenuResponse> getAll() {
        return menuService.getAll();
    }

    @GetMapping("/{id}")
    public MenuResponse getById(@PathVariable Long id) {
        return menuService.getById(id);
    }

    @PostMapping
    public ResponseEntity<MenuResponse> create(@Valid @RequestBody MenuRequest request) {
        MenuResponse response = menuService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public MenuResponse update(@PathVariable Long id, @Valid @RequestBody MenuRequest request) {
        return menuService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
