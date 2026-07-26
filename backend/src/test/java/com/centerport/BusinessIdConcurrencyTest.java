package com.centerport;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.centerport.common.util.BusinessIdGenerator;

import java.util.List;
import java.util.Set;
import java.util.concurrent.*;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test verifying concurrent business-ID generation produces no duplicates.
 * Requires Docker (Testcontainers). If Docker is unavailable, test is skipped automatically.
 *
 * Requirement validated: 5.3 — WHEN two creates occur concurrently THEN the system
 * SHALL NOT assign duplicate business IDs.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@ActiveProfiles("test")
@DisplayName("Business ID Concurrency")
@EnabledIf(value = "isDockerAvailable", disabledReason = "Docker not available")
class BusinessIdConcurrencyTest {

    static boolean isDockerAvailable() {
        try {
            return DockerClientFactory.instance().isDockerAvailable();
        } catch (Exception e) {
            return false;
        }
    }

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private BusinessIdGenerator businessIdGenerator;

    @Test
    @DisplayName("concurrent CMSI ID generation produces no duplicates")
    void concurrentProfileIdGeneration_noDuplicates() throws InterruptedException {
        int threadCount = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);

        List<Future<String>> futures = new CopyOnWriteArrayList<>();

        for (int i = 0; i < threadCount; i++) {
            futures.add(executor.submit(() -> {
                latch.await(); // all threads start at same time
                return businessIdGenerator.generateId("CMSI");
            }));
        }

        // Release all threads simultaneously
        latch.countDown();

        Set<String> generatedIds = ConcurrentHashMap.newKeySet();
        for (Future<String> future : futures) {
            try {
                String id = future.get(10, TimeUnit.SECONDS);
                generatedIds.add(id);
            } catch (ExecutionException | TimeoutException e) {
                throw new RuntimeException("Failed to get generated ID", e);
            }
        }

        executor.shutdown();
        assertThat(executor.awaitTermination(10, TimeUnit.SECONDS)).isTrue();

        // All generated IDs must be unique
        assertThat(generatedIds).hasSize(threadCount);

        // All IDs must match expected format
        for (String id : generatedIds) {
            assertThat(id).matches("CMSI\\d{8}");
        }
    }

    @Test
    @DisplayName("concurrent MED ID generation produces no duplicates")
    void concurrentMedicalIdGeneration_noDuplicates() throws InterruptedException {
        int threadCount = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);

        List<Future<String>> futures = new CopyOnWriteArrayList<>();

        for (int i = 0; i < threadCount; i++) {
            futures.add(executor.submit(() -> {
                latch.await();
                return businessIdGenerator.generateId("MED");
            }));
        }

        latch.countDown();

        Set<String> generatedIds = ConcurrentHashMap.newKeySet();
        for (Future<String> future : futures) {
            try {
                String id = future.get(10, TimeUnit.SECONDS);
                generatedIds.add(id);
            } catch (ExecutionException | TimeoutException e) {
                throw new RuntimeException("Failed to get generated ID", e);
            }
        }

        executor.shutdown();
        assertThat(executor.awaitTermination(10, TimeUnit.SECONDS)).isTrue();

        assertThat(generatedIds).hasSize(threadCount);

        for (String id : generatedIds) {
            assertThat(id).matches("MED\\d{8}");
        }
    }
}
