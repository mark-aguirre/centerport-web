# syntax=docker/dockerfile:1

# ---------- Stage 1: build the Spring Boot jar ----------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Cache dependencies first: copy only the pom, resolve, then copy sources.
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q clean package -DskipTests

# ---------- Stage 2: minimal runtime ----------
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

# Pin the container timezone so server-side LocalDate.now() matches the clinic's
# local day. Without this the container runs in UTC, and visits saved in the
# morning get stamped with the previous (UTC) calendar date, so they drop out of
# the frontend's "today" list. Overridable at runtime via the TZ env var.
ENV TZ=Asia/Singapore
RUN apt-get update \
    && apt-get install -y --no-install-recommends tzdata \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && rm -rf /var/lib/apt/lists/*

# Run as a non-root user.
RUN groupadd --system app && useradd --system --gid app --home /app app

# Copy the fat jar produced by the build stage.
COPY --from=build /build/target/*.jar app.jar

# Writable upload dir (used when STORAGE_TYPE=local; harmless otherwise).
RUN mkdir -p /app/uploads && chown -R app:app /app
USER app

EXPOSE 8080

# Container-internal port stays 8080; host port is mapped in docker-compose.
ENV SERVER_PORT=8080

ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -Duser.timezone=$TZ -jar /app/app.jar"]
