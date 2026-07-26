package com.centerport.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ThreadPoolExecutor;

/**
 * Configures asynchronous event processing infrastructure.
 *
 * Thread Pool:
 * Provides a dedicated {@code eventTaskExecutor} pool for async event
 * listeners, isolated from the main request-handling threads. Uses
 * {@code CallerRunsPolicy} as backpressure when the queue is full,
 * ensuring events are never silently dropped.
 *
 * @see org.springframework.scheduling.annotation.Async
 * @see com.centerport.common.event.AuditEventListener
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    private static final int CORE_POOL_SIZE = 4;
    private static final int MAX_POOL_SIZE = 8;
    private static final int QUEUE_CAPACITY = 100;
    private static final String THREAD_PREFIX = "event-";

    /**
     * Task executor bean for async domain event processing.
     *
     * @return configured thread pool executor with caller-runs backpressure
     */
    @Bean(name = "eventTaskExecutor")
    public TaskExecutor eventTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(CORE_POOL_SIZE);
        executor.setMaxPoolSize(MAX_POOL_SIZE);
        executor.setQueueCapacity(QUEUE_CAPACITY);
        executor.setThreadNamePrefix(THREAD_PREFIX);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}
