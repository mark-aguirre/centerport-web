package com.centerport.upload;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.centerport.common.exception.NotFoundException;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Local filesystem implementation of {@link StorageService}.
 *
 * Storage Strategy:
 * Files are stored in a configurable directory (default: {@code ./uploads}) with
 * UUID-prefixed filenames to guarantee collision-free storage. Original filenames
 * are sanitized to remove path separators before appending.
 *
 * Security:
 * - Directory traversal prevention via path normalization and startsWith checks
 * - Original filename sanitization strips path separators
 *
 * Configuration:
 * - {@code app.upload.dir} — base directory for file storage (default: {@code ./uploads})
 *
 * @see StorageService
 * @see FileUploadController
 */
@Slf4j
@Service
public class LocalStorageService implements StorageService {

    private static final String PATH_SEPARATOR_PATTERN = "[/\\\\]";
    private static final String DEFAULT_FILENAME = "file";

    private final Path uploadDir;

    /**
     * Constructs the service with the configured upload directory path.
     *
     * @param uploadPath base directory for file storage (property: {@code app.upload.dir})
     */
    public LocalStorageService(@Value("${app.upload.dir:./uploads}") String uploadPath) {
        this.uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
    }

    /**
     * Creates the upload directory on startup if it does not already exist.
     *
     * @throws IllegalStateException if the directory cannot be created
     */
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
            log.debug("Upload directory initialized — path: {}", uploadDir);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory: " + uploadDir, e);
        }
    }

    // === StorageService Implementation ===

    /**
     * {@inheritDoc}
     *
     * Generates a UUID-prefixed filename and writes the file to the upload directory.
     * The original filename is sanitized to prevent path traversal.
     *
     * @throws IllegalStateException if the file cannot be written to storage
     */
    @Override
    public String store(MultipartFile file) {
        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
        Path targetPath = uploadDir.resolve(uniqueFilename).normalize();

        validatePathWithinUploadDir(targetPath);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file: " + uniqueFilename, e);
        }

        log.debug("File stored — name: {}, path: {}", uniqueFilename, targetPath);
        return uniqueFilename;
    }

    /**
     * {@inheritDoc}
     *
     * Resolves the filename against the upload directory, validates the path is
     * contained within it, and returns a readable {@link UrlResource}.
     */
    @Override
    public Resource loadAsResource(String filename) {
        Path filePath = uploadDir.resolve(filename).normalize();
        validatePathWithinUploadDir(filePath);

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new NotFoundException("File", filename);
        } catch (MalformedURLException e) {
            throw new NotFoundException("File", filename);
        }
    }

    // === Private Helpers ===

    private static String sanitizeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return DEFAULT_FILENAME;
        }
        return originalFilename.replaceAll(PATH_SEPARATOR_PATTERN, "_");
    }

    private void validatePathWithinUploadDir(Path targetPath) {
        if (!targetPath.startsWith(uploadDir)) {
            throw new SecurityException("Path traversal attempt — resolved path is outside upload directory");
        }
    }
}
