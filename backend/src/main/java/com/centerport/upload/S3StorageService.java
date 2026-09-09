package com.centerport.upload;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.centerport.common.exception.NotFoundException;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;

/**
 * S3-compatible object storage implementation of {@link StorageService}, targeting
 * SeaweedFS (via its S3 gateway) but compatible with any S3 API endpoint (MinIO, AWS S3).
 *
 * Storage Strategy:
 * Objects are stored under UUID-prefixed keys to guarantee collision-free storage.
 * Original filenames are sanitized to remove path separators before appending. Only
 * the object key is persisted by callers (e.g., as {@code SeafarerProfile.photoUrl}),
 * mirroring the {@link LocalStorageService} contract so the {@code /api/files/*}
 * upload/serve flow is unchanged.
 *
 * Activation:
 * Active only when {@code app.storage.type=s3}. Otherwise {@link LocalStorageService}
 * is used.
 *
 * Configuration ({@code app.storage.s3.*}):
 * - {@code endpoint} — S3 gateway URL (e.g. {@code http://192.168.0.15:8333})
 * - {@code region} — S3 region (SeaweedFS ignores it but the SDK requires one)
 * - {@code bucket} — target bucket (created on startup if missing)
 * - {@code access-key} / {@code secret-key} — S3 credentials
 * - {@code path-style-access} — force path-style URLs (required by SeaweedFS/MinIO)
 *
 * @see StorageService
 * @see LocalStorageService
 * @see FileUploadController
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "s3")
public class S3StorageService implements StorageService {

    private static final String PATH_SEPARATOR_PATTERN = "[/\\\\]";
    private static final String DEFAULT_FILENAME = "file";

    private final S3Client s3Client;
    private final String bucket;

    /**
     * Constructs the service and its underlying {@link S3Client} from configuration.
     *
     * @param endpoint        S3 gateway URL (property: {@code app.storage.s3.endpoint})
     * @param region          S3 region (property: {@code app.storage.s3.region})
     * @param bucket          target bucket (property: {@code app.storage.s3.bucket})
     * @param accessKey       S3 access key (property: {@code app.storage.s3.access-key})
     * @param secretKey       S3 secret key (property: {@code app.storage.s3.secret-key})
     * @param pathStyleAccess whether to force path-style access
     *                        (property: {@code app.storage.s3.path-style-access})
     */
    public S3StorageService(
            @Value("${app.storage.s3.endpoint}") String endpoint,
            @Value("${app.storage.s3.region:us-east-1}") String region,
            @Value("${app.storage.s3.bucket:patient-photos}") String bucket,
            @Value("${app.storage.s3.access-key}") String accessKey,
            @Value("${app.storage.s3.secret-key}") String secretKey,
            @Value("${app.storage.s3.path-style-access:true}") boolean pathStyleAccess) {
        this.bucket = bucket;
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(pathStyleAccess)
                        .build())
                .build();
    }

    /**
     * Verifies connectivity to the S3 endpoint and ensures the target bucket exists,
     * creating it if necessary.
     *
     * @throws IllegalStateException if the bucket cannot be verified or created
     */
    @PostConstruct
    public void init() {
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucket).build());
            log.debug("S3 storage initialized — bucket: {}", bucket);
        } catch (NoSuchBucketException e) {
            log.info("S3 bucket does not exist, creating — bucket: {}", bucket);
            try {
                s3Client.createBucket(b -> b.bucket(bucket));
            } catch (S3Exception ce) {
                throw new IllegalStateException("Could not create S3 bucket: " + bucket, ce);
            }
        } catch (S3Exception e) {
            throw new IllegalStateException("Could not connect to S3 storage / verify bucket: " + bucket, e);
        }
    }

    // === StorageService Implementation ===

    /**
     * {@inheritDoc}
     *
     * Generates a UUID-prefixed key and uploads the file to the configured bucket.
     * The original filename is sanitized to strip path separators.
     *
     * @throws IllegalStateException if the file cannot be uploaded
     */
    @Override
    public String store(MultipartFile file) {
        String originalFilename = sanitizeFilename(file.getOriginalFilename());
        String key = UUID.randomUUID() + "_" + originalFilename;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();
            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException | S3Exception e) {
            throw new IllegalStateException("Failed to store file in S3: " + key, e);
        }

        log.debug("File stored in S3 — key: {}, bucket: {}", key, bucket);
        return key;
    }

    /**
     * {@inheritDoc}
     *
     * Downloads the object bytes and wraps them in an in-memory {@link ByteArrayResource}.
     *
     * @throws com.centerport.common.exception.NotFoundException if the object does not exist
     */
    @Override
    public Resource loadAsResource(String filename) {
        try {
            GetObjectRequest request = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(filename)
                    .build();
            ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(request);
            return new NamedByteArrayResource(objectBytes.asByteArray(), filename);
        } catch (NoSuchKeyException e) {
            throw new NotFoundException("File", filename);
        } catch (S3Exception e) {
            throw new IllegalStateException("Failed to load file from S3: " + filename, e);
        }
    }

    // === Private Helpers ===

    private static String sanitizeFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return DEFAULT_FILENAME;
        }
        return originalFilename.replaceAll(PATH_SEPARATOR_PATTERN, "_");
    }

    /**
     * {@link ByteArrayResource} that reports a filename, so downstream code (e.g.
     * {@code FileUploadController}) can read {@link Resource#getFilename()} for the
     * {@code Content-Disposition} header.
     */
    private static final class NamedByteArrayResource extends ByteArrayResource {
        private final String filename;

        private NamedByteArrayResource(byte[] byteArray, String filename) {
            super(byteArray);
            this.filename = filename;
        }

        @Override
        public String getFilename() {
            return filename;
        }
    }
}
