package com.centerport.upload;

import com.centerport.common.GlobalExceptionHandler;
import com.centerport.common.NotFoundException;
import com.centerport.config.JacksonConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * WebMvcTest for FileUploadController.
 * Validates upload success/failure, file type validation, empty file handling, and file serving.
 */
@WebMvcTest(FileUploadController.class)
@Import({GlobalExceptionHandler.class, JacksonConfig.class})
class FileUploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StorageService storageService;

    @Test
    void postValidImageFile_returns200WithFileUrl() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "photo.png", "image/png", "fake-image-content".getBytes());

        when(storageService.store(any())).thenReturn("abc123_photo.png");

        mockMvc.perform(multipart("/api/files").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.file_url").value("/api/files/abc123_photo.png"));
    }

    @Test
    void postValidPdfFile_returns200WithFileUrl() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "document.pdf", "application/pdf", "fake-pdf-content".getBytes());

        when(storageService.store(any())).thenReturn("def456_document.pdf");

        mockMvc.perform(multipart("/api/files").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.file_url").value("/api/files/def456_document.pdf"));
    }

    @Test
    void postDisallowedFileType_returns400() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "malware.exe", "application/x-msdownload", "bad-content".getBytes());

        mockMvc.perform(multipart("/api/files").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("File type not allowed")));
    }

    @Test
    void postEmptyFile_returns400() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "empty.png", "image/png", new byte[0]);

        mockMvc.perform(multipart("/api/files").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("File is empty")));
    }

    @Test
    void postFileWithNullContentType_returns400() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "noext", null, "some-content".getBytes());

        mockMvc.perform(multipart("/api/files").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("File type not allowed")));
    }

    @Test
    void getExistingFile_returns200WithContent() throws Exception {
        byte[] content = "file-content-bytes".getBytes();
        ByteArrayResource resource = new ByteArrayResource(content) {
            @Override
            public String getFilename() {
                return "abc123_photo.png";
            }
        };

        when(storageService.loadAsResource("abc123_photo.png")).thenReturn(resource);

        mockMvc.perform(get("/api/files/abc123_photo.png"))
                .andExpect(status().isOk())
                .andExpect(content().bytes(content));
    }

    @Test
    void getMissingFile_returns404() throws Exception {
        when(storageService.loadAsResource("nonexistent.png"))
                .thenThrow(new NotFoundException("File", "nonexistent.png"));

        mockMvc.perform(get("/api/files/nonexistent.png"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
