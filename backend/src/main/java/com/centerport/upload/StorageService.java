package com.centerport.upload;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction for file storage operations.
 *
 * Implementations may store files on the local filesystem, in cloud storage (e.g., S3),
 * or any other backing store. The contract guarantees collision-free storage via
 * unique filename generation and path-traversal-safe retrieval.
 *
 * @see LocalStorageService
 */
public interface StorageService {

    /**
     * Stores the given file and returns the generated filename.
     * The returned filename is guaranteed to be unique and collision-free.
     *
     * @param file the multipart file to store
     * @return the unique filename under which the file was stored
     * @throws RuntimeException if the file cannot be written to storage
     */
    String store(MultipartFile file);

    /**
     * Loads a previously stored file as a Spring {@link Resource} for serving.
     *
     * @param filename the stored filename (as returned by {@link #store(MultipartFile)})
     * @return the file as a readable Resource
     * @throws com.centerport.common.exception.NotFoundException if the file does not exist or is unreadable
     */
    Resource loadAsResource(String filename);
}
