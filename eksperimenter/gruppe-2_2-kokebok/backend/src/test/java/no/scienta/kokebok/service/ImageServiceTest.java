package no.scienta.kokebok.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ImageServiceTest {

    @TempDir
    Path tempDir;

    private ImageService imageService;

    @BeforeEach
    void setUp() {
        imageService = new ImageService(tempDir.toString());
    }

    @Test
    void store_validImageFile_savesFileAndReturnsFilenameAndUrl() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file", "photo.jpg", "image/jpeg", "fake-jpeg-bytes".getBytes()
        );

        Map<String, String> result = imageService.store(file);

        assertThat(result).containsKey("filename");
        assertThat(result).containsKey("url");
        assertThat(result.get("filename")).endsWith(".jpg");
        assertThat(result.get("url")).startsWith("/images/");

        Path storedFile = tempDir.resolve(result.get("filename"));
        assertThat(Files.exists(storedFile)).isTrue();
        assertThat(Files.readAllBytes(storedFile)).isEqualTo("fake-jpeg-bytes".getBytes());
    }

    @Test
    void store_nonImageFile_throwsIllegalArgumentException() {
        MultipartFile file = new MockMultipartFile(
                "file", "script.sh", "application/x-sh", "#!/bin/bash".getBytes()
        );

        assertThatThrownBy(() -> imageService.store(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
    }

    @Test
    void store_preservesOriginalFileExtension() throws IOException {
        MultipartFile png = new MockMultipartFile(
                "file", "photo.png", "image/png", new byte[]{1, 2, 3}
        );

        Map<String, String> result = imageService.store(png);
        assertThat(result.get("filename")).endsWith(".png");
    }

    @Test
    void delete_existingFile_removesFile() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file", "delete-me.jpg", "image/jpeg", new byte[]{1}
        );
        Map<String, String> stored = imageService.store(file);

        imageService.delete(stored.get("filename"));

        Path storedPath = tempDir.resolve(stored.get("filename"));
        assertThat(Files.exists(storedPath)).isFalse();
    }

    @Test
    void delete_nonExistingFile_doesNotThrow() {
        imageService.delete("nonexistent.jpg");
    }

    @Test
    void delete_nullFilename_doesNotThrow() {
        imageService.delete(null);
    }
}
