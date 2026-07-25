package com.centerport.upload;

import com.centerport.common.NotFoundException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    private final Path uploadDir;

    public LocalStorageService(@Value("${app.upload.dir:./uploads}") String uploadPath) {
        this.uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
    }

    /**
     * Creates the upload directory on startup if it does not already exist.
     */
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
            log.debug("Upload directory initialized: {}", uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String uniqueFilename = UUID.randomUUID() + "_" + originalFilename;
        Path targetPath = uploadDir.resolve(uniqueFilename).normalize();

        validatePathWithinUploadDir(targetPath);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + uniqueFilename, e);
        }

        return uniqueFilename;
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path filePath = uploadDir.resolve(filename).normalize();
            validatePathWithinUploadDir(filePath);

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
            return "file";
        }
        return originalFilename.replaceAll("[/\\\\]", "_");
    }

    private void validatePathWithinUploadDir(Path targetPath) {
        if (!targetPath.startsWith(uploadDir)) {
            throw new RuntimeException("Cannot store file outside upload directory");
        }
    }
}
