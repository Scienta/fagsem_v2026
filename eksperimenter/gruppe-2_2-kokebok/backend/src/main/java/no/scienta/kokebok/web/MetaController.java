package no.scienta.kokebok.web;

import no.scienta.kokebok.domain.Category;
import no.scienta.kokebok.domain.Cuisine;
import no.scienta.kokebok.domain.FlavorTag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/meta")
public class MetaController {

    @GetMapping("/categories")
    public List<String> categories() {
        return List.of(Category.values()).stream().map(Enum::name).toList();
    }

    @GetMapping("/cuisines")
    public List<String> cuisines() {
        return List.of(Cuisine.values()).stream().map(Enum::name).toList();
    }

    @GetMapping("/flavors")
    public List<String> flavors() {
        return List.of(FlavorTag.values()).stream().map(Enum::name).toList();
    }
}
