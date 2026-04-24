package no.scienta.kokebok.web;

import no.scienta.kokebok.dto.RecipeImageDto;
import no.scienta.kokebok.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/recipes/{recipeId}/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping
    public ResponseEntity<RecipeImageDto> upload(
            @PathVariable Long recipeId,
            @RequestParam("file") MultipartFile file) {
        RecipeImageDto dto = imageService.upload(recipeId, file);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(dto.id()).toUri();
        return ResponseEntity.created(location).body(dto);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> delete(@PathVariable Long recipeId, @PathVariable Long imageId) {
        imageService.deleteImage(recipeId, imageId);
        return ResponseEntity.noContent().build();
    }
}
