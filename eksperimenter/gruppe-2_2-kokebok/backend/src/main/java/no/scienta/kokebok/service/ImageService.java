package no.scienta.kokebok.service;

import no.scienta.kokebok.domain.Recipe;
import no.scienta.kokebok.domain.RecipeImage;
import no.scienta.kokebok.dto.RecipeImageDto;
import no.scienta.kokebok.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class ImageService {

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    @Value("${app.uploads.dir}")
    private String uploadsDir;

    private final RecipeRepository recipeRepository;

    public ImageService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public RecipeImageDto upload(Long recipeId, MultipartFile file) {
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported image type: " + file.getContentType());
        }

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found: " + recipeId));

        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + ext;
        String relativePath = uploadsDir + "/" + filename;

        try {
            Path dir = Paths.get(uploadsDir);
            Files.createDirectories(dir);
            Files.copy(file.getInputStream(), Paths.get(relativePath));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store image", e);
        }

        int nextOrder = recipe.getImages().size();
        RecipeImage image = new RecipeImage();
        image.setRecipe(recipe);
        image.setFilePath(relativePath);
        image.setOriginalFilename(file.getOriginalFilename());
        image.setSortOrder(nextOrder);
        recipe.getImages().add(image);

        recipeRepository.save(recipe);

        return new RecipeImageDto(image.getId(), "/uploads/images/" + filename, nextOrder);
    }

    public void deleteImage(Long recipeId, Long imageId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found: " + recipeId));

        RecipeImage image = recipe.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found: " + imageId));

        deleteFile(image.getFilePath());
        recipe.getImages().remove(image);
        recipeRepository.save(recipe);
    }

    public void deleteFile(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException ignored) {
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf("."));
    }

    public List<RecipeImageDto> getImages(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipe not found: " + recipeId));
        return recipe.getImages().stream()
                .map(img -> new RecipeImageDto(img.getId(),
                        "/uploads/images/" + img.getFilePath().replace(uploadsDir + "/", ""),
                        img.getSortOrder()))
                .toList();
    }
}
