package no.scienta.kokebok.controller;

import no.scienta.kokebok.service.ImageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ImageController.class)
class ImageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImageService imageService;

    @Test
    void upload_validImage_returnsFilenameAndUrl() throws Exception {
        when(imageService.store(any())).thenReturn(Map.of("filename", "abc.jpg", "url", "/images/abc.jpg"));

        MockMultipartFile file = new MockMultipartFile(
                "file", "photo.jpg", "image/jpeg", "bytes".getBytes()
        );

        mockMvc.perform(multipart("/api/images/upload").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.filename").value("abc.jpg"))
                .andExpect(jsonPath("$.url").value("/images/abc.jpg"));
    }

    @Test
    void upload_invalidFileType_returns400() throws Exception {
        when(imageService.store(any())).thenThrow(new IllegalArgumentException("Only image files are allowed"));

        MockMultipartFile file = new MockMultipartFile(
                "file", "script.sh", "application/x-sh", "#!/bin/bash".getBytes()
        );

        mockMvc.perform(multipart("/api/images/upload").file(file))
                .andExpect(status().isBadRequest());
    }
}
