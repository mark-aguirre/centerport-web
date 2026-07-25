package com.centerport.upload;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

/**
 * REST controller for file upload and retrieval.
 *
 * Endpoints:
 * - {@code POST /api/files} — upload a file (multipart form data)
 * - {@code GET /api/files/{filename}} — serve a previously stored file
 *
 * Upload Validation:
 * - Rejects empty files
 * - Validates content type against a configurable allowlist
 *   (default: JPEG, PNG, GIF, WebP, PDF)
 *
 * @see StorageService
 * @see LocalStorageService
 */
@Slf4j
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private static final String DEFAULT_CONTENT_TYPE = "application/octet-stream";
    private static final String INLINE_DISPOSITION_FORMAT = "inline; filename=\"%s\"";

    private final StorageService storageService;
    private final List<String> allowedTypes;

    /**
     * Constructs the controller with a storage backend and configurable allowed content types.
     *
     * @param storageService     the storage implementation for persisting and retrieving files
     * @param allowedTypesConfig comma-separated list of allowed MIME types
     *                           (property: {@code app.upload.allowed-types})
     */
    public FileUploadController(
            StorageService storageService,
            @Value("${app.upload.allowed-types:image/jpeg,image/png,image/gif,image/webp,application/pdf}")
            String allowedTypesConfig) {
        this.storageService = storageService;
        this.allowedTypes = List.of(allowedTypesConfig.split(","));
    }

    // === Endpoints ===

    /**
     * Uploads a single file. Validates that the file is non-empty and its content
     * type matches the configured allowlist.
     *
     * @param file the multipart file from the request
     * @return JSON with {@code file_url} pointing to the stored file's retrieval endpoint
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "File type not allowed. Allowed types: " + String.join(", ", allowedTypes)));
        }

        String storedFilename = storageService.store(file);
        String fileUrl = "/api/files/" + storedFilename;
        log.debug("File uploaded — originalName: {}, storedAs: {}", file.getOriginalFilename(), storedFilename);

        return ResponseEntity.ok(Map.of("file_url", fileUrl));
    }

    /**
     * Serves a previously uploaded file by its stored filename.
     * Probes the file's content type for accurate {@code Content-Type} header.
     *
     * @param filename the stored filename (UUID-prefixed)
     * @return the file as inline content with appropriate media type
     */
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource resource = storageService.loadAsResource(filename);
        String contentType = probeContentType(resource);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format(INLINE_DISPOSITION_FORMAT, resource.getFilename()))
                .body(resource);
    }

    // === Private Helpers ===

    private static String probeContentType(Resource resource) {
        try {
            Path path = resource.getFile().toPath();
            String probed = Files.probeContentType(path);
            if (probed != null) {
                return probed;
            }
        } catch (IOException e) {
            log.trace("Content type probe failed, falling back to default — resource: {}", resource.getFilename(), e);
        }
        return DEFAULT_CONTENT_TYPE;
    }
}
